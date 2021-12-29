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
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ToggleTabsComponent from "../../components/ToggleTabsComponent/ToggleTabComponents";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { isArrayNotEmpty, getWindowDimensions, isStringNullOrEmpty } from '../../tools/Helpers';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AlertDialog from "../../components/modal/Modal";
import DeleteIcon from '@mui/icons-material/Delete';

import './UserDetail.css'
function mapStateToProps(state) {
  return {
    userProfile: state.counterReducer["userProfile"],
    loading: state.counterReducer["loading"],
    userAreaCode: state.counterReducer["userAreaCode"],
    userManagementApproval: state.counterReducer["userManagementApproval"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUserProfileByID: (data) => dispatch(GitAction.CallUserProfileByID(data)),
    CallUpdateTransactionPayment: (data) => dispatch(GitAction.CallUpdateTransactionPayment(data)),
    CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
    CallUpdateUserData: (data) => dispatch(GitAction.CallUpdateUserData(data)),
    CallResetUserApprovalReturn: () => dispatch(GitAction.CallResetUserApprovalReturn()),
    CallResetUserProfile: () => dispatch(GitAction.CallResetUserProfile()),
    CallUserProfile: () => dispatch(GitAction.CallUserProfile()),
    CallDeleteUser: (data) => dispatch(GitAction.CallDeleteUser(data)),
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

const PaymentHeadCells = [
  {
    id: 'ReferenceNo',
    align: 'left',
    disablePadding: false,
    label: 'Ref.',
  },
  {
    id: 'Type',
    align: 'left',
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'PaymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Method',
  },
  {
    id: 'PaymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount',
  },
  {
    id: 'PaymentDatetime',
    align: 'left',
    disablePadding: false,
    label: 'Date',
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
      Transaction: [],
      filteredList: [],
      selectedRow: [],
      payment: "",
      selectedindex: "",
      isOnEditMode: false,
      AddModalOpen: false,
      PieChartData: [],
      isPieChartNoData: false,

      //form data
      userCode: "",
      userCodeValidated: null,
      userAreaId: 1,
      userAreaIdValidated: true,
      userFullname: "",
      userFullnameValidated: null,
      userContact: "",
      userEmail: "",
      userAddress: "",
      userMinSelfPickup: "",
      userMinSelfPickupValidated: null,
      userCubicSelfPickup: "",
      userCubicSelfPickupValidated: null,
      userConslidate: "",
      userConslidateValidated: null,
      userDeliveryCargo: "",
      userDeliveryCargoValidated: null,
      userDeliveryOn1stKG: "",
      userDeliveryOn1stKGValidated: null,
      userDeliveryOnSubKG: "",
      userDeliveryOnSubKGValidated: null,
      userDeliveryOnSubKG: "",
      userDeliveryOnSubKGValidated: null,

      // comment below used for future used, as the member may able to login to view their details
      // userDescription: "",
      // userAccountName: "",
      // userAccountNameValidated: null,

      passwordManagerOpen: false,
      newPassword: "",
      confirmationPassword: "",
      passwordValidated: null,
      deleteManagerOpen: false,

    }
    this.onTextFieldOnChange = this.onTextFieldOnChange.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.onSubmitUpdateUser = this.onSubmitUpdateUser.bind(this)
    this.handleOnDelete = this.handleOnDelete.bind(this)
    this.props.CallUserProfileByID(this.state)
  }

  componentDidMount() {
    if (this.props.userProfile.length !== this.state.UserProfile.length) {
      if (typeof this.props.userProfile !== "undefined" && typeof this.props.userProfile[0] !== "undefined") {
        let piechart_data = (isArrayNotEmpty(this.props.userProfile)) ? [
          { name: "Total Unpaid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalUnpaid)) ? Number(this.props.userProfile[0].TotalUnpaid) : 0 },
          { name: "Total Paid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalPaid)) ? Number(this.props.userProfile[0].TotalPaid) : 0 },
        ] : [{ name: "Total Unpaid", value: 0 }, { name: "Total Paid", value: 0 }]

        const { userProfile } = this.props
        this.setState({
          UserProfile: this.props.userProfile,

          //form data
          userCode: (userProfile.length > 0) ? userProfile[0].UserCode : "",
          userCodeValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].UserCode)) ? true : false,
          userAreaId: (userProfile.length > 0) ? userProfile[0].UserAreaID : 1,
          userAreaIdValidated: true,
          userFullname: (userProfile.length > 0) ? userProfile[0].Fullname : "",
          userFullnameValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].Fullname)) ? true : false,
          userContact: (userProfile.length > 0) ? userProfile[0].UserContactNo : "",
          userEmail: (userProfile.length > 0) ? userProfile[0].UserEmailAddress : "",
          userAddress: (userProfile.length > 0) ? userProfile[0].UserAddress : "",
          userMinSelfPickup: (userProfile.length > 0) ? userProfile[0].MinimumPrice : 0,
          userMinSelfPickupValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].MinimumPrice)) ? true : false,
          userCubicSelfPickup: (userProfile.length > 0) ? userProfile[0].SelfPickOverCubic : 0,
          userCubicSelfPickupValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].SelfPickOverCubic)) ? true : false,
          userConslidate: (userProfile.length > 0) ? userProfile[0].ConsolidatedPrice : 0,
          userConslidateValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].ConsolidatedPrice)) ? true : false,
          userDeliveryCargo: (userProfile.length > 0) ? userProfile[0].LargeDeliveryPrice : 0,
          userDeliveryCargoValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].LargeDeliveryPrice)) ? true : false,
          userDeliveryOn1stKG: (userProfile.length > 0) ? userProfile[0].SmallDeliveryFirstPrice : 0,
          userDeliveryOn1stKGValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].SmallDeliveryFirstPrice)) ? true : false,
          userDeliveryOnSubKG: (userProfile.length > 0) ? userProfile[0].SmallDeliverySubPrice : 0,
          userDeliveryOnSubKGValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].SmallDeliverySubPrice)) ? true : false,

          // comment below used for future used, as the member may able to login to view their details
          // userDescription: (userProfile.length > 0) ? userProfile[0].UserDescription : "",
          // userAccountName: (userProfile.length > 0) ? userProfile[0].Username : "",
          // userAccountNameValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].Username)) ? true : false,

          Transaction: JSON.parse(this.props.userProfile[0].Transaction),
          filteredList: JSON.parse(this.props.userProfile[0].Transaction),
          PieChartData: piechart_data,
          isPieChartNoData: (piechart_data[0].value === 0 && piechart_data[0].value === 0),
          Payment: (isStringNullOrEmpty(this.props.userProfile[0].Payment)) ? [] : JSON.parse(this.props.userProfile[0].Payment)
        });

        // binding form data with selected data

        if (userProfile.length < 1) {
          toast.warning("Error occured while hanlding selected data with edit form. Please try again.", { autoClose: 2000 })
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.CallResetUserProfile()
    this.setState({
      UserProfile: [],
      UserID: this.props.match.params.userid,
      Transaction: [],
      filteredList: [],
      selectedRow: [],
      payment: "",
      selectedindex: "",
      isOnEditMode: false,
      AddModalOpen: false,
      PieChartData: [],
      isPieChartNoData: false,

      //form data
      userCode: "",
      userCodeValidated: null,
      userAreaId: 1,
      userAreaIdValidated: true,
      userFullname: "",
      userFullnameValidated: null,
      userContact: "",
      userEmail: "",
      userAddress: "",
      userMinSelfPickup: "",
      userMinSelfPickupValidated: null,
      userCubicSelfPickup: "",
      userCubicSelfPickupValidated: null,
      userConslidate: "",
      userConslidateValidated: null,
      userDeliveryCargo: "",
      userDeliveryCargoValidated: null,
      userDeliveryOn1stKG: "",
      userDeliveryOn1stKGValidated: null,
      userDeliveryOnSubKG: "",
      userDeliveryOnSubKGValidated: null,
      userDeliveryOnSubKG: "",
      userDeliveryOnSubKGValidated: null,

      // comment below used for future used, as the member may able to login to view their details
      // userDescription: "",
      // userAccountName: "",
      // userAccountNameValidated: null,

      passwordManagerOpen: false,
      newPassword: "",
      confirmationPassword: "",
      passwordValidated: null,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userProfile.length !== this.props.userProfile.length) {
      if (typeof this.props.userProfile !== "undefined" && typeof this.props.userProfile[0] !== "undefined") {
        let piechart_data = (isArrayNotEmpty(this.props.userProfile)) ? [
          { name: "Total Unpaid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalUnpaid)) ? Number(this.props.userProfile[0].TotalUnpaid) : 0 },
          { name: "Total Paid", value: (!isStringNullOrEmpty(this.props.userProfile[0].TotalPaid)) ? Number(this.props.userProfile[0].TotalPaid) : 0 },
        ] : [{ name: "Total Unpaid", value: 0 }, { name: "Total Paid", value: 0 }]

        const { userProfile } = this.props
        this.setState({
          UserProfile: this.props.userProfile,
          userCode: (userProfile.length > 0) ? userProfile[0].UserCode : "",
          userCodeValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].UserCode)) ? true : false,
          userAreaId: (userProfile.length > 0) ? userProfile[0].UserAreaID : 1,
          userAreaIdValidated: true,
          userFullname: (userProfile.length > 0) ? userProfile[0].Fullname : "",
          userFullnameValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].Fullname)) ? true : false,
          userContact: (userProfile.length > 0) ? userProfile[0].UserContactNo : "",
          userEmail: (userProfile.length > 0) ? userProfile[0].UserEmailAddress : "",
          userAddress: (userProfile.length > 0) ? userProfile[0].UserAddress : "",
          userMinSelfPickup: (userProfile.length > 0) ? userProfile[0].MinimumPrice : 0,
          userMinSelfPickupValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].MinimumPrice)) ? true : false,
          userCubicSelfPickup: (userProfile.length > 0) ? userProfile[0].SelfPickOverCubic : 0,
          userCubicSelfPickupValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].SelfPickOverCubic)) ? true : false,
          userConslidate: (userProfile.length > 0) ? userProfile[0].ConsolidatedPrice : 0,
          userConslidateValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].ConsolidatedPrice)) ? true : false,
          userDeliveryCargo: (userProfile.length > 0) ? userProfile[0].LargeDeliveryPrice : 0,
          userDeliveryCargoValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].LargeDeliveryPrice)) ? true : false,
          userDeliveryOn1stKG: (userProfile.length > 0) ? userProfile[0].SmallDeliveryFirstPrice : 0,
          userDeliveryOn1stKGValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].SmallDeliveryFirstPrice)) ? true : false,
          userDeliveryOnSubKG: (userProfile.length > 0) ? userProfile[0].SmallDeliverySubPrice : 0,
          userDeliveryOnSubKGValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].SmallDeliverySubPrice)) ? true : false,
          Transaction: JSON.parse(this.props.userProfile[0].Transaction),
          filteredList: JSON.parse(this.props.userProfile[0].Transaction),
          PieChartData: piechart_data,
          isPieChartNoData: (piechart_data[0].value === 0 && piechart_data[0].value === 0),
          Payment: (isStringNullOrEmpty(this.props.userProfile[0].Payment)) ? [] : JSON.parse(this.props.userProfile[0].Payment)

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
          isPieChartNoData: (piechart_data[0].value === 0 && piechart_data[0].value === 0),
          Payment: (isStringNullOrEmpty(prevProps.userProfile[0].Payment)) ? [] : JSON.parse(prevProps.userProfile[0].Payment)

        });
      }
    }

    // successfully update user profile
    if (isArrayNotEmpty(this.props.userManagementApproval)) {
      if (this.props.userManagementApproval[0].ReturnVal == 1) {
        if (this.state.deleteManagerOpen) {
          this.props.CallResetUserApprovalReturn()
          toast.success("This member removed successfully.", { autoClose: 2000, position: 'top-center', theme: 'dark', transition: Flip })
          this.props.CallUserProfile()
          this.props.history.goBack()
        }
        else {
          this.props.CallResetUserApprovalReturn()
          toast.success("Data is updated successfully", { autoClose: 3000, position: "top-center", transition: Flip, theme: "dark" })
          let userData = this.state.UserProfile
          if (isArrayNotEmpty(userData)) {
            userData[0].Fullname = this.state.userFullname;
            userData[0].UserCode = this.state.userCode;
            userData[0].UserAreaID = this.state.userAreaId;
            userData[0].UserContactNo = this.state.userContact;
            userData[0].UserAddress = this.state.userAddress;
            userData[0].UserEmailAddress = this.state.userEmail;

            userData[0].MinimumPrice = this.state.userMinSelfPickup;
            userData[0].SelfPickOverCubic = this.state.userCubicSelfPickup;
            userData[0].ConsolidatedPrice = this.state.userConslidate;
            userData[0].LargeDeliveryPrice = this.state.userDeliveryCargo;
            userData[0].SmallDeliveryFirstPrice = this.state.userDeliveryOn1stKG;
            userData[0].SmallDeliverySubPrice = this.state.userDeliveryOnSubKG;
          }
          this.setState({
            isOnEditMode: false,
            UserProfile: userData
          })
          this.props.CallUserProfile()
        }

      }
      else {
        toast.error("Error occured while udpating user. Please try again or contact our developer.", { autoClose: 2000, theme: "colored" })
      }

    }
  }

  onTextFieldOnChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case "usercode":
        this.setState({
          userCode: value,
          userCodeValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "areaCode":
        this.setState({
          userAreaId: value,
          userAreaIdValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "Fullname":
        this.setState({
          userFullname: value,
          userFullnameValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "Contact":
        this.setState({
          userContact: value,
        })
        break;
      case "Email":
        this.setState({
          userEmail: value,
        })
        break;
      case "Address":
        this.setState({
          userAddress: value,
        })
        break;
      case "MinSelfPickup":
        this.setState({
          userMinSelfPickup: value,
          userMinSelfPickupValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "CubicSelfPickup":
        this.setState({
          userCubicSelfPickup: value,
          userCubicSelfPickupValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "Conslidate":
        this.setState({
          userConslidate: value,
          userConslidateValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "DeliveryCargo":
        this.setState({
          userDeliveryCargo: value,
          userDeliveryCargoValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "DeliveryOn1stKG":
        this.setState({
          userDeliveryOn1stKG: value,
          userDeliveryOn1stKGValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "DeliveryOnSubKG":
        this.setState({
          userDeliveryOnSubKG: value,
          userDeliveryOnSubKGValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "Username":
        this.setState({
          userAccountName: value,
          userAccountNameValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "Description":
        this.setState({
          userDescription: value,
        })
        break;
      case "NewPassword":
        this.setState({
          newPassword: value,
          passwordValidated: value.length > 0
        })
        break;
      case "ConfPassword":
        this.setState({
          confirmationPassword: value,
          passwordValidated: value === this.state.newPassword
        })
        break;
      default:
        break;
    }
  }

  onSubmitUpdateUser = () => {
    const { userAreaCode, userProfile } = this.props
    const {
      UserID,
      userCode,
      userCodeValidated,
      userAreaId,
      userAreaIdValidated,
      userFullname,
      userFullnameValidated,
      userContact,
      userEmail,
      userAddress,
      userMinSelfPickup,
      userMinSelfPickupValidated,
      userCubicSelfPickup,
      userCubicSelfPickupValidated,
      userConslidate,
      userConslidateValidated,
      userDeliveryCargo,
      userDeliveryCargoValidated,
      userDeliveryOn1stKG,
      userDeliveryOn1stKGValidated,
      userDeliveryOnSubKG,
      userDeliveryOnSubKGValidated,

      // userAccountName,
      // userAccountNameValidated,
      // userDescription,
    } = this.state

    let selectedAreaCode = userAreaCode.filter(x => x.UserAreaID === userAreaId)
    let object = {
      USERID: UserID,
      USERCODE: userCode,
      USERAREAID: (selectedAreaCode.length > 0) ? selectedAreaCode[0].UserAreaID : "1",
      FULLNAME: (!isStringNullOrEmpty(userFullname) ? userFullname : "-"),
      CONTACTNO: (!isStringNullOrEmpty(userContact) ? userContact : "-"),
      USEREMAIL: (!isStringNullOrEmpty(userEmail) ? userEmail : "-"),
      USERADDRESS: (!isStringNullOrEmpty(userAddress) ? userAddress : "-"),
      MINSELFPICKUPPRICE: (!isStringNullOrEmpty(userMinSelfPickup) ? userMinSelfPickup : "0"),
      CUBICSELFPICKUPPRICE: (!isStringNullOrEmpty(userCubicSelfPickup) ? userCubicSelfPickup : "0"),
      CONSOLIDATEPRICE: (!isStringNullOrEmpty(userConslidate) ? userConslidate : "0"),
      DELIVERYCARGO: (!isStringNullOrEmpty(userDeliveryCargo) ? userDeliveryCargo : "0"),
      DELIVERYFIRSTPRICE: (!isStringNullOrEmpty(userDeliveryOn1stKG) ? userDeliveryOn1stKG : "0"),
      DELIVERYSUBPRICE: (!isStringNullOrEmpty(userDeliveryOnSubKG) ? userDeliveryOnSubKG : "0"),
    }

    const isValidated = (
      userCodeValidated &&
      userAreaIdValidated &&
      userFullnameValidated &&
      userMinSelfPickupValidated &&
      userCubicSelfPickupValidated &&
      userConslidateValidated &&
      userDeliveryCargoValidated &&
      userDeliveryOn1stKGValidated &&
      userDeliveryOnSubKGValidated
    )

    if (isValidated) {
      this.props.CallUpdateUserData(object)
    }
    else
      toast.error("Some of the field is invalid. Please check and resubmit again.", { autoClose: 3000, position: "top-center", theme: 'colored' })
    // this.props.CallInsertUserDataByPost(object)
  }

  onUpdatePassword = () => {
    const { newPassword, confirmationPassword, UserProfile } = this.state
    if (newPassword.length < 8 || newPassword !== confirmationPassword) {
      this.setState({ passwordValidated: false })
    }
    else {
      this.setState({ passwordValidated: true })
      let object = {
        USERID: UserProfile[0].UserID,
        password: newPassword
      }
    }
  }

  onUpdateTransactionPayment = (event, row) => {
    this.props.CallUpdateTransactionPayment({ TransactionID: row.TransactionID, PaymentAmmount: this.state.payment })
    this.state.filteredList[this.state.selectedindex].OrderPaidAmount = this.state.payment;
    if (this.state.filteredList[this.state.selectedindex].OrderTotalAmount <= this.state.payment) {
      this.state.filteredList[this.state.selectedindex].OrderStatus = 'Paid'
      this.state.filteredList[this.state.selectedindex].OrderColor = 'green'
    }
    this.setState({ AddModalOpen: false })
  }

  toggleEditMode() {
    this.setState({ isOnEditMode: true })
  }

  handleOnCancel = () => {
    this.setState({ isOnEditMode: false })
  }

  handleOnDelete = () => {
    this.props.CallDeleteUser({ USERID: this.state.UserID })
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
          data.OrderStatus === "Unpaid" && <TableCell onClick={(event) => this.onAddButtonClick(event, data, index)} align="center"><CheckCircleIcon color="grey" sx={{ fontSize: 30 }}></CheckCircleIcon></TableCell>
        }
      </>
    )
  }
  renderPaymentTableRows = (data, index) => {
    return (
      <>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)} component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{data.ReferenceNo}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.Type}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.PaymentMethod}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.PaymentAmount}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.PaymentDatetime}</TableCell>
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
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontWeight: 600 }}>
          {this.state.PieChartData[index].name} {" RM " + this.state.PieChartData[index].value}
        </text>
      );
    };

    const renderAreaCodeName = (areaId) => {
      if (isArrayNotEmpty(this.props.userAreaCode)) {
        let selectedArea = this.props.userAreaCode.filter(x => x.UserAreaID == areaId)
        return selectedArea.length > 0 ? selectedArea[0].AreaCode + " - " + selectedArea[0].AreaName : "Nil"
      }
      else
        return "Nil"
    }

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
                    <div>
                      <LoadingButton
                        loading={this.props.loading}
                        loadingPosition="end"
                        endIcon={<DoDisturbIcon />}
                        variant="outlined"
                        onClick={() => this.handleOnCancel()}
                      >
                        Cancel
                      </LoadingButton>
                      <Button
                        style={{ marginLeft: "4px" }}
                        endIcon={<DeleteIcon />}
                        variant="contained"
                        sx={{ bgcolor: 'red' }}
                        color="secondary"
                        onClick={() => this.setState({ deleteManagerOpen: true })}
                      >
                        Delete Member
                      </Button>
                      <LoadingButton
                        style={{ marginLeft: "4px" }}
                        loading={this.props.loading}
                        loadingPosition="end"
                        endIcon={<SaveIcon />}
                        variant="contained"
                        onClick={() => this.onSubmitUpdateUser()}
                      >
                        Save
                      </LoadingButton>
                    </div>
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
                <Grid container sx={{ marginTop: 2, marginBottom: 2 }} spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      id="usercode"
                      label="User Code"
                      name="usercode"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userCode}
                      error={this.state.userCodeValidated !== null && !this.state.userCodeValidated}
                      helperText={this.state.userCodeValidated !== null && !this.state.userCodeValidated ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="areaCode">Area Code</InputLabel>
                      <Select
                        id="areaCode"
                        value={this.state.userAreaId}
                        label="Area Code"
                        name="areaCode"
                        required
                        placeholder="Select an area code"
                        onChange={this.onTextFieldOnChange}
                        size="small"
                      >
                        {
                          this.props.userAreaCode.length > 0 && this.props.userAreaCode.map((i, id) => {
                            return (
                              <MenuItem key={id} value={i.UserAreaID} >
                                {i.AreaName} ({i.AreaCode})
                              </MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      name="Fullname"
                      required
                      fullWidth
                      id="Fullname"
                      label="Fullname"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userFullname}
                      error={this.state.userFullnameValidated !== null && !this.state.userFullnameValidated}
                      helperText={this.state.userFullnameValidated !== null && !this.state.userFullnameValidated ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="Contact"
                      fullWidth
                      id="Contact"
                      label="Contact"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userContact}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="Email"
                      label="Email"
                      name="Email"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userEmail}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      name="Address"
                      label="Address"
                      id="Address"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userAddress}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="MinSelfPickup"
                      label="Min Self-Pickup"
                      name="MinSelfPickup"
                      variant="standard"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userMinSelfPickup}
                      error={this.state.userMinSelfPickupValidated !== null && !this.state.userMinSelfPickupValidated}
                      helperText={this.state.userMinSelfPickupValidated !== null && !this.state.userMinSelfPickupValidated ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      name="CubicSelfPickup"
                      label="Cubic Self-Pickup"
                      id="CubicSelfPickup"
                      variant="standard"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userCubicSelfPickup}
                      error={this.state.userCubicSelfPickupValidated !== null && !this.state.userCubicSelfPickupValidated}
                      helperText={this.state.userCubicSelfPickupValidated !== null && !this.state.userCubicSelfPickupValidated ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      name="Conslidate"
                      label="Conslidate"
                      id="Conslidate"
                      variant="standard"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userConslidate}
                      error={this.state.userConslidateValidated !== null && !this.state.userConslidateValidated}
                      helperText={this.state.userConslidateValidated !== null && !this.state.userConslidateValidated ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="DeliveryCargo"
                      label="Delivery Cargo"
                      name="DeliveryCargo"
                      variant="standard"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userDeliveryCargo}
                      error={this.state.userDeliveryCargoValidated !== null && !this.state.userDeliveryCargoValidated}
                      helperText={this.state.userDeliveryCargoValidated !== null && !this.state.userDeliveryCargoValidated ? "Required" : "Delivery Cargo"}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="DeliveryOn1stKG"
                      label="Delivery On 1st KG"
                      name="DeliveryOn1stKG"
                      variant="standard"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userDeliveryOn1stKG}
                      error={this.state.userDeliveryOn1stKGValidated !== null && !this.state.userDeliveryOn1stKGValidated}
                      helperText={this.state.userDeliveryOn1stKGValidated !== null && !this.state.userDeliveryOn1stKGValidated ? "Required" : "Delivery On 1st KG"}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      name="DeliveryOnSubKG"
                      label="Delivery On Sub KG"
                      id="DeliveryOnSubKG"
                      variant="standard"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userDeliveryOnSubKG}
                      error={this.state.userDeliveryOnSubKGValidated !== null && !this.state.userDeliveryOnSubKGValidated}
                      helperText={this.state.userDeliveryOnSubKGValidated !== null && !this.state.userDeliveryOnSubKGValidated ? "Required" : "Delivery On Sub KG"}
                    />
                  </Grid>

                  {/* The comment below is prepared for the future used, as if the members are allow to manage their own dashboard */}
                  {/* <Grid item xs={12} md={12}>
                    <hr />
                    <h4>User Account Information</h4>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      required
                      fullWidth
                      name="Username"
                      label="Username"
                      id="Username"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userAccountName}
                      error={this.state.userAccountNameValidated !== null && !this.state.userAccountNameValidated}
                      helperText={this.state.userAccountNameValidated !== null && !this.state.userAccountNameValidated ? "Required" : ""}
                      length={30}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div className="d-flex w-100" >
                      <TextField
                        fullWidth
                        required
                        name="Password"
                        label="Password"
                        id="Password"
                        type="password"
                        onChange={this.onTextFieldOnChange}
                        size="small"
                        value={"bfb7759a67daeb65410490b4d98bb9da7d1ea2ce"}
                        length={30}
                        disabled
                      />
                      <Button style={{ width: '20%' }} variant="outlined" startIcon={<VpnKeyIcon />} onClick={() => this.setState({ passwordManagerOpen: true })}>
                        Update
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      required
                      fullWidth
                      name="Description"
                      label="Description"
                      id="Description"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userDescription}
                      helperText={(200 - ((!isStringNullOrEmpty(this.state.userDescription)) ? this.state.userDescription.length : 0)) + " words left"}
                      length={200}
                    />
                  </Grid> */}
                  {/* The comment above is prepared for the future used, as if the members are allow to manage their own dashboard */}


                </Grid>
                :
                <div className="row">
                  {/* <div className="col-12 col-md-3 my-3  d-flex">
                    {
                      isArrayNotEmpty(this.state.UserProfile) ?
                        <div className="user-profile-image">
                          <img src={this.state.UserProfile[0].UserProfileImage} alt="User Profile" width="100%" height="100%" />
                        </div>
                        :
                        <div className="user-profile-image">

                        </div>
                    }
                  </div> */}
                  <div className="col-12 col-md-12 p-5">
                    {
                      isArrayNotEmpty(this.state.UserProfile) &&
                      <div className="row">
                        <div className="mb-2 col-4 col-md-3 information-label">MemberID </div>
                        <div className="mb-2 col-8 col-md-3">{this.state.UserProfile[0].UserCode}</div>
                        <div className="mb-2 col-4 col-md-3 information-label">Status </div>
                        <div className="mb-2 col-8 col-md-3 text-uppercase"><b className={this.state.UserProfile[0].UserStatus === "Pending" ? "text-danger" : "text-normal"}>{this.state.UserProfile[0].UserStatus}</b></div>
                        <div className="mb-2 col-4 col-md-3 information-label">Name</div>
                        <div className="mb-2 col-8 col-md-3">{this.state.UserProfile[0].Fullname}</div>
                        <div className="mb-2 col-4 col-md-3 information-label">AreaCode </div>
                        <div className="mb-2 col-8 col-md-3"><b>{renderAreaCodeName(this.state.UserProfile[0].UserAreaID)}</b></div>
                        <div className="mb-2 col-4 col-md-3 information-label">Email</div>
                        <div className="mb-2 col-8 col-md-3">{this.state.UserProfile[0].UserEmailAddress}</div>
                        <div className="mb-2 col-4 col-md-3 information-label">Contact</div>
                        <div className="mb-2 col-8 col-md-3 ">{this.state.UserProfile[0].UserContactNo}</div>
                        <div className="mb-2 col-4 col-md-3 information-label">Address</div>
                        <div className="mb-2 col-8 col-md-3 ">{this.state.UserProfile[0].UserAddress}</div>
                        <div className="col-12">
                          <hr />
                        </div>
                        <div className="row">
                          <div className="col-md-2 col-8 information-label">Self-Pickup (Min.)</div>
                          <div className="col-md-2 col-4"><b>RM</b> {this.state.UserProfile[0].MinimumPrice}</div>
                          <div className="col-md-2 col-8 information-label">Self-Pickup (Cubic)</div>
                          <div className="col-md-2 col-4"><b>RM</b> {this.state.UserProfile[0].SelfPickOverCubic}</div>
                          <div className="col-md-2 col-8 information-label">Conslidate</div>
                          <div className="col-md-2 col-4"><b>RM</b> {this.state.UserProfile[0].ConsolidatedPrice}</div>
                          <div className="col-md-2 col-8 information-label">Delivery Cargo</div>
                          <div className="col-md-2 col-4"><b>RM</b> {this.state.UserProfile[0].LargeDeliveryPrice}</div>
                          <div className="col-md-2 col-8 information-label">Delivery (1st KG)</div>
                          <div className="col-md-2 col-4"><b>RM</b> {this.state.UserProfile[0].SmallDeliveryFirstPrice}</div>
                          <div className="col-md-2 col-8 information-label">Delivery (sub-KG)</div>
                          <div className="col-md-2 col-4"><b>RM</b> {this.state.UserProfile[0].SmallDeliverySubPrice}</div>
                        </div>
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
                  <ResponsiveContainer height={getWindowDimensions().screenHeight * .5} width="100%">
                    <PieChart>
                      <Pie
                        data={this.state.PieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={this.renderCustomizedLabel}
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
                  {
                    this.state.isPieChartNoData && <p className="text-center text-secondary"><i>There are no paid or unpaid amount.</i></p>
                  }
                </div>
                <div className="col-12 col-md-6">
                  <TableComponents
                    tableOptions={{
                      dense: true,
                      tableOrderBy: 'asc',
                      sortingIndex: "ReferenceNo",
                      stickyTableHeader: false,
                      stickyTableHeight: 400,
                    }}
                    paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]}
                    tableHeaders={PaymentHeadCells}
                    tableRows={{
                      renderTableRows: this.renderPaymentTableRows,
                      checkbox: false,
                      onRowClickSelect: false
                    }}
                    selectedIndexKey={"PaymentID"}
                    Data={isArrayNotEmpty(this.state.Payment) ? this.state.Payment : []}
                    headerStyle={{ fontWeight: 'medium', bgcolor: 'rgb(200, 200, 200)', fontSize: '10pt' }}
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
              sortingIndex: "OrderDate",
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

        <AlertDialog
          open={this.state.passwordManagerOpen}              // required, pass the boolean whether modal is open or close
          handleToggleDialog={() => this.setState({ passwordManagerOpen: !this.state.passwordManagerOpen })}  // required, pass the toggle function of modal
          handleConfirmFunc={this.onUpdatePassword}    // required, pass the confirm function 
          showAction={true}                           // required, to show the footer of modal display
          title={"Change Password"}                      // required, title of the modal
          buttonTitle={"Update"}                         // required, title of button
          singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
          maxWidth={"md"}
        >
          <Grid container sx={{ marginTop: 2, marginBottom: 2 }} spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="NewPassword"
                label="NewPassword"
                id="NewPassword"
                type="password"
                onChange={this.onTextFieldOnChange}
                size="small"
                value={this.state.newPassword}
                length={30}
                error={(this.state.passwordValidated !== null && !this.state.passwordValidated)}
                helperText={(this.state.passwordValidated !== null && !this.state.passwordValidated) ? "Invalid Password" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="ConfPassword"
                label="ConfPassword"
                id="ConfPassword"
                type="password"
                onChange={this.onTextFieldOnChange}
                value={this.state.confirmationPassword}
                size="small"
                length={30}
                error={(this.state.passwordValidated !== null && !this.state.passwordValidated) || this.state.confirmationPassword !== this.state.newPassword}
                helperText={(this.state.passwordValidated !== null && !this.state.passwordValidated) || this.state.confirmationPassword !== this.state.newPassword ? "Invalid Password" : ""}
              />
            </Grid>
          </Grid>
        </AlertDialog>

        {/* Delete Modal */}
        <AlertDialog
          open={this.state.deleteManagerOpen}              // required, pass the boolean whether modal is open or close
          handleToggleDialog={() => this.setState({ deleteManagerOpen: !this.state.deleteManagerOpen })}  // required, pass the toggle function of modal
          handleConfirmFunc={this.handleOnDelete}    // required, pass the confirm function 
          showAction={true}                           // required, to show the footer of modal display
          title={"Delete Member"}                      // required, title of the modal
          buttonTitle={"Confirm Delete"}                         // required, title of button
          singleButton={false}                         // required, to decide whether to show a single full width button or 2 buttons
          maxWidth={"md"}
        >
          <div>
            <p className="text-center" style={{ fontSize: '16pt' }}><b>Are you sure to remove this member?</b></p>
            <p className="text-center">
              {isArrayNotEmpty(this.state.UserProfile) && this.state.UserProfile[0].UserCode + " - " + this.state.UserProfile[0].Fullname} <br />
              {isArrayNotEmpty(this.state.UserProfile) && "Area Code: " + this.state.UserProfile[0].AreaCode} <br />
              {isArrayNotEmpty(this.state.UserProfile) && "Area Code: " + this.state.UserProfile[0].UserContactNo}
            </p>
            <p className="text-center text-danger "><i>**Disclaimer: This action is irrevertible.</i></p>
          </div>
        </AlertDialog>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDetail));