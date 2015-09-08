/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

import config from '../configs/config';
import FilteredList from './FilteredList';

import { provideContext, connectToStores } from 'fluxible/addons';
import { handleHistory, NavLink } from 'fluxible-router';

class Stacks extends React.Component {
    constructor(props) {
        super(props);
        this.initial = props.current;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isNavigateComplete;
    }
    
    componentDidUpdate(prevProps, prevState) {
        document.title = this.props.currentTitle;
    }
    
    filteredList(event) {
        var search = event.target.value.toLowerCase();
        var current = this.state.current;
        var key = current.key;
        var updated = this.initial.content;
        if (search) {
            updated = updated.filter(function(item){
                return JSON.stringify(item).toLowerCase().search(event.target.value.toLowerCase()) !== -1;
		        });
            current = {key: key, content: updated};
            this.setState({current: current});
        } else {
            current = {key: key, content: updated};
            this.setState({current: current});
        }
	  }

    render() {
        var data = this.state.current;
        var items = '';
        if (Object.keys(data).length) {
            var stacks = data.content;
            items = stacks.map(function (stack) {
                var displayclassDefinitions = "Bgc(#0280ae.5) C(#fff) P(20px)";
                return (
                    <div key={'id-' + stack.Name}>
                        {stack.Name}
                    </div>
                );
                
            }, this);
        }

        return (
            <div>
                <FilteredList stacked={this.state.current.content} onFilteredList={this.filteredList}/>
                {items}
            </div>
        );
    }
}

Stacks = connectToStores(Stacks, ['StackStore'], function (stores, props) {
    return {
        currentTitle: stores.StackStore.getCurrentTitle() || '',
        currentStack: stores.StackStore.getCurrent() || {}
    };
});

Stacks = handleHistory(Stacks);

// and wrap that with context
Stacks = provideContext(Stacks);

export default Stacks;
