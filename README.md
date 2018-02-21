# paper-cutter

A script to programmatically submit print jobs to a PaperCut MF Printer using
[puppeteer].

## Installation

    yarn global add https://github.com/0xcaff/paper-cutter

## Usage

    paper-cutter \
      --login-page 'https://print02.main.ad.rit.edu/app' \
      --username 'mxc4400' \
      --password 'THISISMYPASSWORD' \
      homeworkToPrint.pdf

When running in docker the `--no-sandbox` flag needs to be used.

    paper-cutter \
      --login-page 'https://print02.main.ad.rit.edu/app' \
      --username 'mxc4400' \
      --password 'THISISMYPASSWORD' \
      homeworkToPrint.pdf \
      -- --no-sandbox

A docker image with puppeteer and paper-cutter is available here
([0xcaff/paper-cutter][docker]).

[docker]: https://hub.docker.com/r/0xcaff/paper-cutter/
[puppeteer]: https://github.com/GoogleChrome/puppeteer
