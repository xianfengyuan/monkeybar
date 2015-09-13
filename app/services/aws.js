import Debug from 'debug';
import fs from 'fs';

import config from '../configs/config';

const debug = Debug('awsService');

export default {
  opsworks: function(acc, detail, done) {
    let accounts = acc.split(',');
    debug(acc);
    debug(detail);
    fs.readFile(config.gdir('opsworks'), function(err, data) {
      if (err) {
        return done(err);
      }
      let scache = JSON.parse(data).cache;
      fs.readFile(config.gdir(detail), function(err, data) {
        if (err) {
          return done(err);
        }
        let dcache = JSON.parse(data).cache;
        let stacks = [{a: accounts[0], d: {Stacks: scache[accounts[0]]}},
                      {a: accounts[1], d: {Stacks: scache[accounts[1]]}}];
        stacks = stacks.map(function(e) {
          let account = e.a, slist = e.d.Stacks;
          slist = slist.map(function(d) {
            let nstack = d;
            nstack.deployments = [];
            let deployments = dcache[account].filter(function(dd) {
              return dd.sid === d.StackId;
            });
            if (deployments.length) {
              nstack.deployments = deployments[0].si;
            }
            return nstack;
          });
          return {a: account, d: {Stacks: slist}};
        });
        done(null, {account: acc, stacks: stacks});
      });
    });
  }
};
