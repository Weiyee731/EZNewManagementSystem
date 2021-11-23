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
      UserProfile: [],
      UserID: this.props.match.params.userid,
      FullName: "",
      UserCode: "",
      Email: "",
      Contact: "",
      Address: "",
      Transaction:[]
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.props.CallUserProfileByID(this.state)
  }

  componentDidMount() {
    if (this.props.transaction.length !== this.state.UserProfile.length) {
      if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
        console.log(this.props.transaction)
        this.setState({
          UserProfile: this.props.transaction,
          FullName: this.props.transaction[0].Fullname,
          UserCode: this.props.transaction[0].UserCode,
          Email: this.props.transaction[0].UserEmailAddress,
          Contact: this.props.transaction[0].UserContactNo,
          Address: this.props.transaction[0].UserAddress,
          Transaction: JSON.parse(this.props.transaction[0].Transaction),
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.transaction.length !== this.props.transaction.length) {
      if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
        this.setState({
          UserProfile: this.props.transaction,
          FullName: this.props.transaction[0].Fullname,
          UserCode: this.props.transaction[0].UserCode,
          Email: this.props.transaction[0].UserEmailAddress,
          Contact: this.props.transaction[0].UserContactNo,
          Address: this.props.transaction[0].UserAddress,
          Transaction: JSON.parse(this.props.transaction[0].Transaction),
        });
      }
    } else {
      if (prevProps.transaction.length !== this.state.UserProfile.length) {
        this.setState({
          UserProfile: prevProps.transaction,
          FullName: prevProps.transaction[0].Fullname,
          UserCode: prevProps.transaction[0].UserCode,
          Email: prevProps.transaction[0].UserEmailAddress,
          Contact: prevProps.transaction[0].UserContactNo,
          Address: prevProps.transaction[0].UserAddress,
          Transaction: JSON.parse(prevProps.transaction[0].Transaction),
        });
      }
    }
  }

  handleInputChange = (e) => {
    const elementId = e.target.id
    switch (elementId) {
      case "fullname":
        this.setState({ FullName: e.target.value.trim() })
        break;

      case "usercode":
        this.setState({ UserCode: e.target.value })
        break;
      case "email":
        this.setState({ Email: e.target.value })
        break;
      case "contact":
        this.setState({ Contact: e.target.value })
        break;
      case "address":
        this.setState({ Address: e.target.value })
        break;
      default:
        break;
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
              <Typography variant="h5" component="div">
                Edit Profile
              </Typography>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  required
                  value={this.state.FullName}
                  onChange={(e) => this.handleInputChange(e)}
                  id="fullname"
                  label="Full Name"
                  defaultValue={this.state.FullName}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  required
                  value={this.state.UserCode}
                  onChange={(e) => this.handleInputChange(e)}
                  id="usercode"
                  label="User Code"
                  defaultValue={this.state.UserCode}
                />
              </div>
            </div>
            <TextField
              className="w-100 my-3"
              required
              value={this.state.Email}
              onChange={(e) => this.handleInputChange(e)}
              id="email"
              label="Email Address"
              defaultValue={this.state.Email}
            />
            <TextField
              className="w-100 my-3"
              required
              value={this.state.Contact}
              onChange={(e) => this.handleInputChange(e)}
              id="contact"
              label="Contact No."
              defaultValue={this.state.Contact}
            />
            <TextField
              className="w-100 my-3"
              required
              value={this.state.Address}
              onChange={(e) => this.handleInputChange(e)}
              id="address"
              label="Address"
              defaultValue={this.state.Address}
            />
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