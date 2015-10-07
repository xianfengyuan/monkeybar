import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import util from 'util';

import SimpleTable from './SimpleTable';

export default class JSONData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            cols: props.cols,
            api: props.api ? props.api : 'addr',
            content: {}
        }
    }

    showModal() {
        $.get('/j/' + this.state.api + '/' + this.props.data + '?a=' + this.props.account, function(result) {
            let key = Object.keys(this.state.cols)[0];
            if (util.isArray(result) && Object.keys(result[0]).indexOf(key)) {
                this.setState({
                    content: result,
                    show: true
                });
            } else {
                this.setState({
                    content: [{
                        message: 'error loading addresses',
                        account: this.props.account,
                        data: this.props.data
                    }],
                    cols: {message: 200, data: 400, account: 200},
                    show: true
                });
            }
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
                        <SimpleTable tableRows={this.state.content} cols={this.state.cols} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
};
