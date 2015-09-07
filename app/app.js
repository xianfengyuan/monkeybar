/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';
import FluxibleApp from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
var RouteStore = require('fluxible-router').RouteStore;

// configs
import routes from './configs/routes';

// components
import App from './components/App';

// actions
import show500 from './actions/show500';
import show404 from './actions/show404';

const app = new FluxibleApp({
    component: App,
    componentActionHandler: function (context, payload, done) {
        if (payload.err) {
            if (payload.err.statusCode && payload.err.statusCode === 404) {
                context.executeAction(show404, payload, done);
            }
            else {
                console.log(payload.err.stack || payload.err);
                context.executeAction(show500, payload, done);
            }
            return;
        }
        done();
    }
});

var MyRouteStore = RouteStore.withStaticRoutes(routes);

app.plug(fetchrPlugin({ xhrPath: '/_api' }));
app.registerStore(MyRouteStore);

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/DocStore'));
app.registerStore(require('./stores/ReferenceStore'));
app.registerStore(require('./stores/StackStore'));

export default app;
