import React, { Component } from "react";
import moment from "moment";
import settings from "../../../settings";
import { Button, } from "reactstrap";

import {
    ArchiveMemorandumModal,
    MemorandumFormModal,
} from "../modals";
import {
    Section,
    SectionRow,
    SectionRowContent,
    SectionRowTitle,
    SectionTable,
    SectionTitle,
} from "../../../components/section";
import { RestoreMemorandumModal } from "../../Archives/tabs/modals";


class MemorandumSidebarPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteMemorandumIsShowing : false,
            editMemorandumIsShowing : false,
            restoreMemorandumIsShowing : false,
            memorandum : props.memorandum,
        };

        this.onEditMemorandum = this.onEditMemorandum.bind(this);
        this.toggleEditMemorandum = this.toggleEditMemorandum.bind(this);
        this.toggleDeleteMemorandum = this.toggleDeleteMemorandum.bind(this);
        this.toggleRestoreMemorandum = this.toggleRestoreMemorandum.bind(this);
    }

    toggleRestoreMemorandum() {
        this.setState({
            restoreMemorandumIsShowing : !this.state.restoreMemorandumIsShowing,
        });
    }

    toggleDeleteMemorandum() {
        this.setState({
            deleteMemorandumIsShowing : !this.state.deleteMemorandumIsShowing,
        });
    }

    toggleEditMemorandum() {
        this.setState({
            editMemorandumIsShowing : !this.state.editMemorandumIsShowing,
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            memorandum : props.memorandum,
        });
    }

    onEditMemorandum(memorandum) {
        this.setState({
            memorandum : memorandum,
        });
    }

    render() {
        const memorandum = this.state.memorandum;
        return (
            <div className="p-0 h-100 d-flex flex-column">
                <div className="page-head pt-5 d-flex flex-row align-items-end">
                    <div className="mr-auto">
                        <h5 className="mb-0">Memorandum</h5>
                    </div>
                </div>

                <div className="page-body">
                    <MemorandumDetails archived={this.props.archived}
                                       memorandum={memorandum}
                                       toggleRestoreMemorandum={this.toggleRestoreMemorandum}
                                       toggleDeleteMemorandum={this.toggleDeleteMemorandum}
                                       toggleEditMemorandum={this.toggleEditMemorandum}/>
                    <MemorandumLinkages linkages={memorandum.linkages}/>

                    {this.state.activeMemorandum !== null &&
                    <ArchiveMemorandumModal isOpen={this.state.deleteMemorandumIsShowing}
                                            memorandum={memorandum}
                                            toggle={this.toggleDeleteMemorandum}
                                            onDeleteSuccess={this.props.removeActiveMemorandum}
                                            refresh={this.props.refreshMemorandums}/>}

                    {this.state.activeMemorandum !== null &&
                    <MemorandumFormModal edit
                                         isOpen={this.state.editMemorandumIsShowing}
                                         memorandum={memorandum}
                                         toggle={this.toggleEditMemorandum}
                                         onEditSuccess={this.onEditMemorandum}
                                         refresh={this.props.refreshMemorandums}/>}

                    {this.state.activeMemorandum !== null &&
                    <RestoreMemorandumModal memorandum={memorandum}
                                            onRestoreSuccess={this.props.onRestoreSuccess}
                                            isOpen={this.state.restoreMemorandumIsShowing}
                                            toggle={this.toggleRestoreMemorandum}/>
                    }
                </div>
            </div>
        );
    }
}

class MemorandumDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        function formatDate(date) {
            return moment(date).format("LL");
        }

        const dateEffective = formatDate(this.props.memorandum.date_effective);
        const type = this.props.memorandum.category === "MOA" ? "Agreement" : "Understanding";
        const expiryDate = this.props.memorandum.date_expiration === null ? "None" : formatDate(this.props.memorandum.date_expiration);
        const college = this.props.memorandum.college_initiator === null ? "None" : this.props.memorandum.college_initiator;
        const viewMemorandum = () => {
            const shell = require("electron").shell;
            shell.openExternal(this.props.memorandum.memorandum_file);
        };

        return (
            <Section>
                <SectionTitle>Details</SectionTitle>
                <SectionTable>
                    <SectionRow>
                        <SectionRowTitle>Memorandum Type</SectionRowTitle>
                        <SectionRowContent>{type}</SectionRowContent>
                    </SectionRow>
                    <SectionRow>
                        <SectionRowTitle>Date Effective</SectionRowTitle>
                        <SectionRowContent>{dateEffective}</SectionRowContent>
                    </SectionRow>
                    <SectionRow>
                        <SectionRowTitle>Expiration Date</SectionRowTitle>
                        <SectionRowContent>{expiryDate}</SectionRowContent>
                    </SectionRow>
                    <SectionRow>
                        <SectionRowTitle>College Initiator</SectionRowTitle>
                        <SectionRowContent>{college}</SectionRowContent>
                    </SectionRow>
                    <SectionRow>
                        <SectionRowContent className="d-flex">
                            <Button outline
                                    color="success"
                                    size="sm"
                                    className="mr-2"
                                    onClick={viewMemorandum}>View</Button>

                            {!this.props.archived &&
                            <Button outline
                                    color="success"
                                    size="sm"
                                    className="mr-auto"
                                    onClick={this.props.toggleEditMemorandum}>Edit</Button>
                            }
                            {!this.props.archived &&
                            < Button outline
                                     color="warning"
                                     size="sm"
                                     onClick={this.props.toggleDeleteMemorandum}>Archive</Button>
                            }

                            {this.props.archived &&
                            <Button outline
                                    color="primary"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={this.props.toggleRestoreMemorandum}>Restore</Button>
                            }
                        </SectionRowContent>
                    </SectionRow>
                </SectionTable>
            </Section>
        );
    }
}

