const fs = require('fs');
const puppeteer = require('puppeteer');
const logger = require('../../utils/logger');
const { ScrapeError } = require('../../utils/errorHandler');
const { _replaceParams } = require('./utils');

const isEq = n1 => n2 => n1 === n2;
const isSameJob = url1 => url2 => isEq(jobId(url1))(jobId(url2));
const cc = a => (...arrs) => a.concat(...arrs);

/*
 * Stackoverflow class.
 *  PRIVATE METHODS :
 *
 *  _getURL(location, stack) - > compose the url
 *  _getJobInfo(page) -> get job's text content
 *  _getLinks(page) -> grab all job-links in a given page
 *  _extractResults(page) -> executes all functions to grab all needed date and the return it in an Object to the publci method
 *
 * PUB METHOD:
 * getJobs(location, stack) - > initiates the browsers the whole other stuff.
 * _extractResults -- returns object with ( apply link, technology stack, job description, salary)
 *
*/

const defaultURL = `https://stackoverflow.com/jobs?q=Junior&ms=Junior&mxs=Junior`

class StackOverflow {
  constructor(data) {
    this.data = data || []
    this._isDupURL = this._isDupURL.bind(this);
    this.getJobs = this.getJobs.bind(this);
    this._getLinks = this._getLinks.bind(this);
    this._getURL = this._getURL.bind(this);
    this._extractResults = this._extractResults.bind(this);
    this._getJobInfo = this._getJobInfo.bind(this);
  }


  // need to export out COMMON functionaity for other robots.
  _isDupURL = list => url => list.reduce((a,c) => isSameJob(c)(url) ? true : a, false)

  _isHours = str => str.replace(/\d/g,"") === 'h'

  _parseDate = x =>  {
    const currentDate = new Date();
    let format = x.split(' ')[0];
    let num = format.replace(/\D/g,"");
    let timeFormat = format.replace(/\d/g,"");

    return this._isHours(timeFormat) 
      ? currentDate
      : new Date(currentDate.setDate(currentDate.getDate() - num))
  }



  getJobs = async (location = '', stack = '', data) => {
    this.data = data || [];
    logger.info("getJobs -- stackoverflow", location, stack);
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 1920,
        height: 1280
      },
      headless: true,
      ignoreHTTPSErrors: true,
      devtools: true,
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
    await page.setRequestInterception(true);

    page.on("request", r => {
      if ( ["image", "stylesheet", "font", "script"].indexOf(r.resourceType()) !== -1 ) {
        r.abort();
      } else {
        r.continue();
      }
    });

