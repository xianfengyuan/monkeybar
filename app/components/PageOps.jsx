/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

// other dependencies
import Ops from './Ops';

class PageOps extends React.Component {
    render() {
        return (
            <div id="opsworks" role="main" className="opsworks-page innerwrapper Mb(50px) Mx(10px) Maw(1000px)--sm Mx(a)--sm W(90%)--sm">
                <h1>OpsWorks</h1>
                <p>Use this page to search for OpsWorks stack information.</p>
                <Ops stacks={this.state.stacks} />
            </div>
        );
    }
}

export default PageOps;
