import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import TableCell from '@mui/material/TableCell';
import TableComponents from "../../components/TableComponents/TableComponents"
import SearchBar from "../../components/SearchBar/SearchBar"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { withRouter } from "react-router";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { isArrayNotEmpty, isStringNullOrEmpty, isNumber } from "../../tools/Helpers";
import { Paper, TextField, Typography } from "@mui/material"
import { toast, Flip } from "react-toastify"
import Button from '@mui/material/Button';
import Barcode from 'react-barcode';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import moment from 'moment';
import { getDate } from "date-fns";
import { IfObservable } from "rxjs/observable/IfObservable";

function mapStateToProps(state) {
    return {
        courier: state.counterReducer["courier"],
        userAreaCode: state.counterReducer["userAreaCode"],
        inventoryStockAction: state.counterReducer["inventoryStockAction"],
        inventoryStock: state.counterReducer["inventoryStock"],
        userData: state.counterReducer["userData"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallViewInventoryByFilter: (propsData) => dispatch(GitAction.CallViewInventoryByFilter(propsData)),
        CallViewCourier: () => dispatch(GitAction.CallViewCourier()),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
        CallAddInventory: (propsData) => dispatch(GitAction.CallAddInventory(propsData)),
        CallUpdateInventory: (propsData) => dispatch(GitAction.CallUpdateInventory(propsData)),
        CallDeleteInventory: (propsData) => dispatch(GitAction.CallDeleteInventory(propsData)),
        CallViewProfileByUserCode: (propsData) => dispatch(GitAction.CallViewProfileByUserCode(propsData)),
        ClearInventoryAction: () => dispatch(GitAction.ClearInventoryAction()),
        ClearInventoryStock: () => dispatch(GitAction.ClearInventoryStock()),
        ClearUserCodeData: () => dispatch(GitAction.ClearUserCodeData()),
    }
}

const INITIAL_STATE = {

    isCheckUser: false,
    isCheckDatabase: false,
    currentVolume: 65.5,
    isSubmitAdd: false,
    isSubmitDelete: false,
    isSubmitData: [],

    stockData: [{
        TrackingNumber: "",
        isTrackingError: false,
        CourierID: "",
        isCourierError: false,
        UserCode: "",
        isUserCodeError: false,
        UserData: "",
        isUserDataError: false,
        Item: "",
        isItemError: false,
        Quantity: 1,
        isQuantityError: false,
        ProductWeight: "",
        isProductWeightError: false,
        ProductVolumetricWeight: "",
        isProductVolumetricWeightError: false,
        ProductHeight: "",
        isProductHeightError: false,
        ProductWidth: "",
        isProductWidthError: false,
        ProductDeep: "",
        isProductDeepError: false,
        Remark: "",
        isRemarkError: false,
        areaCode: "KU",
        createdDate: "",
        StockID: "",
    }],

}


class WarehouseStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallViewCourier()
        this.props.CallUserAreaCode()
    }

    componentDidMount() { }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.isCheckUser === true && this.props.userData.length > 0) {
            let listing = this.props.userData[0]
            let arr = this.state.stockData
            if (this.props.userData[0].ReturnVal !== 0) {
                arr[0].UserData = listing.Username
                arr[0].areaCode = this.verifyAreaCode(listing.UserAreaID)
            } else {
                arr[0].UserData = ""
                arr[0].areaCode = ""
                toast.warning("没有此会员记录，请确输入正确会员号")
            }
            this.setState({ isCheckUser: false, stockData: arr })
            this.props.ClearUserCodeData()
        }

        console.log("sdsadadad", this.props)

        if (this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal !== 0 && this.state.isCheckDatabase === true) {
            let arr = this.state.stockData
            let listing = this.props.inventoryStock[0]
            if (this.props.inventoryStock[0].ReturnVal !== 0) {
                arr[0].CourierID = listing.CourierID
                arr[0].UserCode = listing.UserCode
                arr[0].UserData = listing.Username
                arr[0].Item = listing.Item
                arr[0].Quantity = listing.ProductQuantity
                arr[0].ProductWeight = listing.ProductWeight
                arr[0].CourierID = listing.CourierID
                arr[0].ProductHeight = listing.ProductDimensionHeight
                arr[0].ProductWidth = listing.ProductDimensionWidth
                arr[0].ProductDeep = listing.ProductDimensionDeep
                arr[0].Remark = listing.Remark
                arr[0].StockID = listing.StockID
                arr[0].createdDate = moment(listing.StockDate).format('DD-MM-YYYY, hh:mm:ss ')
            }
            this.setState({ isCheckDatabase: false, stockData: arr })
        }
        else {
            console.log("componentDidUpdatecomponentDidUpdate", this.props.inventoryStock)
            console.log("componentDidUpdatecomponentDidUpdate this.state.isCheckDatabase", this.state.isCheckDatabase)
            if (this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal === 0 && this.state.isCheckDatabase === true) {
                // console.log("HEREEEE")
                this.props.ClearInventoryStock()
                this.setState({ StockID: "" })
                // this.setInital()
            }
        }

        if (this.props.inventoryStockAction.length > 0 && this.state.isSubmitAdd == true) {
            if (this.props.inventoryStockAction[0].ReturnVal === 1) {
                if (this.state.isSubmitDelete === true)
                    toast.success("已成功删除")
                else
                    toast.success("已成功入库")

                this.setState({ TrackingNumber: "" })
                this.setInital()
            } else {
                if (this.state.isSubmitDelete === true)
                    toast.error("包裹未删除成功, 请联系系统管理")
                else
                    toast.error("包裹未入库成功，请联系系统管理")
            }
            this.props.ClearInventoryAction()
        }
    }

    setInital() {
        this.setState({
            stockData: [{
                TrackingNumber: "",
                isTrackingError: false, CourierID: "", isCourierError: false, UserCode: "", isUserCodeError: false,
                UserData: "", isUserDataError: false, Item: "", isItemError: false, Quantity: 1, isQuantityError: false, ProductWeight: "", isProductWeightError: false,
                ProductVolumetricWeight: "", isProductVolumetricWeightError: false, ProductHeight: "", isProductHeightError: false, ProductWidth: "",
                isProductWidthError: false, ProductDeep: "", isProductDeepError: false, Remark: "", isRemarkError: false, areaCode: "KU", createdDate: "", StockID: "",
            }]
        })
    }

    handleChange(data, title) {
        let arr = []
        arr = this.state.stockData[0]
        let finalData = []

        switch (title) {
            case "快递单号":
                arr.isTrackingError = false
                if (isStringNullOrEmpty(data))
                    arr.isTrackingError = true
                arr.TrackingNumber = data
                this.props.CallViewInventoryByFilter({ FilterColumn: "and TrackingNumber='" + data + "'" })
                this.setState({ isCheckDatabase: true })
                break;

            case "快递公司":
                arr.isCourierError = false
                if (isStringNullOrEmpty(data))
                    arr.isCourierError = true
                arr.CourierID = data
                break;

            case "会员号":
                arr.isUserCodeError = false
                if (isStringNullOrEmpty(data))
                    arr.isUserCodeError = true
                arr.UserCode = data

                console.log("dsadadas", data)
                if (data.length === 4 && this.state.isCheckUser === false) {
                    this.props.CallViewProfileByUserCode({ UserCode: arr.UserCode })
                    this.setState({ isCheckUser: true })
                }
                break;

            case "货物信息":
                arr.isItemError = false
                if (isStringNullOrEmpty(data))
                    arr.isItemError = true
                arr.Item = data
                break;

            case "数量":
                arr.isQuantityError = false
                if (!isNumber(data) || isStringNullOrEmpty(data) || data % 1 !== 0)
                    arr.isQuantityError = true
                arr.Quantity = data
                break;

            case "实际重量":
                arr.isProductWeightError = false
                if (!isNumber(data) || isStringNullOrEmpty(data))
                    arr.isProductWeightError = true
                arr.ProductWeight = data
                break;

            case "高":
                arr.isProductHeightError = false
                if (!isNumber(data) || isStringNullOrEmpty(data))
                    arr.isProductHeightError = true
                arr.ProductHeight = data
                break;

            case "长":
                arr.isProductDeepError = false
                if (!isNumber(data) || isStringNullOrEmpty(data))
                    arr.isProductDeepError = true
                arr.ProductDeep = data
                break;

            case "宽":
                arr.isProductWidthError = false
                if (!isNumber(data) || isStringNullOrEmpty(data))
                    arr.isProductWidthError = true
                arr.ProductWidth = data
                break;

            case "备注":
                arr.isRemarkError = false
                if (isStringNullOrEmpty(data))
                    arr.isRemarkError = true
                arr.Remark = data
                break;

            default:
                break;
        }
        finalData.push(arr)
        this.setState({ stockData: finalData })
    }

    verifyError = () => {
        let listing = this.state.stockData[0]
        let error = false
        if (listing.isTrackingError === false && listing.isCourierError === false && listing.isUserCodeError === false && listing.isItemError === false &&
            listing.isQuantityError === false && listing.isProductWeightError === false && listing.isProductHeightError === false &&
            listing.isProductWidthError === false && listing.isProductDeepError === false && listing.isRemarkError === false) {
            if (listing.TrackingNumber !== "" && listing.CourierID !== "" && listing.UserCode !== "" && listing.Item !== "" &&
                listing.Quantity !== "" && listing.ProductWeight !== "" && listing.ProductHeight !== "" &&
                listing.ProductWidth !== "" && listing.ProductDeep !== "") {
                error = false
            }
            else {
                error = true
            }
        } else {
            error = true
        }

        return error
    }

    verifyAreaCode = (id) => {
        let listing = this.props.userAreaCode
        let data = ""

        if (listing.length > 0 && listing[0].ReturnVal !== 0) {
            listing.filter((x) => x.UserAreaID === id).map((y) => {
                data = y.AreaCode
            })
        }
        return data
    }


    createObject = () => {
        console.log("sdsadadada", this.state.stockData[0])

        let listing = this.state.stockData[0]
        let UserCode = ""
        let TrackingNumber = ""
        let ProductWeight = ""
        let ProductHeight = ""
        let ProductWidth = ""
        let ProductDeep = ""
        let CourierID = ""
        let Item = ""
        let Remark = ""
        let data = []

        let areaCode = ""
        let createdDate = ""


        for (let index = 0; index < listing.Quantity; index++) {
            UserCode += listing.UserCode;
            TrackingNumber += listing.Quantity > 1 ? listing.TrackingNumber.replace(/ /g, '') + "00" + parseInt(index + 1) : listing.TrackingNumber.replace(/ /g, '');
            ProductWeight += (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight;
            ProductHeight += (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight;
            ProductDeep += (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep;
            ProductWidth += (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth;
            CourierID += (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID;
            Item += (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item.replace(/ /g, '');
            Remark += (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark.replace(/ /g, '');
            areaCode += (isStringNullOrEmpty(listing.areaCode)) ? "-" : listing.areaCode;
            createdDate += (isStringNullOrEmpty(listing.createdDate)) ? "-" : listing.createdDate;

            if (index !== listing.Quantity - 1) {
                UserCode += ",";
                TrackingNumber += ",";
                ProductWeight += ",";
                ProductHeight += ",";
                ProductDeep += ",";
                ProductWidth += ",";
                CourierID += ",";
                Item += ",";
                Remark += ",";
                areaCode += ",";
                createdDate += ",";
            }

            data.push({
                UserCode: listing.UserCode,
                TrackingNumber: listing.Quantity > 1 ? listing.TrackingNumber.replace(/ /g, '') + "00" + parseInt(index + 1) : listing.TrackingNumber.replace(/ /g, ''),
                ProductWeight: (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight,
                ProductHeight: (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight,
                ProductDeep: (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep,
                ProductWidth: (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth,
                CourierID: (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID,
                Item: (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item.replace(/ /g, ''),
                Remark: (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark.replace(/ /g, ''),
                areaCode: (isStringNullOrEmpty(listing.areaCode)) ? "-" : listing.areaCode,
                createdDate: (isStringNullOrEmpty(listing.createdDate)) ? "-" : listing.createdDate,
                UserData: (isStringNullOrEmpty(listing.UserData)) ? "-" : listing.UserData,
            })
        }
        let Obj = {
            UserCode: UserCode,
            TrackingNumber: TrackingNumber,
            ProductWeight: ProductWeight,
            ProductHeight: ProductHeight,
            ProductDeep: ProductDeep,
            ProductWidth: ProductWidth,
            CourierID: CourierID,
            Item: Item,
            Remark: Remark,
            areaCode: areaCode,
            createdDate: createdDate,
            ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID === null ? 1 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        }
        this.setState({ isSubmitData: data })
        return Obj
    }

    render() {
        const { stockData } = this.state
        const calculateVolumetric = (type) => {
            let height = stockData[0].ProductHeight
            let deep = stockData[0].ProductDeep
            let width = stockData[0].ProductWidth
            let data = ""

            if (isNumber(height) && isNumber(deep) !== "" && isNumber(width) !== "") {
                if (type === "体积")
                    data = parseFloat((height * deep * width) / 1000000).toFixed(3)
                else
                    data = parseFloat((height * deep * width) / 6000).toFixed(3)
            }
            return data
        }

        if (this.props.courier !== undefined && this.props.courier.length > 0) {
            var generateOptions = []
            let DataList = this.props.courier
            generateOptions = DataList.length > 0 &&
                DataList.map((data, i) => {
                    return (
                        <MenuItem value={data.CourierID}>{data.CourierName}</MenuItem>
                    );
                });
        }

        const listingLayout = (title, value, error, type) => {
            return (
                <div className="row" style={{ paddingTop: "20pt" }} key={title}>
                    <div className="col-2" >
                        <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>{title} :</Typography>
                    </div>
                    <div className="col-4" >
                        {type === "list" ?
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{title}</InputLabel>
                                    <Select
                                        value={value}
                                        onChange={(e) => this.handleChange(e.target.value, title)}
                                        className="select"
                                        size="small"
                                        required
                                        label={title}
                                    >
                                        {generateOptions}
                                    </Select>
                                </FormControl>
                            </Box>
                            :
                            <TextField
                                variant="outlined"
                                style={{ width: "100%" }}
                                label={title}
                                value={value}
                                required
                                size="small"
                                inputProps={{ maxLength: title === "会员号" && 4 }}
                                disabled={title === "会员信息" ? true : false}
                                onChange={(e) => this.handleChange(e.target.value, title)}
                            />
                        }
                        {error && <div><label style={{ color: "red", fontSize: "10pt" }}>请输入对的{title}</label></div>}
                    </div>
                    {
                        title === "快递单号" &&
                        <div className="col-4" style={{ paddingLeft: "10pt" }}>
                            <TextField
                                variant="outlined"
                                style={{ width: "100%" }}
                                label="数量"
                                value={stockData[0].Quantity}
                                type="number"
                                required
                                size="small"
                                onChange={(e) => this.handleChange(e.target.value, "数量")}
                            />
                            {stockData[0].isQuantityError && <div><label style={{ color: "red", fontSize: "10pt" }}>请输入对的整数</label></div>}
                        </div>
                    }
                    {
                        title === "会员信息" && this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal !== 0 &&
                        <div className="col-4" >
                            <div className="row" style={{ textAlign: "center", border: "2px solid", padding: "5pt" }}>
                                <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>入库时间：</Typography>
                                <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>{stockData[0].createdDate}</Typography>
                            </div>
                        </div>
                    }
                </div>
            )
        }

        const listingmultipleColumn = (data) => {
            return (
                <div className="row">
                    {
                        data.length > 0 && data.map((x) => {
                            return (
                                <div className="col-4" key={x.title}>
                                    <TextField
                                        variant="outlined"
                                        style={{ width: "100%" }}
                                        label={x.title}
                                        value={x.title === "体积重量" || x.title === "体积" ? calculateVolumetric(x.title) : x.value}
                                        type="number"
                                        size="small"
                                        required
                                        disabled={x.title === "体积重量" || x.title === "体积" ? true : false}
                                        onChange={(e) => this.handleChange(e.target.value, x.title)}
                                    />
                                    {x.error && <div><label style={{ color: "red", fontSize: "10pt" }}>请输入对的{x.title}</label></div>}
                                </div>
                            )
                        })
                    }
                </div>
            )
        }


        const handleButton = (type) => {
            console.log("handleButton", type)
            switch (type) {
                case "Save":
                    if (!this.verifyError()) {
                        let Obj = this.createObject()
                        this.props.CallAddInventory(Obj)
                        this.setState({ isSubmitAdd: true })
                    }
                    else
                        toast.error("请确保正确填写所有包裹资料")
                    break;

                case "Print":
                    if (!this.verifyError()) {
                        let Obj = this.createObject()
                        this.props.CallAddInventory(Obj)
                        this.setState({ isSubmitAdd: true })
                    }
                    else
                        toast.error("请确保正确填写所有包裹资料")
                    break;

                case "RePrint":
                    this.createObject()
                    break;

                case "Delete":
                    if (this.state.stockData[0].StockID !== "" && this.state.stockData[0].StockID !== undefined) {
                        this.props.CallDeleteInventory({
                            StockID: this.state.stockData[0].StockID,
                            ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID === null ? 1 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
                        })
                        this.setState({ isSubmitAdd: true, isSubmitDelete: true })
                    } else {
                        toast.error("未入库单号不可删除")
                    }

                default:
                    break;
            }
        }

        const pageStyle = `@page { size:  80mm 60mm;  margin: 5mm; } @media print { body { -webkit-print-color-adjust: exact; }};`
        const buttonLayout = (data) => {
            return (
                data.length > 0 && data.map((x) => {
                    return (
                        <div className="row" style={{ padding: "15pt" }} onClick={() => handleButton(x.type)} key={x.item} >
                            {
                                x.type === "Delete" || x.type === "Save" ?
                                    <Button style={{
                                        paddingTop: "40pt", paddingBottom: "40pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                        backgroundColor: this.verifyError() ? "grey" : "#0362fc"
                                    }} disabled={
                                        x.type === "Delete" ? this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal === 0 ? true : false :
                                            this.verifyError() ? true : false}
                                    >
                                        {x.title}
                                    </Button>
                                    :
                                    <ReactToPrint
                                        style={{ width: "100%", display: "inline" }}
                                        pageStyle={pageStyle}
                                        trigger={(e) => {
                                            return (
                                                <Button style={{
                                                    paddingTop: "40pt", paddingBottom: "40pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                                    backgroundColor: this.verifyError() ? "grey" : "#0362fc"
                                                }} disabled={this.verifyError() ? true : false}
                                                >
                                                    {x.title}
                                                </Button>
                                            );
                                        }}
                                        content={() => this.componentRef}
                                    />
                            }

                        </div >
                    )
                })
            )
        }

        const renderPrintListing = () => {
            let listing = this.state.stockData[0]
            let data = []
            if (listing.length > 0) {
                for (let index = 0; index < listing.Quantity; index++) {
                    data.push({
                        UserCode: listing.UserCode,
                        TrackingNumber: listing.Quantity > 1 ? listing.TrackingNumber.replace(/ /g, '') + "00" + parseInt(index + 1) : listing.TrackingNumber.replace(/ /g, ''),
                        ProductWeight: (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight,
                        ProductHeight: (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight,
                        ProductDeep: (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep,
                        ProductWidth: (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth,
                        CourierID: (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID,
                        Item: (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item.replace(/ /g, ''),
                        Remark: (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark.replace(/ /g, ''),
                        areaCode: (isStringNullOrEmpty(listing.areaCode)) ? "-" : listing.areaCode,
                        UserData: (isStringNullOrEmpty(listing.UserData)) ? "-" : listing.UserData,
                    })
                }
            }
            return (
                data.length > 0 && data.map((x) => {
                    return (
                        <div className="row" key={x.TrackingNumber} style={{ display: "block" }}>
                            <div style={{ textAlign: "center" }}>
                                <Typography style={{ fontWeight: "600", fontSize: "14pt", color: "#253949", letterSpacing: 1 }}>{x.areaCode}</Typography>
                                <Barcode value={x.TrackingNumber} height='80pt' />
                                <div className="row" style={{ textAlign: "left" }}>
                                    <Typography style={{ fontWeight: "600", fontSize: "8pt", color: "#253949", letterSpacing: 1 }}>会员： {x.UserCode}</Typography>
                                    <Typography style={{ fontWeight: "600", fontSize: "8pt", color: "#253949", letterSpacing: 1 }}>名称： {x.UserData}</Typography>
                                    <Typography style={{ fontWeight: "600", fontSize: "8pt", color: "#253949", letterSpacing: 1 }}>入库：{moment(new Date()).format('DD-MM-YYYY, hh:mm:ss')}</Typography>
                                </div>
                            </div>
                        </div>
                    )
                })

            )
        }

        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="row" style={{ textAlign: "center" }}>
                        <Typography style={{ fontWeight: "600", fontSize: "20pt", color: "#253949", letterSpacing: 1 }}>快递入库</Typography>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-7 col-xs-12" style={{ paddingTop: "10pt" }}>
                        {
                            isArrayNotEmpty(stockData) && stockData.map((x) => {

                                return (
                                    <>
                                        {listingLayout("快递单号", x.TrackingNumber, x.isTrackingError, "text")}
                                        {listingLayout("快递公司", x.CourierID, x.isCourierError, "list")}
                                        {listingLayout("会员号", x.UserCode, x.isUserCodeError, "text")}
                                        {listingLayout("会员信息", x.UserData, x.isUserDataError, "text")}
                                        {listingLayout("货物信息", x.Item, x.isItemError, "text")}

                                        <hr size="5" style={{ marginTop: "20pt" }} />
                                        <div className="row" style={{ paddingTop: "20pt" }}>
                                            <div className="col-2" >
                                                <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>重量 :</Typography>
                                            </div>
                                            <div className="col-10" >
                                                <div className="row">
                                                    {listingmultipleColumn([
                                                        { title: "实际重量", value: x.ProductWeight, error: x.isProductWeightError },
                                                        { title: "体积重量", value: x.ProductVolumetricWeight, error: x.isProductVolumetricWeightError },
                                                        { title: "体积", value: "", error: "" }
                                                    ])}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row" style={{ paddingTop: "20pt" }}>
                                            <div className="col-2" >
                                                <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>尺寸 :</Typography>
                                            </div>
                                            <div className="col-10" >
                                                <div className="row">
                                                    {listingmultipleColumn([
                                                        { title: "长", value: x.ProductDeep, error: x.isProductDeepError },
                                                        { title: "宽", value: x.ProductWidth, error: x.isProductWidthError },
                                                        { title: "高", value: x.ProductHeight, error: x.isProductHeightError }
                                                    ])}
                                                </div>
                                            </div>
                                        </div>
                                        {listingLayout("备注", x.Remark, x.isRemarkError, "text")}
                                    </>
                                )
                            })
                        }

                    </div>
                    {console.log("statstatsasa", this.state)}

                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-5 col-xs-12" >
                        <div className="row" style={{ textAlign: "center" }}>
                            <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>未装箱包裹 : {this.state.currentVolume}</Typography>
                        </div>
                        {buttonLayout([
                            { title: "打印", type: "Print" },
                            { title: "重印", type: "RePrint" },
                            { title: "仅保存", type: "Save" },
                            { title: "删除", type: "Delete" }
                        ])}
                    </div>
                    {console.log("dsdsadsadad", this.state.isSubmitData)}

                    <div style={{ display: "none" }} >
                        <div ref={(el) => (this.componentRef = el)}>
                            {renderPrintListing()}
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WarehouseStock));