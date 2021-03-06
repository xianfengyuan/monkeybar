/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import debugLib from 'debug';
import marked from 'marked';
import fs from 'fs';
import highlight from 'highlight.js';

import renderer from './../utils/renderer';
import config from '../configs/config';
import routes from '../configs/routes';

const debug = debugLib('StackService');

marked.setOptions({
  highlight: (code) => {
    return highlight.highlightAuto(code).value;
  }
});

// Generate an hash of valid api routes, from the /configs/apis.js file
let cache = {};

let fetchAPI = function (params, cb) {
  let service = params.service;
  debug(service);
  let apiPath = config.gdir(service);

  fs.readFile(apiPath, function(err, data) {
    if (err) {
      return cb && cb(err);
    }

    let fcache = JSON.parse(data);
    
    let alist = ['gindevpower', 'ginprodpower'];
    let items = [];
    alist.forEach(function(e) {
      if (fcache && fcache.cache && fcache.cache[e]) {
        let stacks = fcache.cache[e];
        if (stacks.length) {
          items = items.concat(stacks);
        }
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
  });
};

(function refreshService() {
  Object.keys(routes).forEach(function (routeName) {
    var service = routes[routeName].service;
    if (service) {
      debug('refreshing ' + service);
      fetchAPI({
        service: service
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
