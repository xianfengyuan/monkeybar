/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';
import FluxibleApp from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import Debug from 'debug';
import { RouteStore } from 'fluxible-router';

// configs
import routes from './configs/routes';

// components
import App from './components/App';

const debug = Debug('app.js');
const MyRouteStore = RouteStore.withStaticRoutes(routes);

const app = new FluxibleApp({
    component: App,
    componentActionHandler: function (context, payload, done) {
        if (payload.err) {
          if (payload.err.statusCode === 404) {
            debug('component 404 error', payload.err);
          }
          else {
            debug('component exception', payload.err);
          }
          return;
        }
      done();
    }
});

app.plug(fetchrPlugin({ xhrPath: '/_api' }));

app.registerStore(require('./stores/DocStore'));
app.registerStore(require('./stores/StackStore'));
app.registerStore(require('./stores/ReferenceStore'));
app.registerStore(MyRouteStore);

export default app;
