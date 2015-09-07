/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

// components
import Stacks from './Stacks';

// stores
import StackStore from '../stores/StackStore';

// mixins
import {FluxibleMixin} from 'fluxible/addons';

var Ops = React.createClass({
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

    render: function () {
        return (
            <div>
                <h2>OpsWorks Stacks</h2>
                <Stacks />
            </div>
        );
    }
});

export default Ops;
