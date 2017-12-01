import React, { Component } from "react";
import graphql from "../../graphql";
import YearList from "../OutboundPrograms/year_list";
import ProgramList from "./inbound_program_list";
import StudentList from "./student_list";

function fetchYears(onResult) {
    graphql.query(`
    {
        academic_years {
            academic_year_start
        }
    }
    `).then(onResult);
}

function fetchPrograms(year, onResult) {
    graphql.query(`
    {
        inbound_programs(year:${year}) {
            id
            name
        }
    }
    `).then(onResult);
}

function fetchStudents(id, onResult) {
    graphql.query(`
    {
        inbound_program(id:${id}) {
            id
            inboundstudentprogram_set {
                id
                student {
                    id
                    id_number
                    first_name
                    middle_name
                    family_name
                }
            }
        }
    }
    `).then(onResult);
}

class InboundPrograms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            yearList : null,
            programList : null,
            activeYear : null,
            activeProgram : null,
            studentList : null,
            // sidebarContent : null,
        };

        this.refreshYears = this.refreshYears.bind(this);
        this.setActiveYear = this.setActiveYear.bind(this);
        this.programList = this.programList.bind(this);
        this.setActiveProgram = this.setActiveProgram.bind(this);
        this.studentList = this.studentList.bind(this);
        this.refreshYears();
    }

    setActiveYear(year) {
        this.setState({
            activeYear : year.academic_year_start,
            activeProgram : null,
            studentList : null,
        });

        fetchPrograms(year.academic_year_start, result => {
            this.setState({
                programList : result.inbound_programs,
            });
        });
    }

    setActiveProgram(program) {
        this.setState({
            activeProgram : program,
        });

        fetchStudents(program.id, result => {
            this.setState({
                studentList : result.inbound_program.inboundstudentprogram_set,
            });
        });
    }

    refreshYears() {
        fetchYears(result => {
            this.setState({
                yearList : result.academic_years,
            });
        });
    }

    programList() {
        if (this.state.activeYear === null) {
            return (
                <div className="programs-page-pane">
                    <div className="loading-container">
                        <h4>Select an academic year to see its programs</h4>
                    </div>
                </div>
            );
        }

        return (
            <ProgramList programList={ this.state.programList }
                         activeYear={ this.state.activeYear }
                         activeProgram={ this.state.activeProgram }
                         setActiveProgram={ this.setActiveProgram }/>
        );
    }

    studentList() {
        if (this.state.activeProgram === null) {
            return (
                <div className="programs-page-pane">
                    <div className="loading-container">
                        <h4>Select a program to see its students</h4>
                    </div>
                </div>
            );
        }

        return (
            <StudentList activeProgram={ this.state.activeProgram }
                         students={ this.state.studentList }/>
        );
    }

    render() {
        return (
            <div id="programs-page"
                 className="d-flex flex-row p-0 h-100">
                <YearList yearList={ this.state.yearList }
                          setActiveYear={ this.setActiveYear }
                          activeYear={ this.state.activeYear }/>

                { this.programList() }
                { this.studentList() }

                { /*<div className="programs-page-pane">*/ }
                { /*{ this.state.sidebarContent }*/ }
                { /*</div>*/ }
            </div>
        );
    }
}

export default InboundPrograms;