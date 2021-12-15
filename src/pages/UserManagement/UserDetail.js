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
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TableComponents from "../../components/TableComponents/TableComponents"
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ToggleTabsComponent from "../../components/ToggleTabsComponent/ToggleTabComponents";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { isArrayNotEmpty, getWindowDimensions, isStringNullOrEmpty } from '../../tools/Helpers';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import './UserDetail.css'
function mapStateToProps(state) {
  return {
    userProfile: state.counterReducer["userProfile"],
    loading: state.counterReducer["loading"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUserProfileByID: (data) => dispatch(GitAction.CallUserProfileByID(data)),
    CallUpdateTransactionPayment: (data) => dispatch(GitAction.CallUpdateTransactionPayment(data)),
  };
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '25%',
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

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
      Transaction: [],
      filteredList: [],
      selectedRow: [],
      payment: "",
      selectedindex: "",
      isOnEditMode: false,
      AddModalOpen: false,
      PieChartData: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.handleOnSave = this.handleOnSave.bind(this)
    this.props.CallUserProfileByID(this.state)
  }

  // componentDidMount() {
  //   if (this.props.userProfile.length !== this.state.UserProfile.length) {
  //     if (typeof this.props.userProfile !== "undefined" && typeof this.props.userProfile[0] !== "undefined") {
  //       const piechart_data = (isArrayNotEmpty(this.props.UserProfile)) ? [
  //         { name: "Total Unpaid", value: (!isStringNullOrEmpty(this.props.UserProfile[0].TotalUnpaid)) ? Number(this.props.UserProfile[0].TotalUnpaid) : 0 },
  //         { name: "Total Paid", value: (!isStringNullOrEmpty(this.props.UserProfile[0].TotalPaid)) ? Number(this.props.UserProfile[0].TotalPaid) : 0 },
  //       ] : []

  //       this.setState({
  //         UserProfile: this.props.userProfile,
  //         FullName: this.props.userProfile[0].Fullname,
  //         UserCode: this.props.userProfile[0].UserCode,
  //         Email: this.props.userProfile[0].UserEmailAddress,
  //         Contact: this.props.userProfile[0].UserContactNo,
  //         Address: this.props.userProfile[0].UserAddress,
  //         Transaction: JSON.parse(this.props.userProfile[0].Transaction),
  //         filteredList: JSON.parse(this.props.userProfile[0].Transaction),
  //         PieChartData: piechart_data,
  //       });
  //     }
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userProfile.length !== this.props.userProfile.length) {
      if (typeof this.props.userProfile !== "undefined" && typeof this.props.userProfile[0] !== "undefined") {
        let piechart_data = (isArrayNotEmpty(this.props.userProfile)) ? [
          { name: "Total Unpaid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalUnpaid)) ? Number(this.props.userProfile[0].TotalUnpaid) : 0 },
          { name: "Total Paid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalPaid)) ? Number(this.props.userProfile[0].TotalPaid) : 0 },
        ] : [{ name: "Total Unpaid", value: 0 }, { name: "Total Paid", value: 0 }]
        
        this.setState({
          UserProfile: this.props.userProfile,
          FullName: this.props.userProfile[0].Fullname,
          UserCode: this.props.userProfile[0].UserCode,
          Email: this.props.userProfile[0].UserEmailAddress,
          Contact: this.props.userProfile[0].UserContactNo,
          Address: this.props.userProfile[0].UserAddress,
          Transaction: JSON.parse(this.props.userProfile[0].Transaction),
          filteredList: JSON.parse(this.props.userProfile[0].Transaction),
          PieChartData: piechart_data,
        });

      }
    } else {
      if (prevProps.userProfile.length !== this.state.UserProfile.length) {
        let piechart_data = (isArrayNotEmpty(this.props.userProfile)) ? [
          { name: "Total Unpaid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalUnpaid)) ? Number(this.props.userProfile[0].TotalUnpaid) : 0 },
          { name: "Total Paid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalPaid)) ? Number(this.props.userProfile[0].TotalPaid) : 0 },
        ] : [{ name: "Total Unpaid", value: 0 }, { name: "Total Paid", value: 0 }]
        this.setState({
          UserProfile: prevProps.userProfile,
          FullName: prevProps.userProfile[0].Fullname,
          UserCode: prevProps.userProfile[0].UserCode,
          Email: prevProps.userProfile[0].UserEmailAddress,
          Contact: prevProps.userProfile[0].UserContactNo,
          Address: prevProps.userProfile[0].UserAddress,
          Transaction: JSON.parse(prevProps.userProfile[0].Transaction),
          filteredList: JSON.parse(prevProps.userProfile[0].Transaction),
          PieChartData: piechart_data,

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
      case "payment":
        this.setState({ payment: e.target.value.trim() })
        break;
      default:
        break;
    }
  }

  onUpdateTransactionPayment = (event, row) => {
    this.props.CallUpdateTransactionPayment({ TransactionID: row.TransactionID, PaymentAmmount: this.state.payment })
    this.state.filteredList[this.state.selectedindex].OrderPaidAmount = this.state.payment;
    if (this.state.filteredList[this.state.selectedindex].OrderTotalAmount <= this.state.payment) {
      this.state.filteredList[this.state.selectedindex].OrderStatus = 'Paid'
      this.state.filteredList[this.state.selectedindex].OrderColor = 'green'
    }
    console.log(this.state.filteredList)
    this.setState({ AddModalOpen: false })
  }

  toggleEditMode() {
    this.setState({ isOnEditMode: true })
  }

  handleOnSave = () => {
    console.log("Save")
    this.setState({ isOnEditMode: false })

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
        {
          data.OrderStatus === "Unpaid" ? <TableCell onClick={(event) => this.onAddButtonClick(event, data, index)} align="center"><CheckCircleIcon color="grey" sx={{ fontSize: 30 }}></CheckCircleIcon></TableCell> : ""
        }
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
    this.props.history.push(`/TransactionHistoryDetail/${row.TransactionID}`)
  }

  handleClose = () => {
    this.setState({ AddModalOpen: false });
  }

  onAddButtonClick = (event, row, index) => {
    this.setState({ AddModalOpen: true, selectedRow: row, selectedindex: index });
  }

  changeTab = (key) => {
    switch (key) {
      case "All":
        this.setState({
          filteredList: this.state.Transaction
        })
        break;
      case "Unpaid":
        this.setState({
          filteredList: this.state.Transaction.filter(x => x.OrderStatus === "Unpaid")
        })
        break;
      case "Paid":
        this.setState({
          filteredList: this.state.Transaction.filter(x => x.OrderStatus === "Paid")
        })
        break;
      default:
        break;
    }
  }


  render() {
    const { isOnEditMode } = this.state
    const ToggleTabs = [
      { children: "All", key: "All" },
      { children: "Unpaid", key: "Unpaid" },
      { children: "Paid", key: "Paid" }
    ]

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {this.state.PieChartData[index].name} {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    console.log(this.state.UserProfile)
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
              <Typography variant="h5" component="div"> Edit Profile </Typography>
              <div style={{ textAlign: 'end', flex: 1 }}>
                {
                  isOnEditMode ?
                    <LoadingButton
                      loading={this.props.loading}
                      loadingPosition="end"
                      endIcon={<SaveIcon />}
                      variant="contained"
                      onClick={() => this.handleOnSave()}
                    >
                      Save
                    </LoadingButton>
                    :
                    <Button
                      variant="outlined"
                      sx={{ bgcolor: "white", border: '1px solid rgba(22, 22, 22, 0.95)', color: 'rgba(22, 22, 22, 0.95)' }}
                      onClick={() => { this.toggleEditMode() }}
                      endIcon={<ModeEditOutlineOutlinedIcon />}
                    >
                      Edit
                    </Button>
                }

              </div>
            </div>

            {
              isOnEditMode ?
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
                  <div className="col-lg-12 col-md-12 col-12">
                    <TextField
                      className="w-100 my-3"
                      required
                      value={this.state.Email}
                      onChange={(e) => this.handleInputChange(e)}
                      id="email"
                      label="Email Address"
                      defaultValue={this.state.Email}
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-12">
                    <TextField
                      className="w-100 my-3"
                      required
                      value={this.state.Contact}
                      onChange={(e) => this.handleInputChange(e)}
                      id="contact"
                      label="Contact No."
                      defaultValue={this.state.Contact}
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-12">
                    <TextField
                      className="w-100 my-3"
                      required
                      value={this.state.Address}
                      onChange={(e) => this.handleInputChange(e)}
                      id="address"
                      label="Address"
                      defaultValue={this.state.Address}
                    />
                  </div>
                </div>
                :
                <div className="row">
                  <div className="col-12 col-md-3 my-3  d-flex">
                    {
                      isArrayNotEmpty(this.state.UserProfile) ?
                        <div className="user-profile-image">
                          <img src={this.state.UserProfile[0].UserProfileImage} alt="User Profile" width="100%" height="100%" />
                        </div>
                        :
                        <div className="user-profile-image">

                        </div>
                    }

                  </div>
                  <div className="col-12 col-md-9">
                    {
                      isArrayNotEmpty(this.state.UserProfile) &&
                      <div className="row">
                        <div className="mb-2 col-12 col-md-3 information-label">Member No </div>
                        <div className="mb-2 col-12 col-md-3">{this.state.UserProfile[0].UserCode}</div>
                        <div className="mb-2 col-12 col-md-3 information-label">Status </div>
                        <div className="mb-2 col-12 col-md-3">{this.state.UserProfile[0].UserStatus}</div>
                        <div className="mb-2 col-12 col-md-3 information-label">Name</div>
                        <div className="mb-2 col-12 col-md-3">{this.state.UserProfile[0].Fullname}</div>
                        <div className="mb-2 col-12 col-md-3 information-label">Username </div>
                        <div className="mb-2 col-12 col-md-3">{this.state.UserProfile[0].Username}</div>
                        <div className="mb-2 col-12 col-md-3 information-label">Email</div>
                        <div className="mb-2 col-12 col-md-3">{this.state.UserProfile[0].UserEmailAddress}</div>
                        <div className="mb-2 col-12 col-md-3 information-label">Contact</div>
                        <div className="mb-2 col-12 col-md-3 ">{this.state.UserProfile[0].UserContactNo}</div>
                        <div className="mb-2 col-12 col-md-3 information-label">Description</div>
                        <div className="mb-2 col-12 col-md-9">{this.state.UserProfile[0].UserDescription}</div>
                      </div>
                    }
                  </div>
                </div>
            }
          </CardContent>
        </Card>

        <div className="mt-4 ">
          <Card>
            <CardContent>
              <div className="row ">
                <div className="col-12 col-md-6">
                  <ResponsiveContainer height={getWindowDimensions().screenHeight * .3} width="100%">
                    <PieChart>
                      <Pie
                        data={this.state.PieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {isArrayNotEmpty(this.state.PieChartData) && this.state.PieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="col-12 col-md-6">
                  <TableComponents
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
                    Data={this.state.filteredList}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="mt-4">
          <ToggleTabsComponent Tabs={ToggleTabs} size="small" onChange={this.changeTab} />
          <TableComponents
            tableTopLeft={<h3 style={{ fontWeight: 700 }}>History Transaction</h3>}
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
            Data={this.state.filteredList}
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDetail));