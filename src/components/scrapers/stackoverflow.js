const fs = require('fs');
const puppeteer = require('puppeteer');
const logger = require('../../utils/logger');
const { ScrapeError } = require('../../utils/errorHandler');
const { settings, _replaceParams, _getCategory } = require('./utils');

const cc = a => (...arrs) => a.concat(...arrs);

const europe= [
  'Sweden',
  'Finland',
  'Estonia',
  'Germany',
  'Denmark',
  'Netherlands',
  'Italy',
  'Spain',
  'UK',
  'Israel',
  'France',
]

const america = [
  'Mexico',
  'US',
  'Canada'
]




/*
 * Stackoverflow class.
 *  PRIVATE METHODS :
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

const defaultURL = `https://www.stackoverflow.com/jobs?q=Junior&ms=Student&mxs=MidLevel`

class StackOverflow {
  constructor(location = '', data) {
    this.data = data || [];
    this.location = location;
    this.getJobs = this.getJobs.bind(this);
    this._getLinks = this._getLinks.bind(this);
    this._getURL = this._getURL.bind(this);
    this._extractResults = this._extractResults.bind(this);
    this._getJobInfo = this._getJobInfo.bind(this);
  }


  // need to export out COMMON functionaity for other robots.

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



  getJobs = async (location = '', data) => {
    this.data = data || [];
    this.location = location;
    logger.info("getJobs -- stackoverflow", location);
    const browser = await puppeteer.launch(settings);
    const preloadFile = fs.readFileSync(__dirname + '/utils/preload.js', 'utf8');

    const page = await browser.newPage();
    await page.evaluateOnNewDocument(preloadFile);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.setRequestInterception(true);

    page.on("request", r => {
      if ( ["image", "stylesheet", "font", "script"].indexOf(r.resourceType()) !== -1 ) { r.abort() } else { r.continue()}
    });

    try {
      if (this.location) {
        console.log('received location: ', this.location);
        const links = this._searchLinks(this.location);
        const alljobs = [];
        for (const link of links) {
          console.log(link)
          await page.goto(link);
          const jobsData = await this._extractResults(page);
          await page.waitFor(250); // hold on for 200 sec 
          jobsData.length && alljobs.push(jobsData);
          await page.waitFor(150); // hold on for 200 sec 
          console.log('current total jobs: ', alljobs.length)
        }
        const flattenJobs = [].concat.apply([], alljobs);
        await browser.close();
        console.log('scraped this many jobs: ', alljobs.length);
        return flattenJobs;
      }

      console.log('no location received: ', this.location)
      // if (!this.location) return;

      this.searchURL = this._getURL(this.location);
      await page.goto(this.searchURL);
      logger.info(`Worker Visited: ${this._getURL(this.location)}`)
      const jobs = await this._extractResults(page);
      console.log(jobs)
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
    // await page.goto(this._getPage(2));
    // const jobLinksPageTwo = await this._getLinks(page);
    //
    //
    // await page.goto(this._getPage(3));
    // const jobLinksPageThree = await this._getLinks(page);

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

    // const jobLinks = cc([])(jobLinksPageOne, jobLinksPageTwo, jobLinksPageThree);
    const jobLinks = jobLinksPageOne;
    if ( !jobLinks.length ) return [];
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
        logger.info(err);
        return new ScrapeError(err.msg, '', 'INSIDE StackOverflow Scraper: extractResults function ', true);
      }
    }
    console.log('Filtering Out Senior Jobs . . .');
    const juniorJobs = arrayOfJobs.filter(job => !job.title.match(/\bsenior|experienced\b/i))
    console.log(`
      ${juniorJobs.length - arrayOfJobs.length} jobs were filtered
    `)
    console.log('Extraction Finished... ', arrayOfJobs.length)
    return juniorJobs;
  }


  _getLinks = async (page) => {
    const selector = ".-job-summary";
    if ( await page.$(selector) === null ) {
      console.log('no results found,\nReturning []');
      return []
    }
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
    // const category = _getCategory(description);
    // const stack = techStack.push(category);
    const aboutElement = document.querySelector('.-about-company .description');
    const about = aboutElement && aboutElement.innerHTML;
    const salaryElement = document.querySelector('.-salary');
    const salary = salaryElement && salaryElement.offsetParent.className === 'container' ? salaryElement.textContent : null;
    const title = document.querySelector('.fs-headline1').innerText.split('(m/\./\.)')[0];
    const logo = document.querySelector('.s-avatar.s-avatar__lg img')['src'];
    const href = url;
    // const SOID = _jobId(href);

    // const companyEl = document.querySelector('.-life-at-company h2');
    const companyEl = document.querySelector('.job-details--header .fc-black-700 a')
    // const company = companyEl && companyEl['textContent'].split(' ').slice(-1)[0];
    const company = companyEl && companyEl['textContent']

    return {
      title,
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

  _getURL = (location) => {
    return `${defaultURL}${location && ( typeof location === 'string' ? `&l=${location}` : location.join('+') )}`
  }

  _searchLinks = location => {
    switch(location) {
      case 'europe':
        return europe.map(this._getURL);
        break;
      case 'america':
        return america.map(this._getURL);
        break;
      default:
        return this._getURL(location);
    }
  }

}


module.exports = StackOverflow;
