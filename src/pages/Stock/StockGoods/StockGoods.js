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
import { isStringNullOrEmpty, getWindowDimensions, isArrayNotEmpty } from "../../../tools/Helpers";

function mapStateToProps(state) {
    return {
        Stocks: state.counterReducer["stocks"],
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
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
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

    newcontainer: "",
    // datevalue
    options: [],
    childData: [],
    // TrackingNumber: "",
    openAddModal: false,

    ContainerName: "",
    ContainerDate: new Date(),
    TrackingNumber: "",
    UserCode: "",
    ProductDimensionWidth: "",
    ProductDimensionHeight: "",
    ProductDimensionDeep: "",
    ProductWeight: "",
    AreaCode: "",
    Item: "null",
    AdditionalCharges: "0",
    Remark: "no",
}


function renderTableRows(data, index) {
    const fontsize = '9pt'
    var dimension = data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight;
    return (
        <>
            <TableCell
                component="th"
                id={`enhanced-table-checkbox-${index}`}
                scope="row"
                padding="normal"
                sx={{ fontSize: fontsize }}
            >
                {data.Courier}
            </TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.TrackingNumber}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.ProductWeight}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.ProductDimensionDeep}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.ProductDimensionWidth}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.ProductDimensionHeight}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{dimension}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.Category_Name}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.Quantity}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.UserCode}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.AreaCode}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.Remark}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.StockDate}</TableCell>
            <TableCell sx={{ fontSize: fontsize }}>{data.PackagingDate}</TableCell>
            <TableCell className="sticky" key={data.Tracking_No} sx={{ fontSize: fontsize }}>
                <Tooltip title="Approve">
                    <IconButton style={{ backgroundColor: "#f2f2f3 " }}><CheckIcon /></IconButton>
                </Tooltip>
            </TableCell>
        </>
    )
}



function onAddButtonClick() {
    this.setState({ openAddModal: true })
}

function onDeleteButtonClick(items) {
}

