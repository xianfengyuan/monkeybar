/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import Debug from 'debug';
import React from 'react';
import config from '../configs/config';

// other dependencies
import assets from '../utils/assets';

// components
import Nav from './Nav';
import PageHome from './PageHome';
import PageDocs from './PageDocs';
import PageReference from './PageReference';
import PageStacks from './PageStacks';
import Status500 from './Status500';
import Status404 from './Status404';

import { provideContext, connectToStores } from 'fluxible/addons';
import { handleHistory, NavLink } from 'fluxible-router';

const debug = Debug('MyApp');
class App extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isNavigateComplete;
    }
    
    componentDidUpdate(prevProps, prevState) {
        document.title = this.props.currentTitle;
    }
    
    render() {
        debug('rendering', this.props);

        var Handler = this.props.currentRoute && this.props.currentRoute.get('handler');
        var routeName = this.props.currentRoute && this.props.currentRoute.get('name');

        if (Handler) {
            if (this.props.currentNavigateError) {
                Handler = <Status500 />;
            } else if (routeName == 'stacks') {
                Handler = <Handler currentStack={this.props.currentStack} currentRoute={this.props.currentRoute} />;
            } else {
                Handler = <Handler currentDoc={this.props.currentDoc} currentRoute={this.props.currentRoute} />;
            }
        } else {
            Handler = <Status404 />
        }
        
        // Keep <a> and <Nav> in the same line to enforce white-space between them
        return (
            <div className="H(100%)">
                <div className="wrapper Bxz(bb) Mih(100%)">
                    <div id="header" role="header" className="P(10px) Ov(h) home_Ov(v) Z(7) Pos(r) Bgc($brandColor) optLegibility">
                        <div className="innerwrapper SpaceBetween Mx(a)--sm Maw(1000px)--sm W(90%)--sm W(a)--sm">
                            <NavLink className="Va(m) Fz(20px) Lh(1.2) C(#fff) Td(n):h" routeName="home">
                                <b className="D(n)--xs home_D(b) home_Cur(t)">{config.appTitle}</b>
                                <img id="logo" className="H(30px) Mt(1px) D(n)--sm home_D(n) docs_Mstart(40px)" alt='atomic css' src={assets['images/atomic-css-logo.png']} />

                            </NavLink> <Nav selected={routeName} />
                        </div>
                    </div>
                    {Handler}
                </div>
                <div id="footer" className="Py(16px) Px(20px) BdT Bdc(#0280ae.3)" role="footer">
                    <div className="innerwrapper SpaceBetween Mx(a)--sm Maw(1000px)--sm W(90%)--sm W(a)--sm">
                        <small>All code on this site is licensed under © 2015 Xianfeng Yuan. All rights reserved.</small>
                    </div>
                </div>
            </div>
        );
    }
}

App = connectToStores(App, ['DocStore', 'StackStore'], function (stores, props) {
    return {
        currentTitle: stores.DocStore.getCurrentTitle() || '',
        currentDoc: stores.DocStore.getCurrent() || {},
        currentStack: stores.StackStore.getCurrent() || {}
    };
 });
 
// wrap with history handler
App = handleHistory(App);

// and wrap that with context
App = provideContext(App);

export default App;
