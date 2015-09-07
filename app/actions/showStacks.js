/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import config from '../configs/config';
import StackStore from '../stores/StackStore';

export default function (context, route, done) {
  let routeConfig = route.config || {};
  let pageTitle = routeConfig.pageTitle || (routeConfig.pageTitlePrefix + ' | ' + config.appTitle);
  let service = routeConfig.service;
  
  let stackFromCache = context.getStore(StackStore).get(service);
  
  if (stackFromCache) {
    context.dispatch('RECEIVE_STACK_SUCCESS', stackFromCache);
    context.dispatch('UPDATE_PAGE_TITLE', {
      pageTitle: pageTitle
    });
    return done();
  }

  // Load from service
  context.service.read('stacks', {service: service}, {}, function (err, data) {
    if (err) {
      return done(err);
    }

    if (!data) {
      return done('data error');
    }

    context.dispatch('RECEIVE_STACK_SUCCESS', data);
    context.dispatch('UPDATE_PAGE_TITLE', {
      pageTitle: pageTitle
    });
    done();
  });
}
