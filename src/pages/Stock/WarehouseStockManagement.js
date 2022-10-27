import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { withRouter } from "react-router";
import { isArrayNotEmpty, isStringNullOrEmpty, isNumber } from "../../tools/Helpers";
import { toast } from "react-toastify"
import Barcode from 'react-barcode';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import moment from 'moment';
import { Button, TextField, Autocomplete, Box, Typography, } from '@mui/material'
import QRCode from 'qrcode.react';
// let { remote } = require("electron");
// const { PosPrinter } = remote.require("electron-pos-printer");

// import { Br, Cut, Line, Printer, Text, Row, render } from 'react-thermal-printer';



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

    stockData: [{
        TrackingNumber: "",
        isTrackingError: false,
        CourierID: { CourierID: "", CourierName: "" },
        isCourierError: false,
        UserCode: "",
        isUserCodeError: false,
        UserData: "",
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
        areaCode: "",
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
        let listing = this.props.inventoryStock[0]
        let userListing = this.props.userData[0]


        if (this.state.isCheckUser === true && this.props.userData.length > 0) {

            let arr = this.state.stockData
            if (this.props.userData[0].ReturnVal !== 0) {
                arr[0].UserData = userListing.Username
                arr[0].areaCode = this.verifyAreaCode(userListing.UserAreaID)
            } else {
                arr[0].UserData = ""
                arr[0].areaCode = ""
                toast.warning("没有此会员记录，请确输入正确会员号")
            }
            this.setState({ isCheckUser: false, stockData: arr })
            this.props.ClearUserCodeData()
        }

        if (this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal !== 0 && this.state.isCheckDatabase === true) {
            let arr = this.state.stockData
            if (this.props.inventoryStock[0].ReturnVal !== 0) {
                console.log("sdasdasd", this.props)
                arr[0].CourierID = listing.CourierID
                arr[0].UserCode = listing.UserCode
                arr[0].areaCode = listing.UserAreaID
                arr[0].UserData = listing.Username
                arr[0].Item = listing.Item
                arr[0].Quantity = listing.ProductQuantity
                arr[0].ProductWeight = listing.ProductWeight
                arr[0].CourierID = { CourierID: listing.CourierID, CourierName: listing.CourierName }
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
            if (this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal === 0 && this.state.stockData[0].StockID !== "")
                this.setInital(this.state.stockData[0].TrackingNumber)
        }

        if (this.props.inventoryStockAction.length > 0 && this.state.isSubmitAdd === true) {
            if (this.props.inventoryStockAction[0].ReturnVal === 1) {
                if (this.state.isSubmitDelete === true) {
                    toast.success("已成功删除")
                    window.location.reload(false)
                }
                else {
                    if (this.state.stockData[0].StockID === "")
                        toast.success("已成功入库")
                    else
                        toast.success("已更新成功")
                }

            } else {
                if (this.state.isSubmitDelete === true)
                    toast.error("包裹未删除成功, 请联系系统管理")
                else
                    toast.error("包裹未入库成功，请联系系统管理")
            }
            this.props.ClearInventoryAction()
            this.setState({ isSubmitAdd: false, isSubmitDelete: false })
        }
    }

    setInital(data) {
        this.setState({
            stockData: [{
                TrackingNumber: data,
                isTrackingError: false, CourierID: { CourierID: "", CourierName: "" }, isCourierError: false, UserCode: "", isUserCodeError: false,
                UserData: "", Item: "", isItemError: false, Quantity: 1, isQuantityError: false, ProductWeight: "", isProductWeightError: false,
                ProductVolumetricWeight: "", isProductVolumetricWeightError: false, ProductHeight: "", isProductHeightError: false, ProductWidth: "",
                isProductWidthError: false, ProductDeep: "", isProductDeepError: false, Remark: "", areaCode: "", createdDate: "", StockID: "",
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

                if (data.length === 5 && this.state.isCheckUser === false) {
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
            listing.isProductWidthError === false && listing.isProductDeepError === false) {
            if (listing.TrackingNumber !== "" && listing.CourierID !== "" && listing.UserCode !== "" && listing.Item !== "" &&
                listing.Quantity !== "" && listing.ProductWeight !== "" && listing.ProductHeight !== "" &&
                listing.ProductWidth !== "" && listing.ProductDeep !== "" && listing.UserData !== "") {
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
            listing.filter((x) => x.UserAreaID == id).map((y) => {
                data = y.AreaCode
            })
        }
        return data
    }


    createObject = () => {
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
        let areaCode = ""
        let createdDate = ""
        console.log(" listing.UserCode", listing.areaCode)


        for (let index = 0; index < listing.Quantity; index++) {
            UserCode += listing.UserCode;
            TrackingNumber += listing.Quantity > 1 ? listing.TrackingNumber.replace(/ /g, '') + "00" + parseInt(index + 1) : listing.TrackingNumber.replace(/ /g, '');
            ProductWeight += (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight;
            ProductHeight += (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight;
            ProductDeep += (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep;
            ProductWidth += (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth;
            CourierID += (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID.CourierID;
            Item += (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item.replace(/ /g, '');
            Remark += (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark.replace(/ /g, '');
            areaCode += (isStringNullOrEmpty(listing.areaCode)) ? "-" : listing.areaCode ;
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
        const handleFilter = (event, data) => {
            let arr = []
            arr = this.state.stockData[0]
            let finalData = []

            arr.isCourierError = false
            if (isArrayNotEmpty(data))
                arr.isCourierError = true
            arr.CourierID = data

            finalData.push(arr)
            this.setState({ stockData: finalData })
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
                                    <Autocomplete
                                        disableCloseOnSelect={true}
                                        disablePortal
                                        size="small"
                                        id="combo-box-demo"
                                        options={this.props.courier}
                                        getOptionLabel={(option) => option.CourierName}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.CourierID}>
                                                    {option.CourierName}
                                                </li>
                                            )
                                        }}
                                        renderInput={(params) => <TextField {...params} label="快递" />}
                                        onChange={(e, obj) => {
                                            handleFilter(e, obj)
                                        }}
                                        value={value}
                                    />
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
                                inputProps={{ maxLength: title === "会员号" && 5 }}
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
                                disabled={stockData[0].StockID !== "" ? true : false}
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
                    break;

                default:
                    break;
            }
        }
        const pageStyle = `@media print {
            @page {
             size: 300px 227px landscape;
             margin:5px
            }
          }`;

        // const pageStyle = `@page { size: 40mm 30mm landscape;  } @media print { body { -webkit-print-color-adjust: exact; } };`
        const buttonLayout = (data) => {
            return (
                data.length > 0 && data.map((x) => {
                    return (
                        <div className="row" style={{ padding: "5pt 20pt 15pt" }} onClick={() => handleButton(x.type)} key={x.item} >
                            {
                                x.type === "Delete" || x.type === "Save" ?
                                    <Button style={{
                                        paddingTop: "30pt", paddingBottom: "30pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                        backgroundColor: this.verifyError() ? "grey" : "#0362fc"
                                    }} disabled={
                                        x.type === "Delete" ? this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal === 0 ? true : false :
                                            this.verifyError() ? true : false}
                                    >
                                        {x.title}
                                    </Button>
                                    :
                                    // <Button style={{
                                    //     paddingTop: "30pt", paddingBottom: "30pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                    //     backgroundColor: this.verifyError() ? "grey" : "#0362fc"
                                    // }} disabled={this.verifyError() ? true : false} onClick={() => renderPrintListing()}
                                    // >
                                    //     {x.title}
                                    // </Button>
                                    <ReactToPrint
                                        style={{ width: "100%", display: "inline" }}
                                        pageStyle={pageStyle}
                                        preview={false}
                                        trigger={(e) => {
                                            return (
                                                <Button style={{
                                                    paddingTop: "30pt", paddingBottom: "30pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                                    backgroundColor: this.verifyError() ? "grey" : "#0362fc"
                                                }} disabled={this.verifyError() ? true : false}
                                                >
                                                    {x.title}111
                                                </Button>
                                            );
                                        }}
                                        onAfterPrint={() => { window.location.reload(false) }}
                                        content={() => this.componentRef}
                                    />
                            }

                        </div >
                    )
                })
            )
        }
        // <script src="./renderer.js"></script>
        const renderPrintListing = () => {
            let dataListing = []
            let listing = ""
            if (this.state.stockData.length > 0) {
                listing = this.state.stockData[0]
                for (let index = 0; index < listing.Quantity; index++) {
                    dataListing.push({
                        UserCode: listing.UserCode,
                        TrackingNumber: listing.Quantity > 1 ? listing.TrackingNumber.replace(/ /g, '') + "00" + parseInt(index + 1) : listing.TrackingNumber.replace(/ /g, ''),
                        ProductWeight: (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight,
                        ProductHeight: (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight,
                        ProductDeep: (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep,
                        ProductWidth: (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth,
                        CourierID: (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID.CourierID,
                        Item: (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item.replace(/ /g, ''),
                        Remark: (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark.replace(/ /g, ''),
                        areaCode: (isStringNullOrEmpty(listing.areaCode)) ? "-" : this.verifyAreaCode(listing.areaCode),
                        UserData: (isStringNullOrEmpty(listing.UserData)) ? "-" : listing.UserData,
                    })
                }
            }

            return (
                dataListing.length > 0 && dataListing.map((x) => {
                    return (
                        <div key={x.TrackingNumber} style={{ width: "300px", paddingLeft: "0px", paddingTop: "3pt" }}>
                            {/* <Typography style={{ fontWeight: "600", fontSize: "16pt", color: "#253949", letterSpacing: 1 }}>{x.areaCode}</Typography> */}
                            <Barcode value={x.TrackingNumber} height='50pt' width='1px' fontSize='23pt' />
                            <div className="row" style={{ textAlign: "left", paddingTop: "4pt" }}>
                                <div className="col-2" style={{itemAlign:"center"}}>
                                    <QRCode value={x.TrackingNumber} size={50}/>,
                                </div>
                                <div className="col-10">
                                    <Typography style={{ fontWeight: "600", fontSize: "11pt", color: "#253949", letterSpacing: 1 }}>会员：
                                        <label style={{ fontSize: "14pt" }}> {x.UserCode} ( {x.areaCode} )</label></Typography>
                                    <Typography style={{ fontWeight: "600", fontSize: "11pt", color: "#253949", letterSpacing: 1 }}>称号： {x.UserData}</Typography>
                                    <Typography style={{ fontWeight: "600", fontSize: "11pt", color: "#253949", letterSpacing: 1 }}>入库：{moment(new Date()).format('DD-MM-YYYY, hh:mm:ss')}</Typography>
                                </div>
                            </div>
                        </div>
                    )
                })
            )

            // document.getElementById("DisplayNumber").innerHTML = 123
            // document.getElementById("CurrentNumber").innerHTML = 456

            // const data = [
            //     {
            //         type: "text", value: `<html><style>
            //               .font-center{
            //                 width:"100%";
            //                 text-align: center;
            //               }
            //               .font-60-pt {
            //                   font-size: 60pt;
            //               }
            //               .font-20-pt {
            //                 font-size: 20pt;
            //               }
            //               .width-100 {
            //                 width: 100%;
            //               }
            //               .height-100 {
            //                 height: 100%;
            //               }
            //             </style>
            //             <body>
            //               <div class="p-4 width-100 height-100">
            //                 <img style="filter: grayscale(100%);" src='data:image/png;base64, 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' width='150'/>
            //                 <div class="font-center font-weight-bolder font-20-pt">
            //                   NORMAL LANE
            //                 </div>
            //                 <div class="font-center font-weight-bolder font-60-pt" id="DisplayNumber"> 123` 
            //             `</div>
            //                 <div class="font-center">
            //                   Currently serving: <b id="CurrentNumber"> 123`  `</b>
            //                 </div>
            //                 <div class="mt-2 font-center">` `</div>
            //               </div>
            //             </body>
            //           </html>`,
            //         css: { "font-size": "15px", "width": "100%", "height": "100%" }
            //     }];
            // let printerName = "XP-80C";
            // let widthPage = 300;
            // const options = {
            //     preview: false,
            //     width: widthPage,
            //     margin: "0 0 0 0",
            //     copies: 1,
            //     printerName: printerName,
            //     timeOutPerLine: 400,
            //     silent: true,
            // };
            // const d = [...data];

            // if (printerName && widthPage) {
            //     PosPrinter.print(d, options)
            //         .then(() => { })
            //         .catch((error) => {
            //             console.error(error);
            //         });
            // } else {
            //     alert("Select the printer and the width");
            // }
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
                                        {listingLayout("会员信息", x.UserData, "", "text")}
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
                                        {listingLayout("备注", x.Remark, "", "text")}
                                    </>
                                )
                            })
                        }
                    </div>

                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-5 col-xs-12" style={{ paddingTop: "20pt" }} >
                        {/* <div className="row" style={{ textAlign: "center" }}>
                            <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>未装箱包裹 : {this.state.currentVolume}</Typography>
                        </div> */}
                        {buttonLayout([
                            { title: "打印", type: "Print" },
                            { title: "重印", type: "RePrint" },
                            { title: "仅保存", type: "Save" },
                            { title: "删除", type: "Delete" }
                        ])}
                    </div>

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