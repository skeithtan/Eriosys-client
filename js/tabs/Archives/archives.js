import React, { Component } from "react";
import tabs from "./tabs/archives_tabs_list";
import TabBar from "../../components/tab_bar";


class Archives extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab : tabs[0],
            sidebarContent : null,
        };

        this.setActiveTab = this.setActiveTab.bind(this);
        this.setSidebarContent = this.setSidebarContent.bind(this);
    }

    setActiveTab(tab) {
        this.setState({
            activeTab : tab,
            sidebarContent : null,
        });
    }

    setSidebarContent(content) {
        this.setState({
            sidebarContent : content,
        });
    }

    render() {
        let sidebarClass = "sidebar-right ";
        if (this.state.sidebarContent === null) {
            sidebarClass += "dismissed";
        }

        const tab = this.state.activeTab.tab(this.setSidebarContent);

        return (
            <div id="archives"
                 className="d-flex flex-row h-100 w-100">
                <div className="d-flex flex-column p-0 h-100 w-100">
                    <div className="tab-content">{ tab }</div>
                    <TabBar setActiveTab={ this.setActiveTab }
                            activeTab={ this.state.activeTab }
                            tabs={ tabs }/>
                </div>

                <div className={ sidebarClass }>
                    { this.state.sidebarContent }
                </div>
            </div>
        );
    }
}

export default Archives;