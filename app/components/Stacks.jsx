/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// external packages
import React from 'react';

import config from '../configs/config';
// stores
import StackStore from '../stores/StackStore';

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

    render: function () {
        var stacks = this.state.current || {};
        var items = stacks.map(function (stack) {
            var displayclassDefinitions = "Ov(h) D(n)";
            return (
                <div key={'id-' + stack.Name} className={displayclassDefinitions}>
                    <dl className="M(0) Mstart(20px) P(10px) Pt(0) Ff(m)">{stack.Name}</dl>
                </div>
            );

        }, this);

        return (
            <div>
                {items}
            </div>
        );
    }
});

export default Stacks;
