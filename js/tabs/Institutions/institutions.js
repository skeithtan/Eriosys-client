import React, { Component } from "react";
import InstitutionList from "./institution_list";
import InstitutionDetail from "./institution_detail";
import {
    AddInstitutionModal,
    DeleteInstitutionModal,
} from "./modals";
import graphql from "../../graphql";


function fetchInstitutions(onResponse) {
    graphql({
        query : `
        {
            countries {
                name
                institutionSet {
                    id
                    name
                }
            }
        }
        `,
        onResponse : onResponse,
    });
}

class Institutions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            institutionList : null,
            activeInstitution : null,
            addInstitutionIsShowing : false,
            deleteInstitutionIsShowing : false,
        };

        this.refreshInstitutions = this.refreshInstitutions.bind(this);
        this.setActiveInstitution = this.setActiveInstitution.bind(this);
        this.toggleAddInstitution = this.toggleAddInstitution.bind(this);
        this.toggleDeleteInstitution = this.toggleDeleteInstitution.bind(this);
        this.onDeleteActiveInstitution = this.onDeleteActiveInstitution.bind(this);

        this.refreshInstitutions();
    }

    refreshInstitutions() {
        fetchInstitutions(response => {
            this.setState({
                institutionList : response.data.countries,
            });
        });
    }

    onDeleteActiveInstitution() {
        this.setState({
            activeInstitution : null,
        });

        this.refreshInstitutions();
    }

    toggleAddInstitution() {
        this.setState({
            addInstitutionIsShowing : !this.state.addInstitutionIsShowing,
        });
    }

    toggleDeleteInstitution() {
        this.setState({
            deleteInstitutionIsShowing : !this.state.deleteInstitutionIsShowing,
        });
    }

    setActiveInstitution(institution) {
        this.setState({
            activeInstitution : institution,
        });
    }

    render() {
        return (
            <div className="container-fluid d-flex flex-row p-0 h-100">
                <InstitutionList institutions={this.state.institutionList}
                                 activeInstitution={this.state.activeInstitution}
                                 setActiveInstitution={this.setActiveInstitution}
                                 toggleAddInstitution={this.toggleAddInstitution}/>
                <InstitutionDetail institution={this.state.activeInstitution}
                                   toggleDeleteInstitution={this.toggleDeleteInstitution}/>
                <AddInstitutionModal isOpen={this.state.addInstitutionIsShowing} toggle={this.toggleAddInstitution}
                                     refresh={this.refreshInstitutions}/>
                {this.state.activeInstitution !== null && //If activeInstitution is not null
                <DeleteInstitutionModal isOpen={this.state.deleteInstitutionIsShowing}
                                        institution={this.state.activeInstitution}
                                        toggle={this.toggleDeleteInstitution}
                                        refresh={this.onDeleteActiveInstitution}/>}
            </div>
        );
    }
}

export default Institutions;