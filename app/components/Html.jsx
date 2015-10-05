/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

// other dependencies
import assets from '../utils/assets';

// stores
import { provideContext, connectToStores } from 'fluxible/addons';

class Html extends React.Component {
    render() {
        let liveReload = this.props.dev ? (<script src={"//localhost:35729/livereload.js"}></script>) : '';
        let ieStylesheet;

        // yes, browser sniffing isn't a good idea, but we're taking the pragmatic approach
        // for old IE for server-side rendering.
        if (this.props.ua.browser.name === 'IE' && this.props.ua.browser.major < 9) {
            ieStylesheet = (<link rel="stylesheet" href={assets['css/ie.css']} />);
        }

        return (
            <html className="web" lang="en-US">
                <head>
                    <meta charSet="UTF-8" />
                    <title>{this.props.currentTitle}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" href={assets['css/bundle.css']} />
                    <link href="http://fonts.googleapis.com/css?family=Nobile" rel="stylesheet" />
                    <link rel="author" href="humans.txt" />
                    <script src="https://code.jquery.com/jquery-1.10.0.min.js"></script>
                    {ieStylesheet}
                </head>
                <body>
                    <div id="app" className="H(100%)" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                    {liveReload}
                </body>
                <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                <script src={assets['js/common.js']}></script>
                <script src={assets['js/main.js']}></script>
                <script src="https://assets.codepen.io/assets/embed/ei.js" async></script>
            </html>
        );
    }
}

// connect to stores
Html = connectToStores(Html, ['DocStore'], function (stores, props) {
    return {
        currentTitle: stores.DocStore.getCurrentTitle() || '',
        currentDoc: stores.DocStore.getCurrent() || {}
    };
});

// and wrap that with context
Html = provideContext(Html);

export default Html;
