/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Debug from 'debug';
import marked from 'marked';
import fs from 'fs';
import highlight from 'highlight.js';

import renderer from '../utils/renderer';
import helpers from '../utils/helpers';
import config from '../configs/config';
import routes from '../configs/routes';

const debug = Debug('StackService');

marked.setOptions({
  highlight: (code) => {
    return highlight.highlightAuto(code).value;
  }
});

// Generate an hash of valid api routes, from the /configs/apis.js file
let cache = {};

let fetchAPI = function (params, cb) {
  let service = params.service;
  let detail = params.detail;
  debug(service);
  let apiPath = config.gdir(service);
  let deploys = config.gdir(detail);

  fs.readFile(apiPath, function(err, data) {
    if (err) {
      return cb && cb(err);
    }
    let scache = JSON.parse(data).cache;

    fs.readFile(deploys, function(err, data) {
      if (err) {
        return cb && cb(err);
      }
      let dcache = JSON.parse(data).cache;
      let alist = ['ginprodpower', 'gindevpower'];

      let stacks = [{a: alist[0], d: {Stacks: scache[alist[0]]}},
                    {a: alist[1], d: {Stacks: scache[alist[1]]}}];
      stacks = stacks.map(function(e) {
        let account = e.a, slist = e.d.Stacks;
        slist = slist.map(function(d) {
          let nstack = d;
          nstack.deployments = [];
          let ts = 'deployments';
          let deployments = dcache[account].filter(function(dd) {
            return dd.sid === d.StackId;
          });
          if (deployments.length) {
            nstack.deployments = deployments[0].si;
            if (nstack.deployments.length) {
              ts = new Date(nstack.deployments[0].CreatedAt);
              let date = helpers.datestamp(ts.getTime() / 1000);
              ts = helpers.formatZero(ts.getHours()) + ':' +
                helpers.formatZero(ts.getMinutes()) + ':' +
                helpers.formatZero(ts.getSeconds()) + ' ' + date;
            }
            nstack.lastdeploy = ts;
            debug(ts);
          }
          return nstack;
        });
        return {a: account, d: {Stacks: slist}};
      });

      let items = [];
      stacks.forEach(function(e) {
        let slist = e.d.Stacks;
        if (slist.length) {
          items = items.concat(slist);
        }
      });
      debug(items.length);
    
      if (items.length) {
        cache[service] = {
          key: service,
          content: items
        };
        cb && cb(null, cache[service]);
      } else {
        cache[service] = {
          key: service,
          content: marked('# Service Not Found: ' + service, {renderer: renderer})
        };
        cb && cb(null, cache[service]);
      }
    }); //deploys
  }); // stacks
};

(function refreshService() {
  Object.keys(routes).forEach(function (routeName) {
    let service = routes[routeName].service;
    let detail = routes[routeName].detail;
    if (service) {
      debug('refreshing ' + service);
      fetchAPI({
        service: service,
        detail: detail
      });
    }
  });
  
  setInterval(refreshService, 60 * 60 * 1000); // one hour
})();

export default {
  name: 'stacks',
  read: function (req, resource, params, config, callback) {
    if (cache[params.service]) {
      return callback(null, cache[params.service]);
    } else {
      return fetchAPI(params);
    }
  }
};
