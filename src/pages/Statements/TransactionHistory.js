import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableComponents from "../../components/TableComponents/TableComponents"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import SearchBar from "../../components/SearchBar/SearchBar"
import CsvDownloader from 'react-csv-downloader';
import { getWindowDimensions, isArrayNotEmpty } from "../../tools/Helpers";
function mapStateToProps(state) {
    return {
        transactions: state.counterReducer["transactions"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllTransaction: (data) => dispatch(GitAction.CallFetchAllTransaction(data)),
    };
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '65%',
    height: '50%',
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
class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddModalOpen: false,
            TransactionListing: [],
            TransactionListingFiltered: [],
            TrackingStatusID:4
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
        if (prevProps.transactions.length !== this.props.transactions.length) {
            console.log(this.props.transactions !== undefined && this.props.transactions[0] !== undefined)
            if (this.props.transactions !== undefined && this.props.transactions[0] !== undefined) {
                this.setState({ TransactionListing: this.props.transactions, TransactionListingFiltered: this.props.transactions });
            }
        } else {
            if (prevProps.transactions.length !== this.state.TransactionListing.length) {
                this.setState({ TransactionListing: prevProps.transactions, TransactionListingFiltered: prevProps.transactions });
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
                <TableCell align="center"><Box color={data.OrderColor}>{data.OrderTotalAmount}</Box></TableCell>
                <TableCell align="center"><Box color={data.OrderColor}>{data.OrderPaidAmount}</Box></TableCell>
                <TableCell align="center"><Box color={data.OrderColor}>{data.OrderStatus}</Box></TableCell>
            </>
        )
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }

    onTableRowClick = (event, row) => {
        this.props.history.push(`/InvoiceDetail/${row.TransactionID}`)
    }

    handleClose = () => {
        this.setState({ AddModalOpen: false });
    }

    onAddButtonClick = () => {
        this.setState({ AddModalOpen: true });
    }

    onDeleteButtonClick = (items) => {
        console.log('delete button')

    }



    render() {
        const onChange = (e) => {
            const FilterArr = this.state.TransactionListing.filter((searchedItem) =>searchedItem.UserCode.toLowerCase().includes(e.target.value))
            this.setState({ TransactionListingFiltered: FilterArr });
        }

        return (
            <>
                <div className="w-100 container-fluid">
                    <div className="row d-flex">
                        <div className="col-md-10 col-10 m-auto">
                            <SearchBar onChange={onChange} />
                        </div>
                        <div className="col-md-2 col-2 m-auto">
                            <CsvDownloader
                                filename="transactionhistory-list"
                                extension=".xls"
                                separator=","
                                columns={headCells}
                                datas={isArrayNotEmpty(this.state.TransactionListingFiltered) ? this.state.TransactionListingFiltered : []}>
                                <Button className="w-100" variant="contained" color="primary">Download CSV</Button>
                            </CsvDownloader>
                        </div>
                    </div>
                    <TableComponents
                        // table settings 
                        tableTopLeft={<h3 style={{ fontWeight: 700 }}>Transaction History</h3>}  // optional, it can pass as string or as children elements
                        // tableTopRight={this.renderTableActionButton}                 // optional, it will brings the elements to the table's top right corner

                        tableOptions={{
                            dense: false,                // optional, default is false
                            tableOrderBy: 'asc',        // optional, default is asc
                            sortingIndex: "fat",        // require, it must the same as the desired table header
                            stickyTableHeader: true,    // optional, default is true
                            stickyTableHeight: 300,     // optional, default is 300px
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
                        onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                        onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                        onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
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
                            <Typography component="h1" variant="h5">Sign up</Typography>
                            <Box component="form" noValidate sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="Full Name"
                                            required
                                            fullWidth
                                            id="Fullname"
                                            label="Full Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="UserCode"
                                            label="User Code"
                                            name="UserCode"
                                            autoComplete="family-name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="Contact"
                                            label="Contact"
                                            id="contact"
                                            autoComplete="contact"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="Address"
                                            label="Address"
                                            id="address"
                                            autoComplete="address"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Add New User
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