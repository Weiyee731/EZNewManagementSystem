import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TableComponents from "../../../components/TableComponents/TableComponents"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import AlertDialog from "../../../components/modal/Modal";
import { toast, Flip } from "react-toastify";
import SearchBar from "../../../components/SearchBar/SearchBar"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { isArrayNotEmpty, isStringNullOrEmpty, roundOffTotal } from "../../../tools/Helpers";

import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

function mapStateToProps(state) {
    return {
        transactions: state.counterReducer["transactions"],
        transactionReturn: state.counterReducer["transactionReturn"],
        userAreaCode: state.counterReducer["userAreaCode"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllTransaction: (data) => dispatch(GitAction.CallFetchAllTransaction(data)),
        CallCancelTransaction: (propsData) => dispatch(GitAction.CallCancelTransaction(propsData)),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
        CallResetTransaction: () => dispatch(GitAction.CallResetTransaction()),
    };
}

const headCells = [
    {
        id: 'OrderDate',
        align: 'left',
        disablePadding: false,
        label: 'Invoice Date',
    },
    {
        id: 'TransactionName',
        align: 'left',
        disablePadding: false,
        label: 'Invoice No.',
    },
    {
        id: 'UserCode',
        align: 'left',
        disablePadding: false,
        label: 'Code',
    },
    {
        id: 'AreaCode',
        align: 'center',
        disablePadding: false,
        label: 'Area',
    },
    {
        id: 'Fullname',
        align: 'center',
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'OrderTotalAmount',
        align: 'center',
        disablePadding: false,
        label: 'Total Amount',
    },
    {
        id: 'OrderPaidAmount',
        align: 'center',
        disablePadding: false,
        label: 'Paid',
    },
    {
        id: 'OrderStatus',
        align: 'center',
        disablePadding: false,
        label: 'Status',
    },
];
class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddModalOpen: false,
            TransactionListing: [],
            TransactionListingFiltered: [],
            TrackingStatusID: 3,
            selectedRows: [],
            openCancelModal: false,
            searchKeywords: "",
            searchCategory: "All",
            searchArea: "All",
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.handleSearchInput = this.handleSearchInput.bind(this)
        this.handleSearchCategory = this.handleSearchCategory.bind(this)
        this.handleSearchArea = this.handleSearchArea.bind(this)
        this.renderAreaCodeName = this.renderAreaCodeName.bind(this)

        this.props.CallUserAreaCode()
        this.props.CallFetchAllTransaction(this.state);
    }

    componentDidMount() {
        if (this.props.transactions.length !== this.state.TransactionListing.length) {
            if (this.props.transactions !== undefined && this.props.transactions[0] !== undefined) {
                this.setState({ TransactionListing: this.props.transactions, TransactionListingFiltered: this.props.transactions });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { transactions, transactionReturn } = this.props
        if (prevProps.transactions !== transactions) {
            if (transactions !== undefined && transactions[0] !== undefined) {
                if (transactions[0].ReturnVal == "0")
                    this.setState({ TransactionListing: [], TransactionListingFiltered: [] });
                else
                    this.setState({ TransactionListing: transactions, TransactionListingFiltered: transactions });
            }
        }

        if (isArrayNotEmpty(transactionReturn)) {
            try {
                if (transactionReturn[0].ReturnVal == 1) {
                    toast.success(transactionReturn[0].ReturnMsg, { autoClose: 2000, position: "top-right" })
                    this.props.CallResetTransaction()
                    this.props.CallFetchAllTransaction(this.state);
                    this.setState({ openCancelModal: false, })
                } else {
                    toast.error("Something went wrong. Please try again")
                }
            }
            catch (err) {

            }
        }
    }

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
                <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{data.OrderDate}</TableCell>
                <TableCell>{data.TransactionName}</TableCell>
                <TableCell>{data.UserCode}</TableCell>
                <TableCell>{this.renderAreaCodeName(data.UserAreaID)}</TableCell>
                <TableCell align="center">{data.Fullname}</TableCell>
                <TableCell align="center"><Box color={data.OrderColor}>{roundOffTotal(data.OrderTotalAmount)}</Box></TableCell>
                <TableCell align="center"><Box color={data.OrderColor}>{roundOffTotal(data.OrderPaidAmount)}</Box></TableCell>
                <TableCell align="center"><Box color={data.OrderColor}>{data.OrderStatus}</Box></TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.props.history.push(`/InvoiceDetail/${row.TransactionID}`)
    }

    handleClose = () => {
        this.setState({ AddModalOpen: false });
    }

    onDeleteButtonClick = () => {
        const { selectedRows } = this.state
        let selectedRowId = []
        selectedRows.map((row) => {
            selectedRowId.push(row.TransactionID)
        })
        this.props.CallCancelTransaction(selectedRowId)
    }

    onSelectRow = (items) => {
        this.setState({
            selectedRows: items
        })
    }

    renderTableActionButton = () => {
        return (
            <IconButton onClick={(event) => { this.onCancelModalPop() }}>
                <DeleteIcon color="error" />
            </IconButton>
        )
    }

    onCancelModalPop = () => {
        this.setState({
            openCancelModal: !this.state.openCancelModal
        })
    }

    onCategoryFilter(list, searchCategory, searchKeys) {
        switch (searchCategory) {
            case "Tracking":
                return list.filter(x => (!isStringNullOrEmpty(x.TransactionName) && x.TransactionName.includes(searchKeys)))

            case "Member":
                return list.filter(x => (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) || (!isStringNullOrEmpty(x.Fullname) && x.Fullname.includes(searchKeys)))

            case "Container":
                return list.filter(x => (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)))

            default:
                return list.filter(x =>
                    (!isStringNullOrEmpty(x.TransactionName) && x.TransactionName.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.Fullname) && x.Fullname.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys))
                )
        }
    }

    onCategoryAndAreaFilter(list, searchCategory, searchArea, searchKeys) {
        switch (searchCategory) {
            case "Tracking":
                return list.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.TransactionName) && x.TransactionName.includes(searchKeys)))

            case "Member":
                return list.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) || (!isStringNullOrEmpty(x.Fullname) && x.Fullname.includes(searchKeys)))

            case "Container":
                return list.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchArea)) && (!isStringNullOrEmpty(x.ContainerName) && x.ContainerName.includes(searchKeys)))

            default:
                return this.props.transactions.filter(x =>
                    (!isStringNullOrEmpty(x.TransactionName) && x.TransactionName.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.Fullname) && x.Fullname.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                )
        }
    }

    onSearch(keywords, area) {
        const { TransactionListingFiltered, searchKeywords, searchCategory, searchArea, } = this.state
        const { transactions } = this.props
        let searchKeys = ((!isStringNullOrEmpty(keywords))) ? keywords : searchKeywords
        searchKeys = (!isStringNullOrEmpty(searchKeys)) ? searchKeys.toUpperCase() : searchKeys
        let areaSearchKeys = ((!isStringNullOrEmpty(area))) ? area : searchArea

        // CallFilterInventory
        let tempList;
        if (!isStringNullOrEmpty(searchKeys)) {
            // if search keywords is exists
            if (isArrayNotEmpty(transactions)) {

                if (areaSearchKeys !== "All" && searchCategory === "All") {
                    // if area is not empty
                    tempList = transactions.filter(x => (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(areaSearchKeys)) && (x.TransactionName.includes(searchKeys) || x.UserCode.includes(searchKeys) || x.Fullname.includes(searchKeys)))
                }
                else if (areaSearchKeys === "All" && searchCategory !== "All") {
                    // if category is not empty
                    tempList = this.onCategoryFilter(transactions, searchCategory, searchKeys)
                }
                else if (areaSearchKeys !== "All" && searchCategory !== "All") {
                    tempList = this.onCategoryAndAreaFilter(transactions, searchCategory, areaSearchKeys, searchKeys)
                }
                else {
                    // if want to search with all options
                    tempList = transactions.filter(x =>
                        (!isStringNullOrEmpty(x.TransactionName) && x.TransactionName.includes(searchKeys)) ||
                        (!isStringNullOrEmpty(x.Fullname) && x.Fullname.includes(searchKeys)) ||
                        (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                        (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
                    )
                }
            }
            this.setState({ TransactionListingFiltered: tempList })
        }
        else {
            if (searchCategory === "All" && areaSearchKeys !== "All") {
                // if area is not empty but search string is empty
                this.setState({ searchCategory: "All", searchDates: [], TransactionListingFiltered: transactions.filter(x => !isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(areaSearchKeys)) })
            }
            else if (searchCategory !== "All" && areaSearchKeys === "All") {
                // if category is not empty but search string is empty
                // no point to search with category if there are no searching keywords
                this.setState({ areaSearchKeys: "All", searchDates: [], TransactionListingFiltered: transactions })
            }
            else {
                this.setState({ searchCategory: "All", areaSearchKeys: "All", searchDates: [], TransactionListingFiltered: transactions })
            }
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

    render() {
        const { openCancelModal, searchCategory, searchArea } = this.state
        return (
            <div>
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
                                        <MenuItem key="search_tracking" value="Tracking">Invoice Number</MenuItem>
                                        <MenuItem key="search_member" value={"Member"}>Member</MenuItem>
                                        {/* <MenuItem key="search_container" value={"Container"}>Container</MenuItem> */}
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
                                placeholder=""
                                label="Enter Member No, Tracking No or Container No to search"
                                buttonOnClick={() => this.onSearch("", "")}
                                onChange={this.handleSearchInput}
                                className="searchbar-input mb-auto"
                                disableButton={this.state.isDataFetching}
                                tooltipText="Search with current data"
                                value={this.state.searchKeywords}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <TableComponents
                    // table settings 
                    tableTopLeft={<h3 style={{ fontWeight: 700 }}>Invoice</h3>}  // optional, it can pass as string or as children elements

                    tableOptions={{
                        dense: true,                // optional, default is false
                        tableOrderBy: 'asc',        // optional, default is asc
                        sortingIndex: "fat",        // require, it must the same as the desired table header
                        stickyTableHeader: true,    // optional, default is true
                        // stickyTableHeight: 300,     // optional, default is 300px
                    }}
                    paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={headCells}        //required
                    tableRows={{
                        renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: true,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false,                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        headerColor: 'rgb(200, 200, 200)'
                    }}
                    selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={this.state.TransactionListingFiltered}                                  // required, the data that listing in the table
                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                    onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    actionIcon={this.renderTableActionButton()}
                    onSelectRow={this.onSelectRow}
                />
                <AlertDialog
                    open={openCancelModal}              // required, pass the boolean whether modal is open or close
                    handleToggleDialog={this.onCancelModalPop}  // required, pass the toggle function of modal
                    handleConfirmFunc={this.onDeleteButtonClick}    // required, pass the confirm function 
                    showAction={true}                           // required, to show the footer of modal display
                    title={"Cancel this invoice?"}                                  // required, title of the modal
                    buttonTitle={"Yes"}                         // required, title of button
                    singleButton={false}                         // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"xs"}
                    message={`Are you sure want to cancel this invoice? `}
                >
                </AlertDialog>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Invoice));