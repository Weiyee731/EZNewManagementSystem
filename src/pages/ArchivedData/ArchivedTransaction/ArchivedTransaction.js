import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
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
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CsvDownloader from 'react-csv-downloader';
import { getWindowDimensions, isArrayNotEmpty, isStringNullOrEmpty, convertDateTimeToString112Format } from "../../../tools/Helpers";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ResponsiveDatePickers from '../../../components/datePicker/datePicker';
import ToggleTabsComponent from "../../../components/ToggleTabsComponent/ToggleTabComponents";
import TableComponents from "../../../components/TableComponents/TableComponents"
import SearchBar from "../../../components/SearchBar/SearchBar"
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import "./ArchivedTransaction.css";

function mapStateToProps(state) {
    return {
        archivedData: state.counterReducer["archivedData"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllTransaction: (data) => dispatch(GitAction.CallFetchAllTransaction(data)),
        CallFetchArchivedTransactions: (data) => dispatch(GitAction.CallFetchArchivedTransactions(data)),
        CallResetArchivedData: () => dispatch(GitAction.CallResetArchivedData()),
    };
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '45%',
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

];
class ArchivedTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddModalOpen: false,
            TransactionListing: [],
            TransactionListingFiltered: null,
            TrackingStatusID: 4,
            selectedRow: [],
            TransactionID: 0,
            searchCategory: "Cash",
            Payment: "",
            Datetime: "",
            ReferenceNo: "",
            searchDates: [],
            isDataFetching: false,
            searchKeywords: "",
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSearchCategory = this.handleSearchCategory.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
        this.onFilterDateChange = this.onFilterDateChange.bind(this)
        this.onDatabaseSearch = this.onDatabaseSearch.bind(this)

        this.props.CallFetchArchivedTransactions({ STARTDATE: new Date().getFullYear() + '/1/1', ENDDATE: new Date().getFullYear() + '/12/31', })
    }

    componentDidMount() {
        // if (this.props.archivedData.length !== this.state.TransactionListing.length) {
        //     if (this.props.archivedData !== undefined && this.props.archivedData[0] !== undefined) {
        //         this.setState({ TransactionListing: this.props.archivedData, TransactionListingFiltered: this.props.archivedData });
        //     }
        // }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.TransactionListingFiltered === null && isArrayNotEmpty(this.props.archivedData)) {
            const { archivedData } = this.props
            this.setState({
                TransactionListingFiltered: (!isStringNullOrEmpty(archivedData[0].ReturnVal) && archivedData[0].ReturnVal == 0) ? [] : archivedData,
                isDataFetching: false
            })
            toast.dismiss();

            if ((!isStringNullOrEmpty(archivedData[0].ReturnVal) && archivedData[0].ReturnVal == 0)) {
                toast.warning("Fetched data is empty. ", { autoClose: 3000, theme: "dark" });
            }
        }
        // if (prevProps.archivedData.length !== this.props.archivedData.length) {
        //     if (this.props.archivedData !== undefined && this.props.archivedData[0] !== undefined) {
        //         this.setState({ TransactionListing: this.props.archivedData, TransactionListingFiltered: this.props.archivedData });
        //     }
        // } else {
        //     if (prevProps.archivedData.length !== this.state.TransactionListing.length) {
        //         this.setState({ TransactionListing: prevProps.archivedData, TransactionListingFiltered: prevProps.archivedData });
        //     }
        // }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{data.OrderDate}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.TransactionName}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.UserCode}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.AreaCode}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.Fullname}</TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderTotalAmount}</Box></TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderPaidAmount}</Box></TableCell>
                <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderStatus}</Box></TableCell>
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
        this.setState({ AddModalOpen: false });
    }

    onAddButtonClick = (event, row) => {
        this.setState({ AddModalOpen: true, selectedRow: row, TransactionID: row.TransactionID });
    }

    onDeleteButtonClick = (items) => {

    }

    onUpdateTransactionPayment = (event, row) => {
        this.props.CallUpdateTransactionPayment(this.state)
    }

    handleInputChange = (e) => {
        const elementId = e.target.id
        switch (elementId) {
            case "payment":
                this.setState({ Payment: e.target.value.trim() })
                break;

            case "date":
                this.setState({ Datetime: e.target.value })
                break;
            case "reference":
                this.setState({ ReferenceNo: e.target.value })
                break;
            default:
                break;
        }

    }

    onDateChange(e) {
        this.setState({ Datetime: e })
    }

    onFilterDateChange(e) {
        this.setState({ searchDates: e })
    }

    onDatabaseSearch() {
        const { searchDates } = this.state
        let date_range = (typeof searchDates === "string" && !Array.isArray(searchDates)) ? JSON.parse(searchDates) : searchDates
        // 
        if (!date_range.includes(null)) {
            this.props.CallResetArchivedData()
            const object = (date_range.length > 0)
                ? { STARTDATE: convertDateTimeToString112Format(date_range[0], false), ENDDATE: convertDateTimeToString112Format(date_range[1], false) }
                : { STARTDATE: new Date().getFullYear() + "/1/1", ENDDATE: new Date().getFullYear() + "/12/31" }
            this.props.CallFetchArchivedTransactions(object)
            toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
            this.setState({ isDataFetching: true, TransactionListingFiltered: null })
            this.forceUpdate()
        }
        else {
            if (date_range[0] === null && date_range[1] === null) {
                this.props.CallResetArchivedData()
                const object = { STARTDATE: new Date().getFullYear() + "/1/1", ENDDATE: new Date().getFullYear() + "/12/31" }
                this.props.CallFetchArchivedTransactions(object)
                toast.loading("Pulling data... Please wait...", { autoClose: false, position: "top-center", transition: Flip, theme: "dark" })
                this.setState({ isDataFetching: true, TransactionListingFiltered: null })
                this.forceUpdate()
            }
            else {
                if (date_range[0] === null)
                    toast.error("Require valid begin dates", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark" })

                if (date_range[1] === null)
                    toast.error("Require valid end dates", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark" })
            }

        }
    }

    handleSearchCategory(e) {
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

    render() {
        const onLocalSearch = (e) => {
            let searchKeywords = isStringNullOrEmpty(e.target.value) ? "" : e.target.value.toLowerCase()
            let FilterArr = this.props.archivedData.filter((searchedItem) =>
                (!isStringNullOrEmpty(searchedItem.Fullname) && searchedItem.Fullname.toLowerCase().includes(searchKeywords)) || 
                (!isStringNullOrEmpty(searchedItem.UserCode) && searchedItem.UserCode.toLowerCase().includes(searchKeywords)) ||
                (!isStringNullOrEmpty(searchedItem.TransactionName) && searchedItem.TransactionName.toLowerCase().includes(searchKeywords)) || 
                (!isStringNullOrEmpty(searchedItem.UserContactNo) && searchedItem.UserContactNo.includes(searchKeywords))
            )
            this.setState({ TransactionListingFiltered: isStringNullOrEmpty(searchKeywords) ? this.props.archivedData : FilterArr, searchKeywords: searchKeywords });
        }

        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unpaid", key: "Unpaid" },
            { children: "Paid", key: "Paid" }
        ]

        return (
            <>
                <div className="w-100 container-fluid">
                    <div className="row d-flex">
                        <div className="row">
                            <div className="col-md-12 col-12 mb-2 stock-date-range-picker d-flex">
                                <label className="my-auto" style={{ marginRight: '15px' }}>Filter by Date: </label>
                                <ResponsiveDatePickers
                                    rangePicker
                                    openTo="day"
                                    title="FromDate"
                                    value={this.state.datevalue ? this.state.datevalue : ""}
                                    onChange={(e) => this.onFilterDateChange(e)}
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
                        <div className="col-md-11 col-11 m-auto">
                            <SearchBar onChange={onLocalSearch} value={this.state.searchKeywords} />
                        </div>
                        <div className="col-md-1 col-1 m-auto">
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
                            stickyTableHeight: getWindowDimensions().screenHeight * 0.8,     // optional, default is 300px
                        }}
                        paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                        tableHeaders={headCells}        //required
                        tableRows={{
                            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                            checkbox: false,                          // optional, by default is true
                            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                            onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        }}
                        selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                        Data={this.state.TransactionListingFiltered}                                  // required, the data that listing in the table
                        // onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                        onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                        onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                        headerStyle={{ fontWeight: 'medium', bgcolor: 'rgb(200, 200, 200)', fontSize: '10pt' }}
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
                        BackdropProps={{ timeout: 500 }}>
                        <Box sx={style} component="main" maxWidth="xs">
                            <Typography component="h1" variant="h5">Update Payment</Typography>
                            <Box noValidate sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <label className="my-auto col-3">Payment Method:</label>
                                        <Select
                                            labelId="search-filter-category"
                                            id="search-filter-category"
                                            value={this.state.PaymentMethod}
                                            label="Search By"
                                            onChange={this.handleSearchCategory}
                                            size="large"
                                            IconComponent={FilterListOutlinedIcon}
                                            className="col-9"
                                            placeholder="filter by"
                                        >
                                            <MenuItem key="search_all" value="Cash">Cash</MenuItem>
                                            <MenuItem key="search_tracking" value="Tracking">Bank Transfer</MenuItem>
                                            <MenuItem key="search_member" value={"Member"}>Boost</MenuItem>
                                            <MenuItem key="search_container" value={"Container"}>S Pay Global</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="payment"
                                            required
                                            fullWidth
                                            onChange={(e) => this.handleInputChange(e)}
                                            id="payment"
                                            label="Pay ammount"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ResponsiveDatePickers
                                            // rangePicker
                                            openTo="day"
                                            title="Date"
                                            value={this.state.Datetime ? this.state.Datetime : ""}
                                            onChange={(e) => this.onDateChange(e)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="reference"
                                            label="reference"
                                            id="reference"
                                            onChange={(e) => this.handleInputChange(e)}
                                            autoComplete="reference"
                                        />
                                    </Grid>
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
                                    onClick={(e) => { this.onUpdateTransactionPayment(e, this.state.selectedRow) }}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArchivedTransaction));