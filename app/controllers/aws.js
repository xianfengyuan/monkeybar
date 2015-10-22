/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import express from 'express';
import aws from '../services/aws';

let router = express.Router();
let routes = {
  stack:   aws.opsworks,
  vpc:     aws.getVpc,
  ec2:     aws.getEC2,
  deploy:  aws.getDeploy,
  addr:    aws.getAddrByID,
  nat:     aws.getNATByID,
  bastion: aws.getBastionByID
};

router.get('/:route/:id', function(req, res) {
  let accounts = req.query.a;
  let region = req.query.r;
  
  routes[req.params.route](accounts, region, req.params.id, function(err, data) {
    if (err) {
      return res.json(err);
    }
    res.json(data);
  });
});

export default router;
