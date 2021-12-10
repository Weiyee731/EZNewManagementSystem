import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";
import { isArrayNotEmpty } from "../../tools/Helpers";

function mapStateToProps(state) {
    return {
        dashboard: state.counterReducer["dashboard"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchDashboardData: () => dispatch(GitAction.CallFetchDashboardData()),
    };
}


const INITIAL_STATE = {
    dashboard_data: []
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallFetchDashboardData();
    }

    componentDidMount() {
        if(isArrayNotEmpty(this.props.dashboard)){
            this.setState({ dashboard_data: this.props.dashboard})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.stocks)
    }

    render() {
        return (
            <div>
                <h1>Hello</h1>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);