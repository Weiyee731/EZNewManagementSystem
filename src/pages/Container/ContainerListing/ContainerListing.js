import React, { Component } from "react"
import { connect } from "react-redux"
import { GitAction } from "../../../store/action/gitAction"
import TableComponents from "../../../components/TableComponents/TableComponents"
import {
    isArrayNotEmpty,
    isStringNullOrEmpty,
    getWindowDimensions,
    isObjectUndefinedOrNull,
    convertDateTimeToString112Format,
    volumeCalc
} from "../../../tools/Helpers"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import CachedIcon from "@mui/icons-material/Cached"
import CsvDownloader from "react-csv-downloader"
import CheckIcon from "@mui/icons-material/Check"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { toast, Flip } from "react-toastify"
import AlertDialog from "../../../components/modal/Modal"
import DataManagement from "../../DataManagement/DataManagement"
import { ModalPopOut } from "../../../components/modal/Modal";
import CreateIcon from '@mui/icons-material/Create';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import SearchBar from "../../../components/SearchBar/SearchBar"
import { Card, CardContent, Typography, Box, Select, MenuItem, TextField, TableCell, IconButton, Tooltip } from '@mui/material';

import "./ContainerListing.css"


function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
        userAreaCode: state.counterReducer["userAreaCode"],
        stockApproval: state.counterReducer["stockApproval"],
        container: state.counterReducer["container"],
        containerAction: state.counterReducer["containerAction"],
        containerStatus: state.counterReducer["containerStatus"],
        containerStatusUpdate: state.counterReducer["containerStatusUpdate"],
        inventoryStock: state.counterReducer["inventoryStock"],
    }
}

function mapDispatchToProps(dispatch) {
    return {
        CallViewInventoryByFilter: (propsData) => dispatch(GitAction.CallViewInventoryByFilter(propsData)),
        ClearInventoryStock: () => dispatch(GitAction.ClearInventoryStock()),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
        CallFilterInventory: (propsData) => dispatch(GitAction.CallFilterInventory(propsData)),
        CallUpdateStockDetailByGet: (propsData) => dispatch(GitAction.CallUpdateStockDetailByGet(propsData)),
        CallInsertStockByPost: (propsData) => dispatch(GitAction.CallInsertStockByPost(propsData)),
        CallResetUpdatedStockDetail: () => dispatch(GitAction.CallResetUpdatedStockDetail()),
        CallResetStocks: () => dispatch(GitAction.CallResetStocks()),
        CallViewContainer: (props) => dispatch(GitAction.CallViewContainer(props)),
        CallFilterInventoryByDate: (propsData) => dispatch(GitAction.CallFilterInventoryByDate(propsData)),
        CallUpdateStockDetailByPost: (props) => dispatch(GitAction.CallUpdateStockDetailByPost(props)),
        CallAddContainer: (props) => dispatch(GitAction.CallAddContainer(props)),
        CallViewContainerStatus: (props) => dispatch(GitAction.CallViewContainerStatus(props)),
        CallUpdateContainerStatus: (props) => dispatch(GitAction.CallUpdateContainerStatus(props)),
        CallUpdateContainer: (props) => dispatch(GitAction.CallUpdateContainer(props)),
    }
}

const headCells = [
    // {
    //     id: "TrackingNumber",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Tracking No. ",
    // },
    // {
    //     id: "Dimension",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Dimension (m cubic)",
    // },
    {
        id: "id",
        align: "left",
        disablePadding: false,
        label: "ID",
    },
    {
        id: "ContainerName",
        align: "left",
        disablePadding: false,
        label: "Container Name",
    },
    {
        id: "ContainerDate",
        align: "left",
        disablePadding: false,
        label: "Container Date",
    },
    {
        id: "Remark",
        align: "left",
        disablePadding: false,
        label: "Remarks",
    },
    {
        id: "Status",
        align: "left",
        disablePadding: false,
        label: "Current Status",
    }, {
        id: "EditContainer",
        align: "left",
        disablePadding: false,
        label: "Edit Container",
    },
]

