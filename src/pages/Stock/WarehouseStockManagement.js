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
import CsvDownloader from "react-csv-downloader"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import AlertDialog from "../../components/modal/Modal"
import { Paper, TextField, Typography } from "@mui/material"
import { toast, Flip } from "react-toastify"


function mapStateToProps(state) {
    return {
        courier: state.counterReducer["courier"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallViewInventoryByFilter: (propsData) => dispatch(GitAction.CallViewInventoryByFilter(propsData)),
        CallViewCourier: () => dispatch(GitAction.CallViewCourier()),
    };
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
    }]
}

const headCells = [
    {
        id: 'Index',
        align: 'left',
        disablePadding: false,
        label: '序號',
    },
    {
        id: 'UserCode',
        align: 'left',
        disablePadding: false,
        label: '会员',
    },
    {
        id: 'AreaCode',
        align: 'center',
        disablePadding: false,
        label: '分区',
    },
    {
        id: 'Courier',
        align: 'center',
        disablePadding: false,
        label: '快递',
    },
    {
        id: 'TrackingNumber',
        align: 'left',
        disablePadding: false,
        label: '单号',
    },
    {
        id: 'ProductQuantity',
        align: 'left',
        disablePadding: false,
        label: '件数',
    },
    {
        id: 'ProductWeight',
        align: 'left',
        disablePadding: false,
        label: '重量',
    },
    {
        id: 'ProductDimensionDeep',
        align: 'left',
        disablePadding: false,
        label: '尺寸长',
    },
    {
        id: 'ProductDimensionWidth',
        align: 'left',
        disablePadding: false,
        label: '尺寸宽',
    },
    {
        id: 'ProductDimensionHeight',
        align: 'left',
        disablePadding: false,
        label: '尺寸高',
    },

    {
        id: 'ProductVolume',
        align: 'left',
        disablePadding: false,
        label: '体积',
    },

    {
        id: 'Item',
        align: 'left',
        disablePadding: false,
        label: '商品',
    },

    {
        id: 'CreatedDate',
        align: 'left',
        disablePadding: false,
        label: '时间',
    },
];


class WarehouseStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
    }

    componentDidMount() { }

    componentDidUpdate(prevProps, prevState) {

    }

    // redirectToPage = (pageName) => {
    //     this.props.history.push(`/${pageName}`)
    // }

    renderAreaCodeName = (areacodeId) => {
        if (isArrayNotEmpty(this.props.userAreaCode)) {
            const AreaCode = this.props.userAreaCode.filter(x => x.UserAreaID == areacodeId)
            return isArrayNotEmpty(AreaCode) ? AreaCode[0].AreaCode + " - " + AreaCode[0].AreaName : " - "
        }
        else
            return " - "
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{index + 1}</TableCell>
                <TableCell>{data.UserCode}</TableCell>
                <TableCell>{this.renderAreaCodeName(data.UserAreaID)}</TableCell>
                <TableCell>{data.Courier}</TableCell>
                <TableCell >{data.TrackingNumber}</TableCell>
                <TableCell >{data.ProductQuantity}</TableCell>
                <TableCell >{data.ProductWeight}</TableCell>
                <TableCell>{data.ProductDimensionDeep}</TableCell>
                <TableCell>{data.ProductDimensionWidth}</TableCell>
                <TableCell>{data.ProductDimensionHeight}</TableCell>
                <TableCell >{parseFloat((data.ProductDimensionDeep * data.ProductDimensionHeight * data.ProductDimensionWidth / 1000000)).toFixed(3)}</TableCell>
                <TableCell >{data.Item}</TableCell>
                <TableCell>{data.CreatedDate}</TableCell>
            </>
        )
    }



    handleSearchInput(value) {

        const { searchCategory, OveralStock } = this.state

        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        let DataSet = OveralStock
        let filteredListing = []
        if (searchCategory === "Tracking") {
            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.TrackingNumber !== null && searchedItem.TrackingNumber.toLowerCase().includes(
                    value.toLowerCase()
                )
            ).map((filteredItem) => {
                filteredListing.push(filteredItem);
            })
        } else if (searchCategory === "Member") {
            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.UserCode !== null && searchedItem.UserCode.includes(
                    value
                )
            ).map((filteredItem) => {
                filteredListing.push(filteredItem);
            })
        }
        else {
            toast.error("Please select a filter to search")
        }
        this.setState({ isFiltered: true, filteredProduct: filteredListing })
    }

    handleSearchCategory(e) {
        this.setState({ searchCategory: e.target.value })
    }

    handleSearchArea(e) {
        console.log("sadadasda", e.target.value)
        this.onSearch("", e.target.value)
        this.setState({ searchArea: e.target.value })
    }

    addNewContainer() {
        if (this.state.containerDate === "" || this.state.containerNo === "") {
            toast.warning("Please fill in all required data. ", {
                autoClose: 3000,
                theme: "dark",
            })
        }
        else {
            let object = {
                ContainerDate: this.state.containerDate,
                ContainerName: this.state.containerNo
            }
        }
    }

    // TrackingNumber: "",
    // isTrackingError: false,
    // CourierID: "",
    // isCourierError: false,
    // UserCode: "",
    // isUserCodeError: false,
    // UserData: "",
    // isUserDataError: false,
    // UserAlias: "",
    // Item: "",
    // isItemError: false,
    // Quantity: 1,
    // isQuantityError: false,
    // ProductWeight: "",
    // isProductWeightError: false,
    // ProductVolumetricWeight: "",
    // isProductVolumetricWeightError: false,
    // ProductHeight: "",
    // isProductHeightError: false,
    // ProductWidth: "",
    // isProductWidthError: false,
    // ProductDeep: "",
    // isProductDeepError: false,
    // Remark: "",
    // isRemarkError: false,

    handleChange(data, title) {
        let arr = []
        let errorArr = []
        arr = this.state.stockData[0]
        let finalData = []

        console.log("sadadasdas", data)
        console.log("sadadasdas title", title)
        console.log("sadadasdas arr", arr)

        switch (title) {
            case "快递单号":
                arr.isTrackingError = false
                if (isStringNullOrEmpty(data))
                    arr.isTrackingError = true

                arr.TrackingNumber = data
                break;

            case "快递公司":
                arr.isCourierError = false
                if (isStringNullOrEmpty(data))
                    arr.isCourierError = true
                arr.CourierID = data
                this.props.CallViewInventoryByFilter({ FILTERCOLUMN: "and TrackingNumber=" + data })
                break;

            case "会员号":
                arr.isUserCodeError = false
                if (isStringNullOrEmpty(data))
                    arr.isUserCodeError = true
                arr.UserCode = data
                break;

            case "货物信息":
                arr.isItemError = false
                if (isStringNullOrEmpty(data))
                    arr.isItemError = true

                arr.Item = data
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
        // stockData.push(arr)
        this.setState({ stockData: finalData })

    }


    render() {
        const { searchCategory, searchArea, isFiltered, filteredProduct, OveralStock, stockData } = this.state

        const calculateVolumetric = () => {
            let height = stockData[0].ProductHeight
            let deep = stockData[0].ProductDeep
            let width = stockData[0].ProductWidth
            let data = ""

            if (isNumber(height) && isNumber(deep) !== "" && isNumber(width) !== "")
                data = parseFloat((height * deep * width) / 6000).toFixed(3)

            return data
        }

        const listingLayout = (title, value, error, type) => {
            return (
                <div className="row" style={{ paddingTop: "20pt" }}>
                    <div className="col-2" >
                        <Typography style={{ fontWeight: "600", fontSize: "15pt", color: "#253949", letterSpacing: 1 }}>{title} :</Typography>
                    </div>
                    <div className="col-4" >
                        <TextField
                            variant="outlined"
                            style={{ width: "100%" }}
                            label={title}
                            value={value}
                            size="small"
                            onChange={(e) => this.handleChange(e.target.value, title)}
                        />
                        {error && <div><label style={{ color: "red", fontSize: "10pt" }}>请输入对的{title}</label></div>}
                    </div>
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
                                    {console.log("dasdsaas", x)}

                                    <TextField
                                        variant="outlined"
                                        style={{ width: "100%" }}
                                        label={x.title}
                                        value={x.title === "体积重量" ? calculateVolumetric() : x.value}
                                        type="number"
                                        size="small"
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

        return (
            <div className="container-fluid" >
                <div className="row">
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

                                        <hr />
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

                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-5 col-xs-12" style={{ paddingTop: "10pt" }}>
                    </div>
                </div>

            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WarehouseStock));