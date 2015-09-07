/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import express from 'express';
import favicon from 'serve-favicon';
import serialize from 'serialize-javascript';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import React from 'react';
import UAParser from 'ua-parser-js';
import {navigateAction} from 'fluxible-router';
import show404 from './actions/show404';
import show500 from './actions/show500';

// components
import Html from './components/Html';
import { createElementWithContext } from 'fluxible-addons-react';

// other dependencies
import app from './app';

// some options to start the SERVER
import argv from 'minimist';

// constants
const ARGS = argv(process.argv.slice(2));
const HTML = React.createFactory(Html);
const SERVER = express();
const PORT = argv.port || process.env.PORT || 8081;
const DEV = argv.dev || false;
const DOC_TYPE = [
      '<!DOCTYPE html>',
      '<!-- ',
      '            ___           ___           ___           ___                  ',
      '           /  /\\         /  /\\         /  /\\         /  /\\             ',
      '          /  /::\\       /  /:/        /  /:/_       /  /:/_               ',
      '         /  /:/\\:\\     /  /:/        /  /:/ /\\     /  /:/ /\\           ',
      '        /  /:/~/::\\   /  /:/  ___   /  /:/ /::\\   /  /:/ /::\\           ',
      '       /__/:/ /:/\\:\\ /__/:/  /  /\\ /__/:/ /:/\\:\\ /__/:/ /:/\\:\\      ',
      '       \\  \\:\\/:/__\\/ \\  \\:\\ /  /:/ \\  \\:\\/:/~/:/ \\  \\:\\/:/~/:/',
      '        \\  \\::/       \\  \\:\\  /:/   \\  \\::/ /:/   \\  \\::/ /:/     ',
      '         \\  \\:\\        \\  \\:\\/:/     \\__\\/ /:/     \\__\\/ /:/     ',
      '          \\  \\:\\        \\  \\::/        /__/:/        /__/:/           ',
      '           \\__\\/         \\__\\/         \\__\\/         \\__\\/         ',
      '-->'
].join('\n');

// set up the server
SERVER.set('state namespace', 'App');
SERVER.use(favicon(__dirname + '/../favicon.ico'));
SERVER.use('/public', express.static(__dirname + '/build'));
SERVER.use('/humans.txt', express.static(__dirname + '/assets/humans.txt'));
SERVER.use(cookieParser());
SERVER.use(bodyParser.json());
SERVER.use(csrf({cookie: true}));

// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');

// Register our services
fetchrPlugin.registerService(require('./services/docs'));
fetchrPlugin.registerService(require('./services/stacks'));

// Set up the fetchr middleware
SERVER.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

// Render the app
function renderApp(req, res, context) {
  const app =  createElementWithContext(context);
  const renderedApp = React.renderToString(app);
    const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';
    const componentContext = context.getComponentContext();
    const ua = new UAParser().setUA(req.headers['user-agent']).getResult();
    const html = React.renderToStaticMarkup(HTML({
        context: componentContext,
        state: exposed,
        ua: ua,
        dev: DEV,
        markup: renderedApp
    }));
    res.send(DOC_TYPE + html);
}

// Every other request gets the app bootstrap
SERVER.use(function (req, res, next) {
    const context = app.createContext({
        req: req, // The fetchr plugin depends on this
        xhrContext: {
            _csrf: req.csrfToken() // Make sure all XHR requests have the CSRF token
        }
    });

    context.executeAction(navigateAction, { url: req.url }, function (err) {
        if (err) {
            if (err.status === 404 || err.statusCode === 404) {
                res.status(404);
                context.executeAction(show404, { err: err }, function () {
                    renderApp(req, res, context);
                });
            }
            else {
                res.status(500);
                context.executeAction(show500, { err: err }, function () {
                    console.log(err.stack || err);
                    renderApp(req, res, context);
                });
            }

            return;
        }
        renderApp(req, res, context);
    });
});

SERVER.listen(PORT);
console.log('Listening on port ' + PORT + (DEV ? ' - dev mode' : ''));
