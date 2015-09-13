import express from 'express';
import aws from '../services/aws';

let router = express.Router();
let routes = {
  stack: aws.opsworks
};

router.get('/:route/:id', function(req, res) {
  let accounts = req.query.a;
  
  routes[req.params.route](accounts, req.params.id, function(err, data) {
    if (err) {
      return res.json(err);
    }
    res.json(data);
  });
});

export default router;
