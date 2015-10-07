import React from 'react';

import JSONData from './JSONData';
import SimpleTable from './SimpleTable';

function getStack(list, stackId) {
    let stacks = list.filter(function(e) {
        return e.StackId == stackId;
    }).map(function(e) {
        let ne = e;
        ne['account'] = e.DefaultSshKeyName.replace('-master', '');
        return ne;
    });
    return stacks[0];
}

export default class StackTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tableRows: props.tableRows,
            cols: props.cols
        };
    }

    _renderLink(cellData) {
        let s = getStack(this.state.tableRows, cellData);
        return (
            <JSONData data={cellData} account={s.account} title={cellData} />
        )
    }

    render() {
        return (
            <SimpleTable tableRows={this.state.tableRows} cols={this.state.cols} cellRenderer={this._renderLink} />
        )
    }
}

