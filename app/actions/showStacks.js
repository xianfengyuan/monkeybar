/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Debug from 'debug';
import config from '../configs/config';
import StackStore from '../stores/StackStore';

const debug = Debug('StackAction');

export default function (context, route, done) {
  let pageTitle = route.get('pageTitle') || (route.get('pageTitlePrefix') + ' | ' + config.appTitle);
  let service = route.get('service');

  debug(service);
  
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
      let err404 = new Error(service + ' not found');
      err404.statusCode = 404;
      return done(err404);
    }

    context.dispatch('RECEIVE_STACK_SUCCESS', data);
    context.dispatch('UPDATE_PAGE_TITLE', {
      pageTitle: pageTitle
    });
    done();
  });
}
