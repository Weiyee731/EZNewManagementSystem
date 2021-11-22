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
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions } from "../../../tools/Helpers";

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
        id: 'TrackingNo',
        align: 'left',
        disablePadding: false,
        label: 'Tracking No. ',
    },
    {
        id: 'Weight',
        align: 'left',
        disablePadding: false,
        label: 'Weight (KG)',
    },
    {
        id: 'Depth',
        align: 'left',
        disablePadding: false,
        label: 'Depth',
    },
    {
        id: 'Width',
        align: 'left',
        disablePadding: false,
        label: 'Width',
    },
    {
        id: 'Height',
        align: 'left',
        disablePadding: false,
        label: 'Height',
    },
    {
        id: 'Dimension',
        align: 'left',
        disablePadding: false,
        label: 'Dimension',
    },
    {
        id: 'Item',
        align: 'left',
        disablePadding: false,
        label: 'Item',
    },
    {
        id: 'Member',
        align: 'left',
        disablePadding: false,
        label: 'Member',
    },
    {
        id: 'Division',
        align: 'left',
        disablePadding: false,
        label: 'Division',
    },
    {
        id: 'Stockdate',
        align: 'left',
        disablePadding: false,
        label: 'Stock Date',
    },
    {
        id: 'packagingDate',
        align: 'left',
        disablePadding: false,
        label: 'Packaging Date',
    },
    {
        id: 'ContainerNo',
        align: 'left',
        disablePadding: false,
        label: 'Container',
    },
    {
        id: 'Remarks',
        align: 'left',
        disablePadding: false,
        label: 'Remarks',
    },
];
function createData(stockId, TrackingNo, Weight, Depth, Width, Height, Item, Member, Division, Stockdate, packagingDate, ContainerNo, Remarks) {
    return {
        stockId,
        TrackingNo,
        Width,
        Height,
        Depth,
        Weight,
        Item,
        Member,
        Stockdate,
        packagingDate,
        ContainerNo,
        Division,
        Remarks,
    };
}

const rows = [
    createData(1, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(2, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(3, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(4, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(5, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(6, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(7, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(8, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(9, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(10, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(11, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(12, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(13, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(14, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(15, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(16, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(17, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(18, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(19, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(20, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(21, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(22, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(23, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(24, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(25, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(26, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(27, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(28, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(29, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
    createData(30, 'A123456', 3.7, 3.7, 4.3, 1.5, 'box', 'M123456', 'KU', '14/11/2021', '14/11/2021', 'C354123', 'remarks'),
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
        this.onAddButtonClick = this.onAddButtonClick.bind(this)
    }

    componentDidMount() {
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
        const fontsize = '9pt'
        return (
            <>
                <TableCell
                    component="th"
                    id={`table-checkbox-${index}`}
                    scope="row"
                    sx={{ fontSize: fontsize }}
                >
                    {data.TrackingNo}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Weight.toFixed(2)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Depth.toFixed(2)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Width.toFixed(2)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Height.toFixed(2)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.Depth * data.Width * data.Height).toFixed(2)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Item}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Member}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Division}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Stockdate}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.packagingDate}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ContainerNo}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Remarks}</TableCell>
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
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" },
            { children: "Collected", key: "Collected" },
        ]

        return (
            <div className="container-fluid">
                <SearchBar />
                <hr />
                <ToggleTabsComponent Tabs={ToggleTabs} size="small" />
                <TableComponents
                    // table settings 
                    tableOptions={{
                        dense: true,                // optional, default is false
                        tableOrderBy: 'asc',        // optional, default is asc
                        sortingIndex: "TrackingNo",        // require, it must the same as the desired table header
                        stickyTableHeader: true,    // optional, default is true
                        stickyTableHeight: (getWindowDimensions().screenHeight * 0.7),     // optional, default is 300px
                    }}
                    paginationOptions={[50, 100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={headCells}        //required
                    tableRows={{
                        renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: false,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                    }}
                    selectedIndexKey={"stockId"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={rows}                                  // required, the data that listing in the table
                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                    // onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverallStock);