/* global CodePenEmbed */
/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';
import {navigateAction} from 'fluxible-router';

import config from '../configs/config';

// constants
const DOCS_URL = config.appUrl + '/tree/master/app';

function isLeftClickEvent (e) {
    return e.button === 0;
}
function isModifiedEvent (e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

class Doc extends React.Component {
    onClick(e) {
        let target = e.target;

        if ('A' === target.nodeName && '/' === target.getAttribute('href').substr(0, 1)) {
            if (isModifiedEvent(e) || !isLeftClickEvent(e)) {
                return;
            }

            this.context.executeAction(navigateAction, {
                url: target.getAttribute('href')
            });

            e.preventDefault();
        }
    }

    componentDidUpdate() {
        if (typeof CodePenEmbed !== 'undefined' && CodePenEmbed._showCodePenEmbeds) {
            CodePenEmbed._showCodePenEmbeds();
        }
    }

    render() {
        let editEl = '';
        let title = '';
        let path = this.props.currentRoute.get('githubPath');
        
        if (this.props.currentRoute && path !== -1) {
            editEl = (
                <a href={DOCS_URL + path} className="D(ib) Va(m) Mt(30px)" target='_blank'>
                    Edit on Github
                </a>
            )
        }

        if (this.props.title) {
            title = (
                <div className="SpaceBetween">
                    <h1 className="D(ib) Va(m) Fz(30px)">{this.props.title}</h1> {editEl}
                </div>
            );
        }

        let markup = (this.props.currentDoc && this.props.currentDoc.content) || '';
        
        return (
            <div id="main" role="main" className="D(tbc)--sm home_D(b)! Px(10px) menu-on_Pos(f)">
                {title}
                <div onClick={this.onClick.bind(this)} dangerouslySetInnerHTML={{__html: markup}}></div>
            </div>
        );
    }
}

Doc.contextTypes = {
    executeAction: React.PropTypes.func
};

Doc.propTypes = {
    currentDoc: React.PropTypes.object.isRequired,
    currentRoute: React.PropTypes.object.isRequired
};

export default Doc;
