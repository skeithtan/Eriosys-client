"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _year_list = require("./year_list");

var _year_list2 = _interopRequireDefault(_year_list);

var _program_list = require("./program_list");

var _program_list2 = _interopRequireDefault(_program_list);

var _program_list_tabs = require("./program_list_tabs");

var _program_list_tabs2 = _interopRequireDefault(_program_list_tabs);

var _study_field_list = require("./study_field_list");

var _study_field_list2 = _interopRequireDefault(_study_field_list);

var _student_list = require("./student_list");

var _student_list2 = _interopRequireDefault(_student_list);

var _graphql = require("../../graphql");

var _graphql2 = _interopRequireDefault(_graphql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function fetchYears(onResult) {
    _graphql2.default.query("\n    {\n        academic_years {\n            academic_year_start\n        }\n    }\n    ").then(onResult);
}

function fetchPrograms(year, term, onResult) {
    _graphql2.default.query("\n    {\n        programs(year:" + year + ", term:" + term + ") {\n            name\n            memorandum {\n                institution {\n                    name\n                }\n            }\n            terms {\n                number\n            }\n        }\n    }\n    ").then(onResult);
}

var Programs = function (_Component) {
    _inherits(Programs, _Component);

    function Programs(props) {
        _classCallCheck(this, Programs);

        var _this = _possibleConstructorReturn(this, (Programs.__proto__ || Object.getPrototypeOf(Programs)).call(this, props));

        _this.state = {
            yearList: null,
            programList: null,
            activeYear: null,
            activeTerm: 1,
            activeProgram: null,
            activeStudyField: null
        };

        _this.refreshYears = _this.refreshYears.bind(_this);
        _this.setActiveYear = _this.setActiveYear.bind(_this);
        _this.setActiveTerm = _this.setActiveTerm.bind(_this);
        _this.setActiveProgram = _this.setActiveProgram.bind(_this);
        _this.setActiveStudyField = _this.setActiveStudyField.bind(_this);

        _this.refreshYears();
        return _this;
    }

    _createClass(Programs, [{
        key: "refreshYears",
        value: function refreshYears() {
            var _this2 = this;

            fetchYears(function (result) {
                _this2.setState({
                    yearList: result.academic_years
                });
            });
        }
    }, {
        key: "setActiveYear",
        value: function setActiveYear(year) {
            var _this3 = this;

            this.setState({
                activeYear: year
            });

            fetchPrograms(year, this.state.activeTerm, function (result) {
                _this3.setState({
                    programList: result.programs
                });
            });
        }
    }, {
        key: "setActiveTerm",
        value: function setActiveTerm(term) {
            var _this4 = this;

            this.setState({
                activeTerm: term
            });

            fetchPrograms(this.state.activeYear, term, function (result) {
                console.log(result.programs);
                _this4.setState({
                    programList: result.programs
                });
            });
        }
    }, {
        key: "setActiveProgram",
        value: function setActiveProgram(program) {
            console.log(program);
            this.setState({
                activeProgram: program
            });
        }
    }, {
        key: "setActiveStudyField",
        value: function setActiveStudyField(studyField) {
            this.setState({
                activeStudyField: studyField
            });
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { id: "programs-page", className: "container-fluid d-flex flex-row p-0 h-100 page-body" },
                _react2.default.createElement(_year_list2.default, { yearList: this.state.yearList,
                    setActiveYear: this.setActiveYear }),
                this.state.activeYear !== null && _react2.default.createElement(
                    "div",
                    { id: "program-list", className: "d-flex flex-column p-0 h-100" },
                    _react2.default.createElement(_program_list2.default, { programList: this.state.programList,
                        activeYear: this.state.activeYear,
                        activeProgram: this.state.activeProgram,
                        setActiveProgram: this.setActiveProgram }),
                    _react2.default.createElement(_program_list_tabs2.default, { activeTerm: this.state.activeTerm,
                        setActiveTerm: this.setActiveTerm })
                ),
                this.state.activeProgram !== null && _react2.default.createElement(_student_list2.default, null)
            );
        }
    }]);

    return Programs;
}(_react.Component);

exports.default = Programs;
//# sourceMappingURL=programs.js.map