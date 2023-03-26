#!/usr/bin/env node
'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const selProxy = require('selenium-webdriver/proxy');
const bmpClient = require('../index').createClient();
const fs = require('fs');
//need to require this or it looks for a globally installed chromedriver
const chromedriver = require('chromedriver');
const { ServiceBuilder, Options } = require('selenium-webdriver/chrome');

let harData;
let driver;
// let chromeDriverPath = "/path/to/chromedriver";
// const serviceBuilder = new ServiceBuilder(chromeDriverPath);

async function runBmp() {
  await bmpClient.start();
  await bmpClient.createHar();

  const hostPort = 'localhost:' + bmpClient.proxy.port;
  let chromeOptions = new Options();

  // To collect all http request, need use chromeOptions --ignore-certificate-error
  // setProxy() no need to set.
  chromeOptions.addArguments(`--proxy-server=${hostPort}`)
  chromeOptions.addArguments('--ignore-certificate-errors')

  driver = new webdriver.Builder()
    .forBrowser('chrome')
    // .setProxy(selProxy.manual({ http: 'localhost:' + bmpClient.proxy.port }))
    // .setChromeService(serviceBuilder)
    .setChromeOptions(chromeOptions)
    .build();


  await driver.get("https://search.yahoo.com");
  await driver.sleep(5000);

  harData = await bmpClient.getHar();
  //do something
  console.log("harData:", harData);

}

runBmp()
  .then(async function () {
    console.log("harData.log.entries: ", harData.log.entries.length);
    fs.writeFileSync('yahoo.har', JSON.stringify(harData) );
    console.log("Finished Successfully");
    
    await bmpClient.end();
    await driver.quit();
    process.exit([0]);
  })
  .catch(function (err) {
    console.error(err.message);
    console.error(err.stack)
    process.exit([1]);
  });

