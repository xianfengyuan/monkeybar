import Debug from 'debug';
import fs from 'fs';
import aws from 'aws-sdk';

import config from '../configs/config';
import awscreds from '../configs/secrets';
import services from '../configs/awservice';

const debug = Debug('awsService');

String.prototype.inList = function (list) {
   return (list.indexOf(this.toString()) !== -1);
};

function getAWS(account, region, service) {
  let creds = awscreds[account];
  aws.config = new aws.Config(creds);
  aws.config.region = (service === 'OpsWorks')? 'us-east-1': region;
  let ops = new aws[service]({maxRetries: 10});
  return ops;
}

function getOps(account) {
  return getAWS(account, 'us-east-1', 'OpsWorks');
}

function showAWS(account, region, service, type, id, done) {
  var ops = getAWS(account, region, service);
  var params = {};
  var s = services[service];
  if (s && s[type]) {
    if (s[type][3]) {
      params[s[type][1]] = id;
    } else {
      params[s[type][1]] = [id];
    }
    getOpsObject(ops, s[type][0], params, function(err, data) {
      if (err) {
        return done(err);
      }
      done(null, data[s[type][2]]);
    });
  } else {
    var lid = type.split('::')[2];
    params[lid + 'Ids'] = [id];
    getOpsObject(ops, 'describe' + lid + 's', params, function(err, data) {
      if (err) {
        return done(err);
      }
      done(null, data[lid + 's']);
    });
  }
}

function getOpsItem(ops, func, param, collection, attr, val, done) {
  if (ops[func] === undefined) {
    return done({message: 'no function defined: ' + func});
  }
  ops[func](param, function(err, data) {
    if (err) {
      return done(err);
    }
    
    let result = null;
    for (let i = 0; i < data[collection].length; i++) {
      let item = data[collection][i];
      if (item[attr] && (item[attr].toLowerCase() === val.toLowerCase())) {
        result = item;
      }
    }
    done(null, result);
  });
}

function getOpsItems(ops, func, param, collection, attr, vals, done) {
  let vl = vals.map(function(val) {
    return val.toLowerCase();
  });
  if (ops[func] === undefined) {
    return done({message: 'no function defined: ' + func});
  }
  ops[func](param, function(err, data) {
    if (err) {
      return done(err);
    }
    
    let results = [];
    for (let i = 0; i < data[collection].length; i++) {
      let item = data[collection][i];
      if (item[attr].toLowerCase().inList(vl)) {
        results.push(item);
      }
    }
    done(null, results);
  });
}

function getOpsObject(ops, func, param, done) {
  if (ops[func] === undefined) {
    return done({message: 'no function defined: ' + func});
  }
  ops[func](param, function(err, data){
    if (err) {
      return done(err);
    }
    done(null, data);
  });
}

export default {
  getAWS: getAWS,
  getOps: getOps,
  getOpsObject: getOpsObject,
  getOpsItems: getOpsItems,
  getOpsItem: getOpsItem,
  
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
  },

  getAddrByID: function(account, stackId, done) {
    let ops = getOps(account);
    getOpsObject(ops, 'describeInstances', {'StackId': stackId}, function(err, data) {
      if (err) {
        return done(err);
      }
      
      if (!data.Instances.length) {
        return done({message: 'no instance found in stack: ' + stackId});
      }
      let list = data.Instances.sort(function(sa, sb) {
        return (sa.Hostname < sb.Hostname) ? -1 : 1;
      });
      done(null, list);
    });
  },

  getDeploy: function(account, stackId, done) {
    let ops = getOps(account);
    getOpsObject(ops, 'describeDeployments', {'StackId': stackId}, function(err, data) {
      if (err) {
        return done(err);
      }
      
      if (!data.Deployments.length) {
        return done({message: 'no deployment found in stack: ' + stackId});
      }
      let list = data.Deployments.map(function(e) {
        let obj = e;
        obj.account = account;
        return obj;
      });
      done(null, list);
    });
  },

  getVpc: function(account, region, id, done) {
    showAWS(account, region, 'EC2', 'AWS::EC2::VPC', id, function(err, data) {
      if (err) {
        return done(err);
      }
      done(null, data);
    });
  }

};