class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        // this.props.CallFetchAllStock({USERID:JSON.parse(localStorage.getItem("loginUser"))[0].UserID});
        this.props.CallFetchAllStock({ USERID: "1" });
        this.props.CallViewContainer();  //view container


        this.onTableRowClick = this.onTableRowClick.bind(this);
        onAddButtonClick = onAddButtonClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.onContainerChange = this.onContainerChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
    }

    componentDidMount() {
        if (this.state.options !== this.props.AllContainer) {
            this.setState({ options: this.props.AllContainer })
        } //set container return to the state: option

        if (this.props.Stocks.length !== this.state.stockListing.length) {
            if (this.props.Stocks !== undefined && this.props.Stocks[0] !== undefined && this.props.ReturnVal !== "0") {
                this.setState({ stockListing: this.props.Stocks, stockFiltered: this.props.Stocks });
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

        if (this.state.stockFiltered === null && isArrayNotEmpty(this.props.Stocks)) {
            const { Stocks } = this.props
            console.log(Stocks)
            this.setState({
                stockFiltered: (isStringNullOrEmpty(Stocks.ReturnVal) && Stocks.ReturnVal == 0) ? [] : Stocks
            })
        }

        if (prevProps.Stocks.length !== this.props.Stocks.length) {
            if (this.props.Stocks !== undefined && this.props.Stocks[0] !== undefined) {
                this.setState({ stockFiltered: this.props.Stocks });
            } else { console.log("match") }
        }
        else {
            //     if (prevProps.Stocks.length !== this.state.stockFiltered.length) {
            //         this.setState({ stockFiltered: prevProps.Stocks });
            //     }
        }
        if (prevState.selectedRows !== this.state.selectedRows) {
            if (this.state.selectedRows !== undefined) {
                this.setState({
                    TrackingNumber: this.state.selectedRows.TrackingNumber,
                    UserCode: this.state.selectedRows.UserCode,
                    ProductDimensionWidth: this.state.selectedRows.ProductDimensionWidth,
                    ProductDimensionHeight: this.state.selectedRows.ProductDimensionHeight,
                    ProductDimensionDeep: this.state.selectedRows.ProductDimensionDeep,
                    AreaCode: this.state.selectedRows.AreaCode,
                    Item: isStringNullOrEmpty(this.state.selectedRows.Item) ? "no item" : this.state.selectedRows.Item,
                    AdditionalCharges: isStringNullOrEmpty(this.state.selectedRows.AdditionalCharges) ? "0" : this.state.selectedRows.AdditionalCharges,
                    Remark: isStringNullOrEmpty(this.state.selectedRows.Remark) ? "no remark" : this.state.selectedRows.Remark,
                    ProductWeight: this.state.selectedRows.ProductWeight,
                })
            }
        }
    }

    onTableRowClick(event, row) {
        this.setState({
            openEditModal: true,
            selectedRows: row,
        });
        // return <Link to={{ pathname: `/EditStockGoods`, props: row }}></Link>
    }

    handleSearchfilter = (filter) => {
        switch (filter) {
            case "open":
                this.setState({ open: !this.state.open });
                break;

            case "openEditModal":
                this.setState({ openEditModal: !this.state.openEditModal });
                this.props.CallUpdateStockDetailByPost({
                    STOCKID: this.state.selectedRows.StockID,
                    TRACKINGNUMBER: this.state.TrackingNumber,
                    PRODUCTWEIGHT: this.state.ProductWeight,
                    PRODUCTHEIGHT: this.state.ProductDimensionHeight,
                    PRODUCTWIDTH: this.state.ProductDimensionWidth,
                    PRODUCTDEEP: this.state.ProductDimensionDeep,
                    AREACODE: this.state.AreaCode,
                    USERCODE: this.state.UserCode,
                    ITEM: this.state.Item,
                    TRACKINGSTATUSID: 1,
                    CONTAINERNAME: this.state.ContainerName,
                    CONTAINERDATE: this.state.ContainerDate,
                    REMARK: this.state.Remark,
                    EXTRACHARGE: this.state.AdditionalCharges
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
                this.setState({ stockFiltered: this.props.Stocks ? this.props.Stocks : "" });
                break;

            case "Unchecked":

                const FilterArr = this.props.Stocks.filter((searchedItem) => searchedItem.TrackingStatusID === 1)
                this.setState({ stockFiltered: FilterArr });
                break;

            case "Checked":
                const FilterArr2 = this.props.Stocks.filter((searchedItem) => searchedItem.TrackingStatusID === 2)
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
        if (e.target.value !== "") { this.setState({ stockFiltered: this.props.Stocks, ContainerName: e.target.value }); }
        else {
            this.setState({ stockFiltered: this.props.Stocks, ContainerName: e.target.value })
        }
    }

    onDateChange = (e, type) => {
        if (e !== "") {

            this.setState({ ContainerDate: new Date(e).toLocaleDateString('en-GB'), datevalue: e })
        }
        else {
        }
    }

    onSearchChange = (e, type) => {

        if (e.target.value !== ""
            //  &&
            // this.state.stockListing[0].ReturnVal !== undefined &&
            // this.state.stockListing[0].ReturnVal !== "0"
        ) {
            const FilterArr = this.state.stockListing.filter((searchedItem) => searchedItem.TrackingNumber.toLowerCase().includes(e.target.value.toLowerCase()) || searchedItem.UserCode.includes(e.target.value.toLowerCase()) || searchedItem.AreaCode.toLowerCase().includes(e.target.value.toLowerCase()))
            this.setState({ stockFiltered: FilterArr })
            if (FilterArr.length === 1 && FilterArr[0].TrackingNumber === e.target.value) {
                this.setState({ selectedRows: FilterArr[0], openEditModal: !this.state.openEditModal });
            }
        } else {
            this.setState({ stockFiltered: this.props.Stocks });
        }
    }

    handleCallback = (childData) => {
        this.setState({ childData: childData })
        if (childData.TrackingNumber !== null && childData.TrackingNumber !== undefined) {
            this.setState({ TrackingNumber: childData.TrackingNumber })
        }
        if (childData.UserCode !== null && childData.UserCode !== undefined) {
            this.setState({ UserCode: childData.UserCode })
        }
        if (childData.ProductDimensionWidth !== null && childData.ProductDimensionWidth !== undefined) {
            this.setState({ ProductDimensionWidth: childData.ProductDimensionWidth })
        }
        if (childData.ProductDimensionHeight !== null && childData.ProductDimensionHeight !== undefined) {
            this.setState({ ProductDimensionWidth: childData.ProductDimensionHeight })
        }
        if (childData.ProductDimensionDeep !== null && childData.ProductDimensionDeep !== undefined) {
            this.setState({ ProductDimensionDeep: childData.ProductDimensionDeep })
        }
        if (childData.ProductWeight !== null && childData.ProductWeight !== undefined) {
            this.setState({ ProductWeight: childData.ProductWeight })
        }
        if (childData.Item !== null && childData.Item !== undefined) {
            this.setState({ Item: childData.Item })
        }
        if (childData.AreaCode !== null && childData.AreaCode !== undefined) {
            this.setState({ AreaCode: childData.AreaCode })
        }
        if (childData.AdditionalCharges !== null && childData.AdditionalCharges !== undefined) {
            this.setState({ AdditionalCharges: childData.AdditionalCharges })
        }
        if (childData.Remark !== null && childData.Remark !== undefined) {
            this.setState({ Remark: childData.Remark })
        }

    }

    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" }
        ]

        const { open, openEditModal, openAddModal, options } = this.state
        return (
            <div className="container-fluid">
                <ModalPopOut
                    open={open}
                    classes='true'
                    // onBackdropClick={() => console.log('backdrop')}
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
                                getOptionLabel={(option) => option.ContainerName ? option.ContainerName : option.ReturnMsg}
                                onInputChange={(e, newValue) => {
                                    this.setState({ ContainerName: newValue });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select"
                                        variant="standard"
                                        onKeyDown={(e) => {

                                            if (
                                                e.key === "Enter"
                                                && options.ReturnVal !== 0
                                                &&
                                                options.findIndex((o) => o.ContainerName === e.target.value) === -1
                                            ) {

                                                this.setState({
                                                    options: this.state.options.concat({ ContainerName: e.target.value, ContainerDate: this.state.ContainerDate })
                                                }, () => { console.log(this.state.options) })
                                                // this.state.options.push({ ContainerName: e.target.value, ContainerDate: this.state.ContainerDate })
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
                        // onBackdropClick={() => console.log('backdrop')}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={() => this.handleSearchfilter("openEditModal")}
                        message={
                            <EditStockGoods data={this.state.selectedRows} parentCallback={this.handleCallback} />
                        }
                    ></ModalPopOut>

                }
                {openAddModal &&
                    <ModalPopOut
                        open={openAddModal}
                        // onBackdropClick={() => console.log('backdrop')}
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

                            <TextField id="outlined-basic" value={this.state.ContainerName ? this.state.ContainerName : ""} fullWidth label="Container Number" variant="standard" />

                        </div>
                    </div>

                    <div className='w-100'>
                        <ToggleTabsComponent Tabs={ToggleTabs} onChange={(e) => this.changeTab(e)} size="small" />
                        <SearchBar placeholder={"Search anything"} autoFocus={true} onChange={(e) => this.onSearchChange(e)} />
                        <TableComponents
                            tableTopLeft={<h3 style={{ fontWeight: 700 }}>Stocks</h3>}
                            tableTopRight={this.renderTableActionButton}

                            tableOptions={{
                                dense: true,
                                tableOrderBy: 'asc',
                                sortingIndex: "TrackingNo",
                                stickyTableHeader: true,
                                stickyTableHeight: (getWindowDimensions().screenHeight * 0.7),
                            }}
                            paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]}


                            tableHeaders={headCells}
                            tableRows={{
                                renderTableRows: renderTableRows,
                                checkbox: true,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            selectedIndexKey={"StockID"}
                            Data={this.state.stockFiltered ? this.state.stockFiltered : []}
                            onTableRowClick={this.onTableRowClick}
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