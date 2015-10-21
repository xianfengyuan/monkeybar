import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import util from 'util';

import hp from '../utils/helpers';
import DeployTable from './DeployTable';

let INTERVAL = 10000;

export default class Deployments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            cols: props.cols,
            ts: new Date().toString(),
            content: {}
        }
    }

    componentWillMount() {
        this.intervals = [];
    }
    
    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }
    
    tick() {
        if (this.state.show) {
            hp.getJSON('deploy', this.props, function(data) {
                this.setState({
                    content: data.content,
                    cols: data.cols,
                    ts: new Date().toString()
                });
            }.bind(this));
        }
    }

    componentDidMount() {
        this.intervals.push(setInterval(this.tick.bind(this), INTERVAL));
    }
    
    showModal() {
        hp.getJSON('deploy', this.props, function(data) {
            this.setState({
                content: data.content,
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
        return (
            <ButtonToolbar>
                <Button bsStyle="link" onClick={this.showModal.bind(this)}><a href="#">{this.props.title}</a></Button>
                <Modal {...this.props} show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title id='contained-modal-title-lg'>Data Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DeployTable tableRows={this.state.content} cols={this.state.cols} />
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
