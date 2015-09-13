/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';
import cx from 'classnames';

import config from '../configs/config';
import FilteredList from './FilteredList';
import JSONModal from './JSONModal';

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
            initial: props.stacks.content,
            stacks: props.stacks.content
        };
    }
    
    filteredList(event) {
        var search = event.target.value.toLowerCase();
        var updated = this.state.initial;
        if (search) {
            updated = updated.filter(function(item){
                return JSON.stringify(item).toLowerCase().search(event.target.value.toLowerCase()) !== -1;
		        });
            this.setState({stacks: updated});
        } else {
            this.setState({stacks: this.state.initial});
        }
	  }

    render() {
        let wrapperClasses = cx({
            'docs-page innerwrapper D(tb)--sm Tbl(f) Pt(20px) Mb(50px) Maw(1000px)--sm Miw(1000px)--lg Mx(a)--sm W(96%)--sm': true
        });
        
        return (
            <div className={wrapperClasses}>
                <FilteredList stacked={this.state.stacks} onFilteredList={this.filteredList.bind(this)}/>
                <OpsStacks stacks={this.state.stacks} />
            </div>
        );
    }
}

export default Stacks;
