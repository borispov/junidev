const puppeteer = require('puppeteer');
const fs = require('fs');
const botLogger = require('../../utils/botLogger');
const { ScrapeError } = require('../../utils/errorHandler');
const { _replaceParams, _query, keywords, _getText, _getTitle, _getStack, _getDescText } = require('./utils');

const baseURL = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Junior&locT=&locId=0&locKeyword=&jobType=all&fromAge=14&minSalary=0&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=-1&sgocId=7&seniorityType=entrylevel&companyId=-1&employerSizes=0&applicationType=0&remoteWorkType=0`

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

  //
  getJobs = async () => {

    const browser = await puppeteer.launch({
      useDataDir: './data',
      defaultViewport: { width: 1920, height: 1280 },
      headless: true,
      ignoreHTTPSErrors: true,
      devtools: true,
      // dumpio: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-infobars",
        "--window-position=0,0",
        "--ignore-certifcate-errors",
        "--ignore-certifcate-errors-spki-list",
        "--user-agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'"
      ]
    });

    const preloadFile = fs.readFileSync(__dirname + '/utils/preload.js', 'utf8');
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(preloadFile);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    // await page.setUserAgent("--user-agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'")
    await page.setRequestInterception(true);

    page.on("request", r => {
      if ( ["image", "stylesheet", "font", "script"].indexOf(r.resourceType()) !== -1 ) {
        r.abort();
      } else {
        r.continue();
      }
    });

    try {
      await page.goto(baseURL);
      const jobs = await this._extractJobs(page);

      await page.close();
      await browser.close();
      console.log('FINISHED, received number of jobs: ', jobs.length)

      return jobs;
    } catch(e) {
      const err = new ScrapeError(e.msg, 'Scraper Error:', 'Error Inside getJobs()', true);
      return err;
    }}

  _extractJobs = async page => {

    try {


    await page.goto(baseURL);

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

    await page.waitFor(651);

    const arrayOfJobs = [];
    for (const link of jbs) {

      await page.waitFor(213);
      await page.goto(link.href, { waitUntil: 'domcontentloaded' });
      await page.waitFor(1000);
      await page.waitFor(selectors.desc);

      const [description, logo] = await page.evaluate(sels => {
        const d = document.querySelector(sels.desc);
        const l = document.querySelector(sels.logo);
        const description = d && d.innerHTML;
        const logo = l && l.src;
        return [description, logo];
      }, selectors)

      link.src = 'gd'

      link.href = _replaceParams(link.href, ['pos', 'guid', 'cs', 'cb'])
      console.log('gd href::: ')
      console.log(link.href + '\n')

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
}

module.exports = Glassdoor;
