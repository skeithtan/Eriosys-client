import React, { Component } from "react";
import LoadingSpinner from "../../../components/loading";
import graphql from "../../../graphql";
import { Button } from "reactstrap";
import $ from "jquery";
import { InstitutionFormModal, } from "../modals";
import iziToast from "izitoast";

import {
    Section,
    SectionTitle,
    SectionTable,
    SectionRow,
    SectionRowTitle,
    SectionRowContent,
} from "../../../components/section";
import ErrorState from "../../../components/error_state";
import { makeInfoToast } from "../../../dismissable_toast_maker";
import authorizeXHR from "../../../authorization";
import settings from "../../../settings";


function makeInstitutionOverviewQuery(id) {
    return graphql.query(`
    {
        institution(id:${id}) {
            address
            website
            contact_person_email
            contact_person_name
            contact_person_number
            country
            agreement
        }
    }    
    `);
}

function institutionIsFetched(institution) {
    return institution.website !== undefined;
}

class InstitutionOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            institution : props.institution,
            error : null,
        };

        this.props.setSidebarContent(null);
        this.fetchInstitution = this.fetchInstitution.bind(this);

        this.fetchInstitution();
    }

    fetchInstitution(id) {
        if (id === undefined) {
            id = this.state.institution.id;
        }

        if (this.state.error) {
            this.setState({
                error : null,
            });
        }

        //Fetch active institution details
        makeInstitutionOverviewQuery(id)
            .then(result => {
                //ID from when query was made must be the same ID now
                if (id !== this.state.institution.id) {
                    return;
                }

                const institution = result.institution;

                // Carbon copy
                Object.assign(this.state.institution, institution);

                this.setState({
                    institution : this.state.institution,
                });
            })
            .catch(error => this.setState({
                    error : error,
                }),
            );
    }

    componentWillReceiveProps(props) {
        if (this.state.institution !== null &&
            this.state.institution.id === props.institution.id) {
            // Institution is already showing, why reload?
            return;
        }

        this.setState({
            institution : props.institution,
        });

        if (!institutionIsFetched(props.institution)) {
            this.fetchInstitution(props.institution.id);
        }
    }

    render() {
        if (this.state.error) {
            return (
                <ErrorState onRetryButtonClick={ () => this.fetchInstitution(this.state.institution.id) }>
                    { this.state.error.toString() }
                </ErrorState>
            );
        }

        //User has already selected, but we haven't fetched it from the database yet
        if (!institutionIsFetched(this.state.institution)) {
            return <LoadingSpinner/>;
        }

        return (
            <div className="d-flex flex-column p-0 h-100">
                <OverviewHead institution={ this.state.institution }
                              onArchiveInstitution={ this.props.onArchiveActiveInstitution }
                              onEditInstitution={ this.fetchInstitution }/>
                <OverviewBody institution={ this.state.institution }/>
            </div>
        );
    }
}

class OverviewHead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editInstitutionIsShowing : false,
        };

        this.confirmArchive = this.confirmArchive.bind(this);
        this.toggleEditInstitution = this.toggleEditInstitution.bind(this);
    }

    toggleEditInstitution() {
        this.setState({
            editInstitutionIsShowing : !this.state.editInstitutionIsShowing,
        });
    }

    confirmArchive() {
        if (!confirm(`Are you sure you want to archive ${this.props.institution.name}?`)) {
            return;
        }

        const dismissToast = makeInfoToast({
            title : "Archiving",
            message : "Archiving institution...",
        });

        $.ajax({
            url : `${settings.serverURL}/institutions/${this.props.institution.id}/`,
            method : "DELETE",
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.onArchiveInstitution();
                iziToast.success({
                    icon : "",
                    title : "Success",
                    message : "Institution archived",
                    progressBar : false,
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to archive institution",
                    progressBar : false,
                });
            },
        });

    }

    render() {
        return (
            <div className="page-head pt-5 d-flex flex-row align-items-end">
                <div className="mr-auto">
                    <h5 className="mb-0 text-secondary">Overview</h5>
                    <h4 className="page-head-title mb-0">{ this.props.institution.name }</h4>
                </div>

                <div className="page-head-actions">
                    { localStorage.userType !== "program_assistant" && <Button outline
                                                                               size="sm"
                                                                               color="success"
                                                                               className="mr-2"
                                                                               onClick={ this.toggleEditInstitution }>Edit
                        Institution</Button> }
                    { localStorage.userType === "VP" && <Button outline
                                                                size="sm"
                                                                color="warning"
                                                                onClick={ this.confirmArchive }>Archive</Button> }
                </div>

                <InstitutionFormModal edit
                                      isOpen={ this.state.editInstitutionIsShowing }
                                      institution={ this.props.institution }
                                      refresh={ this.props.onEditInstitution }
                                      toggle={ this.toggleEditInstitution }/>
            </div>
        );
    }
}

class OverviewBody extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-body">
                <InstitutionDetails institution={ this.props.institution }/>
                <ContactDetails institution={ this.props.institution }/>
            </div>
        );
    }
}

class InstitutionDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const institution = this.props.institution;
        const agreementType = this.props.institution.agreement === "B" ? "Bilateral" : "Multilateral";
        const website = `http://${institution.website}`;

        function openWebsite() {
            const {shell} = require("electron");
            shell.openExternal(website);
        }

        return (
            <Section>
                <SectionTitle>Institution details</SectionTitle>
                <SectionTable>
                    <SectionRow>
                        <SectionRowTitle>Address</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ institution.address }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Country</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ institution.country }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Website</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }
                                           className="text-primary"
                                           onClick={ openWebsite }>{ website }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Agreement Type</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ agreementType }</SectionRowContent>
                    </SectionRow>

                    { this.props.archived && localStorage.userType === "VP" &&
                    <SectionRow>
                        <SectionRowContent className="d-flex">
                            <Button outline
                                    color="primary"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={ this.props.confirmRestore }>Restore</Button>
                        </SectionRowContent>
                    </SectionRow>
                    }
                </SectionTable>
            </Section>
        );
    }
}

class ContactDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const institution = this.props.institution;

        return (
            <Section>
                <SectionTitle>Contact Details</SectionTitle>
                <SectionTable>
                    <SectionRow>
                        <SectionRowTitle>Contact Person</SectionRowTitle>
                        <SectionRowContent
                            large={ !this.props.sidebar }>{ institution.contact_person_name }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Contact Person Email</SectionRowTitle>
                        <SectionRowContent
                            large={ !this.props.sidebar }>{ institution.contact_person_email }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Contact Person Number</SectionRowTitle>
                        <SectionRowContent
                            large={ !this.props.sidebar }>{ institution.contact_person_number }</SectionRowContent>
                    </SectionRow>
                </SectionTable>
            </Section>
        );
    }
}


export {
    InstitutionOverview as default,
    InstitutionDetails,
    ContactDetails,
    makeInstitutionOverviewQuery,
};