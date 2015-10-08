import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import util from 'util';

import hp from '../utils/helpers';
import SimpleTable from './SimpleTable';

export default class JSONData extends React.Component {
    constructor(props) {
        super(props);
        let cellRenderer = props.cellRenderer ? props.cellRenderer : null;
        
        this.state = {
            show: false,
            cellRenderer: cellRenderer,
            cols: props.cols,
            api: props.api ? props.api : 'addr',
            content: {}
        }
    }

    showModal() {
        hp.getJSON(this.state.api, this.state.cols, this.props.data, this.props.account, function(data) {
            this.setState({
                content: data.content,
                cols: data.cols,
                show: true
            });
        }.bind(this));
    }

    hideModal() {
        this.setState({show: false});
    }

    render() {
        let table = (
            <SimpleTable tableRows={this.state.content} cols={this.state.cols} />
        );
        if (this.state.cellRenderer) {
            table = (<SimpleTable tableRows={this.state.content} cols={this.state.cols} cellRenderer={this.state.cellRenderer.bind(this)}/>);
        }
        
        return (
            <ButtonToolbar>
                <Button bsStyle="link" onClick={this.showModal.bind(this)}><a href="#">{this.props.title}</a></Button>
                <Modal {...this.props} show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title id='contained-modal-title-lg'>Data Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {table}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
};
