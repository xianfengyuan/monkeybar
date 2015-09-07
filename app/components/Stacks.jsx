/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

import config from '../configs/config';
// stores
import StackStore from '../stores/StackStore';

import FilteredList from './FilteredList';

// mixins
import {FluxibleMixin} from 'fluxible/addons';

var Stacks = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [StackStore]
    },

    getInitialState: function () {
        this.store = this.getStore(StackStore);
        return this.store.getState();
    },

    onChange: function () {
        var state = this.store.getState();
        this.setState(state);
    },

    filteredList(event) {
        var search = event.target.value.toLowerCase();
        var current = this.state.current;
        var key = current.key;
        var updated = current.content;
        if (search) {
            updated = updated.filter(function(item){
                return JSON.stringify(item).toLowerCase().search(event.target.value.toLowerCase()) !== -1;
		        });
            current = {key: key, content: updated};
            this.setState({current: current});
        } else {
            this.setState({current: current});
        }
	  },

    render: function () {
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
                <FilteredList stacked={this.state.current.content} onFilteredList={this.filteredList.bind(this)}/>
                {items}
            </div>
        );
    }
});

export default Stacks;
