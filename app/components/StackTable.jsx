import React from 'react';

import hp from '../utils/helpers';
import JSONModal from './JSONModal';
import SimpleTable from './SimpleTable';
import IpList from './IpList';
import Deployments from './Deployments';

function stackF(e) {
    let ne = e;
    ne['account'] = e.DefaultSshKeyName ? e.DefaultSshKeyName.replace('-master', '') : null;
    return ne;
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
        let id = columnData[3];
        let s = hp.mapData(this.state.tableRows, 'StackId', id, stackF);
        if (cellDataKey == 1) {
            let cols = {Hostname: 360, Ec2InstanceId: 150, InstanceType: 150, AvailabilityZone: 150, PublicIp: 125, PrivateIp: 125, Status: 100, };
            return (
                <IpList cols={cols} data={id} account={s.account} title={s.Name} />
            )
        } else if (cellDataKey == 3) {
            return (
                <JSONModal data={s} title={id} />
            )
        } else if (cellDataKey == 4) {
            let cols = {DeploymentId: 320, Status: 100, IamUserArn: 100, CreatedAt: 200, Command: 225, Duration: 80};
            return (
                <Deployments cols={cols} data={id} account={s.account} title={s.Name} />
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

