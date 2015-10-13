/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FixedDataTable from 'fixed-data-table';
import util from 'util';

import hp from '../utils/helpers';
import JSONModal from './JSONModal';
import FilteredList from './FilteredList';

let INTERVAL = 10000;

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;
let SortTypes = {
    ASC: 'ASC',
    DES: 'DES'
};

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
    ne['key'] = e.DeploymentId;
    return ne;
}

function getIndex(list, key) {
    let i = 0;
    for (; i < list.length; i++) {
        if (list[i].indexOf(key) >= 0) {
            break;
        }
    }
    return i == list.length ? -1 : i;
}

export default class Deployments extends React.Component {
    constructor(props) {
        super(props);

        let ColumnDef = props.cols
        let Width = 0;
        let Keys = Object.keys(ColumnDef);
        Keys.forEach(function(k) {
            Width = Width + ColumnDef[k];
        });

        this.state = {
            show: false,
            ts: new Date().toString(),
            tableRows: [],
            rows: [],
            width: Width,
            keys: Keys,
            cols: ColumnDef,
            filteredRows: null,
            filterBy: null,
            sortDir: null,
            sortBy: 'Name'
        }
    }

    componentWillMount() {
        this.intervals = [];
        this._filterRowsBy(this.state.filterBy);
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    tick() {
        if (this.state.show) {
            hp.getJSON('deploy', this.props, function(data) {
                let rows = data.content.map(function(e) {
                    let row = [];
                    this.state.keys.forEach(function(k) {
                        row.push(e[k]);
                    });
                    return row;
                }.bind(this));
                
                let ncontent = data.content.map(function(e) {
                    let ne = e;
                    ne['key'] = e.DeploymentId;
                    return ne;
                });
                this.state.rows = rows;
                this._filterRowsBy(null);
                this.setState({
                    tableRows: ncontent,
                    cols: data.cols,
                    ts: new Date().toString()
                });
            }.bind(this));
        }
    }
    
    componentDidMount() {
        this.intervals.push(setInterval(this.tick.bind(this), INTERVAL));
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

    showModal() {
        hp.getJSON('deploy', this.props, function(data) {
            let rows = data.content.map(function(e) {
                let row = [];
                this.state.keys.forEach(function(k) {
                    row.push(e[k]);
                });
                return row;
            }.bind(this));

            let ncontent = data.content.map(function(e) {
                let ne = e;
                ne['key'] = e.DeploymentId;
                return ne;
            });
            this.state.rows = rows;
            this._filterRowsBy(null);
            this.setState({
                tableRows: ncontent,
                cols: data.cols,
                ts: new Date().toString(),
                show: true
            });
        }.bind(this));
    }

    hideModal() {
        this.setState({show: false});
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
            Columns.push(
                <Column headerRenderer={this._renderHeader.bind(this, label, k)} label={label} width={this.state.cols[k]} dataKey={i} cellRenderer={this._renderLink.bind(this)} />
                );
        }

        return (
            <ButtonToolbar>
                <Button bsStyle="link" onClick={this.showModal.bind(this)}><a href="#">{this.props.title}</a></Button>
                <Modal {...this.props} show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title id='contained-modal-title-lg'>Data Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <FilteredList stacked={this.state.filteredRows} onFilteredList={this._onFilterChange.bind(this)}/>
                            <br />
                            <Table rowHeight={40} rowGetter={this._rowGetter.bind(this)} rowsCount={this.state.filteredRows.length}
                                   width={this.state.width} height={600} headerHeight={40}>
                                {Columns}
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                    <Button bsStyle="link">Data requested at: {this.state.ts}</Button>
                </Modal>
            </ButtonToolbar>
        )
    }
};
