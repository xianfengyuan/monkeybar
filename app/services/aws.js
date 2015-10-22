/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Debug from 'debug';
import fs from 'fs';
import aws from 'aws-sdk';
import async from 'async';

import config from '../configs/config';
import awscreds from '../configs/secrets';
import services from '../configs/awservice';

const debug = Debug('awsService');

String.prototype.inList = function (list) {
   return (list.indexOf(this.toString()) !== -1);
};

function isObjectInList(obj, list, key) {
  var ret = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i][key] === obj[key]) {
      ret = true;
      break;
    }
  }
  return ret;
}

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
  let ops = getAWS(account, region, service);
  let params = {};
  let s = services[service];
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
    let lid = type.split('::')[2];
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

function getAttrBy(account, region, ec2, attr, done) {
  showAWS(account, region, 'EC2', 'AWS::EC2::Instance', ec2, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data[0].Instances[0][attr]);
  });
}

function getBastion(account, region, ec2, done) {
  getAttrBy(account, region, ec2, 'VpcId', function(err, vpc) {
    if (err) {
      return done(err);
    }

    let ops = getAWS(account, region, 'EC2');
    let tags = ['opsworks:layer:bastion_host=bastion_host', 'aws:cloudformation:logical-id=BastionHost'];
    async.map(tags, function(tag, done) {
      let tp = tag.split('=');
      getOpsObject(ops,
                   'describeInstances',
                   {Filters: [{Name: 'vpc-id', Values: [vpc]}, {Name: 'tag:'+tp[0], Values: [tp[1]]}]}, done
                  );
    }, function(err, results) {
      if (err) {
        return done(err);
      }

      let ilist = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i] && results[i].Reservations) {
          for (let j = 0; j < results[i].Reservations.length; j++) {
            ilist = ilist.concat(results[i].Reservations[j].Instances);
          }
        }
      }
      done(null, ilist);
    }); //tags
  }); //vpc
}

function getSubNAT(account, region, subnetId, done) {
  var ops = getAWS(account, region, 'EC2');
  getOpsObject(ops, 'describeRouteTables', {
    Filters: [{Name: 'association.subnet-id', Values: [subnetId]}]
  }, function(err, data) {
    if (err) {
      return done(err);
    }
    
    if (data === undefined || !data.RouteTables.length) {
      return done({message: 'no routes found: ' + subnetId});
    }
    
    var vpc = data.RouteTables[0].VpcId;
    var routes = data.RouteTables[0].Routes.filter(function(e) {
      return e.DestinationCidrBlock.match('0.0.0.0/0');
    });
    if (!routes.length) {
      return done({vpc: vpc, message: 'no default route found: ' + JSON.stringify(data.RouteTables[0])});
    }
    
    if ('GatewayId' in routes[0] && routes[0].GatewayId.match('igw')) {
      getOpsObject(ops, 'describeInternetGateways', {InternetGatewayIds: [routes[0].GatewayId]}, function(err, data) {
        if (err) {
          return done(err);
        }
        var tag = data.InternetGateways[0].Tags.filter(function(t) {
          return t.Key.match('aws:cloudformation:stack-name');
        });
        return done({vpc: vpc, message: 'Traffic routes through internat gateway in cloudformation stack: '+tag[0].Value});
      });
    } else if ('InstanceId' in routes[0]) {
      getOpsObject(ops, 'describeInstances', {InstanceIds: [routes[0].InstanceId]}, function(err, data) {
        if (err) {
          return done(err);
        }
        var ilist = null;
        if (data.Reservations) {
          if (data.Reservations[0].Instances.length) {
            ilist = data.Reservations[0].Instances[0];
          }
        }
        done(null, ilist);
      });
    }
  });
}

export default {
  getAWS: getAWS,
  getOps: getOps,
  getOpsObject: getOpsObject,
  getOpsItems: getOpsItems,
  getOpsItem: getOpsItem,
  
  opsworks: function(acc, region, detail, done) {
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

  getAddrByID: function(account, region, stackId, done) {
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

  getNATByID: function(account, region, stackId, done) {
    var ops = getOps(account);
    
    getOpsObject(ops, 'describeInstances', {'StackId': stackId}, function(err, data) {
      if (err) {
        return done(err);
      }
      
      if (!data.Instances.length) {
        return done({message: 'no instance found in stack: ' + stackId});
      }
        
      var subs = {};
      data.Instances.forEach(function(e) {
        var sub = e.SubnetId;
        if (e.ElasticIp || e.PublicIp) {
          return;
        }

        if (subs[sub] === undefined) {
          subs[sub] = [e];
        } else {
          subs[sub].push(e);
        }
      });
      async.map(Object.keys(subs), function(sub, done) {
        getSubNAT(account, region, sub, done);
      }, function(err, data) {
        if (err) {
          return done(err);
        }
        var ilist = [];
        for (var i = 0; i < data.length; i++) {
          if (!isObjectInList(data[i], ilist, 'InstanceId')) {
            ilist.push(data[i]);
          }
        }
        if (!ilist.length) {
          return done({message: 'no NAT host found in stack: ' + stackId});
        }
        done(null, ilist);
      });
    });
  },

  getBastionByID: function(account, region, stackId, done) {
    let ops = getOps(account);
    getOpsObject(ops, 'describeInstances', {'StackId': stackId}, function(err, data) {
      if (err) {
        return done(err);
      }
      
      if (!data.Instances.length) {
        return done({message: 'no instance found in stack: ' + stackId});
      }

      let ec2list = [];
      data.Instances.forEach(function(e) {
        if (e.Status.match('(online|setup_failed)')) {
          ec2list.push(e.Ec2InstanceId);
        }
      });
      if (!ec2list.length) {
        return done({message: 'no online instance found in stack: ' + stackId});
      }

      getBastion(account, region, ec2list[0], function(err, data) {
        if (err) {
          return done(err);
        }
        
        if (!data.length) {
          return done({message: 'no bastion host found in stack: ' + stackId});
        }
        done(null, data);
      });
    });
  },
  
  getDeploy: function(account, region, stackId, done) {
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
    showAWS(account, region, 'EC2', 'AWS::EC2::VPC', id, done);
  },

  getEC2: function(account, region, id, done) {
    showAWS(account, region, 'EC2', 'AWS::EC2::Instance', id, done);
  }
  
};
