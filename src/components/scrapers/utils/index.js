const puppeteer = require('puppeteer');
const keywords = require('./keywords');

const _getStack = text => {
   return keywords
    .filter(keyword => keyword.regex.test(text))
    .map(keyword => keyword.name);
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
  keywords,
  _getStack,
  _getApplyLink,
  _getTitle,
  _getDescText,
  _getText
}

