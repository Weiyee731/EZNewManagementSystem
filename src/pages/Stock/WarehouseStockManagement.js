import React, { useState, useEffect, useRef } from "react";
import { GitAction } from "../../store/action/gitAction";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { withRouter } from "react-router";
import { isArrayNotEmpty, isStringNullOrEmpty, isNumber, isObjectUndefinedOrNull } from "../../tools/Helpers";
import { toast } from "react-toastify"
import Barcode from 'react-barcode';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import moment from 'moment';
import { Button, TextField, Autocomplete, Box, Typography, } from '@mui/material'
import QRCode from 'qrcode.react';
import EZLogo from "../../assets/logos/logo.png"
import { useSelector, useDispatch } from "react-redux";

export const WarehouseStock = (props) => {
    const { courier, userAreaCode, inventoryStockAction, inventoryStock, userData } = useSelector(state => ({
        courier: state.counterReducer.courier,
        userAreaCode: state.counterReducer.userAreaCode,
        inventoryStockAction: state.counterReducer.inventoryStockAction,
        inventoryStock: state.counterReducer.inventoryStock,
        userData: state.counterReducer.userData,
    }));

    const dispatch = useDispatch()
    const firstRender = useRef(true);
    let componentRef = useRef();

    const [isCheckUser, setIsCheckUser] = useState(false)
    const [isCheckDatabase, setIsCheckDatabase] = useState(false)
    const [isSubmitAdd, setIsSubmitAdd] = useState(false)
    const [isSubmitDelete, setIsSubmitDelete] = useState(false)
    const [stockData, setStockData] = useState([{
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
    }])
    const [currentVolume, setCurrentVolume] = useState(65.5)
    const [currrentTitle, setCurrentTitle] = useState("快递单号")
    const [focusID, setFocusID] = useState(1)
    const trackingNoRef = useRef(null)
    const qtyRef = useRef(null)
    const courierCoRef = useRef(null)
    const userCodeRef = useRef(null)
    const itemDescRef = useRef(null)
    const productWeightRef = useRef(null)
    const productLengthRef = useRef(null)
    const productWidthRef = useRef(null)
    const productHeightRef = useRef(null)
    const printingRef = useRef(null)

    useEffect(() => {
        if (userAreaCode.length === 0) {
            dispatch(GitAction.CallUserAreaCode())
        }
        if (inventoryStockAction.length > 0 && isSubmitAdd === true) {
            if (inventoryStockAction[0].ReturnVal === 1) {
                if (isSubmitDelete === true) {
                    toast.success("已成功删除")
                    window.location.reload(false)
                } else {
                    if (stockData[0].StockID === "")
                        toast.success("已成功入库")
                    else
                        toast.success("已更新成功")

                    setStockData([{
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
                    }])

                    // window.location.reload(false)
                }
            } else {
                if (isSubmitDelete === true)
                    toast.error("包裹未删除成功, 请联系系统管理")
                else
                    toast.error("包裹未入库成功，请联系系统管理")
            }
            dispatch(GitAction.ClearInventoryAction())
            dispatch(GitAction.ClearInventoryStock())
            setIsSubmitAdd(false)
            setIsSubmitDelete(false)
            setIsCheckDatabase(false)
            setIsCheckUser(false)
        }
    }, [inventoryStockAction])

    useEffect(() => {
        let listing = inventoryStock[0]

        if (inventoryStock.length > 0 && inventoryStock[0].StockID && isCheckDatabase) {
            let arr = [...stockData]
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
            arr[0].createdDate = moment(listing.StockDate).format('DD-MM-YYYY, HH:mm:ss ')
            setIsCheckDatabase(false)
            setStockData(arr)
        } else {
            if (inventoryStock.length > 0 && inventoryStock[0].ReturnVal === 0 && stockData[0].StockID !== "")
                setInital(stockData[0].TrackingNumber)
        }
    }, [inventoryStock])

    useEffect(() => {
        let userListing = userData[0]

        if (isCheckUser && isArrayNotEmpty(userData)) {
            let arr = stockData
            if (userData[0].ReturnVal !== 0) {
                arr[0].UserData = userListing.Username
                arr[0].areaCode = userListing.UserAreaID
            } else {
                arr[0].UserData = ""
                arr[0].areaCode = ""
                toast.warning("没有此会员记录，请确输入正确会员号")
            }
            setIsCheckUser(false)
            setStockData(arr)
            dispatch(GitAction.ClearUserCodeData())
        }
    }, [userData])

    useEffect(() => {
        if (!isObjectUndefinedOrNull(props.selectedRow)) {
            let arr = stockData
            arr[0].TrackingNumber = props.selectedRow.TrackingNumber
            setStockData(arr)
        }
    }, [props.selectedRow])

    useEffect(() => {
        if (firstRender.current) {
            dispatch(GitAction.CallViewCourier())
            dispatch(GitAction.CallUserAreaCode())
            firstRender.current = false;
        }
        return () => {
            firstRender.current = true;
        }
    }, [])

    function setInital(data) {
        setStockData([{
            TrackingNumber: data,
            isTrackingError: false, CourierID: { CourierID: "", CourierName: "" }, isCourierError: false, UserCode: "", isUserCodeError: false,
            UserData: "", Item: "", isItemError: false, Quantity: 1, isQuantityError: false, ProductWeight: "", isProductWeightError: false,
            ProductVolumetricWeight: "", isProductVolumetricWeightError: false, ProductHeight: "", isProductHeightError: false, ProductWidth: "",
            isProductWidthError: false, ProductDeep: "", isProductDeepError: false, Remark: "", areaCode: "", createdDate: "", StockID: "",
        }])
    }

    function handleChange(data, title) {
        let arr = []
        arr = stockData[0]
        let finalData = []

        switch (title) {
            case "快递单号":
                arr.isTrackingError = false
                if (isStringNullOrEmpty(data))
                    arr.isTrackingError = true
                arr.TrackingNumber = data
                dispatch(GitAction.CallViewInventoryByFilter({ FilterColumn: "and TrackingNumber='" + data + "'" }))
                setIsCheckDatabase(true)
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

                if (data.length === 4 && isCheckUser === false) {
                    dispatch(GitAction.CallViewProfileByUserCode({ UserCode: arr.UserCode }))
                    setIsCheckUser(true)
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
        setStockData(finalData)
    }

    const verifyError = () => {
        let listing = stockData[0]
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

    const verifyAreaCode = (id) => {
        let listing = userAreaCode
        let data = ""

        if (listing.length > 0 && listing[0].ReturnVal !== 0) {
            listing.filter((x) => x.UserAreaID == id).map((y) => {
                data = y.AreaCode
            })
        }
        return data
    }

    const createObject = () => {
        let listing = stockData[0]
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

    const renderPrintListing = () => {
        let dataListing = []
        let listing = ""
        if (stockData.length > 0) {
            listing = stockData[0]
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
                    areaCode: (isStringNullOrEmpty(listing.areaCode)) ? "-" : verifyAreaCode(listing.areaCode),
                    UserData: (isStringNullOrEmpty(listing.UserData)) ? "-" : listing.UserData,
                })
            }
        }
        return (
            dataListing.length > 0 && dataListing.map((x) => {
                return (
                    <div key={x.TrackingNumber} style={{ width: "330px", height: "270px", paddingLeft: "10pt", paddingTop: "20pt", paddingBottom: "10pt" }}>
                        <div className="row" style={{ textAlign: "center", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                            <Typography style={{ fontWeight: "600", fontSize: "16pt", letterSpacing: 1 }}>EZ 转运 ({x.areaCode})</Typography>
                        </div>
                        <Barcode value={x.TrackingNumber} />
                        <div className="row" style={{ textAlign: "left", paddingTop: "10pt" }}>
                            <div className="col-2" style={{ itemAlign: "center", paddingTop: "5px" }}>
                                <QRCode value={x.TrackingNumber} size={65} />
                            </div>
                            <div className="col-10" style={{ paddingLeft: "21pt" }}>
                                <Typography style={{ fontWeight: "600", fontSize: "13pt", color: "#253949", letterSpacing: 1 }}>会员： <label style={{ fontSize: "18pt" }}> {x.UserCode} 已验视</label></Typography>
                                <Typography style={{ fontWeight: "600", fontSize: "12pt", color: "#253949", letterSpacing: 1 }}>名称： {x.UserData}</Typography>
                                <Typography style={{ fontWeight: "600", fontSize: "9pt", color: "#253949", letterSpacing: 1 }}>打印：{moment(new Date()).format('DD-MM-YYYY, HH:mm:ss')} EZ ({x.areaCode}) </Typography>
                            </div>
                        </div>
                    </div>
                )
            })
        )
    }

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

    if (courier !== undefined && courier.length > 0) {
        var generateOptions = []
        let DataList = courier
        generateOptions = DataList.length > 0 &&
            DataList.map((data, i) => {
                return (
                    <MenuItem key={i} value={data.CourierID}>{data.CourierName}</MenuItem>
                );
            });
    }

    const handleFilter = (event, data) => {
        let arr = []
        arr = stockData[0]
        let finalData = []

        arr.isCourierError = false
        if (isArrayNotEmpty(data))
            arr.isCourierError = true
        arr.CourierID = data

        finalData.push(arr)
        setStockData(finalData)
    }

    const listingLayout = (title, value, error, type, ref, nextRef) => {
        return (
            <div className="row" style={{ paddingTop: "20pt" }} key={title}>
                <div className="col-3" >
                    <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>{title} :</Typography>
                </div>
                <div className="col-4" >
                    {type === "list" ?
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    size="small"
                                    id="combo-box-demo"
                                    options={courier}
                                    getOptionLabel={(option) => option.CourierName.length > 0 ? option.CourierName.trim() : ""}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.CourierID}>
                                                {option.CourierName.length > 0 ? option.CourierName.trim() : ""}
                                            </li>
                                        )
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="快递"
                                            inputRef={ref}
                                            inputProps={{
                                                ...params.inputProps,
                                                onKeyPress: event => {
                                                    const { key } = event;
                                                    if (key === "Enter") {
                                                        nextRef.current.focus();
                                                    }
                                                }
                                            }}
                                        />
                                    }
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
                            autoFocus={title === "快递单号" ? true : false}
                            disabled={title === "会员信息" ? true : false}
                            onChange={(e) => handleChange(e.target.value, title)}
                            inputRef={ref}
                            inputProps={{
                                onKeyPress: event => {
                                    const { key } = event;
                                    if (key === "Enter") {
                                        nextRef.current.focus();
                                    }
                                },
                                maxLength: title === "会员号" ? 4 : 9999
                            }}
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
                            inputRef={qtyRef}
                            inputProps={{
                                onKeyPress: event => {
                                    const { key } = event;
                                    if (key === "Enter") {
                                        courierCoRef.current.focus();
                                    }
                                }
                            }}
                            disabled={stockData[0].StockID !== "" ? true : false}
                            onChange={(e) => handleChange(e.target.value, "数量")}
                        />
                        {stockData[0].isQuantityError && <div><label style={{ color: "red", fontSize: "10pt" }}>请输入对的整数</label></div>}
                    </div>
                }
                {
                    title === "会员信息" && inventoryStock.length > 0 && inventoryStock[0].ReturnVal !== 0 &&
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

    const listingmultipleColumn = (data, index) => {
        return (
            <div className="row" key={index}>
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
                                    onChange={(e) => handleChange(e.target.value, x.title)}
                                    inputRef={x.ref}
                                    inputProps={{
                                        onKeyPress: event => {
                                            const { key } = event;
                                            if (key === "Enter") {
                                                x.nextRef.current.focus();
                                            }
                                        }
                                    }}
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
                if (!verifyError()) {
                    let Obj = createObject()
                    dispatch(GitAction.CallAddInventory(Obj))
                    setIsSubmitAdd(true)
                }
                else
                    toast.error("请确保正确填写所有包裹资料")
                break;

            case "Print":
                if (!verifyError()) {
                    let Obj = createObject()
                    toast.warning("SENDING Inventory_AddStock ")
                    dispatch(GitAction.CallAddInventory(Obj))
                    setIsSubmitAdd(true)
                }
                else
                    toast.error("请确保正确填写所有包裹资料")
                break;

            case "RePrint":
                createObject()
                break;

            case "Delete":
                if (stockData[0].StockID !== "" && stockData[0].StockID !== undefined) {
                    dispatch(GitAction.CallDeleteInventory({
                        StockID: stockData[0].StockID,
                        ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID === null ? 1 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
                    }))
                    setIsSubmitAdd(true)
                    setIsSubmitDelete(true)
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
             size: 300px 228px landscape;
             margin:5px;
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
                                <Button
                                    style={{
                                        paddingTop: "30pt", paddingBottom: "30pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                        backgroundColor: verifyError() ? "grey" : "#0362fc"
                                    }}
                                    disabled={
                                        x.type === "Delete" ? inventoryStock.length > 0 && inventoryStock[0].ReturnVal === 0 ? true : false :
                                            verifyError() ? true : false}
                                >
                                    {x.title}
                                </Button>
                                :
                                <ReactToPrint
                                    style={{ width: "100%", display: "inline" }}
                                    pageStyle={pageStyle}
                                    preview={false}
                                    trigger={(e) => {
                                        return (
                                            <Button
                                                style={{
                                                    paddingTop: "30pt", paddingBottom: "30pt", borderRadius: "20pt", color: "white", fontWeight: "bold", fontSize: "20pt",
                                                    backgroundColor: verifyError() ? "grey" : "#0362fc"
                                                }}
                                                disabled={verifyError() ? true : false}
                                                ref={x.type === "Print" ? printingRef : null}
                                            >
                                                {x.title}
                                            </Button>
                                        );
                                    }
                                    }
                                    // onAfterPrint={() => { window.location.reload(false) }}
                                    content={() => componentRef}
                                />
                        }

                    </div >
                )
            })
        )
    }

    return (
        <div className="container-fluid" >
            <div className="row">
                <div className="row" style={{ textAlign: "center" }}>
                    <label style={{ fontWeight: "600", fontSize: "20pt", color: "#253949", letterSpacing: 1 }}>
                        <img src={EZLogo} height="45px" style={{ paddingLeft: "20px", paddingRight: "10px" }} />  壹智快递入库  </label>
                    {/* <Typography style={{ fontWeight: "600", fontSize: "20pt", color: "#253949", letterSpacing: 1 }}>
                       壹智快递入库 
                    </Typography> */}
                </div>
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-7 col-xs-12" style={{ paddingTop: "10pt" }}>
                    {
                        isArrayNotEmpty(stockData) && stockData.map((x, index) => {
                            return (
                                <form key={index}>
                                    {listingLayout("快递单号", x.TrackingNumber, x.isTrackingError, "text", trackingNoRef, qtyRef)}
                                    {listingLayout("快递公司", x.CourierID, x.isCourierError, "list", courierCoRef, userCodeRef)}
                                    {listingLayout("会员号", x.UserCode, x.isUserCodeError, "text", userCodeRef, itemDescRef)}
                                    {listingLayout("会员信息", x.UserData, "", "text", null, null)}
                                    {listingLayout("货物信息", x.Item, x.isItemError, "text", itemDescRef, productWeightRef)}

                                    <hr size="5" style={{ marginTop: "20pt" }} />
                                    <div className="row" style={{ paddingTop: "20pt" }}>
                                        <div className="col-3" >
                                            <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>重量 :</Typography>
                                        </div>
                                        <div className="col-9" >
                                            <div className="row">
                                                {listingmultipleColumn([
                                                    { title: "实际重量", value: x.ProductWeight, error: x.isProductWeightError, ref: productWeightRef, nextRef: productLengthRef },
                                                    { title: "体积重量", value: x.ProductVolumetricWeight, error: x.isProductVolumetricWeightError, ref: null, nextRef: null },
                                                    { title: "体积", value: "", error: "", ref: null, nextRef: null }
                                                ], index)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row" style={{ paddingTop: "20pt" }}>
                                        <div className="col-3" >
                                            <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>尺寸 :</Typography>
                                        </div>
                                        <div className="col-9" >
                                            <div className="row">
                                                {listingmultipleColumn([
                                                    { title: "长", value: x.ProductDeep, error: x.isProductDeepError, ref: productLengthRef, nextRef: productWidthRef },
                                                    { title: "宽", value: x.ProductWidth, error: x.isProductWidthError, ref: productWidthRef, nextRef: productHeightRef },
                                                    { title: "高", value: x.ProductHeight, error: x.isProductHeightError, ref: productHeightRef, nextRef: printingRef }
                                                ], index)}
                                            </div>
                                        </div>
                                    </div>
                                    {listingLayout("备注", x.Remark, "", "text")}
                                </form>
                            )
                        })
                    }
                </div>

                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-5 col-xs-12" style={{ paddingTop: "20pt" }} >
                    {/* <div className="row" style={{ textAlign: "center" }}>
                                <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>未装箱包裹 : {currentVolume}</Typography>
                            </div> */}
                    {
                        isObjectUndefinedOrNull(props.selectedRow) ? (buttonLayout([
                            { title: "打印", type: "Print" },
                            { title: "重印", type: "RePrint" },
                            { title: "仅保存", type: "Save" },
                            { title: "删除", type: "Delete" }
                        ])) : (
                            buttonLayout([
                                { title: "仅保存", type: "Save" }
                            ]))
                    }
                </div>

                <div style={{ display: "none" }} >
                    <div ref={(el) => (componentRef = el)}>
                        {renderPrintListing()}
                    </div>
                </div>
            </div>
        </div >
    )
}