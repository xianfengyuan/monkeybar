/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';
import cx from 'classnames';
import {NavLink} from 'fluxible-router';

import config from '../configs/config';

// other dependencies
import assets from '../utils/assets';

class Nav extends React.Component {
    render() {
        let selected = this.props.selected;

        return (
            <ul role="navigation" className="Va(m)">
                <li className={cx({'selected': selected !== 'stacks' && selected !== 'home', 'D(ib) Va(m) Mstart(10px) Pos(r)': true})}>
                    <NavLink routeName="quickStart" className="D(b) C(#fff) Td(n):h">Docs</NavLink>
                </li>
                <li className={cx({'selected': selected === 'stacks', 'D(ib) Va(m) Pos(r) Mstart(10px)': true})}>
                    <NavLink routeName="stacks" className="D(b) C(#fff) Td(n):h">OpsWorks</NavLink>
                </li>
                <li className="D(ib) Mstart(10px) Pos(r)">
                    <a className="D(b) C(#fff) Td(n):h" href={config.appUrl}>
                        <img className="Va(m) Pos(r)" alt="GitHub" width="30" src={assets['images/github-logo.png']} />
                    </a>
                </li>
            </ul>
        );
    }
}

export default Nav;
