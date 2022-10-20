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

function mapStateToProps(state) {
    return {
        courier: state.counterReducer["courier"],
        userAreaCode: state.counterReducer["userAreaCode"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallViewInventoryByFilter: (propsData) => dispatch(GitAction.CallViewInventoryByFilter(propsData)),
        CallViewCourier: () => dispatch(GitAction.CallViewCourier()),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
    }
}

const INITIAL_STATE = {
    searchKeywords: "",
    searchCategory: "Tracking",
    searchArea: "",

    openModal: false,
    containerNo: "",
    containerDate: "",

    filteredProduct: [],
    isFiltered: false,

    requiredCheck: false,
    requiredCheck2: false,
    currentVolume: 60.5,

    stockData: [{
        TrackingNumber: "",
        isTrackingError: false,
        CourierID: "",
        isCourierError: false,
        UserCode: "",
        isUserCodeError: false,
        UserData: "",
        isUserDataError: false,
        UserAlias: "",
        isUserAliasError: false,
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
        createdDate: "10-10-2022",
    }],

    stockData2: [{
        TrackingNumber: "Sf256878787878dfd",
        CourierID: "2",
        UserCode: "1001",
        UserData: "12345",
        UserAlias: "sdsddds",
        Item: "日用品",
        Quantity: 1,
        ProductWeight: "10",
        ProductVolumetricWeight: "",
        ProductHeight: "20",
        ProductWidth: "30",
        ProductDeep: "40.5",
        Remark: "",
    }],

    isSubmitData: [],
    UserDetails: [{ UserID: 1, UserAreaID: 1, UserAlias: "123", UserCode: "1001" }]
}


class WarehouseStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallViewCourier()
    }

    componentDidMount() { }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.requiredCheck === true && this.state.UserDetails.length > 0) {
            let arr = this.state.stockData
            arr[0].UserAlias = this.state.UserDetails[0].UserAlias
            this.setState({ requiredCheck: false, stockData: arr })
        }

        if (this.state.requiredCheck2 === true && this.state.stockData2.length > 0) {
            let arr = this.state.stockData
            let listing = this.state.stockData2[0]
            arr[0].CourierID = listing.CourierID
            arr[0].UserCode = listing.UserCode
            arr[0].UserData = listing.UserData
            arr[0].UserAlias = listing.UserAlias
            arr[0].Item = listing.Item
            arr[0].Quantity = listing.Quantity
            arr[0].ProductWeight = listing.ProductWeight
            arr[0].CourierID = listing.CourierID
            arr[0].ProductHeight = listing.ProductHeight
            arr[0].ProductWidth = listing.ProductWidth
            arr[0].ProductDeep = listing.ProductDeep
            arr[0].Remark = listing.Remark

            this.setState({ requiredCheck2: false, stockData: arr })
        }

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
                this.props.CallViewInventoryByFilter({ FILTERCOLUMN: "and TrackingNumber=" + data })
                this.setState({ requiredCheck2: true })
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

                if (data.length === 4)
                    this.setState({ requiredCheck: true })
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
        let data = []

        let areaCode = ""
        let createdDate = ""

        for (let index = 0; index < listing.Quantity; index++) {
            UserCode += listing.UserCode;
            TrackingNumber += listing.Quantity > 1 ? listing.TrackingNumber + "00" + parseInt(index + 1) : listing.TrackingNumber;
            ProductWeight += (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight;
            ProductHeight += (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight;
            ProductDeep += (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep;
            ProductWidth += (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth;
            CourierID += (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID;
            Item += (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item;
            Remark += (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark;
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
                TrackingNumber: listing.Quantity > 1 ? listing.TrackingNumber + "00" + parseInt(index + 1) : listing.TrackingNumber,
                ProductWeight: (isStringNullOrEmpty(listing.ProductWeight)) ? "0" : listing.ProductWeight,
                ProductHeight: (isStringNullOrEmpty(listing.ProductHeight)) ? "0" : listing.ProductHeight,
                ProductDeep: (isStringNullOrEmpty(listing.ProductDeep)) ? "0" : listing.ProductDeep,
                ProductWidth: (isStringNullOrEmpty(listing.ProductWidth)) ? "0" : listing.ProductWidth,
                CourierID: (isStringNullOrEmpty(listing.CourierID)) ? "0" : listing.CourierID,
                Item: (isStringNullOrEmpty(listing.Item)) ? "-" : listing.Item,
                Remark: (isStringNullOrEmpty(listing.Remark)) ? "-" : listing.Remark,
                areaCode: (isStringNullOrEmpty(listing.areaCode)) ? "-" : listing.areaCode,
                createdDate: (isStringNullOrEmpty(listing.createdDate)) ? "-" : listing.createdDate
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
            ModifyBy: localStorage.getItem("UserID")
        }

        this.setState({ isSubmitData: data })
    }

    render() {
        const { stockData } = this.state
        const calculateVolumetric = () => {
            let height = stockData[0].ProductHeight
            let deep = stockData[0].ProductDeep
            let width = stockData[0].ProductWidth
            let data = ""

            if (isNumber(height) && isNumber(deep) !== "" && isNumber(width) !== "") {
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
                <div className="row" style={{ paddingTop: "20pt" }}>
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
                </div>
            )
        }

        const listingmultipleColumn = (data) => {
            return (
                <div className="row">
                    {
                        data.length > 0 && data.map((x) => {
                            return (
                                <div className="col-4" >
                                    <TextField
                                        variant="outlined"
                                        style={{ width: "100%" }}
                                        label={x.title}
                                        value={x.title === "体积重量" ? calculateVolumetric() : x.value}
                                        type="number"
                                        size="small"
                                        required
                                        disabled={x.title === "体积重量" ? true : false}
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
                        this.createObject()
                    }
                    else
                        toast.error("请确保正确填写所有包裹资料")
                    break;

                case "Print":
                    if (!this.verifyError()) {
                        this.createObject()
                    }
                    else
                        toast.error("请确保正确填写所有包裹资料")
                    break;

                default:
                    break;
            }
        }

        const pageStyle = `@page { size:  80mm 60mm;  margin: 5mm; } @media print { body { -webkit-print-color-adjust: exact; }};`
        const buttonLayout = (data) => {
            return (
                data.length > 0 && data.map((x) => {
                    return (
                        <div className="row" style={{ padding: "20pt" }} onClick={() => handleButton(x.type)} >
                            <ReactToPrint
                                style={{ width: "100%", display: "inline" }}
                                pageStyle={pageStyle}
                                trigger={(e) => {
                                    return (
                                        <Button style={{ paddingTop: "40pt", paddingBottom: "40pt", borderRadius: "20pt", backgroundColor: this.verifyError() ? "grey" : "#0362fc", color: "white", fontWeight: "bold" }}
                                            disabled={this.verifyError() ? true : false}
                                        >
                                            {x.title}
                                        </Button>
                                    );
                                }}
                                content={() => this.componentRef}
                            />
                        </div >
                    )
                })
            )
        }

        const renderPrintListing = (data) => {
            let listing = data
            return (
                <div>
                    <div style={{ textAlign: "center" }}>
                        <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>{listing.areaCode}</Typography>
                        <Barcode value={listing.TrackingNumber} />
                        <div className="row" style={{ textAlign: "left" }}>
                            <Typography style={{ fontWeight: "600", fontSize: "10pt", color: "#253949", letterSpacing: 1 }}>会员： {listing.UserCode}</Typography>
                            <Typography style={{ fontWeight: "600", fontSize: "10pt", color: "#253949", letterSpacing: 1 }}>名称： {listing.UserAlias}</Typography>
                            <Typography style={{ fontWeight: "600", fontSize: "10pt", color: "#253949", letterSpacing: 1 }}>入库：{listing.createdDate}</Typography>
                        </div>
                    </div>
                    <br />
                </div>
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
                                        {listingLayout("会员信息", x.UserAlias, x.isUserAliasError, "text")}
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
                                                        { title: "体积重量", value: x.ProductVolumetricWeight, error: x.isProductVolumetricWeightError }
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

                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-5 col-xs-12" style={{ paddingTop: "30pt" }}>
                        <div className="row" style={{ textAlign: "center" }}>
                            <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>未装箱包裹 : {this.state.currentVolume}</Typography>
                        </div>
                        {buttonLayout([
                            { title: "打印", type: "Print" },
                            { title: "重印", type: "RePrint" },
                            { title: "保存", type: "Save" }

                        ])}
                    </div>
                    {
                        this.state.isSubmitData.length > 0 &&
                        <div style={{ display: "none" }} >
                            <div ref={(el) => (this.componentRef = el)}>
                                {
                                    this.state.isSubmitData.map((data) => {
                                        return (renderPrintListing(data))
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WarehouseStock));