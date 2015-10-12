/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import cx from 'classnames';

import Menu from './Menu';
import Stacks from './Stacks';

import { handleRoute } from 'fluxible-router';

class PageStacks extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isMenuVisible: false
        };
    }

    handleMenuToggle() {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible
        });
    }

    hideMenu() {
        this.setState({
            isMenuVisible: false
        });
    }

    render() {
        let wrapperClasses = cx({
            'menu-on': this.state.isMenuVisible,
            'docs-page innerwrapper D(tb)--sm Tbl(f) Pt(20px) Mb(50px) Maw(1200px)--sm Miw(1200px)--lg Mx(a)--sm W(96%)--sm': true
        });

        return (
            <div className={wrapperClasses}>
                <button onClick={this.handleMenuToggle} id="toggleMenuButton" className="menu-button Bgi(hamburger) W(32px) H(32px) D(n)--sm Pos(a) Bdw(0) Bgc(t) P(0) T(0) Start(0) Z(7) M(10px) menu-on_Bgp(end_t)">
                    <b className="Hidden">Toggle the menu</b>
                </button>
                <Menu onClickHandler={this.handleMenuToggle} selected={this.props.currentRoute.get('name')} />
                <Stacks stacks={this.props.currentStack} currentRoute={this.props.currentRoute} />
                <div onClick={this.handleMenuToggle} id="overlay" className="D(n) D(n)!--sm menu-on_D(b) Bgc(#000.6) Z(3) Pos(f) T(0) Start(0) W(100%) H(100%)"></div>
            </div>
        );
    }
}

PageStacks = handleRoute(PageStacks);

PageStacks.propTypes = {
    currentStack: React.PropTypes.object.isRequired,
    currentRoute: React.PropTypes.object.isRequired
};

export default PageStacks;
