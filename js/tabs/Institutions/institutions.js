import React, { Component } from "react";
import InstitutionList from "./institution_list";
import InstitutionDetail from "./institution_detail";
import {
    InstitutionFormModal,
} from "./modals";
import graphql from "../../graphql";


function fetchInstitutions(onResult) {
    graphql.query(`
        {
            countries {
                name
                institutions {
                    id
                    name
                }
            }
        }
    `).then(onResult);
}

class Institutions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            institutionList : null,
            activeInstitution : null,
            addInstitutionIsShowing : false,
            memorandumToBeAdded : false,
        };

        this.refreshInstitutions = this.refreshInstitutions.bind(this);
        this.setActiveInstitution = this.setActiveInstitution.bind(this);

        this.toggleAddInstitution = this.toggleAddInstitution.bind(this);
        this.toggleMemorandumToBeAdded = this.toggleMemorandumToBeAdded.bind(this);

        this.onDeleteActiveInstitution = this.onDeleteActiveInstitution.bind(this);
        this.onAddInstitution = this.onAddInstitution.bind(this);

        this.refreshInstitutions();
    }

    refreshInstitutions() {
        fetchInstitutions(result => {
            this.setState({
                institutionList : result.countries,
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

    setActiveInstitution(institution) {
        this.setState({
            activeInstitution : institution,
        });
    }

    onAddInstitution(institution) {
        this.setState({
            activeInstitution : institution,
        });
        this.toggleMemorandumToBeAdded();
    }

    toggleMemorandumToBeAdded() {
        this.setState({
            memorandumToBeAdded : !this.state.memorandumToBeAdded,
        });
    }

    render() {
        return (
            <div className="container-fluid d-flex flex-row p-0 h-100">
                <InstitutionList institutions={ this.state.institutionList }
                                 activeInstitution={ this.state.activeInstitution }
                                 setActiveInstitution={ this.setActiveInstitution }
                                 toggleAddInstitution={ this.toggleAddInstitution }/>

                <InstitutionDetail institution={ this.state.activeInstitution }
                                   onDeleteActiveInstitution={ this.onDeleteActiveInstitution }
                                   refreshInstitutions={ this.refreshInstitutions }
                                   memorandumToBeAdded={ this.state.memorandumToBeAdded }
                                   toggleMemorandumToBeAdded={ this.toggleMemorandumToBeAdded }/>

                <InstitutionFormModal isOpen={ this.state.addInstitutionIsShowing }
                                      toggle={ this.toggleAddInstitution }
                                      onAddInstitution={ this.onAddInstitution }
                                      refresh={ this.refreshInstitutions }/>
            </div>
        );
    }
}

export default Institutions;