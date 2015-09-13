import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

export default class JSONModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    showModal() {
        this.setState({show: true});
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
                        <Modal.Title id='contained-modal-title-lg'>JSON Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre>{JSON.stringify(this.props.data, null, 2)}</pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
}

