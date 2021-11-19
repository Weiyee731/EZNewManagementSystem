import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import TableCell from '@mui/material/TableCell';
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

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: false,
        label: 'Dessert ',
    },
    {
        id: 'calories',
        align: 'center',
        disablePadding: false,
        label: 'Calories',
    },
    {
        id: 'fat',
        align: 'center',
        disablePadding: false,
        label: 'Fat (g)',
    },
    {
        id: 'carbs',
        align: 'center',
        disablePadding: false,
        label: 'Carbs (g)',
    },
    {
        id: 'protein',
        align: 'center',
        disablePadding: false,
        label: 'Protein (g)',
    },
];

function createData(pid, name, calories, fat, carbs, protein) {
    return {
        pid,
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0),
];

class Statements extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.renderTableRows = this.renderTableRows.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.name}
                </TableCell>
                <TableCell align="center">{data.calories}</TableCell>
                <TableCell align="center">{data.fat}</TableCell>
                <TableCell align="center">{data.carbs}</TableCell>
                <TableCell align="center">{data.protein}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        console.log(row)
    }

    onAddButtonClick = () => {
        console.log('add button')
    }

    onDeleteButtonClick = (items) => {
        console.log('delete button')
        console.log(items)
    }

    render() {
        return (
            <div className="w-100 container-fluid">
                <TableComponents
                    // table settings 
                    title="Table Name"
                    tableOptions={{
                        dense: true,
                        tableOrderBy: 'asc',
                        sortingIndex: "fat",    //default sorting index based on header id
                        stickyTableHeader: false,
                        stickyTableHeight: 600,
                    }}
                    paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]}
                    tableHeaders={headCells}
                    tableRows={{
                        renderTableRows: this.renderTableRows,
                        tableCellsNumber: 6,
                        checkbox: true,
                        checkboxColor: "primary",
                        onRowClickSelect: true
                    }}
                    selectedIndexKey={"pid"}
                    Data={rows}
                    onTableRowClick={this.onTableRowClick}
                    onActionButtonClick={this.onAddButtonClick}
                    onDeleteButtonClick={this.onDeleteButtonClick}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Statements);