class MemorandumLinkages extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let body = (
            <div className="p-4 pt-5 pb-5 bg-light text-center">
                <h5 className="text-secondary">There are no linkages for this memorandum.</h5>
            </div>
        );


        const rows = this.props.linkages.map((linkage, index) => {
            return (
                <SectionRow key={index}>{settings.linkages[linkage]}</SectionRow>
            );
        });

        if (this.props.linkages.length > 0) {
            body = (
                <SectionTable>
                    {rows}
                </SectionTable>
            );
        }

        return (
            <Section>
                <SectionTitle>Linkages</SectionTitle>
                {body}
            </Section>
        );
    }
}

class ProgramSidebarPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteProgramIsShowing : false,
            editProgramIsShowing : false,
            program : props.program,
        };

        this.toggleDeleteProgram = this.toggleDeleteProgram.bind(this);
        this.toggleEditProgram = this.toggleEditProgram.bind(this);
        this.onEditProgram = this.onEditProgram.bind(this);
    }

    toggleDeleteProgram() {
        this.setState({
            deleteMemorandumIsShowing : !this.state.deleteProgramIsShowing,
        });
    }

    toggleEditProgram() {
        this.setState({
            editProgramIsShowing : !this.state.editProgramIsShowing,
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            program : props.program,
        });
    }

    onEditProgram(program) {
        this.setState({
            program : program,
        });
    }

    render() {
        const program = this.state.program;
        return (
            <div className="p-0 h-100 d-flex flex-column">
                <div className="page-head pt-5 d-flex flex-row align-items-end">
                    <div className="mr-auto">
                        <h5 className="mb-0">{program.name}</h5>
                    </div>
                </div>


                <div className="page-body">
                    <ProgramDetails program={program}
                                    toggleDeleteProgram={this.toggleDeleteProgram}
                                    toggleEditProgram={this.toggleEditProgram}/>
                    <ProgramStudyFields studyFields={program.studyfield_set}/>

                    {/* Delete and Edit Modals */}
                </div>
            </div>
        );
    }
}

class ProgramDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const program = this.props.program;
        return (
            <Section>
                <SectionTitle>Details</SectionTitle>
                <SectionTable>
                    <SectionRow>
                        <SectionRowTitle>Program Name</SectionRowTitle>
                        <SectionRowContent>{program.name}</SectionRowContent>
                    </SectionRow>
                    <SectionRow>
                        <SectionRowTitle>Linkage</SectionRowTitle>
                        <SectionRowContent>{program.linkage.name}</SectionRowContent>
                    </SectionRow>
                    <SectionRow>
                        <SectionRowContent className="d-flex">
                            <Button outline
                                    color="success"
                                    size="sm"
                                    className="mr-auto"
                                    onClick={this.props.toggleEditMemorandum}>Edit</Button>
                            <Button outline
                                    color="warning"
                                    size="sm"
                                    onClick={this.props.toggleDeleteMemorandum}>Archive</Button>
                        </SectionRowContent>
                    </SectionRow>
                </SectionTable>
            </Section>
        );
    }
}

class ProgramStudyFields extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let body = (
            <div className="p-4 pt-5 pb-5 bg-light text-center">
                <h5 className="text-secondary">There are no study fields for this program.</h5>
            </div>
        );

        const rows = this.props.studyFields.map((studyField, index) => {
            return (
                <SectionRow key={index}>{studyField.name}</SectionRow>
            );
        });

        if (this.props.studyFields.length > 0) {
            body = (
                <SectionTable>
                    {rows}
                </SectionTable>
            );
        }

        return (
            <Section>
                <SectionTitle>Study Fields</SectionTitle>
                {body}
            </Section>
        );
    }
}


export {
    MemorandumSidebarPane,
    ProgramSidebarPane,
};