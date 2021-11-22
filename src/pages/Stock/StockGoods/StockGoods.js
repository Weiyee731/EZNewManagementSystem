import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

import SearchBar from "../../../components/SearchBar/SearchBar"
import FullWidthTabs from '../../../components/TabsComponent/Tabs';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TableComponents from "../../../components/TableComponents/TableComponents"
import TableCell from '@mui/material/TableCell';
import { ModalPopOut } from "../../../components/modal/Modal";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ResponsiveDatePickers from '../../../components/datePicker/datePicker';
import CheckIcon from '@mui/icons-material/Check';
import '../../../scss/stock.scss';
import { Link } from 'react-router-dom';
import EditStockGoods from "./EditStockGoods";

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

const headCells = [
    {
        id: 'Courier',
        numeric: false,
        disablePadding: false,
        label: 'Courier',
    },
    {
        id: 'Tracking_No',
        numeric: true,
        disablePadding: false,
        label: 'Tracking No',
    },
    {
        id: 'Weight',
        numeric: true,
        disablePadding: false,
        label: 'Weight(kg)',
    },
    {
        id: 'Depth',
        numeric: true,
        disablePadding: false,
        label: 'Depth(m)',
    },
    {
        id: 'Width',
        numeric: true,
        disablePadding: false,
        label: 'Width(m)',
    },
    {
        id: 'Height',
        numeric: true,
        disablePadding: false,
        label: 'Height(m)',
    },
    {
        id: 'Dimension',
        numeric: true,
        disablePadding: false,
        label: 'Dimension',
    },
    {
        id: 'Category_Name',
        numeric: true,
        disablePadding: false,
        label: 'Category Name',
    },
    {
        id: 'Quantity',
        numeric: true,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'Member_No',
        numeric: true,
        disablePadding: false,
        label: 'Member No',
    },
    {
        id: 'Division',
        numeric: true,
        disablePadding: false,
        label: 'Division',
    },
    {
        id: 'Charged_remark',
        numeric: true,
        disablePadding: false,
        label: 'Charged Remark',
    },
    {
        id: 'Stock_Date',
        numeric: true,
        disablePadding: false,
        label: 'Stock Date',
    },
    {
        id: 'Packaging_Date',
        numeric: true,
        disablePadding: false,
        label: 'Packaging Date',
    },
    {
        id: 'Approve',
        numeric: true,
        disablePadding: false,
        label: 'Approve',
        className: "sticky "
    },
];

const INITIAL_STATE = {
    open: true,
    openModal: false,
    selectedRows: []
}

