import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
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
import TableComponents from "../../components/TableComponents/TableComponents"
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

function mapStateToProps(state) {
  return {
    userProfile: state.counterReducer["userProfile"],
    loading: state.counterReducer["loading"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUserProfileByID: (data) => dispatch(GitAction.CallUserProfileByID(data)),
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

class UserDetail extends Component {
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
      Transaction: []
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.props.CallUserProfileByID(this.state)
  }

  componentDidMount() {
    if (this.props.userProfile.length !== this.state.UserProfile.length) {
      if (this.props.userProfile !== undefined && this.props.userProfile[0] !== undefined) {
        console.log(this.props.userProfile)
        this.setState({
          UserProfile: this.props.userProfile,
          FullName: this.props.userProfile[0].Fullname,
          UserCode: this.props.userProfile[0].UserCode,
          Email: this.props.userProfile[0].UserEmailAddress,
          Contact: this.props.userProfile[0].UserContactNo,
          Address: this.props.userProfile[0].UserAddress,
          Transaction: JSON.parse(this.props.userProfile[0].Transaction),
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userProfile.length !== this.props.userProfile.length) {
      if (this.props.userProfile !== undefined && this.props.userProfile[0] !== undefined) {
        this.setState({
          UserProfile: this.props.userProfile,
          FullName: this.props.userProfile[0].Fullname,
          UserCode: this.props.userProfile[0].UserCode,
          Email: this.props.userProfile[0].UserEmailAddress,
          Contact: this.props.userProfile[0].UserContactNo,
          Address: this.props.userProfile[0].UserAddress,
          Transaction: JSON.parse(this.props.userProfile[0].Transaction),
        });
      }
    } else {
      if (prevProps.userProfile.length !== this.state.UserProfile.length) {
        this.setState({
          UserProfile: prevProps.userProfile,
          FullName: prevProps.userProfile[0].Fullname,
          UserCode: prevProps.userProfile[0].UserCode,
          Email: prevProps.userProfile[0].UserEmailAddress,
          Contact: prevProps.userProfile[0].UserContactNo,
          Address: prevProps.userProfile[0].UserAddress,
          Transaction: JSON.parse(prevProps.userProfile[0].Transaction),
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
              <div
                style={{
                  textAlign: 'end',
                  flex: 1
                }}
              >
                {/* <Button
                  onClick={() => console.log("save")}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button> */}
                <LoadingButton
                  loading={this.props.loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={() => console.log("save")}
                >
                  Save
                </LoadingButton>
              </div>
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
        <div className="mt-4">
          <TableComponents
            tableTopLeft={<h3 style={{ fontWeight: 700 }}>Invoice</h3>}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDetail));