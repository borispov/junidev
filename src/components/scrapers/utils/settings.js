const settings = {
  defaultViewport: {
    width: 1920,
    height: 1080
  },
  headless: true,
  // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
  ignoreHTTPSErrors: true,
  devtools: true,
  args: [
    "--incognito",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    "--user-agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'"
  ]
}


module.exports = settings;
