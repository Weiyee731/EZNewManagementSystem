import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from 'react-router'
import EnhancedTable from "../../components/table/table";

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


function createData(name, calories, fat, carbs, protein) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const INITIAL_STATE = {

}

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleDeleteRow = (row) => {
        console.log(row)
    }

    handleRowDetail = (row) => {
        console.log(this.props)
        this.props.history.push(`/UserDetail/${row.name}/${row.fat}`)
    }

    render() {
        const headCells = [
            {
                id: 'name',
                numeric: false,
                disablePadding: false,
                label: 'Dessert (100g serving)',
            },
            {
                id: 'calories',
                numeric: true,
                disablePadding: false,
                label: 'Calories',
            },
            {
                id: 'fat',
                numeric: true,
                disablePadding: false,
                label: 'Fat (g)',
            },
            {
                id: 'carbs',
                numeric: true,
                disablePadding: false,
                label: 'Carbs (g)',
            },
            {
                id: 'protein',
                numeric: true,
                disablePadding: false,
                label: 'Protein (g)',
            },
        ];

        const rows = [
            createData('Cupcake', 305, 3.7, 67, 4.3),
            createData('Donut', 452, 25.0, 51, 4.9),
            createData('Eclair', 262, 16.0, 24, 6.0),
            createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
            createData('Gingerbread', 356, 16.0, 49, 3.9),
            createData('Honeycomb', 408, 3.2, 87, 6.5),
            createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
            createData('Jelly Bean', 375, 0.0, 94, 0.0),
            createData('KitKat', 518, 26.0, 65, 7.0),
            createData('Lollipop', 392, 0.2, 98, 0.0),
            createData('Marshmallow', 318, 0, 81, 2.0),
            createData('Nougat', 360, 19.0, 9, 37.0),
            createData('Oreo', 437, 18.0, 63, 4.0),
        ];

        return (
            <div>
                <EnhancedTable
                    title={"User Management"}
                    headCells={headCells}
                    rows={rows}
                    handleDeleteRow={this.handleDeleteRow}
                    handleRowDetail={this.handleRowDetail}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserManagement));