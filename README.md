# BrowserMob Proxy Client

A library built to interact with [browsermob-proxy][1]'s REST Api. Browsermob proxy has not been updated in several years, it is unlikely that this library will see any substantial updates anytime soon

### Setup

1. Ensure that you've downloaded [browsermob-proxy][1] and have it running
2. `npm install browsermob-proxy-client-axios`

#### Quick Start With Selenium

```javascript
const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;
const selProxy = require("selenium-webdriver/proxy");
const bmpClient = require('browsermob-proxy-client-axios').createClient();
const fs = require("fs");
//need to require this or it looks for a globally installed chromedriver
const chromedriver = require("chromedriver");
const { ServiceBuilder, Options } = require("selenium-webdriver/chrome");

let harData;
let driver;
    // .setChromeService(serviceBuilder)
async function runBmp() {
  await bmpClient.start();
  await bmpClient.createHar();

  const hostPort = "localhost:" + bmpClient.proxy.port;
  let chromeOptions = new Options();

  // To collect all http request, need use chromeOptions --ignore-certificate-error
  // setProxy() no need to set.
  chromeOptions.addArguments(`--proxy-server=${hostPort}`);
  chromeOptions.addArguments("--ignore-certificate-errors");

  driver = new webdriver.Builder()
    .forBrowser("chrome")
    // .setProxy(selProxy.manual({ http: 'localhost:' + bmpClient.proxy.port }))
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
    fs.writeFileSync("yahoo.har", JSON.stringify(harData));
    console.log("Finished Successfully");

    await bmpClient.end();
    await driver.quit();
    process.exit([0]);
  })
  .catch(function (err) {
    console.error(err.message);
    console.error(err.stack);
    process.exit([1]);
  });
```

#### API

##### BrowserMobClient.createClient(config)

Synchronous function that instantiates a new client

- config

      {
        browserMob:{ // *optional* details on where browsermob is running
           host:'localhost',
           port: 8080,
           protocol:'http'
         },
         proxy:{ // *optional*
           port:8081,
           bindAddress: `192.168.1.222`
         }
      }

##### client.callRest(url, method, data)

Method to make direct calls to browsermob-proxy's REST API
see [browsermob-proxy](https://github.com/lightbody/browsermob-proxy#rest-api) for available urls. Returns a promise.

- url

  String - '/har' (see https://github.com/lightbody/browsermob-proxy#rest-api, for a list of endpoints)

- method

  String - 'GET, POST, DELETE, PUT'

- data

  Object - { enable: true }

##### client.closeProxies()

Returns a promise that closes all proxies running

##### client.createHar(options)

Returns a promise. Creates a har file on browsermob

- options

      {
        captureHeaders: - Boolean, capture headers or not.
                             Optional, default to "false".

        captureContent: - Boolean, capture content bodies or not.
                      Optional, default to "false".

        captureBinaryContent:  Boolean, capture binary content or not.
                         Optional, default to "false".

        initialPageRef: - The string name of The first page ref
                     that should be used in the HAR. Optional,
                     default to "Page 1".

        initialPageTitle: - The title of first HAR page. Optional,
                        default to initialPageRef.
      }

##### client.end()

Returns a promise that stops the proxy port

##### client.getHar()

Returns a promise that resolves to a har in JSON format

##### client.listProxies()

Resolves to { proxyList: [ { port: 8081 }, { port: 8082 }, { port: 8083 } ]

##### client.setLimits(options)

sets limits on the proxy

- options

      {
        downstreamKbps: - Sets the downstream bandwidth limit in kbps. Optional.

        upstreamKbps: - Sets the upstream bandwidth limit kbps. Optional, by default unlimited.

        downstreamMaxKB: - Specifies how many kilobytes in total the client is allowed to download through the proxy. Optional, by default unlimited.

        upstreamMaxKB: - Specifies how many kilobytes in total the client is allowed to upload through the proxy. Optional, by default unlimited.

        latency: - Add the given latency to each HTTP request. Optional, by default all requests are invoked without latency.

        enable: - A boolean that enable bandwidth limiter. Optional, by default to "false", but setting any of the properties above will implicitly enable throttling

        payloadPercentage: - Specifying what percentage of data sent is payload, e.g. use this to take into account overhead due to tcp/ip. Optional.

        maxBitsPerSecond: - The max bits per seconds you want this instance of StreamManager to respect. Optional.
      }

##### client.start(options)

starts a port to use

- options

      {
        port: 'specify a port to start the proxy on',
        bindAddress: '192.168.1.222'    // if working in a multi-home env
      }

### Development

### Testing

1. Install dependencies `npm install`

2. Install and run [browsermob-proxy][1]

   npm run install-browsermob
   npm run start-browsermob

3. Run the tests

   npm test

[1]: https://github.com/lightbody/browsermob-proxy
