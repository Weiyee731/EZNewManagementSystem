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
import { isStringNullOrEmpty, getWindowDimensions, isArrayNotEmpty, extractNumberFromStrings, isObjectUndefinedOrNull } from "../../../tools/Helpers";
import { toast } from "react-toastify";
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

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
        CallResetUpdatedStockDetail: () => dispatch(GitAction.CallResetUpdatedStockDetail()),
        CallResetStocks: () => dispatch(GitAction.CallResetStocks()),
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
        label: 'Depth(cm)',
    },
    {
        id: 'Width',
        numeric: true,
        disablePadding: false,
        label: 'Width(cm)',
    },
    {
        id: 'Height',
        numeric: true,
        disablePadding: false,
        label: 'Height(cm)',
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
    // {
    //     id: 'Approve',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Approve',
    //     className: "sticky"
    // },
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
    CallResetSelected: false,
    needCheckBox: true
}

function onAddButtonClick() {
    this.setState({ openAddModal: true })
}
class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        // this.props.CallFetchAllStock({USERID:JSON.parse(localStorage.getItem("loginUser"))[0].UserID});
        this.props.CallFetchAllStock({ TRACKINGSTATUSID: "1" });
        this.props.CallViewContainer();  //view container
        this.state.stockListing = this.props.Stocks;

        this.onTableRowClick = this.onTableRowClick.bind(this);
        this.onAddButtonClick = onAddButtonClick.bind(this);
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

        if (!isArrayNotEmpty(this.state.stockFiltered) && isArrayNotEmpty(this.props.Stocks)) {
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

        if (isArrayNotEmpty(this.props.stockApproval)) {
            this.setState({ selectedStocks: "", selectedRows: "" })
            this.props.CallResetUpdatedStockDetail()
            this.props.CallResetStocks()
            this.props.CallFetchAllStock({ TRACKINGSTATUSID: 1 })

            this.setState({ CallResetSelected: true })
            setTimeout(() => { this.setState({ CallResetSelected: false }) }, 300)

        }

        if (this.state.stockFiltered === null && isArrayNotEmpty(this.props.Stocks)) {
            const { Stocks } = this.props
            this.setState({
                stockFiltered: (isStringNullOrEmpty(Stocks.ReturnVal) && Stocks.ReturnVal === 0) ? [] : Stocks
            })

            if ((!isStringNullOrEmpty(Stocks[0].ReturnVal) && Stocks[0].ReturnVal === 0)) {
                toast.warning("Fetched data is empty. ", { autoClose: 3000, theme: "dark" });
            }
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

        this.props.CallUpdateStockDetailByPost({
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
        })
    }

    renderTableRows(data, index) {

        const fontsize = '9pt'
        var dimension = data.ProductDimensionDeep && data.ProductDimensionWidth && data.ProductDimensionHeight ?
            ((data.ProductDimensionDeep / 100) * (data.ProductDimensionWidth / 100) * (data.ProductDimensionHeight / 100)).toFixed(3) : "";

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
        var color = "#ffffff"
        var fontcolor = "#000000"
        if (data.TrackingStatusID === 2) { color = "#87C09B" }
        if (data.Remark !== "-" || data.AdditionalCharges !== null) { fontcolor = "#FF0000" }

        return (
            <>
                {/* <TableCell
                //     component="th"
                //     id={`enhanced-table-checkbox-${index}`}
                //     scope="row"
                //     padding="normal"
                //     sx={{ fontSize: fontsize }}
                // >
                //     {data.Courier}
                // </TableCell> */}
                < TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}> {data.TrackingNumber}</ TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.ProductWeight}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.ProductDimensionDeep}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.ProductDimensionWidth}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.ProductDimensionHeight}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{dimension}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.Item}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.UserCode}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.AreaCode && data.AreaName ? data.AreaCode + " - " + data.AreaName : ""}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.PackagingDate}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.StockDate}</TableCell>
                <TableCell style={{ backgroundColor: color, color: fontcolor }} sx={{ fontSize: fontsize }}>{data.ContainerName}</TableCell>
                <TableCell style={{ backgroundColor: color }} align="left" sx={{ fontSize: fontsize }}>{!isStringNullOrEmpty(data.AdditionalCharges) && renderAdditionalCost(data.AdditionalCharges)}</TableCell>
                <TableCell style={{ backgroundColor: color }} align="left" sx={{ fontSize: fontsize }}>{data.Remark}</TableCell>
                {/* <TableCell className="sticky" key={data.Tracking_No} sx={{ fontSize: fontsize }}>
                    <Tooltip title="Approve">
                        <IconButton style={{ backgroundColor: "#f2f2f3 " }}><CheckIcon /></IconButton>
                    </Tooltip>
                </TableCell> */}

            </>
        )
    }

    onTableRowClick(event, row) {
        this.setState({
            openEditModal: true,
            selectedRows: row,
        });
    }

    handleSearchfilter = (filter, checked) => {
        switch (filter) {
            case "open":
                if ((this.state.ContainerName && this.state.ContainerDate) !== "" || undefined) {
                    this.setState({ open: !this.state.open });
                }
                else { toast.warning("Please fill in the all the details before proceed") }

                break;

            case "openEditModal":

                let extraChangesValue = "", isNotVerified = 0;
                if (this.state.AdditionalCharges.length > 0) {
                    for (var i = 0; i < this.state.AdditionalCharges.length; i++) {

                        if (this.state.AdditionalCharges[i].Charges === undefined || this.state.AdditionalCharges[i].Value === undefined) {
                            this.setState({ AdditionalCharges: "" })
                            extraChangesValue = "-"
                        } else {
                            extraChangesValue += this.state.AdditionalCharges[i].Charges + "=" + this.state.AdditionalCharges[i].Value
                            if (i !== this.state.AdditionalCharges.length - 1)
                                extraChangesValue += ';'

                            //check extra charge
                            if (this.state.AdditionalCharges[i].validated === false)
                                isNotVerified++;
                        }
                    }
                }
                else
                    extraChangesValue = "-"
                if (checked === false) {
                    if (!isStringNullOrEmpty(this.state.selectedRows.AreaCode) || !isStringNullOrEmpty(this.state.AreaCode)) {
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
                            AdditionalCharges: extraChangesValue
                        })
                        this.searchResult.value = "";
                    }
                    else { toast.warning("User may not registered in the system. Please register the user in 'User Management' page. ", { autoClose: 2000 }) }
                } else {
                    if (!isStringNullOrEmpty(this.state.selectedRows.AreaCode) || !isStringNullOrEmpty(this.state.AreaCode)) {
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
                            TRACKINGSTATUSID: 1,
                            ContainerName: this.state.ContainerName,
                            ContainerDate: this.state.ContainerDate,
                            Remark: this.state.Remark,
                            AdditionalCharges: extraChangesValue
                        })
                        this.searchResult.value = "";
                    }
                    else { toast.warning("User may not registered in the system. Please register the user in 'User Management' page. ", { autoClose: 2000 }) }
                }
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
                this.props.CallResetStocks()
                this.props.CallFetchAllStock({ TRACKINGSTATUSID: 1 })
                this.setState({ stockFiltered: this.props.Stocks ? this.props.Stocks : "", needCheckBox: true });
                break;

            case "Unchecked":
                this.props.CallResetStocks()
                this.props.CallFetchAllStock({ TRACKINGSTATUSID: 1 })
                const FilterArr = this.props.Stocks.filter((searchedItem) => searchedItem.TrackingStatusID === 1)
                this.setState({ stockFiltered: FilterArr, needCheckBox: true });
                break;

            case "Checked":
                this.props.CallResetStocks()
                this.props.CallFetchAllStock({ TRACKINGSTATUSID: 2 })

                const FilterArr2 = this.props.Stocks.filter((searchedItem) => searchedItem.TrackingStatusID === 2)

                this.setState({ stockFiltered: FilterArr2, needCheckBox: false });
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

    //depreciated
    onContainerChange = (e, type) => {
        if (e.target.value !== "") {
            this.setState({ stockFiltered: this.props.Stocks, ContainerName: e.target.value });
        }
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
        let searchKeywords = isStringNullOrEmpty(e.target.value) ? "" : e.target.value.toLowerCase()
        if (searchKeywords !== ""
            //  &&
            // this.state.stockListing[0].ReturnVal !== undefined &&
            // this.state.stockListing[0].ReturnVal !== "0"
        ) {
            const FilterArr = this.props.Stocks && this.props.Stocks[0].ReturnVal !== "0" ? this.props.Stocks.filter((searchedItem) =>
                searchedItem.TrackingNumber.toLowerCase().includes(searchKeywords) ||
                searchedItem.UserCode.includes(searchKeywords)
            ) : toast.warning("No data is found")

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

    onSelectAllRow = (items) => {
        this.setState({
            selectedStocks: this.state.stockFiltered
        })
    }

    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" }
        ]
        const checked = this.state.selectedRows.TrackingStatusID === 2
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
                    message={<div className="row" style={{ minWidth: "40vw" }}>
                        <FormControl variant="standard" size="small" fullWidth>
                            <InputLabel id="Division-label">Container Number and Date</InputLabel>
                            <Select
                                labelId="Division"
                                id="Division"
                                name="Division"
                                defaultValue={this.props.AllContainer.ContainerID}
                                onChange={(e) => {
                                    isStringNullOrEmpty(e.target.value)
                                    isArrayNotEmpty(this.props.AllContainer) && this.props.AllContainer.map((container) => {
                                        if (container.ContainerID === e.target.value) {
                                            this.setState({ ContainerName: container.ContainerName, ContainerDate: container.ContainerDate })
                                        }
                                    })
                                }
                                }
                                label="Division"
                            >

                                {
                                    isArrayNotEmpty(this.props.AllContainer) && this.props.AllContainer.map((el, idx) => {
                                        return <MenuItem value={el.ContainerID} key={idx}>{el.ContainerName + " ( " + el.ContainerDate + " )"}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>}
                />

                {openEditModal &&
                    <ModalPopOut
                        showCancel={true}
                        open={openEditModal}
                        checked={checked}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={() => this.handleSearchfilter("openEditModal", checked)}
                        message={
                            <EditStockGoods data={this.state.selectedRows} ContainerDate={this.state.ContainerDate ? this.state.ContainerDate : ""} ContainerName={this.state.ContainerName ? this.state.ContainerName : ""} parentCallback={this.handleCallback} />
                        }
                    ></ModalPopOut>

                }
                {openAddModal &&
                    <ModalPopOut
                        showCancel={true}
                        open={openAddModal}
                        checked={false}
                        handleToggleDialog={() => this.handleCancel("form")}
                        handleConfirmFunc={() => this.handleSearchfilter("openAddModal")}
                        message={
                            <EditStockGoods />
                        }
                    />
                }
                <div>
                    <div onClick={() => this.setState({ open: !this.state.open })}>
                        <Tooltip title="Click to change container" placement="bottom-start">
                            <div style={{ fontSize: "1.05rem" }}><strong>Container Number and Date :    </strong>{this.state.ContainerName + "( " + this.state.ContainerDate + " )"}</div>
                        </Tooltip>
                    </div>

                    <div className='w-100'>
                        <ToggleTabsComponent className="" Tabs={ToggleTabs} onChange={(e) => this.changeTab(e)} size="small" />
                        <SearchBar placeholder={"Search anything"} id="searchResult" autoFocus={true} onChange={(e) => this.onSearchChange(e)} />

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
                                checkbox: this.state.needCheckBox,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            selectedIndexKey={"StockID"}
                            Data={this.state.stockFiltered ? this.state.stockFiltered : []}
                            onTableRowClick={this.onTableRowClick}
                            onActionButtonClick={onAddButtonClick}
                            onSelectRow={this.onSelectRow}
                            onSelectAllClick={this.onSelectAllRow}
                            CallResetSelected={this.state.CallResetSelected}
                        />
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockGoods);