/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import React from 'react';

import hp from '../utils/helpers';
import JSONData from './JSONData';
import SimpleTable from './SimpleTable';

export default class BastionTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tableRows: props.tableRows,
            cols: props.cols
        }
    }

    _renderLink(cellData, cellDataKey, columnData) {
        let id = columnData[1];
        let s = hp.mapData(this.state.tableRows, 'InstanceId', id, null);
        if (cellDataKey == 1) {
            let cols = {Instances: 320};
            return (
                <JSONData cols={cols} data={id} account={s.account} region={s.region} title={id} />
            )
        } else {
            return (
                {cellData}
            )
        }
    }

    render() {
        return (
            <SimpleTable tableRows={this.state.tableRows} cols={this.state.cols} cellRenderer={this._renderLink} />
        )
    }
};
