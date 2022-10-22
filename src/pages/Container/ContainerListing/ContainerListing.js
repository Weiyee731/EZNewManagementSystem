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
import Tooltip from "@mui/material/Tooltip"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from "@mui/material/IconButton"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import CachedIcon from "@mui/icons-material/Cached"
import CsvDownloader from "react-csv-downloader"
import CheckIcon from "@mui/icons-material/Check"
import TableCell from "@mui/material/TableCell"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { toast, Flip } from "react-toastify"
import AlertDialog from "../../../components/modal/Modal"
import { Paper } from "@mui/material"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import DataManagement from "../../DataManagement/DataManagement"
import { ModalPopOut } from "../../../components/modal/Modal";

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
    }
}

function mapDispatchToProps(dispatch) {
    return {
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
        label: "Container",
    },
    {
        id: "ContainerDate",
        align: "left",
        disablePadding: false,
        label: "Container Date",
    },
    {
        id: "Status",
        align: "left",
        disablePadding: false,
        label: "Current Status",
    },
    // {
    //     id: "Remark",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Remarks",
    // },

    // {
    //     id: "ProductDimensionDeep",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Depth (cm)",
    // },
    // {
    //     id: "ProductDimensionWidth",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Width (cm)",
    // },
    // {
    //     id: "ProductDimensionHeight",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Height (cm)",
    // },

    // {
    //     id: "Item",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Item",
    // },
    // {
    //     id: "UserCode",
    //     align: "center",
    //     disablePadding: false,
    //     label: "Member",
    // },
    // {
    //     id: "AreaCode",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Division",
    // },

    // {
    //     id: "StockDate",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Stock Date",
    // },

    // {
    //     id: "AdditionalCharges",
    //     align: "left",
    //     disablePadding: false,
    //     label: "Additional Charges",
    // },

]


const INITIAL_STATE = {
    isDataFetching: false,
    filteredList: null,
    openModal: false,
    openDataManagementModal: false,
    containerNo: "",
    containerDate: "",
    container: null,
    containerAction: null,
    ContainerStatus: "All",
    containerStatusReturn: "",
    ClickedRow: null
}

class ContainerListing extends Component {
    constructor(props) {
        super(props)
        this.state = INITIAL_STATE

        this.props.CallViewContainer() //view container
        this.props.CallViewContainerStatus() //view container
    }

    componentDidMount() {
        // if (this.props.typeIndicator === "approve") {
        //     this.setState({ approvePage: true })
        // } else {
        //     this.setState({ approvePage: false })
        // }
    }

    componentDidUpdate(prevProps, prevState) {
        if (isArrayNotEmpty(this.props.container) && (prevProps.container !== this.props.container)) {
            console.log("call ghere")
            let list = !isStringNullOrEmpty(this.props.container[0].ReturnVal) && this.props.container[0].ReturnVal == 0 ? [] : this.props.container
            console.log("list", list)
            this.setState({
                filteredList: list,
                isDataFetching: false,
                totalItem: list.length,
                // container: list
            })

            toast.dismiss()
            if (!isStringNullOrEmpty(this.props.container[0].ReturnVal) && this.props.container[0].ReturnVal == 0) {
                toast.warning("Fetched data is empty. ", {
                    autoClose: 3000,
                    theme: "dark",
                })
            }
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
                console.log("this.", this.props.containerAction[0].ReturnMsg)
                this.props.CallViewContainer()
                this.setState({
                    openModal: false
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
            MODIFY: 1

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
                <TableCell component="th" id={`table-checkbox-${index}`} scope="row" sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} >{index + 1} </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} > {data.ContainerName} </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} > {data.ContainerDate}   </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} >
                    <Select
                        labelId="search-filter-category"
                        id="search-filter-category"
                        value={data.ContainerStatusID}
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
                {/* <TableCell align="left" sx={{ fontSize: fontsize }} style={{ backgroundColor: color, color: fontcolor, cursor: 'pointer' }} > {data.Remark}</TableCell> */}
            </>
        )
    }

    onTableRowClick = (event, row) => {
        // TODO: SHOW SMALL DIALOG , 2 SELECTION , EDIT CONTAINER OR ADD STOCK INTO CONTAINER
        console.log(event, row)
        this.setState({openDataManagementModal: !this.state.openDataManagementModal , ClickedRow: row})
    }

    setAddModalDetails = () => {
        this.setState({ openModal: !this.state.openModal })
    }

    addNewContainer = () => {
        var obj = {
            ContainerName: this.state.containerNo,
            ContainerDate: this.state.containerDate,
            ModifyBy: 1
        }
        this.props.CallAddContainer(obj)
    }


    render() {
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
                            // aria-label="Add Stock"
                            size="small"
                            onClick={() => { this.setAddModalDetails() }}
                            disabled={this.state.isDataFetching}
                        >
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Synchronize Data">
                        <IconButton
                            aria-label="Pull Data"
                            size="small"
                            // onClick={() => { this.onDatabaseSearch() }}
                            disabled={this.state.isDataFetching}
                        >
                            <CachedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <CsvDownloader
                        filename={"Container-list_" + today}
                        extension=".xls"
                        separator=","
                        columns={headCells}
                        datas={isArrayNotEmpty(this.state.filteredList) ? this.state.filteredList : []}
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
                    </CsvDownloader>
                </div>
            )
        }
        return (
            <div className="container-fluid my-2">
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
                    onTableRowClick={this.onTableRowClick} // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
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
                    open={this.state.openModal} // required, pass the boolean whether modal is open or close
                    handleToggleDialog={() => this.setState({ openModal: false, containerNo: "", containerDate: "" })} // required, pass the toggle function of modal
                    handleConfirmFunc={() => this.addNewContainer()} // required, pass the confirm function
                    showAction={true} // required, to show the footer of modal display
                    title={"Create New Container"} // required, title of the modal
                    buttonTitle={"Confirm"} // required, title of button
                    singleButton={false} // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                    draggable={true}
                >
                    <div className="container-fluid">
                        <div className="row">
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
                    </div>
                </AlertDialog>
                <ModalPopOut fullScreen={true}
                    open={this.state.openDataManagementModal} // required, pass the boolean whether modal is open or close
                    handleToggleDialog={() => this.setState({ openDataManagementModal: false})} // required, pass the toggle function of modal
                    handleConfirmFunc={() => this.addNewContainer()} // required, pass the confirm function
                    showAction={true} // required, to show the footer of modal display
                    title={"Create New Container"} // required, title of the modal
                    buttonTitle={"Confirm"} // required, title of button
                    singleButton={false} // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                    draggable={true}
                >
                    <div className="container-fluid">
                    <DataManagement/>
                    </div>
                </ModalPopOut>
            </div>
        )
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(ContainerListing)