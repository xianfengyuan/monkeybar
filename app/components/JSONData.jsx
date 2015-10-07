import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import SimpleTable from './SimpleTable';

export default class JSONData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            content: {}
        }
    }

    showModal() {
        $.get('/j/addr/' + this.props.data + '?a=' + this.props.account, function(result) {
            this.setState({
                content: result,
                show: true
            });
        }.bind(this));
    }

    hideModal() {
        this.setState({show: false});
    }

    render() {
        let cols = {Hostname: 200, Ec2InstanceId: 120, InstanceType: 120, AvailabilityZone: 140, PrivateIp: 100, Status: 80, };
        return (
            <ButtonToolbar>
                <Button bsStyle="link" onClick={this.showModal.bind(this)}><a href="#">{this.props.title}</a></Button>
                <Modal {...this.props} show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title id='contained-modal-title-lg'>Data Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SimpleTable tableRows={this.state.content} cols={cols} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
};
