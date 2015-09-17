import React from 'react';
import FixedDataTable from 'fixed-data-table';

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;

export default class StackTable extends React.Component {
    render() {
        let coldef = {Region: 125, Name: 375, VpcId: 125, StackId: 375};
        let width = 0;
        Object.keys(coldef).forEach(function(k) {
            width = width + coldef[k];
        });
        let rows = this.props.stacks.map(function(e) {
            let row = [];
            Object.keys(coldef).forEach(function(k) {
                row.push(e[k]);
            });
            return row;
        });

        function rowGetter(rowIndex) {
            return rows[rowIndex];
        }

        let i = 0;
        let cols = [];
        Object.keys(coldef).forEach(function(k) {
            cols.push(
                <Column label={k} width={coldef[k]} dataKey={i} />
            );
            i = i + 1;
        });
        return (
            <Table rowHeight={40} rowGetter={rowGetter} rowsCount={rows.length}
                   width={width} height={600} headerHeight={40}>
                {cols}
            </Table>
        )
    }
}

