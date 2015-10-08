import React from 'react';

import hp from '../utils/helpers';
import JSONModal from './JSONModal';
import SimpleTable from './SimpleTable';

function deployF(e) {
    let ne = e;
    ne['user'] = null;
    if (e.IamUserArn) {
        ne.user = e.IamUserArn.replace(/arn[^\/]+\//, '');
    }
    let ts = new Date(e.CreatedAt);
    let date = hp.datestamp(ts.getTime() / 1000);
    ne['localtime'] = hp.formatZero(ts.getHours()) + ':' +
                      hp.formatZero(ts.getMinutes()) + ':' +
                      hp.formatZero(ts.getSeconds()) + ' ' + date;
    return ne;
}

export default class DeployTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tableRows: props.tableRows,
            cols: props.cols
        };
    }

    _renderLink(cellData, cellDataKey, columnData) {
        let id = columnData[0];
        let s = hp.mapData(this.state.tableRows, 'DeploymentId', id, deployF);
        let user = s ? s.user : null;
        let time = s ? s.localtime : null;
        if (cellDataKey == 0) {
            return (
                <JSONModal data={s} title={id} />
            )
        } else if (cellDataKey == 2) {
            return (
                {user}
            )
        } else if (cellDataKey == 3) {
            return (
                {time}
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


