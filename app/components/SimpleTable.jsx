import React from 'react';
import FixedDataTable from 'fixed-data-table';

import FilteredList from './FilteredList';

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;

let SortTypes = {
    ASC: 'ASC',
    DES: 'DES'
};

//let ColumnDef = {StackId: 375};

function getIndex(list, key) {
    let i = 0;
    for (; i < list.length; i++) {
        if (list[i].indexOf(key) >= 0) {
            break;
        }
    }
    return i == list.length ? -1 : i;
}

export default class SimpleTable extends React.Component {
    constructor(props) {
        super(props);
        
        let ColumnDef = props.cols
        let Width = 0;
        let Keys = Object.keys(ColumnDef);
        Keys.forEach(function(k) {
            Width = Width + ColumnDef[k];
        });
        let rows = props.tableRows.map(function(e) {
            let row = [];
            Keys.forEach(function(k) {
                row.push(e[k]);
            });
            return row;
        });
        let cellRenderer = props.cellRenderer ? props.cellRenderer : null;
        
        this.state = {
            cellRenderer: cellRenderer,
            tableRows: props.tableRows,
            rows: rows,
            width: Width,
            keys: Keys,
            cols: ColumnDef,
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

    _sortRowsBy(cellDataKey) {
        let sortDir = this.state.sortDir;
        let sortBy = cellDataKey;
        if (sortBy === this.state.sortBy) {
            sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DES : SortTypes.ASC;
        } else {
            sortDir = SortTypes.DES;
        }
        let sortInd = getIndex(this.state.keys, sortBy);
        let filteredRows = this.state.filteredRows.slice();
        filteredRows.sort((a, b) => {
            let sortVal = 0;
            if (a[sortInd] > b[sortInd]) {
                sortVal = 1;
            }
            if (a[sortInd] < b[sortInd]) {
                sortVal = -1;
            }
      
            if (sortDir === SortTypes.DES) {
                sortVal = sortVal * -1;
            }
      
            return sortVal;
        });
    
        this.setState({
            filteredRows,
            sortBy,
            sortDir,
        });
    }
    
    _renderHeader(label, cellDataKey) {
        return (
            <a onClick={this._sortRowsBy.bind(this, cellDataKey)}>{label}</a>
        );
    }

    _onFilterChange(e) {
        this._filterRowsBy(e.target.value);
    }

    render() {
        let sortDirArrow = '';
        let sortBy = this.state.sortBy;
        if (this.state.sortDir !== null) {
            sortDirArrow = this.state.sortDir === SortTypes.DES ? ' ↓' : ' ↑';
        }
        let Columns = [], i = 0;
        for (; i < this.state.keys.length; i++) {
            let k = this.state.keys[i];
            let label = k + (sortBy === k ? sortDirArrow : '');
            if (this.state.cellRenderer) {
                Columns.push(
                    <Column headerRenderer={this._renderHeader.bind(this, label, k)} label={label} width={this.state.cols[k]} dataKey={i} cellRenderer={this.state.cellRenderer.bind(this)} />
                );
            } else {
                Columns.push(
                    <Column headerRenderer={this._renderHeader.bind(this, label, k)} label={label} width={this.state.cols[k]} dataKey={i} />
                );
            }
        }
        
        return (
            <div>
                <FilteredList stacked={this.state.filteredRows} onFilteredList={this._onFilterChange.bind(this)}/>
                <br />
                <Table rowHeight={40} rowGetter={this._rowGetter.bind(this)} rowsCount={this.state.filteredRows.length}
                       width={this.state.width} height={600} headerHeight={40}>
                    {Columns}
                </Table>
            </div>
        )
    }
}