const inventoryHeadCell = [
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
        id: 'CourierName',
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
        id: 'Volume',
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


const INITIAL_STATE = {
    isDataFetching: false,
    filteredList: null,
    containerListing: null,
    openCreateContainerModal: false,
    openDataManagementModal: false,
    containerID: "",
    containerNo: "",
    containerDate: "",
    containerRemark: "",
    container: null,
    containerAction: null,
    ContainerStatus: "All",
    containerStatusReturn: "",
    ClickedRow: null,
    editContainer: false,

    inventoryStock: [],
    isInventorySet: false,
    filteredProduct: [],
    isFiltered: false,
    searchKeywords: "",
    searchCategory: "Tracking",
}

class ContainerListing extends Component {
    constructor(props) {
        super(props)
        this.state = INITIAL_STATE

        this.props.CallViewContainer() //view container
        toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
        this.props.CallViewContainerStatus() //view container
        this.renderInventoryTableRows = this.renderInventoryTableRows.bind(this)
        this.handleSearchCategory = this.handleSearchCategory.bind(this)

    }

    componentDidUpdate(prevProps, prevState) {
        if (isArrayNotEmpty(this.props.container) && (prevProps.container !== this.props.container)) {
            let list = !isStringNullOrEmpty(this.props.container[0].ReturnVal) && this.props.container[0].ReturnVal == 0 ? [] : this.props.container
            this.setState({
                filteredList: list,
                containerListing: list,
                isDataFetching: false,
                totalItem: list.length,
            })

            toast.dismiss()
            if (!isStringNullOrEmpty(this.props.container[0].ReturnVal) && this.props.container[0].ReturnVal == 0) {
                toast.warning("Fetched data is empty. ", {
                    autoClose: 3000,
                    theme: "dark",
                })
            }

        }

        if (this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal !== 0 && this.props.inventoryStock !== prevProps.inventoryStock) {
            console.log("sini lah")
            this.setState({ inventoryStock: this.props.inventoryStock, isInventorySet: true })
            // this.props.ClearInventoryStock()
        }


        if (isArrayNotEmpty(this.props.containerStatusUpdate)) {
            if (!isStringNullOrEmpty(this.props.containerStatusUpdate[0].ReturnVal) && this.props.containerStatusUpdate[0].ReturnVal == 0) {
                console.log("upadte containerstatus fail", this.props.containerStatusUpdate[0].ReturnMsg)
            } else {
                console.log("upadte containerstatus success", this.props.containerStatusUpdate[0].ReturnMsg)
            }
        }

        if (this.state.containerAction === null && isArrayNotEmpty(this.props.containerAction) && (prevProps.containerAction !== this.props.containerAction)) {
            if (this.props.containerAction[0].ReturnVal = 1) {
                this.props.CallViewContainer()
                this.setState({
                    openCreateContainerModal: false,

                })
            } else {
                console.log("fail", this.props.containerAction[0].ReturnMsg)
            }
        }

    }

    handleChangeStatus = (data, index, e) => {
        data.ContainerStatusID = e.target.value
        data.ContainerStatus = this.props.containerStatus.find((x) => !isStringNullOrEmpty(x.ContainerStatusID) && x.ContainerStatusID === e.target.value).ContainerStatus

        var latestDataSet = this.state.filteredList
        latestDataSet[index] = data

        this.setState({
            filteredList: latestDataSet
        })

        var obj = {
            CONTAINERID: data.ContainerID,
            CONTAINERSTATUSID: e.target.value,
            MODIFY: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 1

        }
        this.props.CallUpdateContainerStatus(obj)
    }

    renderTableActionButton = () => {
        return (
            <IconButton onClick={(event) => { this.toggleVerificationModal() }} >
                <CheckIcon />
            </IconButton>
        )
    }

    renderTableRows = (data, index) => {
        const fontsize = "9pt"

        var color = ""
        var fontcolor = "#000000"

        return (
            <>
                <TableCell component="th" id={`table-checkbox-${index}`} scope="row" onClick={(e) => this.onTableRowClick(e, data)} sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} >{index + 1} </TableCell>
                <TableCell align="left" onClick={(e) => this.onTableRowClick(e, data)} sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} > {data.ContainerName} </TableCell>
                <TableCell align="left" onClick={(e) => this.onTableRowClick(e, data)} sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} > {data.ContainerDate}   </TableCell>
                <TableCell align="left" onClick={(e) => this.onTableRowClick(e, data)} sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} className="long-remark"> {data.ContainerRemark}   </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} >
                    <Select
                        labelId="search-filter-category"
                        id="search-filter-category"
                        value={data.ContainerStatusID ? data.ContainerStatusID : ""}
                        label="Search By"
                        onChange={(e) => this.handleChangeStatus(data, index, e)}
                        size="small"
                        className="col-12"
                        placeholder="filter by"
                    >
                        {this.props.containerStatus.map((status, ind) => {
                            return (
                                <MenuItem key={ind} value={status.ContainerStatusID} >{status.ContainerStatus}</MenuItem>
                            )
                        })}
                    </Select>
                </TableCell>

                <TableCell align="left" className="sticky" sx={{ fontSize: fontsize }}>
                    <IconButton onClick={(event) => this.onEditContainer(event, data)}>
                        <CreateIcon />
                    </IconButton>
                </TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.setState({ openDataManagementModal: !this.state.openDataManagementModal, ClickedRow: row })
        this.props.CallViewInventoryByFilter({ FilterColumn: "and T_Inventory_Stock.ContainerID=" + row.ContainerID })
    }

    onEditContainer = (event, row) => {
        this.setState({
            openCreateContainerModal: !this.state.openCreateContainerModal,
            ClickedRow: row,
            containerNo: row.ContainerName,
            containerDate: row.ContainerDate,
            containerRemark: row.ContainerRemark ? row.ContainerRemark : "",
            editContainer: true
        })
    }

    setAddModalDetails = () => {
        this.setState({ openCreateContainerModal: !this.state.openCreateContainerModal })
    }

    addNewContainer = () => {
        if (this.state.editContainer) {
            var obj = {
                ContainerID: this.state.ClickedRow.ContainerID,
                ContainerName: this.state.containerNo,
                ContainerRemark: this.state.containerRemark,
                ContainerDate: this.state.containerDate,
                ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 1
            }
            this.props.CallUpdateContainer(obj)
        } else {
            var obj = {
                ContainerName: this.state.containerNo,
                ContainerDate: this.state.containerDate,
                ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 1
            }
            this.props.CallAddContainer(obj)
        }
        this.setState({ openCreateContainerModal: false, containerNo: "", containerDate: "", containerRemark: "", editContainer: false })
    }

    handleSearchInput(value, title) {
        switch (title) {
            case "Containers":

                if (isStringNullOrEmpty(value)) {
                    this.setState({ searchKeywords: value, filteredList: this.state.containerListing })
                } else {
                    var tempList = this.state.containerListing.filter(x => (x.ContainerName.includes(value)))
                    this.setState({ searchKeywords: value, filteredList: tempList })
                }
                break;

            case "Stocks":
                const { searchCategory, inventoryStock } = this.state
                this.setState({ searchKeywords: value })
                this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

                let DataSet = inventoryStock
                let filteredListing = []

                DataSet.length > 0 && DataSet.filter((searchedItem) =>
                    searchedItem.UserCode !== null && searchedItem.UserCode.includes(
                        value
                    )
                ).map((filteredItem) => {
                    filteredListing.push(filteredItem);
                })

                DataSet.length > 0 && DataSet.filter((searchedItem) =>
                    searchedItem.TrackingNumber !== null && searchedItem.TrackingNumber.toLowerCase().includes(
                        value.toLowerCase()
                    )
                ).map((filteredItem) => {
                    filteredListing.push(filteredItem);
                })

                let removeDuplicate = filteredListing.length > 0 ? filteredListing.filter((ele, ind) => ind === filteredListing.findIndex(elem => elem.StockID === ele.StockID)) : []
                this.setState({ isFiltered: true, filteredProduct: removeDuplicate })
                break;

            default:
                console.log("default")
        }


    }

    handleSearchCategory(e) {
        this.setState({ searchCategory: e.target.value })
    }

    renderInventoryTableRows = (data, index) => {
        return (
            <>
                <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{index + 1}</TableCell>
                <TableCell>{data.UserCode}</TableCell>
                <TableCell>{data.AreaCode}</TableCell>
                <TableCell>{data.CourierName}</TableCell>
                <TableCell >{data.TrackingNumber}</TableCell>
                <TableCell >{data.ProductQuantity}</TableCell>
                <TableCell >{data.ProductWeight}</TableCell>
                <TableCell>{data.ProductDimensionDeep}</TableCell>
                <TableCell>{data.ProductDimensionWidth}</TableCell>
                <TableCell>{data.ProductDimensionHeight}</TableCell>
                <TableCell >{data.Volume}</TableCell>
                <TableCell >{data.Item}</TableCell>
                <TableCell>{data.CreatedDate}</TableCell>
            </>
        )
    }


    render() {
        const { ClickedRow, inventoryStock, filteredProduct, isFiltered, searchCategory } = this.state
        const renderTableTopRightButtons = () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;
            return (
                <div className="d-flex">
                    <Tooltip title="Add New Stock">
                        <IconButton
                            size="small"
                            onClick={() => { this.setAddModalDetails() }}
                            disabled={this.state.isDataFetching}
                        >
                            <AddCircleIcon fontSize="large" color="primary" />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
        return (
            <div className="container-fluid my-2">
                <div className="row" style={{ padding: "10pt 10pt 10pt" }}>
                    <SearchBar
                        id="SearchBarMain"
                        placeholder=""
                        label="Enter Container Number to search"
                        buttonOnClick={() => this.onSearch("", "")}
                        onChange={(e) => this.handleSearchInput(e.target.value, "Containers")}
                        className="searchbar-input mb-auto"
                        disableButton={this.state.isDataFetching}
                        tooltipText="Search with current data"
                        value={this.state.searchKeywords}
                    />
                </div>
                <TableComponents
                    // table settings
                    tableOptions={{
                        dense: true, // optional, default is false
                        tableOrderBy: "asc", // optional, default is asc
                        sortingIndex: "TrackingNo", // require, it must the same as the desired table header
                        stickyTableHeader: true, // optional, default is true
                        stickyTableHeight: getWindowDimensions().screenHeight * 0.7, // optional, default is 300px
                    }}
                    actionIcon={this.renderTableActionButton()}
                    paginationOptions={[50, 100, 250, { label: "All", value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={headCells} //required
                    tableRows={{
                        renderTableRows: this.renderTableRows, // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: (this.state.approvePage === true) ? true : false, // optional, by default is true
                        checkboxColor: "primary", // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false, // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        headerColor: "rgb(200, 200, 200)",
                    }}
                    selectedIndexKey={"StockID"} // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click.
                    Data={isArrayNotEmpty(this.state.filteredList) ? this.state.filteredList : []} // required, the data that listing in the table
                    // onTableRowClick={this.onTableRowClick} // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                    onActionButtonClick={this.onAddButtonClick} // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    tableTopRight={renderTableTopRightButtons()}
                    onSelectRow={this.onSelectRow}
                    onSelectAllClick={this.onSelectAllRow}
                    tableTopLeft={
                        (this.state.approvePage === true)
                            ? <em style={{ fontWeight: 600, color: 'red' }}>Stock in the stocks from the container <span style={{ fontSize: '14pt', color: 'black' }}>(Item: {this.state.totalItem})</span></em>
                            : <em style={{ fontWeight: 600 }}>All active container</em>
                    }
                    CallResetSelected={this.state.CallResetSelected}

                />
                <AlertDialog
                    open={this.state.openCreateContainerModal} // required, pass the boolean whether modal is open or close
                    handleToggleDialog={() => this.setState({ openCreateContainerModal: false, containerNo: "", containerDate: "", containerRemark: "", editContainer: false })} // required, pass the toggle function of modal
                    handleConfirmFunc={() => this.addNewContainer()} // required, pass the confirm function
                    showAction={true} // required, to show the footer of modal display
                    title={this.state.editContainer ? "Create New Container" : "Update Container"} // required, title of the modal
                    buttonTitle={"Confirm"} // required, title of button
                    singleButton={false} // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                    hideBackdrop={false}
                    handleBackdrop={() => this.setState({ openCreateContainerModal: false, containerNo: "", containerDate: "", containerRemark: "", editContainer: false })}
                    draggable={true}
                >
                    <div className="container-fluid">
                        <div className="row" style={{ paddingTop: "10pt" }}>
                            <TextField
                                variant="outlined"
                                style={{ width: "100%" }}
                                label="Container Number"
                                value={this.state.containerNo}
                                size="small"
                                required
                                onChange={(e) => this.setState({ containerNo: e.target.value })}
                            />
                        </div>
                        <div className="row" style={{ paddingTop: "10pt" }}>
                            <TextField
                                variant="outlined"
                                type="date"
                                style={{ width: "100%" }}
                                label="Container Date"
                                value={this.state.containerDate}
                                size="small"
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => this.setState({ containerDate: e.target.value })}
                            />
                        </div>
                        {
                            this.state.editContainer ? (
                                <div className="row" style={{ paddingTop: "10pt" }}>
                                    <TextField
                                        variant="outlined"
                                        style={{ width: "100%" }}
                                        label="Remarks"
                                        value={this.state.containerRemark}
                                        size="small"
                                        required
                                        multiline
                                        onChange={(e) => this.setState({ containerRemark: e.target.value })}
                                    />
                                </div>
                            ) : (<></>)
                        }
                    </div>
                </AlertDialog>
                <ModalPopOut
                    fullScreen={true}
                    open={this.state.openDataManagementModal} // required, pass the boolean whether modal is open or close
                    handleToggleDialog={() => this.setState({ openDataManagementModal: false, inventoryStock: [], isInventorySet: false, filteredProduct: [], isFiltered: false })} // required, pass the toggle function of modal
                    // handleConfirmFunc={() => this.addNewContainer()} // required, pass the confirm function
                    showAction={true} // required, to show the footer of modal display
                    title={"Upload Stocks to container"} // required, title of the modal
                    // buttonTitle={"Confirm"} // required, title of button
                    singleButton={false} // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                    draggable={true}
                >
                    <div className="container-fluid">
                        {inventoryStock.length <= 0 && <Box>
                            <Typography variant="h5" >
                                Container: <b>{this.state.ClickedRow ? this.state.ClickedRow.ContainerName : ""}</b>
                            </Typography>
                            <Typography variant="subtitle1" >
                                Date: <b>{this.state.ClickedRow ? this.state.ClickedRow.ContainerDate : ""}</b>
                            </Typography>
                        </Box>}
                        {
                            inventoryStock.length > 0 &&
                            <div className="row" style={{ padding: "10pt 10pt 10pt 10pt" }}>
                                <Card>
                                    <CardContent>
                                        <div className="row" style={{ padding: "10pt 10pt 10pt" }}>
                                            <SearchBar
                                                id=""
                                                placeholder=""
                                                label="Enter Member No, Tracking number to search"
                                                buttonOnClick={() => this.onSearch("", "")}
                                                onChange={(e) => this.handleSearchInput(e.target.value, "Stocks")}
                                                className="searchbar-input mb-auto"
                                                disableButton={this.state.isDataFetching}
                                                tooltipText="Search with current data"
                                                value={this.state.searchKeywords}
                                            />
                                        </div>

                                        <TableComponents
                                            tableTopLeft={
                                                <div className="row" >
                                                    <div className="col" >       <Typography style={{ fontWeight: "bold" }}>柜子号： {ClickedRow !== null && ClickedRow.ContainerName}</Typography></div>
                                                    <div className="col">   <Typography style={{ fontWeight: "bold" }}>柜子日期： {ClickedRow !== null && ClickedRow.ContainerDate}</Typography></div>
                                                    <div className="col">        <Typography style={{ fontWeight: "bold" }}>柜子状态： {ClickedRow !== null && ClickedRow.ContainerStatus}</Typography></div>
                                                </div>
                                            }
                                            tableTopRight={<CsvDownloader
                                                filename={ClickedRow !== null && ClickedRow.ContainerName + " - " + ClickedRow.ContainerDate}
                                                extension=".xls"
                                                wrapColumnChar="'"
                                                separator=","
                                                columns={inventoryHeadCell}
                                                datas={isArrayNotEmpty(inventoryStock) ? inventoryStock : []}
                                            >
                                                <Tooltip title="Download">
                                                    <IconButton size="small">
                                                        <DownloadForOfflineIcon
                                                            color="primary"
                                                            fontSize="large"
                                                            sx={{}}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            </CsvDownloader>}
                                            tableOptions={{
                                                dense: true,
                                                tableOrderBy: 'asc',
                                                sortingIndex: "fat",
                                                stickyTableHeader: true,
                                            }}
                                            paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]}
                                            tableHeaders={inventoryHeadCell}
                                            tableRows={{
                                                renderTableRows: this.renderInventoryTableRows,
                                                checkbox: false,
                                                checkboxColor: "primary",
                                                onRowClickSelect: false,
                                                headerColor: 'rgb(200, 200, 200)'
                                            }}

                                            selectedIndexKey={"pid"}
                                            Data={isFiltered === true ? filteredProduct : inventoryStock}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        }

                        <DataManagement propsData={this.state.ClickedRow} />
                    </div>
                </ModalPopOut>
            </div>
        )
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(ContainerListing)