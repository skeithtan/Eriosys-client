import React, { Component } from "react";
import LoadingSpinner from "../../../components/loading";
import graphql from "../../../graphql";
import { Button } from "reactstrap";
import {
    Section,
    SectionTitle,
    SectionTable,
    SectionRow,
    SectionRowTitle,
    SectionRowContent,
} from "../../../components/section";
import {
    ArchiveStudentModal,
    StudentFormModal,

} from "../modals";
import moment from "moment";
import settings from "../../../settings";

function fetchStudent(id, onResult) {
    graphql.query(`
    {
        student(id:${id}) {
            id
            category
            id_number
            college
            family_name
            first_name
            middle_name
            nickname
            nationality
            home_address
            phone_number
            birth_date
            sex
            emergency_contact_name
            emergency_contact_relationship
            emergency_contact_number
            email
            civil_status
            institution {
                name
            }
        }
    }    
    `).then(onResult);
}

class StudentOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            student : null,
            studentID : props.student.id,
        };

        this.onEditStudent = this.onEditStudent.bind(this);

        fetchStudent(props.student.id, result => {
            const student = result.student;

            this.setState({
                student : student,
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            studentID : nextProps.student.id,
            student : null,
        });

        fetchStudent(nextProps.student.id, result => {
            const student = result.student;
            this.setState({
                student : student,
            });
        });
    }

    onEditStudent() {
        this.setState({
            student : null,
        });

        fetchStudent(this.state.studentID, result => {
            const student = result.student;
            this.setState({
                student : student,
            });

            this.props.refreshStudents();
        });
    }

    render() {
        if (this.state.student === null) {
            return <LoadingSpinner/>;
        }

        return (
            <div className="d-flex flex-column p-0 h-100">
                <OverviewHead student={ this.state.student }
                              onDeleteStudent={ this.props.onDeleteActiveStudent }
                              onEditStudent={ this.onEditStudent }/>
                <OverviewBody student={ this.state.student }/>
            </div>
        );
    }
}

class OverviewHead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteStudentIsShowing : false,
            editStudentIsShowing : false,
        };
    }

    toggleEditStudent() {
        this.setState({
            editStudentIsShowing : !this.state.editStudentIsShowing,
        });
    }

    toggleDeleteStudent() {
        this.setState({
            deleteStudentIsShowing : !this.state.deleteStudentIsShowing,
        });
    }

    render() {
        return (
            <div className="page-head pt-5 d-flex flex-row align-items-center">
                <div className="mr-auto">
                    <h4 className="page-head-title justify-content-left d-inline-block mb-0 mr-2">
                        { this.props.student.first_name } { this.props.student.middle_name } { this.props.student.family_name }
                        <small className="text-muted ml-2">{ this.props.student.id_number }</small>
                    </h4>
                </div>

                <div className="page-head-actions">
                    <Button outline
                            size="sm"
                            color="success"
                            className="mr-2"
                            onClick={ this.toggleEditStudent }>
                        Edit Student
                    </Button>

                    <Button outline
                            size="sm"
                            color="warning"
                            onClick={ this.toggleDeleteStudent }>Archive</Button>
                </div>

                <ArchiveStudentModal isOpen={ this.state.deleteStudentIsShowing }
                                     student={ this.props.student }
                                     toggle={ this.toggleDeleteStudent }
                                     refresh={ this.props.onDeleteStudent }/>

                <StudentFormModal edit
                                  isOpen={ this.state.editStudentIsShowing }
                                  student={ this.props.student }
                                  refresh={ this.props.onEditStudent }
                                  toggle={ this.toggleEditStudent }/>
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
                <StudentDetails student={ this.props.student }/>
                <ContactDetails student={ this.props.student }/>
                <UniversityDetails student={ this.props.student }/>
            </div>
        );
    }
}

class StudentDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const student = this.props.student;
        const sex = student.sex === "F" ? "Female" : "Male";
        const civilStatus = settings.civilStatuses[student.civil_status];
        const birthDate = moment(student.birth_date).format("LL");

        return (
            <Section>
                <SectionTitle>Student Details</SectionTitle>
                <SectionTable>

                    { student.nickname.length > 0 && //Only show if student nickname exists
                    <SectionRow>
                        <SectionRowTitle>Nickname</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ student.nickname }</SectionRowContent>
                    </SectionRow>
                    }

                    <SectionRow>
                        <SectionRowTitle>Sex</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ sex }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Home Address</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ student.home_address }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Date of Birth</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ birthDate }</SectionRowContent>
                    </SectionRow>

                    { student.nationality.length > 0 &&
                    <SectionRow>
                        <SectionRowTitle>Nationality</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ student.nationality }</SectionRowContent>
                    </SectionRow>
                    }

                    <SectionRow>
                        <SectionRowTitle>Civil Status</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ civilStatus }</SectionRowContent>
                    </SectionRow>

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
        const student = this.props.student;

        return (
            <Section>
                <SectionTitle>Contact Details</SectionTitle>
                <SectionTable>

                    <SectionRow>
                        <SectionRowTitle>Phone Number</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ student.phone_number }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Email</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ student.email }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Emergency Contact</SectionRowTitle>
                        <SectionRowContent
                            large={ !this.props.sidebar }>{ `${student.emergency_contact_name} (${student.emergency_contact_relationship})` }</SectionRowContent>
                    </SectionRow>

                    <SectionRow>
                        <SectionRowTitle>Emergency Contact Number</SectionRowTitle>
                        <SectionRowContent
                            large={ !this.props.sidebar }>{ student.emergency_contact_number }</SectionRowContent>
                    </SectionRow>

                </SectionTable>
            </Section>
        );
    }
}

class UniversityDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const student = this.props.student;
        const college = settings.colleges[student.college];
        const type = student.category === "OUT" ? "Outbound" : "Inbound";

        return (
            <Section>
                <SectionTitle>University Details</SectionTitle>
                <SectionTable>

                    <SectionRow>
                        <SectionRowTitle>Student Type</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ type }</SectionRowContent>
                    </SectionRow>

                    { student.category === "IN" &&
                    <SectionRow>
                        <SectionRowTitle>Institution</SectionRowTitle>
                        <SectionRowContent
                            large={ !this.props.sidebar }>{ student.institution.name }</SectionRowContent>
                    </SectionRow>
                    }

                    <SectionRow>
                        <SectionRowTitle>College</SectionRowTitle>
                        <SectionRowContent large={ !this.props.sidebar }>{ college }</SectionRowContent>
                    </SectionRow>

                </SectionTable>
            </Section>
        );
    }
}

export default StudentOverview;