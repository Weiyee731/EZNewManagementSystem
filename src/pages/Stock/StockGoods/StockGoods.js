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
import TextField from '@mui/material/TextField';
import ResponsiveDatePickers from '../../../components/datePicker/datePicker';
import CheckIcon from '@mui/icons-material/Check';
import '../../../scss/stock.scss';
import { Link } from 'react-router-dom';
import EditStockGoods from "./EditStockGoods";
import ToggleTabsComponent from "../../../components/ToggleTabsComponent/ToggleTabComponents";
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';

function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
        stockApproval: state.counterReducer["stockApproval"],
        AllContainer: state.counterReducer["AllContainer"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllStock: (props) => dispatch(GitAction.CallFetchAllStock(props)),
        CallUpdateStockStatus: (props) => dispatch(GitAction.CallUpdateStockStatus(props)),
        CallViewContainer: (props) => dispatch(GitAction.CallViewContainer(props)),
        CallUpdateStockDetailByPost: (props) => dispatch(GitAction.CallUpdateStockDetailByPost(props)),
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
        label: 'Dimension (m^3)',
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
        className: "sticky"
    },
];

const INITIAL_STATE = {
    open: true,
    key: "All",
    openEditModal: false,
    selectedRows: [],
    stockListing: [],
    stockFiltered: [],
    container: "",
    date: new Date(),
    newcontainer: "",
    // datevalue
    options: [],
    childData: [],
    TrackingNumber: "",
    openAddModal: false,
}


function renderTableRows(data, index) {
    var dimension = data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight;
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
            <TableCell>{dimension}</TableCell>
            <TableCell>{data.Category_Name}</TableCell>
            <TableCell>{data.Quantity}</TableCell>
            <TableCell>{data.UserCode}</TableCell>
            <TableCell>{data.AreaCode}</TableCell>
            <TableCell>{data.Remark}</TableCell>
            <TableCell>{data.StockDate}</TableCell>
            <TableCell>{data.PackagingDate}</TableCell>
            <TableCell className="sticky" key={data.Tracking_No}>
                <Tooltip title="Approve">
                    <IconButton style={{ backgroundColor: "#f2f2f3 " }}><CheckIcon /></IconButton>
                </Tooltip>
            </TableCell>
        </>
    )
}

function onTableRowClick(event, row) {
    console.log(row)
    this.setState({ openEditModal: true, selectedRows: row });
    // return <Link to={{ pathname: `/EditStockGoods`, props: row }}></Link>

}

function onAddButtonClick() {
    console.log('add button')
    this.setState({ openAddModal: true })
}

function onDeleteButtonClick(items) {
    console.log('delete button')
}

class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        onTableRowClick = onTableRowClick.bind(this);
        onAddButtonClick = onAddButtonClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.onSearchTrackingNumchange = this.onSearchTrackingNumchange.bind(this);
        this.onContainerChange = this.onContainerChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
    }

    componentDidMount() {
        // this.props.CallFetchAllStock({USERID:JSON.parse(localStorage.getItem("loginUser"))[0].UserID});
        this.props.CallViewContainer();  //view container
        if (this.state.options !== this.props.AllContainer) {
            this.setState({ options: this.props.AllContainer })
        } //set container return to the state: option

        this.props.CallFetchAllStock({ USERID: "1" });
        if (this.props.stocks.length !== this.state.stockListing.length) {
            if (this.props.stocks !== undefined && this.props.stocks[0] !== undefined && this.props.ReturnVal !== "0") {
                this.setState({ stockListing: this.props.stocks, stockFiltered: this.props.stocks });
            } else { console.log(("no")) }
        } else { console.log(("no")) }
    }

    componentDidUpdate(prevProps, prevState) {
       
        if (prevProps.AllContainer.length !== this.props.AllContainer.length) {
            if (this.props.AllContainer !== undefined && this.props.AllContainer[0] !== undefined) {
                this.setState({ options: this.props.AllContainer });
                console.log("1", this.state.options)
            } else { console.log("match wo") }
        }
        if (prevProps.stocks.length !== this.props.stocks.length) {
            // console.log(this.props.stocks !== undefined && this.props.stocks[0] !== undefined)
            if (this.props.stocks !== undefined && this.props.stocks[0] !== undefined) {
                this.setState({ stockListing: this.props.stocks });
            } else { console.log("match") }
        }
        else {
            //     if (prevProps.stocks.length !== this.state.stockFiltered.length) {
            //         this.setState({ stockFiltered: prevProps.stocks });
            //     }
        }
    }

    handleSearchfilter = (filter) => {
        switch (filter) {
            case "open":
                this.setState({ open: !this.state.open });
                break;

            case "openEditModal":

                this.setState({ openEditModal: !this.state.openEditModal });
                console.log(this.state.selectedRows)
                // this.props.CallUpdateStockStatus({ STOCKID: this.state.selectedRows.StockID, CONTAINERNAME: this.state.container, CONTAINERDATE: this.state.date })
                this.props.CallUpdateStockDetailByPost({
                    STOCKID: this.state.selectedRows.StockID,
                    TRACKINGNUMBER: this.state.selectedRows.TRACKINGNUMBER,
                    PRODUCTWEIGHT: this.state.selectedRows.PRODUCTWEIGHT,
                    PRODUCTHEIGHT: this.state.selectedRows.PRODUCTHEIGHT,
                    PRODUCTWIDTH: this.state.selectedRows.PRODUCTWIDTH,
                    PRODUCTDEEP: this.state.selectedRows.PRODUCTDEEP,
                    AREACODE: this.state.selectedRows.AREACODE,
                    ITEM: this.state.selectedRows.USERCODE,
                    ITEM: this.state.selectedRows.USERCODE,
                    TRACKINGSTATUSID: this.state.selectedRows.TRACKINGSTATUSID,
                    CONTAINERNAME: this.state.container,
                    CONTAINERDATE: this.state.date,
                    REMARK: this.state.selectedRows.REMARK,
                    EXTRACHARGE: this.state.selectedRows.EXTRACHARGE
                })
                break;

            case "openAddModal":
                this.setState({ openAddModal: !this.state.openAddModal });
                break;

            default:
                break;
        }
    }

    changeTab = (key) => {
        switch (key) {
            case "All":
                console.log("all")
                this.setState({ stockFiltered: this.props.stocks ? this.props.stocks : "" });
                break;

            case "Unchecked":

                const FilterArr = this.props.stocks.filter((searchedItem) => searchedItem.TrackingStatusID === 1)
                this.setState({ stockFiltered: FilterArr });
                console.log(this.state.stockFiltered)
                break;

            case "Checked":
                console.log("Checked")
                const FilterArr2 = this.props.stocks.filter((searchedItem) => searchedItem.TrackingStatusID === 2)
                this.setState({ stockFiltered: FilterArr2 });
                break;

            default:
                break;
        }
    }

    handleCancel = (condition) => {
        if (condition !== "filter") {
            this.setState({ openEditModal: !this.state.openEditModal })
        } else this.setState({ open: !this.state.open })
    }

    onContainerChange = (e, type) => {
        if (e.target.value !== "") { console.log("container", e.target.value); this.setState({ stockFiltered: this.props.stocks, container: e.target.value }); }
        else {
            this.setState({ stockFiltered: this.props.stocks, container: e.target.value })
        }
    }

    onDateChange = (e, type) => {
        if (e !== "") {
            console.log("date", new Date(e).toLocaleDateString('en-GB'));
            console.log(this.state.date)
            this.setState({ date: new Date(e).toLocaleDateString('en-GB'), datevalue: e })
        }
        else {
        }
    }

    onSearchChange = (e, type) => {
        if (e.target.value !== "" &&
            // this.state.stockListing[0].ReturnVal !== undefined &&
            this.state.stockListing[0].ReturnVal !== "0") {
            const FilterArr = this.state.stockListing.filter((searchedItem) => searchedItem.TrackingNumber.toLowerCase().includes(e.target.value.toLowerCase()) || searchedItem.UserCode.includes(e.target.value.toLowerCase()) || searchedItem.AreaCode.toLowerCase().includes(e.target.value.toLowerCase()) || searchedItem.AreaName.toLowerCase().includes(e.target.value.toLowerCase()))
           
            console.log(FilterArr)
            console.log(this.state.stockFiltered)
            if (FilterArr.length === 1) {
                this.setState({ stockFiltered:FilterArr[0], selectedRows: FilterArr[0], openEditModal: !this.state.openEditModal });
                // if (this.state.selectedRows.length !== 0) { this.setState({ openEditModal: !this.state.openEditModal, selectedRows: FilterArr }) }
            }
        } else {
            this.setState({ stockFiltered: this.props.stocks });
        }
    }

    onSearchTrackingNumchange = (e, type) => {
        const FilterArr = this.state.stockListing.filter((searchedItem) => searchedItem.TrackingNumber.toLowerCase().includes(e.target.value.toLowerCase()))
        if (e.target.value !== "") {
            this.state.stockFiltered.filter((searchedItem) => console.log(searchedItem.TrackingNumber.toLowerCase().includes(e.target.value)))
            this.setState({ stockFiltered: FilterArr });
            if (this.state.stockFiltered.length === 1) {
                this.setState({ selectedRows: this.state.stockFiltered, openEditModal: !this.state.openEditModal })
            }
        }
        else { this.setState({ stockFiltered: this.props.stocks }); }
    }

    handleCallback = (childData) =>{
        console.log(childData)
        if (childData === "TrackingNumber") {
            this.setState({childData: childData})
        }
        if (childData === "UserCode") {
        }
        if (childData === "ProductDimensionWidth") {
        }
        if (childData === "ProductDimensionHeight") {
           
        }
        if (childData === "ProductDimensionDeep") {
           
        }
        if (childData === "ProductWeight") {
            
        }
        if (childData === "AreaCode") {
            
        }
        if (childData === "AdditionalCharges") {
           
        }
        if (childData === "Remark") {
           
        }
      
    }

    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" }
        ]
        console.log(this.state.stockFiltered)
        const { open, openEditModal, openAddModal, options } = this.state
        return (
            <div className="container-fluid">
                <ModalPopOut
                    open={open}
                    classes='true'
                    onBackdropClick={() => console.log('backdrop')}
                    handleToggleDialog={() => this.handleCancel("filter")}
                    handleConfirmFunc={() => this.handleSearchfilter("open")}
                    title={"Please select the container number and date desired"}
                    message={<div className="row ">
                        <div className="col-sm-6 col-12">

                            <ResponsiveDatePickers title="Date" value={this.state.datevalue ? this.state.datevalue : ""} onChange={(e) => this.onDateChange(e)} />

                        </div>
                        <div className="col-sm-6 col-12">
                            <Autocomplete
                                options={options}
                                noOptionsText="Enter to create a new option"
                                getOptionLabel={(option) => option.ReturnMsg}
                                onInputChange={(e, newValue) => {
                                    this.setState({ container: newValue });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select"
                                        variant="standard"
                                        onKeyDown={(e) => {
                                            console.log(e.target.value)
                                            if (
                                                e.key === "Enter"
                                                && options.ReturnVal !== 0
                                                // &&
                                                // options.findIndex((o) => o.CONTAINERNAME === this.state.options) === -1
                                            ) {
                                                this.state.options.push({ ReturnVal: this.state.date, ReturnMsg: e.target.value })
                                                // this.setState((o)=>o.concat({title:this.state.container}))
                                            } else console.log("hi")
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>}
                />
                {openEditModal &&
                    <ModalPopOut
                        open={openEditModal}
                        onBackdropClick={() => console.log('backdrop')}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={() => this.handleSearchfilter("openEditModal")}
                        message={
                            <EditStockGoods data={this.state.selectedRows} parentCallback = {this.handleCallback}/>
                        }
                    > { console.log("22",this.state.selectedRows)}</ModalPopOut>
                    
                }
                {openAddModal &&
                    <ModalPopOut
                        open={openAddModal}
                        onBackdropClick={() => console.log('backdrop')}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={() => this.handleSearchfilter("openAddModal")}
                        message={
                            <EditStockGoods />
                        }
                    />
                }
                <div>
                    <div className="row" onClick={() => this.setState({ open: !this.state.open })}>

                        <div className="col-6 mt-2 mb-md-2">
                            <ResponsiveDatePickers title="Date" value={this.state.datevalue ? this.state.datevalue : ""} disabled readOnly onChange={(e) => this.onDateChange(e)} />
                        </div>
                        <div className="col-6 mt-2">

                            <TextField id="outlined-basic" value={this.state.container ? this.state.container : ""} fullWidth label="Container Number" variant="standard" />

                        </div>
                    </div>

                    <div className='w-100'>
                        <ToggleTabsComponent Tabs={ToggleTabs} onChange={(e) => this.changeTab(e)} size="small" />
                        <SearchBar placeholder={"Search anything"} autoFocus={true} onChange={(e) => this.onSearchChange(e)} />
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
                            selectedIndexKey={"StockID"}
                            Data={this.state.stockFiltered ? this.state.stockFiltered : []}
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