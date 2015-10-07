/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';
import cx from 'classnames';

import config from '../configs/config';
import JSONModal from './JSONModal';
import StackTable from './StackTable';

class OpsStack extends React.Component {
    render() {
        var stack = this.props.stack;
        return (
            <li className="OpsStack">
                <JSONModal data={stack} title={stack.Name}/>
            </li>
        )
    }
}

class OpsStacks extends React.Component {
    render() {
        var content = this.props.stacks.map(function(e) {
            return (
                <OpsStack stack={e} />
            )
        });
        
        return (
            <ul className="OpsStack">{content}</ul>
        )
    }
}

class Stacks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stacks: props.stacks.content
        };
    }
    
    render() {
        let wrapperClasses = cx({
            'docs-page innerwrapper D(tb)--sm Tbl(f) Pt(20px) Mb(50px) Maw(1000px)--sm Miw(1000px)--lg Mx(a)--sm W(96%)--sm': true
        });
        //let cols = {StackId: 375};
        let cols = {Region: 125, Name: 375, VpcId: 125, StackId: 375};
        return (
            <div className={wrapperClasses}>
                <StackTable tableRows={this.state.stacks} cols={cols} />
            </div>
        );
    }
}

export default Stacks;
