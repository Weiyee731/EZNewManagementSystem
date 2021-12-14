import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import SearchBar from "../../../components/SearchBar/SearchBar"
import TableComponents from "../../../components/TableComponents/TableComponents";
import ToggleTabsComponent from "../../../components/ToggleTabsComponent/ToggleTabComponents";
import AlertDialog from "../../../components/modal/Modal";
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull, convertDateTimeToString112Format } from "../../../tools/Helpers";
import ResponsiveDatePickers from '../../../components/datePicker/datePicker';
import axios from "axios";
import { toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import CsvDownloader from 'react-csv-downloader';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import "./ArchivedStock.css";

function mapStateToProps(state) {
    return {
        archivedData: state.counterReducer["archivedData"],
        userAreaCode: state.counterReducer["userAreaCode"],
        stockApproval: state.counterReducer["stockApproval"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
        CallFilterInventory: (propsData) => dispatch(GitAction.CallFilterInventory(propsData)),
        CallResetStocks: () => dispatch(GitAction.CallResetStocks()),
        CallFetchArchivedStock: (propsData) => dispatch(GitAction.CallFetchArchivedStock(propsData)),
    };
}

const headCells = [
    {
        id: 'TrackingNumber',
        align: 'left',
        disablePadding: false,
        label: 'Tracking No. ',
    },
    {
        id: 'ProductWeight',
        align: 'left',
        disablePadding: false,
        label: 'Weight (KG)',
    },
    {
        id: 'ProductDimensionDeep',
        align: 'left',
        disablePadding: false,
        label: 'Depth (cm)',
    },
    {
        id: 'ProductDimensionWidth',
        align: 'left',
        disablePadding: false,
        label: 'Width (cm)',
    },
    {
        id: 'ProductDimensionHeight',
        align: 'left',
        disablePadding: false,
        label: 'Height (cm)',
    },
    {
        id: 'Dimension',
        align: 'left',
        disablePadding: false,
        label: 'Dimension (m cubic)',
    },
    {
        id: 'Item',
        align: 'left',
        disablePadding: false,
        label: 'Item',
    },
    {
        id: 'UserCode',
        align: 'left',
        disablePadding: false,
        label: 'Member',
    },
    {
        id: 'AreaCode',
        align: 'left',
        disablePadding: false,
        label: 'Division',
    },
    {
        id: 'PackagingDate',
        align: 'left',
        disablePadding: false,
        label: 'Packaging Date',
    },
    {
        id: 'StockDate',
        align: 'left',
        disablePadding: false,
        label: 'Stock Date',
    },
    {
        id: 'ContainerName',
        align: 'left',
        disablePadding: false,
        label: 'Container',
    },
    {
        id: 'AdditionalCharges',
        align: 'left',
        disablePadding: false,
        label: 'Additional Charges',
    },
    {
        id: 'Remark',
        align: 'left',
        disablePadding: false,
        label: 'Remarks',
    },
];

const INITIAL_STATE = {
    filteredList: null,
    openAddChrgModal: false,
    selectedRow: [],

    searchKeywords: "",
    searchCategory: "All",
    searchArea: "All",
    searchDates: [],
    isDataFetching: false,
}

class ArchivedStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallUserAreaCode()

        this.changeTab = this.changeTab.bind(this)
        this.handleAddChrgModal = this.handleAddChrgModal.bind(this)
        this.RenderAdditionalCost = this.RenderAdditionalCost.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.handleSearchInput = this.handleSearchInput.bind(this)
        this.handleSearchCategory = this.handleSearchCategory.bind(this)
        this.handleSearchArea = this.handleSearchArea.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
        this.onFetchLatestData = this.onFetchLatestData.bind(this)
        this.onDatabaseSearch = this.onDatabaseSearch.bind(this)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.archivedData)
        if (this.state.filteredList === null && isArrayNotEmpty(this.props.archivedData)) {
            const { archivedData } = this.props
            this.setState({
                filteredList: (!isStringNullOrEmpty(archivedData[0].ReturnVal) && archivedData[0].ReturnVal == 0) ? [] : archivedData,
                isDataFetching: false
            })
            toast.dismiss();

            if ((!isStringNullOrEmpty(archivedData[0].ReturnVal) && archivedData[0].ReturnVal == 0)) {
                toast.warning("Fetched data is empty. ", { autoClose: 3000, theme: "dark" });

            }
        }
    }

    changeTab = (key) => {
        switch (key) {
            case "All":
                this.setState({ filteredList: this.props.archivedData })
                break;

            case "Unchecked":
                this.setState({ filteredList: this.props.archivedData.filter(x => x.TrackingStatusID === "1" || x.TrackingStatusID === 1) })
                break;

            case "Checked":
                this.setState({ filteredList: this.props.archivedData.filter(x => x.TrackingStatusID === "2" || x.TrackingStatusID === 2) })
                break;

            default:
                this.setState({ filteredList: this.props.archivedData })
                break;
        }
    }

    renderTableRows = (data, index) => {
        const fontsize = '9pt'
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
                <TableCell
                    component="th"
                    id={`table-checkbox-${index}`}
                    scope="row"
                    sx={{ fontSize: fontsize }}
                >
                    {data.TrackingNumber}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductWeight.toFixed(2)} </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductDimensionDeep).toFixed(1)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductDimensionWidth).toFixed(1)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductDimensionHeight).toFixed(1)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight / 1000000).toFixed(3)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Item}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.UserCode}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.AreaCode + " - " + data.AreaName}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.StockDate}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.PackagingDate}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ContainerName}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{!isStringNullOrEmpty(data.AdditionalCharges) && renderAdditionalCost(data.AdditionalCharges)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Remark}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        console.log(row)
        let additionalCharges = row.AdditionalCharges
        try { additionalCharges = JSON.parse(additionalCharges) } catch (e) { console.log(e); additionalCharges = [] }
        row.AdditionalCost = isObjectUndefinedOrNull(additionalCharges) ? [] : additionalCharges
        row.AdditionalCost.length > 0 && row.AdditionalCost.map((el, idx) => {
            el.Value = (!isStringNullOrEmpty(el.Value)) && (!isNaN(el.Value) && (Number(el.Value) > 0)) ? el.Value : 0
        })
        this.setState({ openAddChrgModal: true, selectedRow: row })
    }

    onFetchLatestData() {
        this.props.CallResetStocks()
        this.props.CallFetchArchivedStock({ STARTDATE: new Date().getFullYear() + '/1/1', ENDDATE: new Date().getFullYear() + '/12/31', })
        toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
        this.setState({ filteredList: null, isDataFetching: true })
    }

    handleAddChrgModal = () => {
        this.setState({ openAddChrgModal: !this.state.openAddChrgModal })
    }


    RenderAdditionalCost = () => {
        const { formValue } = this.state
        let tempFormValue = formValue
        let additionalCostItems = (!isObjectUndefinedOrNull(tempFormValue.AdditionalCost)) ? formValue.AdditionalCost : []
        let obj = {
            Charges: "",
            Value: "",
            validated: null
        }

        if (additionalCostItems.length > 0) {
            if (additionalCostItems[additionalCostItems.length - 1].validated)
                additionalCostItems.push(obj)
        }
        else
            additionalCostItems.push(obj)

        tempFormValue.AdditionalCost = additionalCostItems
        this.setState({ formValue: tempFormValue })
    }

    onCategoryFilter(archivedData, searchCategory, searchKeys) {
        switch (searchCategory) {
            case "Tracking":
                return archivedData.filter(x => (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)))

            case "Member":
                return archivedData.filter(x => (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)))

            case "Container":
                return archivedData.filter(x => (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)))

            default:
                return archivedData.filter(x =>
                    (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                )
        }
    }

    onCategoryAndAreaFilter(archivedData, searchCategory, searchArea, searchKeys) {
        switch (searchCategory) {
            case "Tracking":
                return archivedData.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)))

            case "Member":
                return archivedData.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)))

            case "Container":
                return archivedData.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)))

            default:
                return this.props.archivedData.filter(x =>
                    (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                )
        }
    }

    onSearch(keywords, area) {
        const { filteredList, searchKeywords, searchCategory, searchArea, searchDates, isDataFetching } = this.state
        const { archivedData } = this.props
        let searchKeys = ((!isStringNullOrEmpty(keywords))) ? keywords : searchKeywords
        searchKeys = (!isStringNullOrEmpty(searchKeys)) ? searchKeys.toUpperCase() : searchKeys

        let areaSearchKeys = ((!isStringNullOrEmpty(area))) ? area : searchArea

        // CallFilterInventory
        if (areaSearchKeys === "All" && searchCategory === "All" && isStringNullOrEmpty(searchKeys)) {
            this.props.CallResetStocks()
            this.props.CallFetchArchivedStock({ STARTDATE: new Date().getFullYear() + '/1/1', ENDDATE: new Date().getFullYear() + '/12/31', })
            toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
            this.setState({ isDataFetching: true, filteredList: null })
        }
        else {
            let tempList;
            if (!isStringNullOrEmpty(searchKeys)) {
                // if search keywords is exists
                if (isArrayNotEmpty(archivedData)) {
                    if (areaSearchKeys !== "All" && searchCategory === "All") {
                        console.log(areaSearchKeys)

                        // if area is not empty
                        tempList = archivedData.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(areaSearchKeys)) && (x.TrackingNumber.includes(searchKeys) || x.UserCode.includes(searchKeys)))
                    }
                    else if (areaSearchKeys === "All" && searchCategory !== "All") {
                        // if category is not empty
                        tempList = this.onCategoryFilter(archivedData, searchCategory, searchKeys)
                    }
                    else if (areaSearchKeys !== "All" && searchCategory !== "All") {
                        console.log(areaSearchKeys)
                        // if area and category is in the list of filtering options
                        tempList = this.onCategoryAndAreaFilter(archivedData, searchCategory, areaSearchKeys, searchKeys)
                    }
                    else {
                        console.log(areaSearchKeys)

                        // if want to search with all options
                        tempList = archivedData.filter(x =>
                            (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)) ||
                            (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)) ||
                            (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                            (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                        )
                    }
                }
                this.setState({ filteredList: tempList })
            }
            else {
                if (searchCategory === "All" && areaSearchKeys !== "All") {
                    // if area is not empty but search string is empty
                    this.setState({ searchCategory: "All", searchDates: [], filteredList: archivedData.filter(x => !isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(areaSearchKeys)) })
                }
                else if (searchCategory !== "All" && areaSearchKeys === "All") {
                    // if category is not empty but search string is empty
                    // no point to search with category if there are no searching keywords
                    this.setState({ areaSearchKeys: "All", searchDates: [], filteredList: archivedData })
                    toast.warning("Please enter searching keywords", { autoClose: 1500, position: "top-center", transition: Flip, theme: "dark" })
                }
                else {
                    this.setState({ searchCategory: "All", areaSearchKeys: "All", searchDates: [], filteredList: archivedData })
                    toast.warning("Please enter searching keywords", { autoClose: 1500, position: "top-center", transition: Flip, theme: "dark" })
                }
            }
        }
    }

    onDatabaseSearch() {
        const { searchDates } = this.state
        let date_range = (typeof searchDates === "string" && !Array.isArray(searchDates)) ? JSON.parse(searchDates) : searchDates
        // 
        if (!date_range.includes(null)) {
            this.props.CallResetStocks()
            const object = { STARTDATE: convertDateTimeToString112Format(date_range[0], false), ENDDATE: convertDateTimeToString112Format(date_range[1], false) }
            this.props.CallFetchArchivedStock(object)
            toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
            this.setState({ isDataFetching: true, filteredList: null })
            this.forceUpdate()
        }
        else {
            if (date_range[0] === null)
                toast.error("Require valid begin dates", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark" })

            if (date_range[1] === null)
                toast.error("Require valid end dates", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark" })
        }
    }


    handleSearchInput(e) {
        let searchKeywords = e.target.value
        this.onSearch(searchKeywords, "")
        this.setState({ searchKeywords: searchKeywords })
    }

    handleSearchCategory(e) {
        this.setState({ searchCategory: e.target.value })
    }

    handleSearchArea(e) {
        this.onSearch("", e.target.value)
        this.setState({ searchArea: e.target.value })
    }

    onDateChange(e) {
        this.setState({ searchDates: e })
    }

    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" },
        ]

        const { filteredList, selectedRow, searchCategory, searchArea } = this.state
        const renderTableTopRightButtons = () => {
            return (
                <div className="d-flex">
                    <Tooltip title="Synchronize Data">
                        <IconButton aria-label="Pull Data" size="small" onClick={() => { this.onFetchLatestData() }} disabled={this.state.isDataFetching}>
                            <CachedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <CsvDownloader
                        filename="overallstock-list"
                        extension=".xls"
                        separator=","
                        columns={headCells}
                        datas={isArrayNotEmpty(this.state.filteredList) ? this.state.filteredList : []}
                    >
                        <Tooltip title="Download">
                            <IconButton size="small" >
                                <DownloadForOfflineIcon color="primary" fontSize="large" sx={{}} />
                            </IconButton>
                        </Tooltip>
                    </CsvDownloader>
                </div>
            )
        }
        return (
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-12 col-12 mb-2 stock-date-range-picker d-flex">
                        <label className="my-auto" style={{ marginRight: '15px' }}>Packaging Date: </label>
                        <ResponsiveDatePickers
                            rangePicker
                            openTo="day"
                            title="FromDate"
                            value={this.state.datevalue ? this.state.datevalue : ""}
                            onChange={(e) => this.onDateChange(e)}
                            variant="outlined"
                            startPickerPropsOptions={{ placeholder: "From", className: "start-date-picker" }}
                            endPickerPropsOptions={{ placeholder: "To", className: "end-date-picker" }}
                        />
                        <Tooltip title="Search Date">
                            <IconButton
                                aria-label="Search Date"
                                size="small"
                                onClick={() => { this.onDatabaseSearch() }}
                                sx={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: '5px', border: '1px solid rgba(33, 33, 33, 0.6)' }}
                                disabled={this.state.isDataFetching}
                            >
                                <ManageSearchOutlinedIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-12 mb-2">
                        <div className="filter-dropdown row">
                            <div className="col-md-6 col-12 mb-2">
                                <div className="d-inline-flex w-100">
                                    <label className="my-auto col-3">Filter By:</label>
                                    <Select
                                        labelId="search-filter-category"
                                        id="search-filter-category"
                                        value={searchCategory}
                                        label="Search By"
                                        onChange={this.handleSearchCategory}
                                        size="small"
                                        IconComponent={FilterListOutlinedIcon}
                                        className="col-9"
                                        placeholder="filter by"
                                    >
                                        <MenuItem key="search_all" value="All">All</MenuItem>
                                        <MenuItem key="search_tracking" value="Tracking">Tracking Number</MenuItem>
                                        <MenuItem key="search_member" value={"Member"}>Member</MenuItem>
                                        <MenuItem key="search_container" value={"Container"}>Container</MenuItem>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-md-6 col-12">
                                <div className="d-inline-block w-100">
                                    <label className="my-auto col-3">Area:</label>
                                    <Select
                                        labelId="search-filter-area"
                                        id="search-filter-area"
                                        value={searchArea}
                                        label="Area"
                                        onChange={this.handleSearchArea}
                                        size="small"
                                        className="col-9"
                                        placeholder="filter by"
                                    >
                                        <MenuItem key="all_area" value="All">All</MenuItem>
                                        {
                                            isArrayNotEmpty(this.props.userAreaCode) && this.props.userAreaCode.map((el, idx) => {
                                                return <MenuItem key={el.AreaName + "_" + idx} value={el.UserAreaID}>{el.AreaName + " - " + el.AreaCode}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 d-flex">
                        <div className="pr-1 w-100">
                            <SearchBar
                                id=""
                                placeholder="Enter Member No, Tracking No or Container No to search"
                                buttonOnClick={() => this.onSearch("", "")}
                                onChange={this.handleSearchInput}
                                className="searchbar-input mb-auto"
                                disableButton={this.state.isDataFetching}
                                tooltipText="Search with current data"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <ToggleTabsComponent Tabs={ToggleTabs} size="small" onChange={this.changeTab} />
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
                    selectedIndexKey={"StockID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={isArrayNotEmpty(filteredList) ? filteredList : []}                                  // required, the data that listing in the table
                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                    onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                    tableTopRight={renderTableTopRightButtons()}
                />

                <AlertDialog
                    open={this.state.openAddChrgModal}              // required, pass the boolean whether modal is open or close
                    handleToggleDialog={this.handleAddChrgModal}  // required, pass the toggle function of modal
                    showAction={false}                           // required, to show the footer of modal display
                    title={"Stock Info - " + selectedRow.TrackingNumber}                                  // required, title of the modal
                    buttonTitle={"Update"}                         // required, title of button
                    // singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                    draggable={true}

                >
                    <div className="py-md-3 py-1">
                        <div className="row">
                            <div className="col-12">
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: "100%" }} aria-label="Item Info" size="small">
                                        <TableBody>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={4} component="th" scope="row" className="text-center text-uppercase" style={{ color: 'black', backgroundColor: "rgba(33 ,33 ,33, 0.1)" }} > <b>Container Info</b>  </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Tracking Number:  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.TrackingNumber) ? selectedRow.TrackingNumber : " - "} </TableCell>
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Tracking Status:  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.TrackingStatus) ? selectedRow.TrackingStatus : "Err"} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Container Name  </TableCell>
                                                <TableCell colSpan={3} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.ContainerName) ? selectedRow.ContainerName : " - "} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Packaging Date  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.StockDate) ? selectedRow.StockDate : " - "} </TableCell>
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Stock Date  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.PackagingDate) ? selectedRow.PackagingDate : " - "} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={4} component="th" scope="row" className="text-center text-uppercase" style={{ color: 'black', backgroundColor: "rgba(33 ,33 ,33, 0.1)" }} > <b>Member Info</b>  </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Member Number  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.UserCode) ? selectedRow.UserCode : " - "} </TableCell>
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Name  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.Fullname) ? selectedRow.Fullname : " Nil "} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Contact   </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.UserContactNo) ? selectedRow.UserContactNo : " - "} </TableCell>
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Email Address  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.UserEmailAddress) ? selectedRow.UserEmailAddress : "  -  "} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Address  </TableCell>
                                                <TableCell colSpan={3} align="left" className="table-col-value"> {selectedRow.UserAddress} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Division  </TableCell>
                                                <TableCell colSpan={3} align="left" className="table-col-value"> {selectedRow.AreaCode + " - " + selectedRow.AreaName} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={4} component="th" scope="row" className="text-center text-uppercase" style={{ color: 'black', backgroundColor: "rgba(33 ,33 ,33, 0.1)" }} > <b>Item Info</b>  </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Item  </TableCell>
                                                <TableCell colSpan={3} align="left" className="table-col-value"> {!isStringNullOrEmpty(selectedRow.Item) ? selectedRow.Item : " - "} </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Dimension (D x W x H) </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value">
                                                    {selectedRow.ProductDimensionDeep + "cm X " + selectedRow.ProductDimensionWidth + "cm X " + selectedRow.ProductDimensionHeight + "cm"} =
                                                    <b> {(selectedRow.ProductDimensionDeep * selectedRow.ProductDimensionWidth * selectedRow.ProductDimensionHeight / 1000000).toFixed(3)} m <sup>3</sup> </b>
                                                </TableCell>
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Weight  </TableCell>
                                                <TableCell colSpan={1} align="left" className="table-col-value"> {selectedRow.ProductWeight} kg </TableCell>
                                            </TableRow>

                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Additional Charge  </TableCell>
                                                <TableCell colSpan={3} align="left" className="table-col-value">
                                                    {
                                                        isArrayNotEmpty(selectedRow.AdditionalCost) && selectedRow.AdditionalCost.map((el, idx) => {
                                                            return (
                                                                <div key={idx} className="row">
                                                                    <div className="col-1 col-sm-1"><b>{idx + 1}  </b></div>
                                                                    <div className="col-6 col-sm-6">{el.Charges} : </div>
                                                                    <div className="col-5 col-sm-5">RM {el.Value}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell colSpan={1} component="th" scope="row" className="table-col-title"> Remarks  </TableCell>
                                                <TableCell colSpan={3} align="left"> {selectedRow.Remark} </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </AlertDialog>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArchivedStock);