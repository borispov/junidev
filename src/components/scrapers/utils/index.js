const puppeteer = require('puppeteer');

const { stackShare, industries } = require('./keywords');
const settings = require('./settings');
const filterTitles = require('./filterTitles');

const _getStack = text => {
   return stackShare
    .filter(keyword => keyword.regex.test(text))
    .map(keyword => keyword.name);
}

const req= {
  backend: [
    'AWS', 
    'EC2', 
    'Kubernetes', 
    'Docker', 
    'Linux', 
    'CI/CD', 'Ruby', 
    'Python', 'Golang', 
    'Nodejs', 'Elixir', 
    'Clojure', 'Haskell', 
    'Scala', 'Java', 
    'C#', '.NET', 
    'Kotlin', 'microservices', 
    'server-side', 'back-end', 
    'django', 'rails'],
  frontend: [
    'SPA', 'Animation', 'Ajax', 'UI', 'UX',
    'Elm', 'svelte', 'React', 'Angular', 
    'Vue', 'JavaScript', 'CSS', 'HTML',
    'frontend', 'front-end', 'single page app'],
  cyber: [
    'Cyber', 'cyberjs', 'security', 'privacy', 'attacks',
  ]
}

const _reduceStack = arr => {
  const stack = arr.map(s => s.toLowerCase());
  if (stack.length < 4) return stack
  const front = req.frontend.map(c => c.toLowerCase()).filter(s => stack.includes(s)).length;
  const back = req.backend.map(c => c.toLowerCase()).filter(s => stack.includes(s)).length;
  if ( front <= 2 || back <= 2 ) return stack
  return front > back
    ? stack.concat(front)
    : stack.concat(back)
}

const _getCategory = text => {
  const categories = Object.keys(industries);
  const values = Object.values(industries);
  const mapped = values.map((keygroup, index) => ({
      name: categories[index],
      match: keygroup.filter(keyword => keyword.regex.test(text)).length
  }))
  const multiple = mapped.filter(a => a.match > 2).map(a => a.name);
  if (multiple.includes('backend') && multiple.includes('frontend')) {
    return 'WEB'
  }
  const reduced = mapped.reduce((init, it) => it.match > init.match ? it : init, { name: 'none', match: 0 })
  if ( reduced.name == 'none' || reduced.match < 2) {
    return ''
  }
  return reduced.name
}

// if job posting is from indeed's, it'll return the original href page as the job link
const _getApplyLink = async page => await page.evaluate(s => {
    const sel = '#viewJobButtonLinkContainer a'
    const el = document.querySelector(sel)
    const href = el && el['href'];
    return href && href || s
}, page.url());

const _getTitle = async (page, sel) => {
  return this._getText(page, sel);
}

const _getDescText = async (page, sel, prop) => {
  return this._getText(page, sel, prop);
}

const _getText = async (page, sel, prop) => {
  const el = await page.$(sel);
  if (el === null) return 'Apply Now'
  const elText = await el.getProperty(prop || 'textContent');
  return await elText.jsonValue();
}

const _query = el => sel => prop => el.querySelector(sel)[prop];

const _replaceParams = (url, arrayOfParams) => (
  arrayOfParams.reduce((modifiedUrl, param) => {
    let currentUrl = modifiedUrl || url;
    let pattern = new RegExp('\\b('+param+'=).*?(&|#|$)');
    return currentUrl.replace(pattern, '');
  }, '')
)


module.exports = {
  _replaceParams,
  _query,
  _getStack,
  _getApplyLink,
  _getTitle,
  _getDescText,
  _getText,
  _getCategory,
  _reduceStack,
  settings,
  filterTitles
}

