import MemorandumArchives from "./memorandums";
import React from "react";


const tabs = [
    {
        name : "Memorandums",
        tab : setSidebarContent => <MemorandumArchives setSidebarContent={setSidebarContent}/>,
        image : "./images/memorandumgrey.png",
        activeImage : "./images/memorandumgreen.png",
    },
    {
        name : "Programs",
        tab : undefined,
        image : "./images/programsgrey.png",
        activeImage : "./images/programsgreen.png",
    },
    {
        name : "Students",
        tab : undefined,
        image : "./images/studentgrey.png",
        activeImage : "./images/studentgreen.png",
    },
    {
        name : "Institutions",
        tab : undefined,
        image : "./images/institutiongrey.png",
        activeImage : "./images/institutiongreen.png",
    },
];

export default tabs;