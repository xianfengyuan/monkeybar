/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */ 
import config from '../configs/config';

export default function (context, route, done) {
    let routeConfig = route.config || {};
  let pageTitle = routeConfig.pageTitle || (routeConfig.pageTitlePrefix + ' | ' + config.appTitle);

    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: pageTitle
    });
    done();
}
