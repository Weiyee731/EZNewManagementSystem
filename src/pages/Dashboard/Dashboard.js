import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";

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

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallFetchAllStock({USERID: 1})
    }

    componentDidMount() {
        
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