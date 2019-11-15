const puppeteer = require('puppeteer');
const fs = require('fs');
const botLogger = require('../../utils/botLogger');
const { ScrapeError } = require('../../utils/errorHandler');
const { filterTitles, _replaceParams, settings, _query, keywords, _getText, _getTitle, _getStack, _getDescText, _getCategory } = require('./utils');

const baseURL = `https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&sc.keyword=Junior&locT=&locKeyword=&jobType=all&fromAge=14&minSalary=0&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=-1&sgocId=7&seniorityType=entrylevel&companyId=-1&employerSizes=0&applicationType=0&jobType=&`

const defURL = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Junior&locT=N&locKeyword=Sweden&jobType=all&fromAge=-1&minSalary=0&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=1059&sgocId=-1&seniorityType=all&`

const america = ['1', '3']

const europe_ids = [
  // '63',
  // '96',
  '119',
  // '120',
  '178',
  // '219',
  // '223'
]

const europe = {
  US: '1',
  Canada: '3',
  Denmark: '63',
  Germany: '96',
  Israel: '119',
  Italy: '120',
  Netherlands: '178',
  Spain: '219',
  Sweden: '223'
}

const selectors = {
  div: {
    href: '.jobHeader a',
    loc: '.jobInfoItem .loc',
    title: '.jobLink.jobInfoItem',
    titleAlt: '[data-normalize-job-title]',
    company: '.jobInfoItem .jobEmpolyerName',
    date: '.minor'
  },
  desc: '.jobDescriptionContent.desc',
  GDID: '[data-id]',
  job: '.jl',
  logo: '.logo.cell img'
};


class Glassdoor {
  constructor(urls){
    this.urls = urls || [];
  }

  _getUrl = loc => loc ? `${defURL}locId=${loc}` : `${baseURL}locId=0`

  getJobs = async (location) => {

    this.location = location || '';
    const browser = await puppeteer.launch(settings);
    const preloadFile = fs.readFileSync(__dirname + '/utils/preload.js', 'utf8');
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(preloadFile);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.setRequestInterception(true);

    page.on("request", r => {
      if ( ["image",  "stylesheet", "script"].indexOf(r.resourceType()) !== -1){ 
        r.abort() 
      } else { r.continue() }});

    try {
      const reg = new RegExp(/\bsenior|lead|experienced\b/i);
      const filterSeniorPositions = j => !reg.test(j.title)
      if (this.location) {
        const links = this._searchLinks(this.location);
        const alljobs = [];
        for (const link of links) {
          await page.goto(link);
          console.log('Entering a link: \n', link)
          const jobsData = await this._extractJobs(page);
          console.log(jobsData.joinDate)
          await page.waitFor(200);
          jobsData.length && alljobs.push(jobsData);
          console.log(`Data added to array.`)
          console.log('---- -----  ---- -----  ---- -----  ---- -----  ---- -----  ')
        }
        const flattenJobs = [].concat.apply([], alljobs);
        const noSenior = flattenJobs.filter(filterTitles);
        await page.close();
        await browser.close();
        console.log(`
          had ${flattenJobs.length} jobs
          // now got: ${noSenior.length}
        `)
        return flattenJobs;
      }

      console.log('NO LOCATION PROVIDED.')

      // if no country specified. search globally (i.e locId=0)
      await page.goto(this._getUrl(this.location));
      const jobs = await this._extractJobs(page);
      const noSenior = jobs.filter(filterSeniorPositions)
      await page.close();
      await browser.close();
      return noSenior;
    } catch(e) {
      const err = new ScrapeError(e.msg, 'Scraper Error:', 'Error Inside getJobs()', true);
      return err;
    }}

  _extractJobs = async (page, loc) => {

    try {

    const jbs = await page.evaluate((sel) => {
      const alldivs = Array.from(document.querySelectorAll('.jl'));
      const data = alldivs.map(el => {
        const elProp = e => prop => sel => e.querySelector(sel)[prop];
        const gt = elProp(el)('textContent');

        const href = el.querySelector(sel.div.href)['href'];
        const location = gt(sel.div.loc);
        const date = gt(sel.div.date);
        const company = gt(sel.div.company);
        const title = el.querySelectorAll(sel.div.title)[1]['textContent'];

        return {
          href,location, title, company, date
        }
      });
      return data;
    }, selectors)

    await page.waitFor(151);

    const arrayOfJobs = [];
    for (const link of jbs) {

      await page.waitFor(153);
      await page.goto(link.href, { waitUntil: 'domcontentloaded' });
      await page.waitFor(150);
      await page.waitFor(selectors.desc);

      const [description, logo] = await page.evaluate(sels => {
        const d = document.querySelector(sels.desc);
        const l = document.querySelector(sels.logo);
        const description = d && d.innerHTML;
        const logo = l && l.src;
        return [description, logo];
      }, selectors)

      console.log('date is: ', link.date)

      link.joinDate = this._parseDate(link.date);
      if (link.joinDate === null) return null
      link.src = 'gd'
      link.href = _replaceParams(link.href, ['pos', 'guid', 'cs', 'cb'])
      const tech = _getStack(description);
      const categ = _getCategory(description); 
      link.stack = tech.concat(categ)

      const jobObject = {
        ...link,
        description,
        logo
      }

      arrayOfJobs.push(jobObject);
    }

    return arrayOfJobs;
    } catch(e) {
        console.log(e)
        const err = new ScrapeError(e.msg, 'Scraper Error:', 'Error Inside extractJobs()', true);
        return err;
    }

  }

  _parseDate = d => {
    const currentDate = new Date();
    let format = d.split(/\d/).slice(-1)[0];
    let thenum = d.replace(/\D/g, "");
    let isHours = format === 'hr' ? true : false;
    let isOld = !isHours && thenum > 21

    return isHours
      ? currentDate
      : thenum < 21 
        ? new Date(currentDate.setDate(currentDate.getDate() - thenum))
        : null
  }

  _searchLinks = location => {
    switch(location) {
      case 'europe':
        return europe_ids.map(this._getUrl);
        break;
      case 'america':
        return america.map(this._getUrl);
        break;
      default:
        return this._getUrl(location);
    }
  }

}



module.exports = Glassdoor;
