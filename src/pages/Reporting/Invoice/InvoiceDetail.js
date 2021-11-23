import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from "react-router";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TableComponents from "../../../components/TableComponents/TableComponents"

function mapStateToProps(state) {
  return {
    transaction: state.counterReducer["transaction"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallFetchAllTransactionByID: (data) => dispatch(GitAction.CallFetchAllTransactionByID(data)),
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

class InvoicerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Transaction: [],
      TransactionID: this.props.match.params.transactionid,
      OrderDate: "",
      TransactionName: "",
      Email: "",
      Contact: "",
      Address: "",
      OrderTotalAmount: "",
      OrderPaidAmount: "",
      TransactionDetail: []
    }
    this.props.CallFetchAllTransactionByID(this.state)
  }

  componentDidMount() {
    if (this.props.transaction.length !== this.state.Transaction.length) {
      if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
        console.log(this.props.transaction)
        this.setState({
          Transaction: this.props.transaction,
          OrderDate: this.props.transaction[0].OrderDate,
          TransactionName: this.props.transaction[0].TransactionName,
          Email: this.props.transaction[0].UserEmailAddress,
          Contact: this.props.transaction[0].UserContactNo,
          Address: this.props.transaction[0].UserAddress,
          OrderTotalAmount: this.props.transaction[0].OrderTotalAmount,
          OrderPaidAmount: this.props.transaction[0].OrderPaidAmount,
          TransactionDetail: JSON.parse(this.props.transaction[0].TransactionDetail),
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.transaction)
    if (prevProps.transaction.length !== this.props.transaction.length) {
      if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
        this.setState({
          Transaction: this.props.transaction,
          OrderDate: this.props.transaction[0].OrderDate,
          TransactionName: this.props.transaction[0].TransactionName,
          Email: this.props.transaction[0].UserEmailAddress,
          Contact: this.props.transaction[0].UserContactNo,
          Address: this.props.transaction[0].UserAddress,
          OrderTotalAmount: this.props.transaction[0].OrderTotalAmount,
          OrderPaidAmount: this.props.transaction[0].OrderPaidAmount,
          TransactionDetail: this.props.transaction[0].TransactionDetail !== "null" ? JSON.parse(this.props.transaction[0].TransactionDetail) : [],
        });
      }
    } else {
      if (prevProps.transaction.length !== this.state.Transaction.length) {
        this.setState({
          Transaction: prevProps.transaction,
          OrderDate: prevProps.transaction[0].OrderDate,
          TransactionName: prevProps.transaction[0].TransactionName,
          Email: prevProps.transaction[0].UserEmailAddress,
          Contact: prevProps.transaction[0].UserContactNo,
          Address: prevProps.transaction[0].UserAddress,
          OrderTotalAmount: prevProps.transaction[0].OrderTotalAmount,
          OrderPaidAmount: prevProps.transaction[0].OrderPaidAmount,
          TransactionDetail: JSON.parse(prevProps.transaction[0].TransactionDetail),
        });
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
      </div>
    )
  }

  onTableRowClick = (event, row) => {
    this.props.history.push(`/UserDetail/${row.UserID}/${row.UserCode}`)
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
    console.log(this.props.transaction)
    return (
      <div>
        <Card>
          <CardContent>
            <div className="d-flex align-items-center">
              <IconButton
                color="primary"
                aria-label="back"
                component="span"
                onClick={() => this.props.history.goBack()}
              >
                <ArrowBackIcon />
              </IconButton>
              <div className="row">
                <Typography variant="h5" component="div">
                  {this.state.TransactionName}
                </Typography>
              </div>
            </div>
            <div className="row">
                <Typography variant="h7" component="div">
                  {this.state.OrderDate}
                </Typography>
              </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  disabled
                  value={this.state.FullName}
                  id="fullname"
                  label="Full Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  defaultValue={this.state.Contact}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  disabled
                  value={this.state.UserCode}
                  id="usercode"
                  label="User Code"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  defaultValue={this.state.Contact}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  disabled
                  value={this.state.Email}
                  id="email"
                  label="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  defaultValue={this.state.Contact}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  disabled
                  value={this.state.Contact}
                  id="contact"
                  label="Contact No."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  defaultValue={this.state.Contact}
                />
              </div>
            </div>
            <TextField
              className="w-100 my-3"
              disabled
              value={this.state.Address}
              id="address"
              label="Address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              defaultValue={this.state.Address}
            />
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  disabled
                  value={this.state.OrderTotalAmount}
                  id="OrderTotal"
                  label="Total Payable"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  defaultValue={this.state.Contact}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  disabled
                  value={this.state.OrderPaidAmount}
                  id="usercode"
                  label="Paid"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  defaultValue={this.state.Contact}
                />
              </div>
            </div>
          </CardContent>

        </Card>
        <div className="">

          <TableComponents
            tableTopLeft={<h3 style={{ fontWeight: 700 }}>Users</h3>}
            tableTopRight={this.renderTableActionButton}
            tableOptions={{
              dense: false,
              tableOrderBy: 'asc',
              sortingIndex: "fat",
              stickyTableHeader: true,
              stickyTableHeight: 300,
            }}
            paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]}
            tableHeaders={headCells}
            tableRows={{
              renderTableRows: this.renderTableRows,
              checkbox: false,
              checkboxColor: "primary",
              onRowClickSelect: false
            }}
            selectedIndexKey={"pid"}
            Data={this.state.Transaction}
            onTableRowClick={this.onTableRowClick}

          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoicerDetail));