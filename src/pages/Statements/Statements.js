import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";

import TableComponents from "../../components/TableComponents/TableComponents"

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

class Statements extends Component {
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
            <div className="w-100 container-fluid">
                <TableComponents
                    tableOptions={{
                        dense: true,
                        tableOrderBy: 'asc',
                        stickyTableHeader: false,
                        stickyTableHeight: 600,
                    }}
                    
                    paginationOptions={[15, 100, 250, { label: 'All', value: -1 }]}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Statements);