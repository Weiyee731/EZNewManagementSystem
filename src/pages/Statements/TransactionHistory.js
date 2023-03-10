import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Button from '@mui/material/Button';
import TableComponents from "../../components/TableComponents/TableComponents"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import SearchBar from "../../components/SearchBar/SearchBar"
import CsvDownloader from 'react-csv-downloader';
import { convertDateTimeToString112Format, isStringNullOrEmpty, isArrayNotEmpty } from "../../tools/Helpers";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ToggleTabsComponent from "../../components/ToggleTabsComponent/ToggleTabComponents";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ResponsiveDatePickers from '../../components/datePicker/datePicker';
import { toast } from "react-toastify";

function mapStateToProps(state) {
    return {
        transactions: state.counterReducer["transactions"],
        transactionReturn: state.counterReducer["transactionReturn"],
        userAreaCode: state.counterReducer["userAreaCode"],
        commission: state.counterReducer["commission"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllTransaction: (data) => dispatch(GitAction.CallFetchAllTransaction(data)),
        CallUpdateTransactionPayment: (data) => dispatch(GitAction.CallUpdateTransactionPayment(data)),
        CallViewCommissionByUserCode: (data) => dispatch(GitAction.CallViewCommissionByUserCode(data)),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
    };
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
};

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
    {
        id: 'action',
        align: 'center',
        disablePadding: false,
        label: '',
    },
];
class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddModalOpen: false,
            TransactionListing: [],
            TransactionListingFiltered: [],
            TrackingStatusID: 4,
            selectedRow: [],
            TransactionID: 0,
            searchCategory: "Cash",
            Payment: "",
            Datetime: "",
            ReferenceNo: "",
            PaymentMethod: "Cash",
            isPayAmountValid: false,
            isDateValid: false,
            isReferenceValid: false,
            searchArea: "All",
            onSearchText: "",
            searchKeys: "",
            referenceCodePayment: []
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handlePaymentCategoryCategory = this.handlePaymentCategoryCategory.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.handleSearchInput = this.handleSearchInput.bind(this)
        this.handleSearchCategory = this.handleSearchCategory.bind(this)
        this.handleSearchArea = this.handleSearchArea.bind(this)
        this.handleReferencePayment = this.handleReferencePayment.bind(this)
        this.renderAreaCodeName = this.renderAreaCodeName.bind(this)
        this.OnEnterToUpdatePayment = this.OnEnterToUpdatePayment.bind(this)
        this.props.CallFetchAllTransaction(this.state);
        this.props.CallUserAreaCode();
    }

    componentDidMount() {
        if (this.props.transactions !== this.state.TransactionListing) {
            if (this.props.transactions !== undefined && this.props.transactions[0] !== undefined) {
                if (this.props.transactions[0].ReturnVal !== "0")
                    this.setState({ TransactionListing: this.props.transactions, TransactionListingFiltered: this.props.transactions });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.transactions !== this.props.transactions) {
            if (this.props.transactions !== undefined && this.props.transactions[0] !== undefined) {
                if (this.props.transactions[0].ReturnVal !== "0")
                    this.setState({ TransactionListing: this.props.transactions, TransactionListingFiltered: this.props.transactions });
            }
        } else {
            if (prevProps.transactions !== this.state.TransactionListing) {
                if (this.props.transactions !== undefined && this.props.transactions[0] !== undefined) {
                    if (this.props.transactions[0].ReturnVal !== "0")
                        this.setState({ TransactionListing: prevProps.transactions, TransactionListingFiltered: prevProps.transactions });
                }
            }
        }

        if (prevProps.transactionReturn !== this.props.transactionReturn) {
            if (this.props.transactionReturn[0].ReturnVal && this.props.transactionReturn[0].ReturnVal === 1) {
                toast.success(this.props.transactionReturn[0].ReturnMsg)
                this.props.CallFetchAllTransaction(this.state);
                this.setState({
                    AddModalOpen: false,
                    referenceCodePayment: [],
                    PaymentMethod: "Cash"
                })
            }
        }
    }

    renderAreaCodeName = (areacodeId) => {
        if (isArrayNotEmpty(this.props.userAreaCode)) {
            const AreaCode = this.props.userAreaCode.filter(x => x.UserAreaID === areacodeId)
            return isArrayNotEmpty(AreaCode) ? AreaCode[0].AreaCode + " - " + AreaCode[0].AreaName : " - "
        }
        else
            return " - "
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{data.OrderDate}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.TransactionName}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.UserCode}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{this.renderAreaCodeName(data.UserAreaID)}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.Fullname}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderTotalAmount}</Box></TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderPaidAmount}</Box></TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderStatus}</Box></TableCell>
                {
                    data.OrderStatus === "Unpaid" ?
                        <TableCell align="center">
                            <IconButton onClick={(event) => this.onAddButtonClick(event, data)}>
                                <CheckCircleIcon color="dark" sx={{ fontSize: 30 }}></CheckCircleIcon>
                            </IconButton>
                        </TableCell> : <TableCell align="center"></TableCell>
                }
            </>
        )
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                {/* <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip> */}
            </div>
        )
    }

    onTableRowClick = (event, row) => {
        this.props.history.push(`/TransactionHistoryDetail/${row.TransactionID}`)
    }

    handleClose = () => {
        this.setState({
            AddModalOpen: false,
            Payment: "",
            isPayAmountValid: false,
            ReferenceNo: "",
            isReferenceValid: false,
            Datetime: new Date()
        });
    }

    onAddButtonClick = (event, row) => {
        this.props.CallViewCommissionByUserCode({ UserCode: row.UserCode })
        this.setState({
            AddModalOpen: true,
            selectedRow: row,
            TransactionID: row.TransactionID,
            Payment: "",
            isPayAmountValid: false,
            ReferenceNo: "",
            isReferenceValid: false,
            Datetime: new Date()
        });
    }
    OnEnterToUpdatePayment = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13)
            this.onUpdateTransactionPayment()
    }

    onDeleteButtonClick = (items) => {

    }

    onUpdateTransactionPayment = (selectedRow) => {
        const { TransactionID, Payment, PaymentMethod, ReferenceNo, Datetime } = this.state

        let object = ""
        if (PaymentMethod == "Reference Code") {
            let listing = this.state.referenceCodePayment
            let data = this.props.commission
            let totalUnpaid = selectedRow.OrderTotalAmount - selectedRow.OrderPaidAmount
            let amount = []
            let commissionID = []
            let TransactionIDList = []

            isArrayNotEmpty(listing) && listing.map((x) => {
                isArrayNotEmpty(data) && data.filter((z) => z.CommissionID == x).map((y) => {
                    if (totalUnpaid >= y.BalancedAmount) {
                        amount.push(y.BalancedAmount)
                        TransactionIDList.push(TransactionID)
                        commissionID.push(y.CommissionID)
                        totalUnpaid = totalUnpaid - y.BalancedAmount
                    } else {
                        if (totalUnpaid > 0) {
                            commissionID.push(y.CommissionID)
                            TransactionIDList.push(TransactionID)
                            amount.push(totalUnpaid)
                            totalUnpaid = totalUnpaid - y.BalancedAmount
                        }
                    }
                })
            })
            object = {
                TransactionID: TransactionIDList.join(';'),
                PaymentAmmount: amount.join(';'),
                CommissionID: commissionID.join(';'),
                PaymentMethod: PaymentMethod,
                ReferenceNo: ReferenceNo != "" ? ReferenceNo : "-",
                Datetime: convertDateTimeToString112Format(Datetime),
            }
        } else {
            object = {
                TransactionID: TransactionID,
                CommissionID: "-",
                PaymentAmmount: Payment,
                PaymentMethod: PaymentMethod,
                ReferenceNo: ReferenceNo != "" ? ReferenceNo : "-",
                Datetime: convertDateTimeToString112Format(Datetime),
            }
        }

        if (!isStringNullOrEmpty(this.state.Payment)) {
            this.props.CallUpdateTransactionPayment(object)
        }
        else
            toast.error("Please fill in all the fields.")
    }

    handleInputChange = (e) => {
        const elementId = e.target.id
        switch (elementId) {
            case "payment":
                this.setState({ Payment: e.target.value.trim() })
                if (e.target.value === "") {
                    this.setState({
                        isPayAmountValid: true
                    })
                } else {
                    this.setState({
                        isPayAmountValid: false
                    })
                }
                break;

            case "date":
                this.setState({ Datetime: e.target.value })
                break;

            case "reference":
                this.setState({ ReferenceNo: e.target.value })
                if (e.target.value === "") {
                    this.setState({
                        isReferenceValid: true
                    })
                } else {
                    this.setState({
                        isReferenceValid: false
                    })
                }
                break;

            default:
                break;
        }

    }

    onDateChange(e) {
        this.setState({ Datetime: e })
    }

    handlePaymentCategoryCategory(e) {
        this.setState({ PaymentMethod: e.target.value })
    }

    changeTab = (key) => {
        switch (key) {
            case "All":
                this.setState({
                    TransactionListingFiltered: this.state.TransactionListing
                })
                break;
            case "Unpaid":
                this.setState({
                    TransactionListingFiltered: this.state.TransactionListing.filter(x => x.OrderStatus === "Unpaid")
                })
                break;
            case "Paid":
                this.setState({
                    TransactionListingFiltered: this.state.TransactionListing.filter(x => x.OrderStatus === "Paid")
                })
                break;
            default:
                break;
        }
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
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserAreaID) && x.UserAreaID.includes(searchKeys))
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
                    (!isStringNullOrEmpty(x.Fullname) && x.Fullname.includes(searchKeys)) ||
                    (!isStringNullOrEmpty(x.UserCode) && x.UserCode.includes(searchKeys)) ||
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
        this.setState({ searchKeys: searchKeywords })
    }

    handleSearchCategory(e) {
        this.setState({ searchCategory: e.target.value })
    }

    handleSearchArea(e) {
        this.onSearch("", e.target.value)
        this.setState({ searchArea: e.target.value })
    }

    handleReferencePayment(e) {
        let value = e.target.value
        let listing = this.props.commission

        let total = 0
        if (listing.length > 0) {

            value.map((y) => {
                listing.filter((x) => x.CommissionID == y).map((data) => {
                    total = total + parseFloat(data.BalancedAmount)
                })
            })
        }
        this.setState({ referenceCodePayment: value, Payment: total, isPayAmountValid: false })
    }

    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unpaid", key: "Unpaid" },
            { children: "Paid", key: "Paid" }
        ]
        const { searchCategory, searchArea, selectedRow } = this.state
        return (
            <>
                <div className="w-100 container-fluid">
                    <div className="row d-flex">
                        <div className="col-md-11 col-11">
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
                                            value={this.state.searchKeys}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1 col-1">
                            <CsvDownloader
                                filename="transactionhistory-list"
                                extension=".xls"
                                separator=","
                                columns={headCells}
                                datas={isArrayNotEmpty(this.state.TransactionListingFiltered) ? this.state.TransactionListingFiltered : []}>
                                <DownloadForOfflineIcon color="primary" sx={{ fontSize: 45 }}></DownloadForOfflineIcon>
                            </CsvDownloader>
                        </div>
                    </div>
                    <ToggleTabsComponent Tabs={ToggleTabs} size="small" onChange={this.changeTab} />
                    <TableComponents
                        // table settings 
                        tableTopLeft={<h3 style={{ fontWeight: 700 }}>Transaction History</h3>}  // optional, it can pass as string or as children elements
                        // tableTopRight={this.renderTableActionButton}                 // optional, it will brings the elements to the table's top right corner

                        tableOptions={{
                            dense: false,                // optional, default is false
                            tableOrderBy: 'asc',        // optional, default is asc
                            sortingIndex: "fat",        // require, it must the same as the desired table header
                            stickyTableHeader: true,    // optional, default is true
                            // stickyTableHeight: 300,     // optional, default is 300px
                        }}
                        paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                        tableHeaders={headCells}        //required
                        tableRows={{
                            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                            checkbox: false,                          // optional, by default is true
                            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                            onRowClickSelect: false,                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                            headerColor: 'rgb(200, 200, 200)'
                        }}
                        selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                        Data={this.state.TransactionListingFiltered}                                  // required, the data that listing in the table
                        // onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                        onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    />
                </div>
                <div>
                    <Modal
                        open={this.state.AddModalOpen}
                        onClose={this.handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500 }}
                    >
                        <Box sx={style} component="main" maxWidth="xs">
                            <Typography component="h1" variant="h5">Update Payment</Typography>

                            <Box noValidate sx={{ mt: 3 }}>
                                <div className="row my-2">
                                    <Box className="col-12">
                                        <div className="clearfix">
                                            <div className="float-start">
                                                Trans. No: <b>{selectedRow.TransactionName}</b>
                                            </div>
                                            <div className="float-end">
                                                Unpaid(RM): <b className="text-danger" style={{ fontSize: '14pt', marginRight: 15 }}>{(selectedRow.OrderTotalAmount - selectedRow.OrderPaidAmount).toFixed(2)}</b>
                                                Paid(RM): <b className="text-success" style={{ fontSize: '14pt' }}>{selectedRow.OrderPaidAmount}</b>
                                            </div>
                                        </div>
                                    </Box>
                                    <hr />
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <label className="my-auto col-3">Payment Method:</label>
                                        <Select
                                            labelId="search-filter-payment"
                                            id="search-filter-payment"
                                            value={this.state.PaymentMethod}
                                            label="Search By"
                                            onChange={this.handlePaymentCategoryCategory}
                                            size="large"
                                            className="col-9"
                                            placeholder="filter by"
                                        >
                                            <MenuItem key="cash_payment" value="Cash">Cash</MenuItem>
                                            <MenuItem key="bank_payment" value="Bank Transfer">Bank Transfer</MenuItem>
                                            <MenuItem key="boost_payment" value="Boost">Boost</MenuItem>
                                            <MenuItem key="spay_payment" value="SPay">S Pay Global</MenuItem>
                                            <MenuItem key="reference_payment" value="Reference Code">Reference Code</MenuItem>
                                        </Select>
                                    </Grid>
                                    {
                                        this.state.PaymentMethod === "Reference Code" && isArrayNotEmpty(this.props.commission) && this.props.commission[0].ReturnVal != 0 &&
                                        <Grid item xs={12} sm={12}>
                                            <Typography style={{ fontWeight: "bold" }}>Deduction Amount : <label style={{ color: "red" }}>{this.state.Payment}</label></Typography>
                                        </Grid>
                                    }
                                    {
                                        this.state.PaymentMethod === "Reference Code" ?
                                            <Grid item xs={12} sm={6}>
                                                {
                                                    isArrayNotEmpty(this.props.commission) && this.props.commission[0].ReturnVal != 0 ?
                                                        <>
                                                            <TextField
                                                                fullWidth
                                                                select
                                                                name="referenceCodePayment"
                                                                id="referenceCodePayment"
                                                                variant="outlined"
                                                                label="referenceCodePayment"
                                                                SelectProps={{
                                                                    multiple: true,
                                                                    value: this.state.referenceCodePayment,
                                                                    onChange: this.handleReferencePayment
                                                                }}
                                                            >
                                                                {
                                                                    isArrayNotEmpty(this.props.commission) && this.props.commission.filter((x) => x.BalancedAmount > 0 && x.ReferalUserCode == selectedRow.UserCode).map((el, idx) => {
                                                                        return <MenuItem key={el.CommissionID + "_" + idx} value={el.CommissionID}>{el.UserCode + " ( " + el.BalancedAmount + " ) "}</MenuItem>
                                                                    })
                                                                }
                                                            </TextField>
                                                        </>
                                                        :
                                                        <Typography style={{ color: "red" }}>????????????????????????</Typography>
                                                }
                                            </Grid>
                                            :
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    autoComplete="given-name"
                                                    name="payment"
                                                    required
                                                    type="number"
                                                    fullWidth
                                                    onChange={(e) => this.handleInputChange(e)}
                                                    onKeyDown={(e) => { this.OnEnterToUpdatePayment(e) }}
                                                    id="payment"
                                                    label="Pay Amount(RM)"
                                                    autoFocus
                                                    error={this.state.isPayAmountValid}
                                                    helperText={this.state.isPayAmountValid ? "Invalid amount" : ""}
                                                />
                                            </Grid>
                                    }
                                    <Grid item xs={12} sm={6}>
                                        <ResponsiveDatePickers
                                            // rangePicker
                                            openTo="day"
                                            title="Date"
                                            required
                                            value={this.state.Datetime ? this.state.Datetime : ""}
                                            onChange={(e) => this.onDateChange(e)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    {
                                        this.state.PaymentMethod != "Reference Code" &&
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="reference"
                                                label="Reference"
                                                id="reference"
                                                onChange={(e) => this.handleInputChange(e)}
                                                onKeyDown={(e) => { this.OnEnterToUpdatePayment(e) }}
                                                autoComplete="reference"
                                                error={this.state.isReferenceValid}
                                                helperText={this.state.isReferenceValid ? "Invalid reference" : ""}
                                            />
                                        </Grid>
                                    }


                                    {/*<Grid item xs={12}>
                                    <TextField
                                    required
                                    fullWidth
                                    name="Address"
                                    label="Address"
                                    id="address"
                                    autoComplete="address"
                                    />
                                </Grid> */}
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => this.onUpdateTransactionPayment(selectedRow)}
                                    disabled={this.state.Payment === ""}
                                >
                                    Update Payment
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TransactionHistory));