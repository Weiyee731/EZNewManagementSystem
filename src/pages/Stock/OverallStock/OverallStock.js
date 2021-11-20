import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

import SearchBar from "../../../components/SearchBar/SearchBar"
import FullWidthTabs from '../../../components/TabsComponent/Tabs';

function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
    };
}


const INITIAL_STATE = {

}

function Table1() {

    return (
        <div>
            Something 1
        </div>
    )
}

function Table2() {

    return (
        <div>
            Something 2
        </div>
    )
}

const TabsHeaders = ["Tab 1", "Tab 2"]
const TabsBody = [<Table1 />, <Table2 />]
const TabsSettings = {
    Headers: TabsHeaders,
    Body: TabsBody
}

class OverallStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        return (
            <div className="container-fluid">
                <SearchBar 
                
                />
                <div className='w-100'>
                    <FullWidthTabs settings={TabsSettings} />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverallStock);