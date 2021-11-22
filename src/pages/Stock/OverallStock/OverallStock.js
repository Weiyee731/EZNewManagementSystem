import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

import SearchBar from "../../../components/SearchBar/SearchBar"
import FullWidthTabs from '../../../components/TabsComponent/Tabs';
import TableComponents from "../../../components/TableComponents/TableComponents";

function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllStock: (propsData) => dispatch(GitAction.CallFetchAllStock(propsData)),
    };
}


const INITIAL_STATE = {

}

function Table1() {
    return (
        <div>
            
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

const TabsHeaders = ["All", "Tab 2"]
const TabsBody = [<Table1 />, <Table2 />]

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
                    <FullWidthTabs 
                        Headers={TabsHeaders}
                        Body={TabsBody}
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverallStock);