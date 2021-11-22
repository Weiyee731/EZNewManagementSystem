import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
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

class DataManagement extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.uploadHandler = this.uploadHandler.bind(this)
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    uploadHandler = (e) => {
        console.log(e)

    }

    render() {
        return (
            <div>
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={this.uploadHandler}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataManagement);