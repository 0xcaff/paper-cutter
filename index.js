#!/usr/bin/env node

const puppeteer = require("puppeteer");
const yargs = require("yargs");

const packageJson = require("./package.json");

const argv = yargs
  .command("$0 [files..]", packageJson.description, yargs =>
    yargs.positional("files", {
      describe: "The files to print.",
      type: "string",
      demandOption: true
    })
  )
  .options({
    "login-page": {
      describe: "The papercut MF login page URL.",
      type: "string",
      demandOption: true
    },
    username: {
      describe: "The username to use at the login page.",
      type: "string",
      demandOption: true
    },
    password: {
      // I am aware that passing passwords as command line arguments is very bad
      // but my use case for this script is in a trusted environment.
      describe: "The password to use at the login page.",
      type: "string",
      demandOption: true
    },
    testing: {
      describe: "Run in testing mode.",
      type: "boolean"
    }
  })
  .help().argv;

const { files, testing, loginPage, username, password } = argv;

if (!files || !files.length) {
  throw new TypeError("Place specify files.");
}

// Navigates to the log in page, enters the username and password and clicks the
// submit button. Throws an exception if login fails. After this function
// executes, the user summary page is loading.
const login = async (page, username, password) => {
  await page.goto(loginPage);

  await page.type('input[name="inputUsername"]', username);
  await page.type('input[name="inputPassword"]', password);

  await page.click('input[type="submit"]');

  await page.waitFor(".errorMessage, .end-user-login");
  const errors = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".errorMessage")).map(elems =>
      elems.textContent.trim()
    )
  );

  if (errors.length) {
    throw new TypeError(
      `The following errors were encountered on the page. ${errors.join(", ")}`
    );
  }
};

// Waits for a button to appear then clicks it.
const waitAndClick = async (page, selector) => {
  await page.waitFor(selector);
  await page.click(selector);
};

// Assumes it is on the user summary page. Navigates to the print submission
// page and submits files for printing.
const print = async (page, files) => {
  await waitAndClick(page, "#linkUserWebPrint");
  await waitAndClick(page, ".btn");
  await waitAndClick(page, 'input[type="submit"].right');

  const fileInputSelector = "body > input[type=file]";
  await page.waitFor(fileInputSelector);
  const fileInput = await page.$(fileInputSelector);

  await fileInput.uploadFile(...files);

  await waitAndClick(page, 'input[type="submit"].right');

  await page.waitFor("#status");
};

async function main() {
  const browser = await puppeteer.launch({
    headless: !testing,
    executablePath: testing ? "/usr/bin/chromium" : undefined,
    args: argv["--"]
  });

  try {
    const page = await browser.newPage();

    await login(page, username, password);
    await print(page, files);
  } finally {
    await browser.close();
  }
}

main();
