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
import ToggleTabsComponent from "../../../components/ToggleTabsComponent/ToggleTabComponents";

function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllStock: (props) => dispatch(GitAction.CallFetchAllStock(props)),
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
        label: 'Dimension (m)',
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
    key: "All",
    openModal: false,
    selectedRows: []
}

// function createData(Courier,
//     Tracking_No,
//     Weight,
//     Depth,
//     Width,
//     Height,
//     Dimension,
//     Category_Name,
//     Quantity,
//     Member_No,
//     Division,
//     Charged_remark,
//     Stock_Date,
//     Packaging_Date, Approve) {
//     return {
//         Courier,
//         Tracking_No,
//         Weight,
//         Depth,
//         Width,
//         Height,
//         Dimension,
//         Category_Name,
//         Quantity,
//         Member_No,
//         Division,
//         Charged_remark,
//         Stock_Date,
//         Packaging_Date,
//         Approve
//     };
// }

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
            <TableCell>{data.TrackingNumber}</TableCell>
            <TableCell>{data.ProductWeight}</TableCell>
            <TableCell>{data.ProductDimensionDeep}</TableCell>
            <TableCell>{data.ProductDimensionWidth}</TableCell>
            <TableCell>{data.ProductDimensionHeight}</TableCell>
            {/* <TableCell>{data.Dimension}</TableCell> */}
            <TableCell>{data.ProductDimensionDeep}x{data.ProductDimensionWidth}x{data.ProductDimensionHeight}</TableCell>
            <TableCell>{data.Category_Name}</TableCell>
            <TableCell>{data.Quantity}</TableCell>
            <TableCell>{data.UserCode}</TableCell>
            <TableCell>{data.UserAreaID}</TableCell>
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

function onTableRowClick(event, row) {
    this.setState({ openModal: true, selectedRows: row });
    return <Link to={{ pathname: `/EditStockGoods`, props: row }}></Link>

}

function onAddButtonClick() {
    console.log('add button')
}

function onDeleteButtonClick(items) {
    console.log('delete button')
}

class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        onTableRowClick = onTableRowClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.changeTab = this.changeTab.bind(this)
        onAddButtonClick = onAddButtonClick.bind(this)
    }

    componentDidMount() {
        // this.props.CallFetchAllStock(localStorage.getItem("loginUser").UserID);
        this.props.CallFetchAllStock({ USERID: "1" });
        //check all value in local storage
        //     var values = [],
        //     keys = Object.keys(localStorage),
        //     i = keys.length;

        // while ( i-- ) {
        //     values.push( localStorage.getItem(keys[i]) );
        // }
        // console.log(values)
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleSearchfilter = () => {
        console.log(this.state.selectedRows)
        this.setState({ open: !this.state.open })
    }

    changeTab = (key) => {
        console.log(key)
        switch (key) {
            case "All":
                console.log("all")
                // this.props.stocks.map((stock, index) => { if (stock.TrackingStatusID === 1) { return stock } else { } })
                break;

            case "Unchecked":
                console.log("Unchecked")
                this.props.stocks.map((stock, index) => { if (stock.TrackingStatusID === 0) { console.log(stock);return stock } else { } })
                break;

            case "Checked":
                console.log("Checked")
                this.props.stocks.map((stock, index) => { if (stock.TrackingStatusID === 1) { console.log(stock); return stock } else { } })
                break;

            default:
                break;
        }
    }

    handleCancel = (condition) => {
        console.log(this.props)
        if (condition !== "filter") {
            this.setState({ openModal: !this.state.openModal })
        } else this.setState({ open: !this.state.open })
    }

    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" }
        ]

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

                {openModal &&
                    <ModalPopOut
                        open={openModal}
                        onBackdropClick={() => console.log('backdrop')}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={this.handleSearchfilter}
                        message={
                            <EditStockGoods data={this.state.selectedRows} />
                        }
                    />
                }
                <div>
                    <div className="row">

                        <div className="col-6 mt-2 mb-md-2">  <ResponsiveDatePickers title="Date" /></div>
                        <div className="col-6 mt-2">  <SearchBar placeholder={"Search container number"} /></div>
                        
                    </div>

                    <div className='w-100'>
                        <ToggleTabsComponent Tabs={ToggleTabs} onChange={() => this.changeTab()} size="small" />
                            <SearchBar placeholder={"Search anything"} />
                        <TableComponents
                            tableTopLeft={<h3 style={{ fontWeight: 700 }}>Stocks</h3>}
                            tableTopRight={this.renderTableActionButton}

                            tableOptions={{
                                dense: false,
                                tableOrderBy: 'asc',
                                sortingIndex: "fat",
                                stickyTableHeader: true,
                                stickyTableHeight: 300,
                            }}
                            paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]}
                            tableOptions={{
                                dense: true,
                                tableOrderBy: 'asc',
                                sortingIndex: "fat",
                            }}

                            tableHeaders={headCells}
                            tableRows={{
                                renderTableRows: renderTableRows,
                                checkbox: true,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            selectedIndexKey={"pid"}
                            Data={this.props.stocks}
                            onTableRowClick={onTableRowClick}
                            onActionButtonClick={onAddButtonClick}
                            onDeleteButtonClick={onDeleteButtonClick}
                        />
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockGoods);