const baseURL = `https://www.indeed.com/jobs?as_and=&as_phr=Junior&as_any=Junior+Developer&as_not=Administrator+eLearning+Senior&as_ttl=&as_cmp=&jt=all&st=employer&as_src=&salary=&radius=25&l=Remote&fromage=7&limit=50&sort=date&psf=advsrch` 
const puppeteer = require('puppeteer');
// const logger = require('../../utils/logger');
// const { ScrapeError } = require('../../utils/errorHandler');

const isTooOld = d => d.slice(0,2) === '7+'

const _parseDate = x =>  {
  const currentDate = new Date();
  let format = x.split(' ')[0];
  if (format.length > 2) {
    return new Date();
  };
  let num = format.replace(/\D/g,"");
  return new Date(currentDate.setDate(currentDate.getDate() - num));
}

class Indeed {
  constructor(data){
    this.data = data || [];
  }

  getJobs = async (query) => {
    // logger.info("getJobs -- INDEED");
    //
    console.log('sd')
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1280 },
      headless: true,
      ignoreHTTPSErrors: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(this._getURL());
    await page.waitFor('.clickcard');
    await page.waitFor(500);

    let kk = await page.$$eval('.clickcard', l => l.map(s => {
      s.click();
      return l.innerHTML
    }))

    await browser.close();
    return kk
    // return alldivs
  }

        // await page.waitFor('#vjs-desc');
        // const jobInfo = await page.evaluate((d) => {
        //
        //   const description = document.querySelector('#vjs-desc');
        //   const title = document.querySelector('#vjs-jobtitle').textContent;
        //   const applyLink = document.querySelector('.view-apply-button')['href'];
        //   const href = d.divTitle.querySelector("a")['href'];
        //   const company = document.querySelector('#vjs-cn').textContent;
        //   const location = document.querySelector('#vjs-loc').textContent.replace(/[^a-zA-Z]+/g, '');
        //   const date = _parseDate(d.timeAgo);
        //
        //   return {
        //     title,
        //     description,
        //     href,
        //     company,
        //     location,
        //     applyLink,
        //     date
        //   }
        // }, div)

  _getURL = () => {
    return baseURL;
  }

}

const indeedService = new Indeed();
indeedService.getJobs();
