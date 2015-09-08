/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

// other dependencies
import Stacks from './Stacks';

import { handleRoute } from 'fluxible-router';

class PageStacks extends React.Component {
    render() {
        return (
            <div id="opsworks" role="main" className="opsworks-page innerwrapper Mb(50px) Mx(10px) Maw(1000px)--sm Mx(a)--sm W(90%)--sm">
                <h1>OpsWorks</h1>
                <p>Use this page to search for OpsWorks stack information.</p>
                <Stacks />
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
