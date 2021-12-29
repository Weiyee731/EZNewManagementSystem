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
import "./OverallStock.css";

function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
        userAreaCode: state.counterReducer["userAreaCode"],
        stockApproval: state.counterReducer["stockApproval"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllStock: (propsData) => dispatch(GitAction.CallFetchAllStock(propsData)),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
        CallFilterInventory: (propsData) => dispatch(GitAction.CallFilterInventory(propsData)),
        CallUpdateStockDetailByGet: (propsData) => dispatch(GitAction.CallUpdateStockDetailByGet(propsData)),
        CallResetUpdatedStockDetail: () => dispatch(GitAction.CallResetUpdatedStockDetail()),
        CallResetStocks: () => dispatch(GitAction.CallResetStocks()),
        CallFilterInventoryByDate: (propsData) => dispatch(GitAction.CallFilterInventoryByDate(propsData)),
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

    formValue: {
        StockID: "",
        Item: "",
        TrackingStatusID: "",
        ContainerName: "",
        StockDate: "",

        TrackingNumber: "",
        TrackingNumberVerified: null,

        MemberNumber: "",
        MemberNumberVerified: null,

        Division: "1",

        Depth: "",
        DepthVerified: null,

        Width: "",
        WidthVerified: null,

        Height: "",
        HeightVerified: null,

        Weight: "",
        WeightVerified: null,

        AdditionalCost: [],

        Remark: "",

    },

    searchKeywords: "",
    searchCategory: "All",
    searchArea: "All",
    searchDates: [],
    isDataFetching: false,
}

class OverallStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        // this.props.CallFetchAllStock({ USERID: 1 })
        this.props.CallUserAreaCode()

        this.changeTab = this.changeTab.bind(this)
        this.handleAddChrgModal = this.handleAddChrgModal.bind(this)
        this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this)
        this.handleFormInput = this.handleFormInput.bind(this)
        this.handleAdditionalCostInputs = this.handleAdditionalCostInputs.bind(this)
        this.RenderAdditionalCost = this.RenderAdditionalCost.bind(this)
        this.handleRemoveAdditionalCosts = this.handleRemoveAdditionalCosts.bind(this)
        this.removeAllAdditionalCost = this.removeAllAdditionalCost.bind(this)
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
        if (this.state.filteredList === null && isArrayNotEmpty(this.props.stocks)) {
            const { stocks } = this.props
            this.setState({
                filteredList: (!isStringNullOrEmpty(stocks[0].ReturnVal) && stocks[0].ReturnVal == 0) ? [] : stocks,
                isDataFetching: false
            })
            toast.dismiss();

            if ((!isStringNullOrEmpty(stocks[0].ReturnVal) && stocks[0].ReturnVal == 0)) {
                toast.warning("Fetched data is empty. ", { autoClose: 3000, theme: "dark" });

            }
        }

        if (isArrayNotEmpty(this.props.stockApproval)) {
            this.props.CallResetUpdatedStockDetail()
            this.props.CallResetStocks()
            this.props.CallFetchAllStock({ TRACKINGSTATUSID: 1 })
            this.setState({ openAddChrgModal: false, isDataFetching: true, filteredList: null })
        }
    }

    changeTab = (key) => {
        switch (key) {
            case "All":
                this.setState({ filteredList: this.props.stocks })
                break;

            case "Unchecked":
                this.setState({ filteredList: this.props.stocks.filter(x => x.TrackingStatusID === "1" || x.TrackingStatusID === 1) })
                break;

            case "Checked":
                this.setState({ filteredList: this.props.stocks.filter(x => x.TrackingStatusID === "2" || x.TrackingStatusID === 2) })
                break;

            default:
                this.setState({ filteredList: this.props.stocks })
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
                <TableCell align="left" sx={{ fontSize: fontsize }}>{!isNaN(data.ProductWeight) ? data.ProductWeight.toFixed(2) : 0} </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{!isNaN(data.ProductDimensionDeep) ? data.ProductDimensionDeep.toFixed(1) : 0} </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{!isNaN(data.ProductDimensionWidth) ? data.ProductDimensionWidth.toFixed(1) : 0} </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{!isNaN(data.ProductDimensionHeight) ? data.ProductDimensionHeight.toFixed(1) : 0} </TableCell>
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
        let tempFormValue = this.state.formValue
        tempFormValue.StockID = row.StockID
        tempFormValue.Item = row.Item
        tempFormValue.TrackingStatusID = row.TrackingStatusID
        tempFormValue.ContainerName = row.ContainerName;
        tempFormValue.StockDate = row.StockDate;

        tempFormValue.TrackingNumber = row.TrackingNumber;
        tempFormValue.TrackingNumberVerified = !isStringNullOrEmpty(row.TrackingNumber);
        tempFormValue.MemberNumber = row.UserCode;
        tempFormValue.MemberNumberVerified = !isStringNullOrEmpty(row.UserCode);
        tempFormValue.Depth = row.ProductDimensionDeep;
        tempFormValue.DepthVerified = !isStringNullOrEmpty(row.ProductDimensionDeep) && !isNaN(row.ProductDimensionDeep)
        tempFormValue.Width = row.ProductDimensionWidth;
        tempFormValue.WidthVerified = !isStringNullOrEmpty(row.ProductDimensionWidth) && !isNaN(row.ProductDimensionDeep)
        tempFormValue.Height = row.ProductDimensionHeight;
        tempFormValue.HeightVerified = !isStringNullOrEmpty(row.ProductDimensionHeight) && !isNaN(row.ProductDimensionHeight)
        tempFormValue.Weight = row.ProductWeight;
        tempFormValue.WeightVerified = !isStringNullOrEmpty(row.ProductWeight) && !isNaN(row.ProductWeight)
        tempFormValue.Division = Number(row.UserAreaID)
        tempFormValue.Remark = !isStringNullOrEmpty(row.Remark) ? row.Remark : ""

        let additionalCharges = row.AdditionalCharges
        try { additionalCharges = JSON.parse(additionalCharges) } catch (e) { console.log(e); additionalCharges = [] }
        tempFormValue.AdditionalCost = isObjectUndefinedOrNull(additionalCharges) ? [] : additionalCharges
        tempFormValue.AdditionalCost.length > 0 && tempFormValue.AdditionalCost.map((el, idx) => {
            el.Value = (!isStringNullOrEmpty(el.Value)) && (!isNaN(el.Value) && (Number(el.Value) > 0)) ? el.Value : 0
            el.validated = !(isStringNullOrEmpty(el.Charges)) && !(isStringNullOrEmpty(el.Value)) && !isNaN(el.Value) && (Number(el.Value) > 0)
        })
        this.setState({ openAddChrgModal: true, formValue: tempFormValue, })
    }

    onFetchLatestData() {
        this.props.CallResetStocks()
        this.props.CallFetchAllStock({ TRACKINGSTATUSID: 1 })
        toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
        this.setState({ filteredList: null, isDataFetching: true })
    }

    handleAddChrgModal = () => {
        this.setState({ openAddChrgModal: !this.state.openAddChrgModal })
    }

    handleSubmitUpdate = () => {
        const { formValue } = this.state
        let extraChangesValue = "", isNotVerified = 0;

        if (formValue.AdditionalCost.length > 0) {
            for (var i = 0; i < formValue.AdditionalCost.length; i++) {
                extraChangesValue += formValue.AdditionalCost[i].Charges + "=" + formValue.AdditionalCost[i].Value
                if (i !== formValue.AdditionalCost.length - 1)
                    extraChangesValue += ';'

                //check extra charge
                if (formValue.AdditionalCost[i].validated === false)
                    isNotVerified++;
            }
        }
        else
            extraChangesValue = "-"

        let selectedAreaCode = this.props.userAreaCode.filter(x => x.UserAreaID == formValue.Division)
        selectedAreaCode = (selectedAreaCode.length > 0) ? selectedAreaCode[0].AreaCode : "KU"
        // let selectedAreaCode = formValue.Division
        let object = {
            STOCKID: formValue.StockID,
            USERCODE: formValue.MemberNumber,
            TRACKINGNUMBER: formValue.TrackingNumber,
            PRODUCTWEIGHT: formValue.Weight,
            PRODUCTHEIGHT: formValue.Height,
            PRODUCTWIDTH: formValue.Width,
            PRODUCTDEEP: formValue.Depth,
            AREACODE: selectedAreaCode,
            ITEM: isStringNullOrEmpty(formValue.Item) ? "-" : formValue.Item,
            TRACKINGSTATUSID: formValue.TrackingStatusID,
            CONTAINERNAME: !isStringNullOrEmpty(formValue.ContainerName) ? formValue.ContainerName : '-',
            CONTAINERDATE: !isStringNullOrEmpty(formValue.StockDate) ? formValue.StockDate : "-",
            REMARK: !isStringNullOrEmpty(formValue.Remark) ? formValue.Remark : "-",
            EXTRACHARGE: extraChangesValue,
        }

        // check member
        if (isStringNullOrEmpty(object.USERCODE) || formValue.MemberNumberVerified === false) {
            isNotVerified++;
        }

        // check tracking number
        if (isStringNullOrEmpty(object.TRACKINGNUMBER) || formValue.TrackingNumberVerified === false) {
            isNotVerified++;
        }

        // check area code / division
        if (isStringNullOrEmpty(object.AREACODE)) {
            isNotVerified++;
        }

        // check width x height x depth x weight
        if (!formValue.DepthVerified || !formValue.WidthVerified || !formValue.HeightVerified || !formValue.WeightVerified) {
            isNotVerified++;
        }

        if (isNotVerified === 0) {
            this.props.CallUpdateStockDetailByGet(object)
            toast.loading("Submitting data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
            this.setState({ isDataFetching: false })
        }
        else {
            toast.error("Invalid to update data!", { autoClose: 3000, position: "top-center", transition: Flip, theme: "dark" })
        }
    }

    handleFormInput = (e) => {
        const { formValue } = this.state
        const { value, name } = e.target
        let tempForm = formValue
        switch (name) {
            case "TrackingNumber":
                tempForm.TrackingNumber = value
                tempForm.TrackingNumberVerified = !isStringNullOrEmpty(value)
                this.setState({ formValue: tempForm })
                break;

            case "MemberNumber":
                tempForm.MemberNumber = value
                tempForm.MemberNumberVerified = !isStringNullOrEmpty(value)
                this.setState({ formValue: tempForm })
                break;

            case "Division":
                tempForm.Division = value
                this.setState({ formValue: tempForm })
                break;

            case "Depth":
                tempForm.Depth = value
                tempForm.DepthVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Width":
                tempForm.Width = value
                tempForm.WidthVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Height":
                tempForm.Height = value
                tempForm.HeightVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Weight":
                tempForm.Weight = value
                tempForm.WeightVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Remark":
                tempForm.Remark = value
                this.setState({ formValue: tempForm })
                break;

            default:
                break;
        }
    }

    handleAdditionalCostInputs = (e, index) => {
        let validated, tempFormValue = this.state.formValue
        const { value, name } = e.target
        let additionalCostItems = tempFormValue.AdditionalCost
        switch (name) {
            case "AdditionalChargedRemark":
                const chargedAmount = additionalCostItems[index].Value
                validated = (!isStringNullOrEmpty(value)) && ((!isStringNullOrEmpty(chargedAmount)) && (!isNaN(chargedAmount) && (Number(chargedAmount) > 0)))
                additionalCostItems[index].Charges = value
                additionalCostItems[index].validated = validated
                tempFormValue.AdditionalCost = additionalCostItems

                this.setState({ formValue: tempFormValue })
                break;

            case "AdditionalChargedAmount":
                const chargedRemark = additionalCostItems[index].Charges
                validated = (!isStringNullOrEmpty(chargedRemark)) && ((!isStringNullOrEmpty(value)) && (!isNaN(e.target.value) && (Number(value) > 0)))
                additionalCostItems[index].Value = value
                additionalCostItems[index].validated = validated
                tempFormValue.AdditionalCost = additionalCostItems

                this.setState({ formValue: tempFormValue })
                break;
            default:
        }
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

    handleRemoveAdditionalCosts(index) {
        const { formValue } = this.state
        let tempFormValue = formValue
        let additionalCostItems = (!isObjectUndefinedOrNull(tempFormValue.AdditionalCost)) ? tempFormValue.AdditionalCost : []

        if (additionalCostItems.length > 0) {
            additionalCostItems.splice(index, 1)
            this.setState({ formValue: tempFormValue })
        }
    }

    removeAllAdditionalCost() {
        let tempFormValue = this.state.formValue
        tempFormValue.AdditionalCost = []
        this.setState({ formValue: tempFormValue })
    }

    onCategoryFilter(stocks, searchCategory, searchKeys) {
        switch (searchCategory) {
            case "Tracking":
                return stocks.filter(x => (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)))

            case "Member":
                return stocks.filter(x => (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)))

            case "Container":
                return stocks.filter(x => (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)))

            default:
                return stocks.filter(x =>
                    (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                )
        }
    }

    onCategoryAndAreaFilter(stocks, searchCategory, searchArea, searchKeys) {
        switch (searchCategory) {
            case "Tracking":
                return stocks.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)))

            case "Member":
                return stocks.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)))

            case "Container":
                return stocks.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)))

            default:
                return this.props.stocks.filter(x =>
                    (!isStringNullOrEmpty(x.TrackingNumber) && x.TrackingNumber.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                )
        }
    }

    onSearch(keywords, area) {
        const { filteredList, searchKeywords, searchCategory, searchArea, searchDates, isDataFetching } = this.state
        const { stocks } = this.props
        let searchKeys = ((!isStringNullOrEmpty(keywords))) ? keywords : searchKeywords
        searchKeys = (!isStringNullOrEmpty(searchKeys)) ? searchKeys.toUpperCase() : searchKeys

        let areaSearchKeys = ((!isStringNullOrEmpty(area))) ? area : searchArea

        // CallFilterInventory
        if (areaSearchKeys === "All" && searchCategory === "All" && isStringNullOrEmpty(searchKeys)) {
            this.props.CallResetStocks()
            this.props.CallFetchAllStock({ TRACKINGSTATUSID: 1 })
            toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
            this.setState({ isDataFetching: true, filteredList: null })
        }
        else {
            let tempList;
            if (!isStringNullOrEmpty(searchKeys)) {
                // if search keywords is exists
                if (isArrayNotEmpty(stocks)) {

                    if (areaSearchKeys !== "All" && searchCategory === "All") {
                        // if area is not empty
                        tempList = stocks.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(areaSearchKeys)) && (x.TrackingNumber.includes(searchKeys) || x.UserCode.includes(searchKeys)))
                    }
                    else if (areaSearchKeys === "All" && searchCategory !== "All") {

                        // if category is not empty
                        tempList = this.onCategoryFilter(stocks, searchCategory, searchKeys)
                    }
                    else if (areaSearchKeys !== "All" && searchCategory !== "All") {

                        tempList = this.onCategoryAndAreaFilter(stocks, searchCategory, areaSearchKeys, searchKeys)
                    }
                    else {
                        // if want to search with all options
                        tempList = stocks.filter(x =>
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
                    this.setState({ searchCategory: "All", searchDates: [], filteredList: stocks.filter(x => !isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(areaSearchKeys)) })
                }
                else if (searchCategory !== "All" && areaSearchKeys === "All") {
                    // if category is not empty but search string is empty
                    // no point to search with category if there are no searching keywords
                    this.setState({ areaSearchKeys: "All", searchDates: [], filteredList: stocks })
                    toast.warning("Please enter searching keywords", { autoClose: 1500, position: "top-center", transition: Flip, theme: "dark" })
                }
                else {
                    this.setState({ searchCategory: "All", areaSearchKeys: "All", searchDates: [], filteredList: stocks })
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
            this.props.CallFilterInventoryByDate(object)
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
        this.onSearch(searchKeywords)
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
        const { filteredList, formValue, searchCategory, searchArea } = this.state
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
                    tableTopRight={renderTableTopRightButtons()}
                    headerStyle={{ fontWeight: 'medium', bgcolor: 'rgb(200, 200, 200)', fontSize: '10pt' }}
                />

                <AlertDialog
                    open={this.state.openAddChrgModal}              // required, pass the boolean whether modal is open or close
                    handleToggleDialog={this.handleAddChrgModal}  // required, pass the toggle function of modal
                    handleConfirmFunc={this.handleSubmitUpdate}    // required, pass the confirm function 
                    showAction={true}                           // required, to show the footer of modal display
                    title={this.state.formValue.Item}                                  // required, title of the modal
                    buttonTitle={"Update"}                         // required, title of button
                    singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                    draggable={true}

                >
                    <div className="py-md-3 py-1">
                        <div className="row">
                            <div className="col-12" style={{ fontSize: '9pt' }}>
                                <div className="clearfix">
                                    <div className="float-start"> <b>Container: </b>{!isStringNullOrEmpty(formValue.ContainerName) ? formValue.ContainerName : " N/A "}  </div>
                                    <div className="float-end"> <b>Container Date: </b> {!isStringNullOrEmpty(formValue.StockDate) ? formValue.StockDate : " N/A "}  </div>
                                </div>
                                <hr />
                            </div>
                            <div className="col-12 col-md-4">
                                <TextField variant="standard" size="small" fullWidth label="Tracking Number" name="TrackingNumber" value={formValue.TrackingNumber} onChange={this.handleFormInput} error={!formValue.TrackingNumberVerified} />
                                {!formValue.TrackingNumberVerified && <FormHelperText sx={{ color: 'red' }} id="TrackingNumber-error-text">Invalid</FormHelperText>}
                            </div>
                            <div className="col-12 col-md-4">
                                <TextField variant="standard" size="small" fullWidth label="Member Number" name="MemberNumber" value={formValue.MemberNumber} onChange={this.handleFormInput} error={!formValue.MemberNumberVerified} />
                                {!formValue.MemberNumberVerified && <FormHelperText sx={{ color: 'red' }} id="MemberNumber-error-text">Invalid</FormHelperText>}
                            </div>
                            <div className="col-12 col-md-4">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel id="Division-label">Division</InputLabel>
                                    <Select
                                        labelId="Division"
                                        id="Division"
                                        name="Division"
                                        value={formValue.Division}
                                        onChange={this.handleFormInput}
                                        label="Division"
                                        error={(formValue.Division === 0)}
                                    >
                                        {
                                            isArrayNotEmpty(this.props.userAreaCode) && this.props.userAreaCode.map((el, idx) => {
                                                return <MenuItem key={el.AreaName + '_' + idx} value={el.UserAreaID} >{el.AreaName + " - " + el.AreaCode}</MenuItem>
                                            })
                                        }
                                    </Select>
                                    {(formValue.Division === 0) && <FormHelperText sx={{ color: 'red' }} id="MemberNumber-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 col-sm-2">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Depth">Depth</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Depth"
                                        value={formValue.Depth}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">cm</InputAdornment>}
                                        error={!formValue.DepthVerified}
                                    />
                                    {!formValue.DepthVerified && <FormHelperText sx={{ color: 'red' }} id="Depth-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-4 col-sm-2">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Width">Width</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Width"
                                        value={formValue.Width}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">cm</InputAdornment>}
                                        error={!formValue.WidthVerified}
                                    />
                                    {!formValue.WidthVerified && <FormHelperText sx={{ color: 'red' }} id="Width-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-4 col-sm-2">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Height">Height</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Height"
                                        value={formValue.Height}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">cm</InputAdornment>}
                                        error={!formValue.HeightVerified}
                                    />
                                    {!formValue.HeightVerified && <FormHelperText sx={{ color: 'red' }} id="Height-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-4 col-sm-2">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Height">Dimension</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Dimension"
                                        value={(formValue.Width * formValue.Height * formValue.Depth / 1000000).toFixed(3)}
                                        endAdornment={<InputAdornment position="start">m <sup>3</sup></InputAdornment>}
                                        disabled
                                    />
                                </FormControl>
                            </div>
                            <div className="col-12 col-sm-4">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Weight">Weight</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Weight"
                                        value={formValue.Weight}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">KG</InputAdornment>}
                                        error={!formValue.WeightVerified}
                                    />
                                    {!formValue.WeightVerified && <FormHelperText sx={{ color: 'red' }} id="Weight-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="my-1 row">
                            <div className="col-12">
                                <Button className="my-1 w-100" color="success" variant="contained" size="small" onClick={() => { this.RenderAdditionalCost() }}>Add Additional Costs</Button>
                            </div>
                        </div>
                        {
                            isArrayNotEmpty(formValue.AdditionalCost) && formValue.AdditionalCost.map((el, idx) => {
                                return (
                                    <div key={idx} className="row">
                                        <div className="col-6 col-sm-8">
                                            <TextField
                                                variant="standard"
                                                size="small"
                                                fullWidth
                                                label={"Add. Chg. " + (idx + 1)}
                                                name="AdditionalChargedRemark"
                                                value={el.Charges}
                                                onChange={(e) => { this.handleAdditionalCostInputs(e, idx) }}
                                                error={!el.validated}
                                            />
                                            {!el.validated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid</FormHelperText>}
                                        </div>
                                        <div className="col-4 col-sm-3">
                                            <FormControl variant="standard" size="small" fullWidth>
                                                <InputLabel htmlFor="AdditionalChargedAmount"></InputLabel>
                                                <Input
                                                    variant="standard"
                                                    size="small"
                                                    name="AdditionalChargedAmount"
                                                    value={el.Value}
                                                    onChange={(e) => { this.handleAdditionalCostInputs(e, idx) }}
                                                    startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                                                    error={!el.validated}
                                                />
                                                {!el.validated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid Amount</FormHelperText>}
                                            </FormControl>
                                        </div>
                                        <div className="col-2 col-sm-1 d-flex">
                                            <IconButton className='m-auto' color="primary" size="small" aria-label="remove-additional-cost" component="span" onClick={() => this.handleRemoveAdditionalCosts(idx)} disabled={this.state.isDataFetching}>
                                                <DeleteIcon size="inherit" />
                                            </IconButton>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            isArrayNotEmpty(formValue.AdditionalCost) &&
                            <div className="mt-3 col-12">
                                <Button className="my-1 w-100" color="error" variant="contained" size="small" onClick={() => { this.removeAllAdditionalCost() }} startIcon={<DeleteIcon />}>Clear Additional Costs</Button>
                            </div>
                        }
                        <div className="row mt-2">
                            <div className="col-12">
                                <Box sx={{ width: '100%' }}>
                                    <TextField
                                        variant="outlined"
                                        size="large"
                                        name="Remark"
                                        label="Remark"
                                        value={formValue.Remark}
                                        onChange={this.handleFormInput}
                                        fullWidth
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                </AlertDialog>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverallStock);