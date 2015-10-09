import express from 'express';
import aws from '../services/aws';

let router = express.Router();
let routes = {
  stack: aws.opsworks,
  vpc: aws.getVpc,
  deploy: aws.getDeploy,
  addr: aws.getAddrByID
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
