const puppeteer = require('puppeteer');
// const logger = require('../../utils/logger');
// const { ScrapeError } = require('../../utils/errorHandler');
const { _query, keywords, _getText, _getTitle, _getStack, _getDescText } = require('./utils');

const baseURL = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Junior&locT=&locId=0&locKeyword=&jobType=all&fromAge=14&minSalary=0&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=-1&sgocId=7&seniorityType=entrylevel&companyId=-1&employerSizes=0&applicationType=0&remoteWorkType=0`


const selectors = {
  title: '[data-normalize-job-title]',
  desc: '',
  location: '.jobInfoItem .loc',
  GDID: '[data-id]',
  company: '.jobInfoItem .jobEmpolyerName',
  job: '.jl',
  href: '.jobHeader a'
};


class Glassdoor {
  constructor(data){
    this.data = data || [];
  }

  getJobs = async () => {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1280 },
      headless: true,
      ignoreHTTPSErrors: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    try {
      await page.goto(baseURL);
      const jobs = await this._extractJobs(page);
      // Job Done, close everything & get the hell out!
      await page.close();
      await browser.close();
      // console.log('FINISHED, received number of jobs: ', jobs.length)
      // return jobs;
    } catch(e) {
      console.log(e);
    }}

  _getHref = o => o['href']
  _getText = o => o['textContent']

  _info = el => {
    const elSel = el.querySelector;
    return {
      href: this._getHref(elSel(selectors.href)),
      location: this._getText(elSel(selectors.location)),
      company: this._getText(elSel(selectors.company)),
    }
  }

  _extractJobs = async page => {

    await page.goto(baseURL);

    const doc = this._info;
    const links = await page.$$eval('.jl', all => all
      .slice(0,1)
      .map(el => {
        const getText = el => sel => prop => el.querySelector(sel)[prop]
        const href = el.querySelector('.jobHeader a')['href'];
        const location = getText(el)('.jobInfoItem .loc')('textContent');
        const title = el.querySelectorAll('.jobLink.jobInfoItem')[1].textContent;
        const company = getText(el)('.jobInfoItem .jobEmpolyerName')('textContent');
        const date = getText(el)('.minor')('textContent');
        return {
          href,location, title, company, date
        }
      }))

    // console.log(links)
    //
    const arrayOfJobs = [];

    for (const link of links) {

      await page.goto(link.href);
      // this._checkModal(page);
      const description = await page.$eval('jobDescriptionContent desc', el => el.lastElementChild.innerHTML);
      const logo = await page.$eval('.logo .cell img')['src'];
      const jobObject = {
        ...link,
        description,
        logo
      }
      arrayOfJobs.push(jobObject);
    }

    console.log(arrayOfJobs)
    // return arrayOfJobs;
  }

  _checkModal = async page => {
    const selector = '';
    if (await page.$(selector) !== null) {
      await page.click(selector);
    }
  }

}

const gd = new Glassdoor();
gd.getJobs();
