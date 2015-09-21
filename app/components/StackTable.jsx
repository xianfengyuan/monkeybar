import React from 'react';
import FixedDataTable from 'fixed-data-table';

import FilteredList from './FilteredList';

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;

let SortTypes = {
    ASC: 'ASC',
    DES: 'DESC'
};

let ColumnDef = {Region: 125, Name: 375, VpcId: 125, StackId: 375};
let Width = 0;
Object.keys(ColumnDef).forEach(function(k) {
    Width = Width + ColumnDef[k];
});
let i = 0;
let Columns = [];
Object.keys(ColumnDef).forEach(function(k) {
    Columns.push(
        <Column label={k} width={ColumnDef[k]} dataKey={i} />
    );
    i = i + 1;
});

export default class StackTable extends React.Component {
    constructor(props) {
        super(props);
        let rows = props.stacks.map(function(e) {
            let row = [];
            Object.keys(ColumnDef).forEach(function(k) {
                row.push(e[k]);
            });
            return row;
        });
        this.state = {
            rows: rows,
            filteredRows: null,
            filterBy: null,
            sortDir: null,
            sortBy: 'Name'
        };
    }

    componentWillMount() {
        this._filterRowsBy(this.state.filterBy);
    }

    _filterRowsBy(filterBy) {
        let rows = this.state.rows.slice();        
        let filteredRows = filterBy ? rows.filter(function(row){
            return row.join(' ').toLowerCase().indexOf(filterBy.toLowerCase()) >= 0
        }) : rows;

        this.setState({
            filteredRows,
            filterBy,
        })
    }

    _rowGetter(rowIndex) {
        return this.state.filteredRows[rowIndex];
    }

    _onFilterChange(e) {
        this._filterRowsBy(e.target.value);
    }

    render() {
        return (
            <div>
                <FilteredList stacked={this.state.filteredRows} onFilteredList={this._onFilterChange.bind(this)}/>
                <br />
                <Table rowHeight={40} rowGetter={this._rowGetter.bind(this)} rowsCount={this.state.filteredRows.length}
                       width={Width} height={600} headerHeight={40}>
                    {Columns}
                </Table>
            </div>
        )
    }
}

