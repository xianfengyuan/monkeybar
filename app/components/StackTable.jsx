import React from 'react';
import FixedDataTable from 'fixed-data-table';

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;

export default class StackTable extends React.Component {
    rowGetter(rowIndex) {
        return rows[rowIndex];
    }

    render() {
        let coldef = {Region: 500, Name: 1500, VpcId: 500, StackId: 1500};
        let width = 0;
        let rows = this.props.stacks.map(function(e) {
            let row = [];
            Object.keys(coldef).forEach(function(k) {
                row.push(e[k]);
                width = width + coldef[k];
            });
            return row;
        });
        let i = 0;
        let cols = [];
        Object.keys(coldef).forEach(function(k) {
            cols.push(
                <Column label={k} width={coldef[k]} dataKey={i} />
            );
            i = i + 1;
        });
        return (
            <Table rowHeight={50} rowGetter={this.rowGetter} rowsCount={rows.length}
                   width={width} height={5000} headerHeight={50}>
                {cols}
            </Table>
        )
    }
}

