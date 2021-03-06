"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _memorandums = require("./memorandums");

var _memorandums2 = _interopRequireDefault(_memorandums);

var _students = require("./students");

var _students2 = _interopRequireDefault(_students);

var _instititutions = require("./instititutions");

var _instititutions2 = _interopRequireDefault(_instititutions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tabs = [{
    name: "Memorandums",
    tab: function tab(setSidebarContent) {
        return _react2.default.createElement(_memorandums2.default, { setSidebarContent: setSidebarContent });
    },
    image: "./images/memorandumgrey.png",
    activeImage: "./images/memorandumgreen.png"
}, {
    name: "Students",
    tab: function tab(setSidebarContent) {
        return _react2.default.createElement(_students2.default, { setSidebarContent: setSidebarContent });
    },
    image: "./images/studentgrey.png",
    activeImage: "./images/studentgreen.png"
}, {
    name: "Institutions",
    tab: function tab(setSidebarContent) {
        return _react2.default.createElement(_instititutions2.default, { setSidebarContent: setSidebarContent });
    },
    image: "./images/institutiongrey.png",
    activeImage: "./images/institutiongreen.png"
}];

exports.default = tabs;
//# sourceMappingURL=archives_tabs_list.js.map