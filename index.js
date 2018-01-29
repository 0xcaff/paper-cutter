const puppeteer = require('puppeteer');

const loginPage = 'https://print02.main.ad.rit.edu/app';
const headless = true;

const login = async (page, username, password) => {
  await page.goto(loginPage);
};

async function main() {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  // Array.from(document.querySelectorAll('input[type="file"]'))[1].click();
  login(page);

  // await browser.close();
}

main();
