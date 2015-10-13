/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import React from 'react';

import hp from '../utils/helpers';
import JSONData from './JSONData';
import SimpleTable from './SimpleTable';

function ec2F(e) {
    let ne = e, zone = e.AvailabilityZone;
    ne['account'] = e.SshKeyName ? e.SshKeyName.replace('-master', '') : 'gindev';
    ne['region'] = zone.match(/\d$/) ? zone : zone.substring(0, zone.length - 1);
    return ne;
}

export default class IpTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tableRows: props.tableRows,
            cols: props.cols
        }
    }

    _renderLink(cellData, cellDataKey, columnData) {
        let id = columnData[1];
        let s = hp.mapData(this.state.tableRows, 'Ec2InstanceId', id, ec2F);
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