    try {
      this.searchURL = this._getURL(location, stack);
      await page.goto(this.searchURL);
      logger.info(`Worker Visited: ${this._getURL(location, stack)}`)
      const jobs = await this._extractResults(page);
      await browser.close();
      console.log('scraped this many jobs: ', jobs.length);
      return jobs;
    }
    catch(err) {
      // logger.error(err.stack);
      console.error('INSIDE StackOverflow Scraper: getJobs__ \n', err)
      // return new ScrapeError(err.msg, '', 'INSIDE StackOverflow Scraper: getJobs__ ', true);
    }

  }




  _extractResults = async (page) => {

    // get Page 1 links
    const jobLinksPageOne = await this._getLinks(page);


    //get Page 2 Links
    await page.goto(this._getPage(2));
    const jobLinksPageTwo = await this._getLinks(page);


    await page.goto(this._getPage(3));
    const jobLinksPageThree = await this._getLinks(page);

    function noDups(arr, comp) {
      if (new Set(arr).siez === arr.length) {
        return arr
      }
      const unique = arr
           .map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => arr[e]).map(e => arr[e]);
       return unique;
    }

    const jobLinks = cc([])(jobLinksPageOne, jobLinksPageTwo, jobLinksPageThree);
    const filteredLinks = noDups(jobLinks, 'href');

    let arrayOfJobs = [];

    for (const link of filteredLinks) {
      try {
        await page.goto(link.href);
        // logger.info(`Visiting .. ${link.href}`);
        const jobinfo = await this._getJobInfo(page);
        await page.waitFor(100);
        jobinfo.location = link.location;
        jobinfo.joinDate = link.date;
        jobinfo.href = link.href;
        jobinfo.src = 'SO';
        arrayOfJobs.push(jobinfo);
        await page.waitFor(250);
      }
      catch(err) {
        logger.info(err.msg);
        return new ScrapeError(err.msg, '', 'INSIDE StackOverflow Scraper: extractResults function ', true);
      }
    }
    console.log('Extraction Finished... ', arrayOfJobs.length)
    return arrayOfJobs;
  }


  _getLinks = async (page) => {
    const selector = ".-job-summary";
    await page.waitFor(selector);
    const links = [];
    const self = this;
    const jobLinks = await page.$$eval(selector, all => all
      .map(element => {
        const href = element.querySelector('[href]')['href'].split('&so_source')[0];
        const date = element.querySelector('.-title span.r0 .fc-black-500')['textContent'];
        const locationEl = element.querySelector('.-remote') || element.querySelector('.-company')['lastElementChild']
        const location = locationEl && locationEl['innerText'].replace(/-/g, '').trim();
        return { href, date, location }
    }))

    for (const link of jobLinks) {
      const _jobId = url => url.split('/').reduce((a,c,i,s) => c === 'jobs' ? s[i+1] : a);
      const url = await link.href;
      const newUrl = _replaceParams(url, ['pg', 'offset', 'so', 'total', 'so_medium', 'a']).replace(/\?/, '')
      const location = link.location;
      const date = link.date;
      const SOID = _jobId(url);

      // console.log(newUrl)

      const o = {
        location,
        href: newUrl,
        date: this._parseDate(date),
        SOID,
      }

      this._isHours(date) 
        ? links.push(o)
        : date.replace(/\D/g, "") < 30
          ? links.push(o)
          : null
    };

    logger.info('got job links: ', links.length);
    return links;
  }

  _getJobInfo = async (page) => await page.evaluate(url => {

    const _jobId = url => url.split('/').reduce((a,c,i,s) => c === 'jobs' ? s[i+1] : a);
    const subheadings = [...document.querySelectorAll('.fs-subheading')];

    // Grab apply link, tech stack, job description, salary if present
    const applyLink = document.querySelector('.js-apply')['href'];
    const techStack = [
      ...subheadings
        .find(el=> el.textContent === 'Technologies')
          .parentElement.lastElementChild.children]
          .map(el => el.textContent)

    const description = subheadings.find(el => el.textContent === 'Job description').parentElement.lastElementChild.innerHTML;
    const aboutElement = document.querySelector('.-about-company .description');
    const about = aboutElement && aboutElement.innerHTML;
    const salaryElement = document.querySelector('.-salary');
    const salary = salaryElement && salaryElement.offsetParent.className === 'container' ? salaryElement.textContent : null;
    const title = document.querySelector('.fs-headline1').innerText.split('(m/\./\.)')[0];
    const logo = document.querySelector('.s-avatar.s-avatar__lg img')['src'];
    const href = url;
    // const href = _replaceParams(originalUrl, ['so', 'pg', 'offset', 'total', 'so_medium'])
    // const SOID = _jobId(href);

    // const companyEl = document.querySelector('.-life-at-company h2');
    const companyEl = document.querySelector('.job-details--header .fc-black-700 a')
    // const company = companyEl && companyEl['textContent'].split(' ').slice(-1)[0];
    const company = companyEl && companyEl['textContent']

    return {
      title,
      // SOID,
      // href,
      applyLink,
      stack: techStack,
      description,
      salary,
      about,
      company,
      logo
    };
  }, page.url());

  _getPage = n => this.searchURL + `&sort=i&pg=${n}`;

  _getURL = (location, stack) => {
    return `${defaultURL}${location && ( typeof location === 'string' ? location : location.join('+') )}${stack && ( typeof stack === 'string' ? stack : stack.join('+') )}`
  }

}


module.exports = StackOverflow;
