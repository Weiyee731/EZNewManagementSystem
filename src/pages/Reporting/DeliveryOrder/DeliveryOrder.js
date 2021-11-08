import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

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

class DeliveryOrder extends Component {
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
            <div>
                <h1>Delivery Order</h1>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOrder);