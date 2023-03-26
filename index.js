'use strict';
const _ = require('lodash');
const axios = require('axios');

const defaultConfig = {
  browserMob: { host: 'localhost', port: 8080, protocol: 'http' },
};

class BrowserMobClient {
  constructor(config) {
    _.defaults(this, config || {}, defaultConfig);
    let bmp = this.browserMob;
    bmp.uri = `${bmp.protocol}://${bmp.host}:${bmp.port}`;
  }

  static createClient(config) {
    return new this(config);
  }

  async createHar(options) {
    return await this._callProxy('har', 'PUT', options);
  }

  async getHar() {
    return await this._callProxy('har', 'GET');
  }

  async closeProxies() {
    let that = this;
    return await this.listProxies().then((ports) => {
      return Promise.all(
        _.map(ports.proxyList, function (portData) {
          return that.end(portData.port);
        })
      );
    });
  }

  async setLimits(options) {
    let that = this;
    await that._callProxy('limit', 'PUT', options);
    return (that.limits = _.extend({}, that.limits, options));
  }

  async start(options) {
    let that = this;
    await that.callRest('proxy', 'POST', options).then((data)=> {
      that.proxy = data
    });
    return that.proxy;
  }

  async end(port) {
    let that = this;
    if (!port && !that.proxy) {
      return Promise.resolve();
    }
    const data = await this._callProxy(null, 'DELETE', null, port);
    if (!port || (that.proxy && that.proxy.port == port)) {
      delete that.proxy;
    }
  }

  async listProxies() {
    return await this.callRest('proxy', 'GET');
  }

  async callRest(url, method, data) {
    const response = await axios({
      method: method,
      data: data || {},
      url: `${this.browserMob.uri}/${url}`,
    }).catch((e) => {
      console.error('error occur');
      console.error(e);
    });
    return response.data;
  }

  _callProxy(ext, method, data, proxyPort) {
    let url = `proxy/${proxyPort || this.proxy.port}/${ext || ''}`;
    return this.callRest(url, method, data);
  }
}

module.exports = BrowserMobClient;
