import React from 'react';

import hp from '../utils/helpers';
import JSONModal from './JSONModal';
import SimpleTable from './SimpleTable';

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
        let s = hp.mapData(this.state.tableRows, 'Ec2InstanceId', id, function(e) {return e;});
        if (cellDataKey == 1) {
            return (
                <JSONModal data={s} title={id} />
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
