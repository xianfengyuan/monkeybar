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
        this.state = {
            show: false,
            cols: props.cols,
            api: props.api ? props.api : 'ec2',
            content: {}
        }
    }

    showModal() {
        hp.getJSON(this.state.api, this.props, function(data) {
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
        return (
            <ButtonToolbar>
                <Button bsStyle="link" onClick={this.showModal.bind(this)}><a href="#">{this.props.title}</a></Button>
                <Modal {...this.props} show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title id='contained-modal-title-lg'>Data Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre>{JSON.stringify(this.state.content, null, 2)}</pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
};
