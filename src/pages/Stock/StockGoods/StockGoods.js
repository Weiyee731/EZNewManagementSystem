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
import { isStringNullOrEmpty, getWindowDimensions, isArrayNotEmpty, isObjectUndefinedOrNull } from "../../../tools/Helpers";
import { toast } from "react-toastify";

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
    // {
    //     id: 'Courier',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Courier',
    // },
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
    // {
    //     id: 'Category_Name',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Category Name',
    // },
    {
        id: 'Item',
        numeric: true,
        disablePadding: false,
        label: 'Item',
    },
    {
        id: 'Member_No',
        numeric: true,
        disablePadding: false,
        label: 'Member No',
    },
    {
        id: 'AreaCode',
        numeric: true,
        disablePadding: false,
        label: 'Division',
    },
    {
        id: 'PackagingDate',
        numeric: true,
        disablePadding: false,
        label: 'Packaging Date',
    },
    {
        id: 'StockDate',
        numeric: true,
        disablePadding: false,
        label: 'Stock Date',
    },
    {
        id: 'ContainerName',
        numeric: true,
        disablePadding: false,
        label: 'Container',
    },
    {
        id: 'AdditionalCharges',
        numeric: true,
        disablePadding: false,
        label: 'Additional Charges',
    },
    {
        id: 'Remark',
        numeric: true,
        disablePadding: false,
        label: 'Remarks',
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
    selectedStocks: [],
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
    ContainerDate: "",
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

function onAddButtonClick() {
    this.setState({ openAddModal: true })
}
class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        // this.props.CallFetchAllStock({USERID:JSON.parse(localStorage.getItem("loginUser"))[0].UserID});
        this.props.CallFetchAllStock({ USERID: "1" });
        this.props.CallViewContainer();  //view container
        this.state.stockListing = this.props.Stocks;

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

        if (!isArrayNotEmpty(this.state.stockFiltered === null) && isArrayNotEmpty(this.props.Stocks)) {
            const { Stocks } = this.props
            this.setState({
                stockFiltered: (isStringNullOrEmpty(Stocks.ReturnVal) && Stocks.ReturnVal === 0) ? [] : Stocks
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.AllContainer.length !== this.props.AllContainer.length) {
            if (this.props.AllContainer !== undefined && this.props.AllContainer[0] !== undefined) {
                this.setState({ options: this.props.AllContainer });
            } else { console.log("match wo") }
        }

        if (this.state.stockFiltered === [] && isArrayNotEmpty(this.props.Stocks)) {
            const { Stocks } = this.props
            this.setState({
                stockFiltered: (isStringNullOrEmpty(Stocks.ReturnVal) && Stocks.ReturnVal === 0) ? [] : Stocks
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

    onDeleteButtonClick = () => {
        const { selectedStocks } = this.state
        let StockID = []
        let TrackingNumber = []
        let ProductWeight = []
        let ProductDimensionHeight = []
        let ProductDimensionWidth = []
        let ProductDimensionDeep = []
        let AreaCode = []
        let UserCode = []
        let Item = []
        let TRACKINGSTATUSID = []
        let ContainerName = []
        let ContainerDate = []
        let Remark = []
        let AdditionalCharges = []
        //status id ===2
        selectedStocks.map((row) => {
            StockID.push(row.StockID)
            TrackingNumber.push(row.TrackingNumber)
            ProductWeight.push(row.ProductWeight)
            ProductDimensionHeight.push(row.ProductDimensionHeight)
            ProductDimensionWidth.push(row.ProductDimensionWidth)
            ProductDimensionDeep.push(row.ProductDimensionDeep)
            AreaCode.push(row.AreaCode)
            UserCode.push(row.UserCode)
            Item.push(row.Item)
            TRACKINGSTATUSID.push(2)
            ContainerName.push(this.state.ContainerName)
            ContainerDate.push(this.state.ContainerDate)
            Remark.push(row.Remark)
            AdditionalCharges.push(row.AdditionalCharges)
        })

        this.props.CallUpdateStockDetailByPost(
            {
                StockID: StockID.join(","),
                TrackingNumber: TrackingNumber.join(","),
                ProductWeight: ProductWeight.join(","),
                ProductDimensionHeight: ProductDimensionHeight.join(","),
                ProductDimensionWidth: ProductDimensionWidth.join(","),
                ProductDimensionDeep: ProductDimensionDeep.join(","),
                AreaCode: AreaCode.join(","),
                UserCode: UserCode.join(","),
                Item: Item.join(","),
                TRACKINGSTATUSID: TRACKINGSTATUSID.join(","),
                ContainerName: ContainerName.join(","),
                ContainerDate: ContainerDate.join(","),
                Remark: Remark.join(","),
                AdditionalCharges: AdditionalCharges.join(",")
            }, () => this.props.CallFetchAllStock({ USERID: "1" }))
    }

    renderTableRows(data, index) {
        const fontsize = '9pt'
        var dimension = data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight;
        const renderAdditionalCost = (charges) => {
            let renderStrings = ""
            try {
                charges = JSON.parse(charges)
                charges.length > 0 && charges.map(el => { renderStrings = renderStrings + el.Charges + ": " + el.Value + "; " })
                return renderStrings
            }
            catch (e) {
                return renderStrings
            }
        }

        return (
            <>
                {/* <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                    sx={{ fontSize: fontsize }}
                >
                    {data.Courier}
                </TableCell> */}
                <TableCell sx={{ fontSize: fontsize }}>{data.TrackingNumber}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.ProductWeight}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.ProductDimensionDeep}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.ProductDimensionWidth}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.ProductDimensionHeight}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{dimension}</TableCell>
                {/* <TableCell sx={{ fontSize: fontsize }}>{data.Category_Name}</TableCell> */}
                <TableCell sx={{ fontSize: fontsize }}>{data.Item}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.UserCode}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.AreaCode + " - " + data.AreaName}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.PackagingDate}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.StockDate}</TableCell>
                <TableCell sx={{ fontSize: fontsize }}>{data.ContainerName}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{!isStringNullOrEmpty(data.AdditionalCharges) && renderAdditionalCost(data.AdditionalCharges)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Remark}</TableCell>
                <TableCell className="sticky" key={data.Tracking_No} sx={{ fontSize: fontsize }}>
                    <Tooltip title="Approve">
                        <IconButton style={{ backgroundColor: "#f2f2f3 " }}><CheckIcon /></IconButton>
                    </Tooltip>
                </TableCell>
            </>
        )
    }

    onTableRowClick(event, row) {
        this.setState({
            openEditModal: true,
            selectedRows: row,
        });
    }

    handleSearchfilter = (filter) => {
        switch (filter) {
            case "open":
                if ((this.state.ContainerName && this.state.ContainerDate) !== "" || undefined) {
                    this.setState({ open: !this.state.open });
                }
                else { toast.warning("Please fill in the all the details before proceed") }

                break;

            case "openEditModal":
                this.setState({ openEditModal: !this.state.openEditModal });
                this.props.CallUpdateStockDetailByPost({
                    StockID: this.state.selectedRows.StockID,
                    TrackingNumber: this.state.TrackingNumber,
                    ProductWeight: this.state.ProductWeight,
                    ProductDimensionHeight: this.state.ProductDimensionHeight,
                    ProductDimensionWidth: this.state.ProductDimensionWidth,
                    ProductDimensionDeep: this.state.ProductDimensionDeep,
                    AreaCode: this.state.AreaCode,
                    UserCode: this.state.UserCode,
                    Item: this.state.Item,
                    TRACKINGSTATUSID: 2,
                    ContainerName: this.state.ContainerName,
                    ContainerDate: this.state.ContainerDate,
                    Remark: this.state.Remark,
                    AdditionalCharges: this.state.AdditionalCharges
                }, () => this.props.CallFetchAllStock({ USERID: "1" }))
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

            const FilterArr = this.state.stockListing.filter((searchedItem) =>
                searchedItem.TrackingNumber.toLowerCase().includes(e.target.value.toLowerCase()) ||
                searchedItem.UserCode.includes(e.target.value.toLowerCase()))
            // isStringNullOrEmpty(searchedItem.AreaCode) ? "" : (searchedItem.AreaCode.toLowerCase().includes(e.target.value.toLowerCase())

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

    renderTableActionButton = () => {
        return (
            <IconButton onClick={(event) => { this.onDeleteButtonClick() }}>
                <CheckIcon />
            </IconButton>
        )
    }

    onSelectRow = (items) => {
        this.setState({
            selectedStocks: items
        })
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
                    showCancel={false}
                    handleToggleDialog={() => this.handleCancel("filter")}
                    handleConfirmFunc={() => this.handleSearchfilter("open")}
                    title={"Please select the container number and date desired"}
                    message={<div className="row ">
                        <div className="col-sm-6 col-12">

                            <ResponsiveDatePickers title="Date" value={this.state.datevalue ? this.state.datevalue : ""} onChange={(e) => this.onDateChange(e)} />

                        </div>

                        <div className="col-sm-6 col-12">
                            <Autocomplete
                                key={options.ContainerID}
                                options={options}
                                noOptionsText="Enter to create a new option"
                                getOptionLabel={(option) => option.ContainerName ? option.ContainerName : option.ReturnMsg}
                                onInputChange={(e, newValue) => {
                                    this.setState({ ContainerName: newValue });
                                }}
                                renderInput={(params, idx) => (
                                    <TextField
                                        {...params}
                                        label="Select"
                                        variant="standard"
                                        key={idx}
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
                        showCancel={true}
                        open={openEditModal}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={() => this.handleSearchfilter("openEditModal")}
                        message={
                            <EditStockGoods data={this.state.selectedRows} ContainerDate={this.state.ContainerDate ? this.state.ContainerDate : ""} ContainerName={this.state.ContainerName ? this.state.ContainerName : ""} parentCallback={this.handleCallback} />
                        }
                    ></ModalPopOut>

                }
                {openAddModal &&
                    <ModalPopOut
                        showCancel={true}
                        open={openAddModal}
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
                            actionIcon={this.renderTableActionButton()}

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
                                renderTableRows: this.renderTableRows,
                                checkbox: true,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            selectedIndexKey={"StockID"}
                            Data={this.state.stockFiltered ? this.state.stockFiltered : []}
                            onTableRowClick={this.onTableRowClick}
                            onActionButtonClick={onAddButtonClick}
                            onSelectRow={this.onSelectRow}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockGoods);