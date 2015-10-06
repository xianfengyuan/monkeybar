import React from 'react';
import FixedDataTable from 'fixed-data-table';

import FilteredList from './FilteredList';
import JSONData from './JSONData';

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;

let SortTypes = {
    ASC: 'ASC',
    DES: 'DES'
};

//let ColumnDef = {Region: 125, Name: 375, VpcId: 125, StackId: 375};
let ColumnDef = {StackId: 375};
let Width = 0;
let Keys = Object.keys(ColumnDef);
Keys.forEach(function(k) {
    Width = Width + ColumnDef[k];
});

function getIndex(list, key) {
    let i = 0;
    for (; i < list.length; i++) {
        if (list[i].indexOf(key) >= 0) {
            break;
        }
    }
    return i == list.length ? -1 : i;
}

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
        let rows = props.stacks.map(function(e) {
            let row = [];
            Keys.forEach(function(k) {
                row.push(e[k]);
            });
            return row;
        });
        this.state = {
            stacks: props.stacks,
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

    _sortRowsBy(cellDataKey) {
        let sortDir = this.state.sortDir;
        let sortBy = cellDataKey;
        if (sortBy === this.state.sortBy) {
            sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DES : SortTypes.ASC;
        } else {
            sortDir = SortTypes.DES;
        }
        let sortInd = getIndex(Keys, sortBy);
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

    _renderLink(cellData) {
        let s = getStack(this.state.stacks, cellData);
        return <JSONData data={cellData} account={s.account} title={cellData}/>
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
        for (; i < Keys.length; i++) {
            let k = Keys[i];
            let label = k + (sortBy === k ? sortDirArrow : '');
            Columns.push(
                <Column headerRenderer={this._renderHeader.bind(this, label, k)} label={label} width={ColumnDef[k]} dataKey={i} cellRenderer={this._renderLink.bind(this)} />
            );
        }
        
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