function createData(Courier,
    Tracking_No,
    Weight,
    Depth,
    Width,
    Height,
    Dimension,
    Category_Name,
    Quantity,
    Member_No,
    Division,
    Charged_remark,
    Stock_Date,
    Packaging_Date, Approve) {
    return {
        Courier,
        Tracking_No,
        Weight,
        Depth,
        Width,
        Height,
        Dimension,
        Category_Name,
        Quantity,
        Member_No,
        Division,
        Charged_remark,
        Stock_Date,
        Packaging_Date,
        Approve
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

function renderTableRows(data, index) {
    return (
        <>
            <TableCell
                component="th"
                id={`enhanced-table-checkbox-${index}`}
                scope="row"
                padding="normal"
            >
                {data.Courier}
            </TableCell>
            <TableCell>{data.Tracking_No}</TableCell>
            <TableCell>{data.Weight}</TableCell>
            <TableCell>{data.Depth}</TableCell>
            <TableCell>{data.Width}</TableCell>
            <TableCell>{data.Height}</TableCell>
            <TableCell>{data.Dimension}</TableCell>
            <TableCell>{data.Category_Name}</TableCell>
            <TableCell>{data.Quantity}</TableCell>
            <TableCell>{data.Member_No}</TableCell>
            <TableCell>{data.Division}</TableCell>
            <TableCell>{data.Charged_remark}</TableCell>
            <TableCell>{data.Stock_Date}</TableCell>
            <TableCell>{data.Packaging_Date}</TableCell>
            <TableCell className="sticky" key={data.Tracking_No}>
                <Tooltip title="Approve">
                    <IconButton style={{ backgroundColor: "#f2f2f3 " }}><CheckIcon /></IconButton>
                </Tooltip>
            </TableCell>
        </>
    )
}

function editOrderPage(data, index) {
    return (
        <>

        </>
    )
}

function onTableRowClick(event, row) {
    console.log(row)
    console.log(this.props)
    this.setState({ openModal: true, selectedRows: row });
    return <Link to={{ pathname: `/EditStockGoods`, props: row }}></Link>

}

function onAddButtonClick() {
    console.log('add button')
}

function onDeleteButtonClick(items) {
    console.log('delete button')
    console.log(items)
}


function Table1() {

    return (
        <div>
            <TableComponents
                // table settings 
                // tableTopLeft={<h3 style={{ fontWeight: 600 }}>Table Name</h3>}  // optional, it can pass as string or as children elements
                // tableTopRight={
                //     <Tooltip title="Delete">
                //         <IconButton >
                //             {/* <AddIcon /> */}
                //         </IconButton>
                //     </Tooltip>}                 // optional, it will brings the elements to the table's top right corner

                tableOptions={{
                    dense: true,                // optional, default is false
                    tableOrderBy: 'asc',        // optional, default is asc
                    sortingIndex: "fat",          // optional, default is 300px
                }}

                tableHeaders={headCells}        //required
                tableRows={{
                    renderTableRows: renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                    checkbox: true,                          // optional, by default is true
                    checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                    onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                }}
                selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                Data={rows}                                  // required, the data that listing in the table
                onTableRowClick={onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                onActionButtonClick={onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                onDeleteButtonClick={onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
            />
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

const TabsHeaders = ["Pending Order", "Order Verified"]
const TabsBody = [<Table1 />, <Table2 />]
const TabsSettings = {
    Headers: TabsHeaders,
    Body: TabsBody
}
class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        onTableRowClick = onTableRowClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleSearchfilter = () => {
        console.log(this.state.selectedRows)
        this.setState({ open: !this.state.open })
    }

    handleCancel = (condition) => {
        console.log(this.props)
        if (condition !== "filter") {
            this.setState({ openModal: !this.state.openModal })
        } else this.setState({ open: !this.state.open })
    }

    render() {
        const { open, openModal } = this.state
        return (
            <div className="container-fluid">
                <ModalPopOut
                    open={open}
                    classes='true'
                    onBackdropClick={() => console.log('backdrop')}
                    handleToggleDialog={() => this.handleCancel("filter")}
                    handleConfirmFunc={this.handleSearchfilter}
                    title={"Please key in the container number and date"}
                    message={<div className="row ">
                        <div className="col-sm-6 col-12">
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { mt: 1, mb: 1 },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField id="outlined-basic" fullWidth label="Container Number" variant="outlined" />
                            </Box>
                        </div>
                        <div className="col-sm-6 col-12">
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { mt: 1, mb: 1 },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <ResponsiveDatePickers title="Date" />
                            </Box>
                        </div>
                    </div>}
                />
                {/* {console.log(openModal)} */}
                {openModal ? (<ModalPopOut
                    open={openModal}
                    onBackdropClick={() => console.log('backdrop')}
                    handleToggleDialog={() => this.handleCancel("form")}
                    handleConfirmFunc={this.handleSearchfilter}
                    // title={"Please make sure all the "}
                    message={<EditStockGoods data={this.state.selectedRows} />}
                />) : ("")}
                <div>
                    <div className="row">
                        <div className="col-xl-11 col-lg-10 col-md-10 col-sm-9 col-9">
                            <div className="row">
                                <div className="col-12">
                                    <SearchBar placeholder={"Search anything"} />
                                </div>
                                <div className="col-6 mt-2 mb-md-2">  <ResponsiveDatePickers title="Date" /></div>
                                <div className="col-6 mt-2">  <SearchBar placeholder={"Search container number"} /></div>
                            </div>
                        </div>
                        <div className="col-xl-1 col-lg-2 col-md-2 col-sm-3 col-3 d-flex align-middle mb-2">
                            <Tooltip title="Add new order">
                                <IconButton>
                                    <ControlPointIcon sx={{ fontSize: "9.5vh" }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='w-100'>
                        <FullWidthTabs settings={TabsSettings} />
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockGoods);