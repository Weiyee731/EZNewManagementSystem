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
import { toast } from "react-toastify";
import SearchBar from "../../../components/SearchBar/SearchBar"
import { roundOffTotal } from "../../../tools/Helpers";

function mapStateToProps(state) {
    return {
        transactions: state.counterReducer["transactions"],
        transactionReturn: state.counterReducer["transactionReturn"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllTransaction: (data) => dispatch(GitAction.CallFetchAllTransaction(data)),
        CallCancelTransaction: (propsData) => dispatch(GitAction.CallCancelTransaction(propsData))
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
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
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
        if (prevProps.transactions.length !== transactions.length) {
            if (transactions !== undefined && transactions[0] !== undefined) {
                this.setState({ TransactionListing: transactions, TransactionListingFiltered: transactions });
            }
        } else {
            if (prevProps.transactions.length !== this.state.TransactionListing.length) {
                this.setState({ TransactionListing: prevProps.transactions, TransactionListingFiltered: prevProps.transactions });
            }
        }

        if (prevProps.transactionReturn !== transactionReturn) {
            if (transactionReturn[0].ReturnVal == 1) {
                toast.success(transactionReturn[0].ReturnMsg)
            } else {
                toast.error("Something went wrong. Please try again")
            }
        }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{data.OrderDate}</TableCell>
                <TableCell>{data.TransactionName}</TableCell>
                <TableCell>{data.UserCode}</TableCell>
                <TableCell>{data.AreaCode}</TableCell>
                <TableCell>{data.Fullname}</TableCell>
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
            selectedRowId.push(row.StockID)
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

    render() {
        const { openCancelModal } = this.state
        const onChange = (e) => {
            const FilterArr = this.state.TransactionListing.filter((searchedItem) => searchedItem.UserCode.toLowerCase().includes(e.target.value))
            this.setState({ TransactionListingFiltered: FilterArr });
        }

        return (
            <div>
                <SearchBar onChange={onChange} />
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
                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
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