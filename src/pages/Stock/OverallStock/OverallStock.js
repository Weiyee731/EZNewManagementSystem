import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

import SearchBar from "../../../components/SearchBar/SearchBar"
import TableComponents from "../../../components/TableComponents/TableComponents";
import ToggleTabsComponent from "../../../components/ToggleTabsComponent/ToggleTabComponents";
import { isArrayNotEmpty, isStringNullOrEmpty } from "../../../tools/Helpers";
import { getWindowDimensions } from "../../../tools/DisplayHelper"

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

const INITIAL_STATE = {
    UserID: 1,
    filteredList: null,
}

class OverallStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallFetchAllStock({ USERID: 1 })
        this.changeTab = this.changeTab.bind(this)
        this.screenOnResize = this.screenOnResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.screenOnResize());
    }

    componentDidUnmount() {
        window.removeEventListener('resize');
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.filteredList === null && isArrayNotEmpty(this.props.stocks)) {
            const { stocks } = this.props
            console.log(stocks)
            this.setState({
                filteredList: (isStringNullOrEmpty(stocks.ReturnVal) && stocks.ReturnVal == 0) ? [] : stocks
            })

        }
    }

    screenOnResize = () => {
        console.log('yes')
    }

    changeTab = (key) => {
        switch (key) {
            case "All":
                console.log("All")
                break;

            case "Unchecked":
                console.log("Unchecked")
                break;

            case "Checked":
                console.log("Checked")
                break;

            case "Collected":
                console.log("Collected")
                break;

            default:
                break;
        }
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

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Buton">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
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
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" },
            { children: "Collected", key: "Collected" },
        ]

        console.log(getWindowDimensions())

        return (
            <div className="container-fluid">
                <SearchBar />
                <ToggleTabsComponent Tabs={ToggleTabs} size="small" />
                <hr />
                <TableComponents
                    // table settings 
                    // tableTopLeft={<h3 style={{ fontWeight: 600 }}>Table Name</h3>}  // optional, it can pass as string or as children elements
                    // tableTopRight={this.renderTableActionButton}                 // optional, it will brings the elements to the table's top right corner

                    tableOptions={{
                        dense: true,                // optional, default is false
                        tableOrderBy: 'asc',        // optional, default is asc
                        sortingIndex: "fat",        // require, it must the same as the desired table header
                        stickyTableHeader: true,    // optional, default is true
                        stickyTableHeight: 300,     // optional, default is 300px
                    }}
                    paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={headCells}        //required
                    tableRows={{
                        renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: true,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                    }}
                    selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={rows}                                  // required, the data that listing in the table
                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                    onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverallStock);