"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reminders = require("./Reminders/reminders");

var _reminders2 = _interopRequireDefault(_reminders);

var _institutions = require("./Institutions/institutions");

var _institutions2 = _interopRequireDefault(_institutions);

var _students = require("./Students/students");

var _students2 = _interopRequireDefault(_students);

var _outbound_programs = require("./OutboundPrograms/outbound_programs");

var _outbound_programs2 = _interopRequireDefault(_outbound_programs);

var _inbound_programs = require("./InboundPrograms/inbound_programs");

var _inbound_programs2 = _interopRequireDefault(_inbound_programs);

var _archives = require("./Archives/archives");

var _archives2 = _interopRequireDefault(_archives);

var _outbound_applications = require("./OutboundApplications/outbound_applications");

var _outbound_applications2 = _interopRequireDefault(_outbound_applications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tabs = [{
    name: "Reminders",
    tab: _react2.default.createElement(_reminders2.default, null),
    image: "./images/bell.png"
}, {
    name: "Institutions",
    tab: _react2.default.createElement(_institutions2.default, null),
    image: "./images/uni.png"
}, {
    name: "Students",
    tab: _react2.default.createElement(_students2.default, null),
    image: "./images/student.png"
}, {
    name: "Outbound Applications",
    tab: _react2.default.createElement(_outbound_applications2.default, null),
    image: "./images/checklist.png"
}, {
    name: "Inbound Programs",
    tab: _react2.default.createElement(_inbound_programs2.default, null),
    image: "./images/inbound.png"
}, {
    name: "Outbound Programs",
    tab: _react2.default.createElement(_outbound_programs2.default, null),
    image: "./images/airplane.png"
}, {
    name: "Archives",
    tab: _react2.default.createElement(_archives2.default, null),
    image: "./images/archive.png"
}];

exports.default = tabs;
//# sourceMappingURL=tabs_list.js.map