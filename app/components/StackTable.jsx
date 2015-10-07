import React from 'react';

import JSONModal from './JSONModal';
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

    _renderLink(cellData, cellDataKey, columnData, rowData) {
        let stackId = columnData[3];
        let s = getStack(this.state.tableRows, stackId);
        if (cellDataKey == 1) {
            return (
                <JSONModal data={s} title={s.Name} />
            )
        } else if (cellDataKey == 3) {
            let cols = {Hostname: 360, Ec2InstanceId: 150, InstanceType: 150, AvailabilityZone: 150, PublicIp: 125, PrivateIp: 125, Status: 100, };
            return (
                <JSONData cols={cols} data={cellData} account={s.account} title={cellData} />
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
}

