import React, { Component } from "react";
import addValidation from "../../form_validation";
import settings from "../../settings";
import $ from "jquery";

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";


class AddInstitutionModal extends Component {
    constructor(props) {
        super(props);
    }

    static addValidation() {
        addValidation({
            inputs : $("#add-institution-modal").find(".text-input"),
            button : $("#add-institution-modal-submit"),
            customValidations : [
                {
                    input : $("#add-institution-email"),
                    validator : email => {
                        //This regex mess checks if email is a real email
                        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                    },
                },
            ],
        });
    }

    render() {
        const countries = settings.countries.map((name, index) =>
            <option key={index}>{name}</option>,
        );

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop={true} id="add-institution-modal"
                   onOpened={() => AddInstitutionModal.addValidation()}>
                <ModalHeader toggle={this.props.toggle}>Add an Institution</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="add-institution-name">Name</Label>
                            <Input id="add-institution-name" placeholder="Institution Name" className="text-input"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="add-institution-country">Country</Label>
                            <Input type="select" id="add-institution-country-list">
                                {countries}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="add-institution-email">Email</Label>
                            <Input type="email" id="add-institution-email" placeholder="Email" className="text-input"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="add-institution-address">Address</Label>
                            <Input id="add-institution-address" placeholder="Address" className="text-input"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="add-institution-website">Website</Label>
                            <Input id="add-institution-website" placeholder="Website" className="text-input"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="add-institution-contact-person">Contact Person</Label>
                            <Input id="add-institution-contact-person" placeholder="Name" className="text-input"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="add-institution-contact-number">Contact Number</Label>
                            <Input id="add-institution-contact-number" placeholder="Number" className="text-input"/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" id="add-institution-modal-submit">Add</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export { AddInstitutionModal };