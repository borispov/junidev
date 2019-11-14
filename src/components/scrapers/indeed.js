const puppeteer = require('puppeteer');
const logger = require('../../utils/logger');
const { ScrapeError } = require('../../utils/errorHandler');
const { filterTitles, _query, keywords, _getText, _getTitle, _getStack, _getDescText, _getCategory } = require('./utils');

// const baseURL = `https://www.indeed.com/jobs?as_and=Junior+Developer&as_phr=Junior&as_any=&as_not=&as_ttl=&as_cmp=&jt=all&st=&as_src=&salary=&radius=25&l=&fromage=any&limit=10&sort=date&psf=advsrch`

const baseURL = `https://www.indeed.com/jobs?as_and=Junior+Software+Engineer&as_phr=&as_any=Web+Development+Software+Engineering+Software+Design&as_not=Manager+Business+Officer+Loan+Electrical+electronic+call%25center&as_ttl=Junior&as_cmp=&jt=all&st=&as_src=&salary=&radius=25&l=&fromage=15&limit=50&sort=date&psf=advsrch&from=advancedsearch`

const selectors = {
  desc: '.jobsearch-JobComponent-description',
  title: '.jobsearch-JobInfoHeader-title'
}

const isTooOld = d => d.slice(0,2) === '30'

const _parseDate = x =>  {
  const currentDate = new Date();
  let format = x.split(' ')[0];

  if (x === 'Just Posted' || x.includes('hours')) return currentDate

  let num = format.replace(/\D/g,"");
  return new Date(currentDate.setDate(currentDate.getDate() - num));
}

class Indeed {
  constructor(data){
    this.data = data || [];
    this.getJobs = this.getJobs.bind(this);
    this._getLinks = this._getLinks.bind(this);
    this._getURL = this._getURL.bind(this);
    this._extractJobs = this._extractJobs.bind(this);
    this._getJobInfo = this._getJobInfo.bind(this);
  }

  getJobs = async () => {
    logger.info("getJobs -- INDEED");
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1280 },
      headless: true,
      ignoreHTTPSErrors: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    try {
      await page.goto(this._getURL());
      const jobs = await this._extractJobs(page);
      // Job Done, close everything & get the hell out!
      const noSenior = jobs.filter(filterTitles)
      await page.close();
      await browser.close();
      console.log('FINISHED, received number of jobs: ', jobs.length)
      return noSenior;
      // return jobs;
    } catch(e) {
      logger.info(e);
      return e;
    }
  }

  _extractJobs = async (page) => {
    const [jobLinks, isVue] = await this._getLinks(page);

    if (isVue) return jobLinks

    let arrayOfJobs = [];

    for (const link of jobLinks) {
      try {
        await page.goto(link.href);

        const jobinfo = await this._getJobInfo(page);

        // jobinfo.company = link.company;
        // jobinfo.href = link.href;
        // jobinfo.joinDate = link.date;
        jobinfo.src = 'indeed';

        await page.waitFor(100);
        arrayOfJobs.push(jobinfo);
        await page.waitFor(203);
      }
      catch(err) {
        logger.error(err);
        return new ScrapeError(err.msg, '', 'INSIDE StackOverflow Scraper: extractResults function ', true);
      }
    }
    return arrayOfJobs;
  }

  _getLinks = async (page) => {
    const links = [];
    const selector = '.clickcard';
    await page.waitFor(selector);
    await page.waitFor(550);


    // const jobLinks = await page.$$eval(selector, all => all
    //   .map(el => {
    //     const href = el.querySelector('a')['href'];
    //     const date = el.querySelector('.date').textContent;
    //     const company = el.querySelector('.company').innerText;
    //     const location = el.querySelector('.location').textContent.replace(/\d/g,"").trim();
    //     return { href, date, company, location }
    // }));


    // FETCHING VueJS -- only Homepage! Yess!
    const jobCards = await page.$$(selector);

    for (const i of jobCards){

      await i.click();

      await page.waitFor('#vjs-desc');
      const href = await i.$eval('.title a', el => el.href);
      // const href = await _getText(page, '[data-tn-element=jobTitle]', 'href');
      const description = await _getText(page, '#vjs-desc', 'innerHTML');
      const rawDate = await _getText(page, '.date');
      const date = _parseDate(rawDate);
      if (isTooOld(rawDate)) return;
      const location = await _getText(page, '#vjs-loc');
      const company = await _getText(page, '#vjs-cn');
      const title = await _getText(page, '#vjs-jobtitle');
      const stackShare = await _getStack(description);
      const enhancedStack = await _getCategory(description);
      const stack = stackShare.push(enhancedStack);
      const sel = '.view-apply-button'
      const applyText = await _getText(page, sel);
      const applyLink = applyText === 'Apply Now' ? href : await _getText(page, sel, 'href');
      const src = 'indeed';

      links.push({
        href, title, src, description, company, location, stack, applyLink, joinDate: date
      })
    }


    // filter some titles.!
    // const fLinks = links.filter(obj => forbiddenKeywords.includes(obj.title))

    return [links, true];
  }

  _getJobInfo = async (page) => {
    const title = await this._getTitle(page);
    const description = await this._getDescText(page);
    const appLink = await this._getApplyLink(page);
    const stack = this._getStack(description);
    return { title, description, applyLink: appLink, stack }
  }

  // if job posting is from indeed's, it'll return the original href page as the job link
  _getApplyLink = async page => await page.evaluate(s => {
      const sel = '#viewJobButtonLinkContainer a'
      const el = document.querySelector(sel)
      const href = el && el['href'];
      return href && href || s
    }, page.url());

  _getURL = () => {
    return baseURL;
  }

}

module.exports = Indeed;
