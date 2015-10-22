/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import util from 'util';

import hp from '../utils/helpers';
import BastionTable from './BastionTable';

function ec2F(e) {
    let ne = e, zone = e.Placement.AvailabilityZone;
    ne['account'] = e.KeyName ? e.KeyName.replace('-master', '') : 'gindev';
    ne['region'] = zone.match(/\d$/) ? zone : zone.substring(0, zone.length - 1);
    ne['Status'] = e.State.Name;
    ne['Hostname'] = e.Tags.filter(function(e) { return e.Key == 'Name'; })[0].Value;
    ne['key'] = e.InstanceId;
    ne['AZ'] = zone;
    return ne;
}

export default class BastionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            cols: props.cols,
            api: props.api ? props.api : 'bastion',
            content: {}
        }
    }

    showModal() {
        hp.getJSON(this.state.api, this.props, function(data) {
            let ncontent = data.content.map(ec2F);
            this.setState({
                content: ncontent,
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
                        <BastionTable tableRows={this.state.content} cols={this.state.cols} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
};
