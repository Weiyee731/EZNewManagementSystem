import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from "react-router";
import Card from '@mui/material/Card';
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
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { isArrayNotEmpty, getWindowDimensions, isStringNullOrEmpty, convertDateTimeToString112Format, roundOffTotal } from '../../tools/Helpers';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { toast, Flip } from 'react-toastify';
import AlertDialog from "../../components/modal/Modal";
import DeleteIcon from '@mui/icons-material/Delete';
import ResponsiveDatePickers from '../../components/datePicker/datePicker';
import PaidIcon from '@mui/icons-material/Paid';

import VpnKeyIcon from '@mui/icons-material/VpnKey';
import './UserDetail.css'

function mapStateToProps(state) {
  return {
    userProfile: state.counterReducer["userProfile"],
    userPassword: state.counterReducer["userPassword"],
    loading: state.counterReducer["loading"],
    userAreaCode: state.counterReducer["userAreaCode"],
    userManagementApproval: state.counterReducer["userManagementApproval"],
    transactionReturn: state.counterReducer["transactionReturn"],
    commission: state.counterReducer["commission"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUserProfileByID: (data) => dispatch(GitAction.CallUserProfileByID(data)),
    CallUpdatePassword: (data) => dispatch(GitAction.CallUpdatePassword(data)),
    CallUpdateTransactionPayment: (data) => dispatch(GitAction.CallUpdateTransactionPayment(data)),
    CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
    CallUpdateUserData: (data) => dispatch(GitAction.CallUpdateUserData(data)),
    CallResetUserApprovalReturn: () => dispatch(GitAction.CallResetUserApprovalReturn()),
    CallResetUserProfile: () => dispatch(GitAction.CallResetUserProfile()),
    CallUserProfile: () => dispatch(GitAction.CallUserProfile()),
    CallDeleteUser: (data) => dispatch(GitAction.CallDeleteUser(data)),
    CallViewCommissionByUserCode: (data) => dispatch(GitAction.CallViewCommissionByUserCode(data)),
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
  }
  // ,
  // {
  //   id: 'action',
  //   align: 'center',
  //   disablePadding: false,
  //   label: '',
  // },
];

const PaymentHeadCells = [
  {
    id: 'PaymentID',
    align: 'left',
    disablePadding: false,
    label: '#',
  },
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
      selectedindex: [],
      isOnEditMode: false,
      AddModalOpen: false,
      PieChartData: [],
      isPieChartNoData: false,

      //form data
      userCode: "",
      userCodeValidated: null,
      userName: "",
      userNameValidated: null,
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
      PaymentMethod: "Cash",
      TransactionID: [],
      ReferenceNo: '',
      Datetime: new Date(),
      // userDeliveryOnSubKG: "",
      // userDeliveryOnSubKGValidated: null,

      // comment below used for future used, as the member may able to login to view their details
      // userDescription: "",
      // userAccountName: "",
      // userAccountNameValidated: null,

      passwordManagerOpen: false,
      newPassword: "",
      confirmationPassword: "",
      passwordValidated: null,
      deleteManagerOpen: false,

      enableCheckbox: false,
      totalDebt: 0,
      referenceCodePayment: []
    }
    this.onTextFieldOnChange = this.onTextFieldOnChange.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.onSubmitUpdateUser = this.onSubmitUpdateUser.bind(this)
    this.handleOnDelete = this.handleOnDelete.bind(this)
    this.handlePaymentCategoryCategory = this.handlePaymentCategoryCategory.bind(this)
    this.onSelectRow = this.onSelectRow.bind(this)
    this.onSelectAllRow = this.onSelectAllRow.bind(this)
    this.handleReferencePayment = this.handleReferencePayment.bind(this)
    this.OnEnterToUpdatePayment = this.OnEnterToUpdatePayment.bind(this)

  }

  componentDidMount() {
    this.props.CallUserProfileByID(this.state)

    if (window.location.pathname.split("/").length > 0) {
      let length = window.location.pathname.split("/").length
      let UserCode = window.location.pathname.split("/")[length - 1]
      this.props.CallViewCommissionByUserCode({ UserCode: UserCode })
    }

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
          userName: (userProfile.length > 0) ? userProfile[0].Username : "",
          userNameValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].Username)) ? true : false,
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
          filteredList: JSON.parse(this.props.userProfile[0].Transaction), //console.log(this.state.filteredList)
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
      selectedindex: [],
      isOnEditMode: false,
      AddModalOpen: false,
      PieChartData: [],
      isPieChartNoData: false,

      //form data
      userCode: "",
      userName: "",
      userNameValidated: null,
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
      // userDeliveryOnSubKG: "",
      // userDeliveryOnSubKGValidated: null,

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
          userName: (userProfile.length > 0) ? userProfile[0].Username : "",
          userNameValidated: (userProfile.length > 0 && !isStringNullOrEmpty(userProfile[0].Username)) ? true : false,
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
          Username: prevProps.userProfile[0].Username,
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
      if (this.props.userManagementApproval[0].ReturnVal === 1) {
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
            userData[0].Username = this.state.userName;
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

    if (prevProps.transactionReturn !== this.props.transactionReturn) {

      this.props.CallResetUserProfile()
      this.props.CallUserProfileByID(this.state)

      if (this.props.transactionReturn && this.props.transactionReturn[0].ReturnVal === 1) {
        if (typeof this.props.userProfile !== "undefined" && typeof this.props.userProfile[0] !== "undefined") {
          console.log(JSON.parse(this.props.userProfile[0].Transaction))
          let filteredList = JSON.parse(this.props.userProfile[0].Transaction).filter(x => x.OrderStatus === "Unpaid")
          console.log(filteredList)
          toast.success("Invoice has been updated successfully", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark" })
          this.setState({ AddModalOpen: false, filteredList: filteredList })
        }
      } else toast.error("Update failed, please check your internet connection and input", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark" })
    }

    if (this.props.userPassword !== prevProps.userPassword && this.props.userPassword !== undefined && this.props.userPassword[0].ReturnVal == 1 && this.state.passwordValidated === true) {
      toast.success("Password Updated")
      this.setState({ passwordManagerOpen: false, passwordValidated: false })
    }
  }

  onSelectRow(row, i) {
    var totalDebt = 0;
    var sorted = []
    if (isArrayNotEmpty(row)) {
      sorted = [...row].sort((a, b) =>
        parseInt(a.TransactionID) - parseInt(b.TransactionID)
      );
    }

    if (this.state.selectedindex.indexOf(i) === -1) {
      this.state.selectedindex.push(i)

    } else {
      this.setState({ selectedindex: this.state.selectedindex.filter(index => index !== i) })
    }
    if (isArrayNotEmpty(sorted)) {
      console.log(sorted)
      sorted.map(el => {
        var debt = el.OrderTotalAmount - el.OrderPaidAmount
        totalDebt += debt
        return (totalDebt)
      })
    }
    this.setState({ selectedRow: sorted, totalDebt: totalDebt.toFixed(2) })
  }

  onSelectAllRow(rows) {
    var index = []
    var totalDebt = 0;

    if (isArrayNotEmpty(rows)) {
      for (var x = 0; x < rows.length; x++) {
        index.push(x)

        // calculate the total debts
        var debt = rows[x].OrderTotalAmount - rows[x].OrderPaidAmount
        totalDebt += debt
      }
      this.setState({ selectedRow: rows, selectedindex: index, totalDebt: totalDebt.toFixed(2) })
    }
  }

  renderTableActionButton = () => {
    return (
      <IconButton onClick={(event) => { this.onAddButtonClick(event, this.state.selectedRow, this.state.selectedindex) }}>
        <PaidIcon color="error" />
      </IconButton>
    )
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
      case "username":
        this.setState({
          userName: value,
          userNameValidated: !isStringNullOrEmpty(value)
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

  handleInputChange = (e) => {
    const elementId = e.target.id
    switch (elementId) {
      case "payment":
        this.setState({ payment: e.target.value.trim() })
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

  onSubmitUpdateUser = () => {
    const { userAreaCode } = this.props
    const {
      UserID,
      userCode,
      userCodeValidated,
      userAreaId,
      userAreaIdValidated,
      userFullname,
      userFullnameValidated,
      userContact,
      userName,
      userNameValidated,
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
      WECHATID: this.props.userProfile[0].UserWechatID,
      USERNICKNAME: this.props.userProfile[0].UserNickname,
      FULLNAME: (!isStringNullOrEmpty(userFullname) ? userFullname : "-"),
      USERNAME: (!isStringNullOrEmpty(userName) ? userName : "-"),
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
      userNameValidated &&
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

      this.props.CallUpdatePassword(object)
    }
  }

  OnEnterToUpdatePayment = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13)
      this.onUpdateTransactionPayment()
  }

  onUpdateTransactionPayment = async (event, row) => {
    const { payment, totalDebt, selectedRow, PaymentMethod, ReferenceNo, Datetime } = this.state
    var TotalPayment = payment
    var AllTransactionID = []
    var pays = [];
    var pay = []
    let commissionID = []

    if (isArrayNotEmpty(selectedRow)) {
      selectedRow.map(el => {
        AllTransactionID.push(el.TransactionID)
        commissionID.push("-")
        pays.push(el.OrderTotalAmount - el.OrderPaidAmount)
        return AllTransactionID
      })
    }


    if (payment === totalDebt) {
      pay = pays
    }
    else if (payment > totalDebt) {
      var count = 0
      pays.map(el => {

        if ((TotalPayment - el) >= 0) {
          if (count <= pays.length - 2)
            pay.push(Number(el));
          else
            pay.push(Number(TotalPayment));
        }
        else if (TotalPayment - el < 0 && TotalPayment > 0)
          pay.push(Number(TotalPayment))
        else
          pay.push(0)

        TotalPayment -= el
        count += 1
        TotalPayment = roundOffTotal(TotalPayment)
        return (pay)
      })

    }
    else if (payment < totalDebt) {
      pays.map(el => {
        if ((TotalPayment - el) >= 0)
          pay.push(el);
        else if (TotalPayment - el < 0 && TotalPayment > 0)
          pay.push(Number(TotalPayment))
        else
          pay.push(0)

        TotalPayment -= el
        TotalPayment = roundOffTotal(TotalPayment)
        return (pay)
      })
      //need to calculate which one to pay
    }

    if (pay.length === AllTransactionID.length) {
      AllTransactionID = AllTransactionID.join(';')
      pay = pay.join(';')
      let object = {
        TransactionID: AllTransactionID,
        CommissionID: commissionID.join(';'),
        PaymentAmmount: pay,
        PaymentMethod: PaymentMethod,
        ReferenceNo: ReferenceNo,
        Datetime: convertDateTimeToString112Format(Datetime),
      }

      if (!isStringNullOrEmpty(object.PaymentAmmount) && !isStringNullOrEmpty(object.ReferenceNo))
        this.props.CallUpdateTransactionPayment(object)
      else
        toast.error("Please fill in all the fields.")

    } else {
      toast.error('Error occured. Please choose the transaction and key in correct payment');
    }

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
        <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderTotalAmount.toFixed(2)}</Box></TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderPaidAmount.toFixed(2)}</Box></TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)} align="center"><Box color={data.OrderColor}>{data.OrderStatus}</Box></TableCell>
        {/* {
          data.OrderStatus === "Unpaid" && <TableCell onClick={(event) => this.onAddButtonClick(event, data, index)} align="center"><CheckCircleIcon color="grey" sx={{ fontSize: 30 }}></CheckCircleIcon></TableCell>
        } */}
      </>
    )
  }
  renderPaymentTableRows = (data, index) => {
    return (
      <>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)} component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{index + 1}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.ReferenceNo}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.Type}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.PaymentMethod}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.PaymentAmount.toFixed(2)}</TableCell>
        <TableCell onClick={(event) => this.onTableRowClick(event, data)}>{data.PaymentDatetime}</TableCell>
      </>
    )
  }

  onTableRowClick = (event, row) => {
    // console.log(row)
    // this.props.history.push(`/TransactionHistoryDetail/${row.TransactionID}`)
  }

  handleClose = () => {
    this.setState({ AddModalOpen: false });
  }

  onAddButtonClick = (event, row, index) => {
    if (row.length > 0) {
      this.setState({
        selectedindex: index,
        AddModalOpen: true,
        selectedRow: row,
        TransactionID: row.TransactionID,
        Payment: "",
        isPayAmountValid: false,
        ReferenceNo: "",
        isReferenceValid: false,
        Datetime: new Date()
      });
    } else {
      toast.error("Please, Select at least one Invoice.")
    }
  }

  changeTab = (key) => {
    switch (key) {
      case "All":
        this.setState({
          filteredList: this.state.Transaction,
          enableCheckbox: false
        })
        break;
      case "Unpaid":
        this.setState({
          filteredList: this.state.Transaction.filter(x => x.OrderStatus === "Unpaid"),
          enableCheckbox: true
        })
        break;
      case "Paid":
        this.setState({
          filteredList: this.state.Transaction.filter(x => x.OrderStatus === "Paid"),
          enableCheckbox: false
        })
        break;
      default:
        break;
    }
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
    this.setState({ referenceCodePayment: value, payment: total, isPayAmountValid: false })
  }


  render() {
    const { isOnEditMode } = this.state
    const ToggleTabs = [
      { children: "All", key: "All" },
      { children: "Unpaid", key: "Unpaid" },
      { children: "Paid", key: "Paid" }
    ]
    //preserved
    // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
    //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

    //   return (
    //     <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontWeight: 600 }}>
    //       {this.state.PieChartData[index].name} {" RM " + this.state.PieChartData[index].value}
    //     </text>
    //   );
    // };

    const renderAreaCodeName = (areaId) => {
      if (isArrayNotEmpty(this.props.userAreaCode)) {
        let selectedArea = this.props.userAreaCode.filter(x => x.UserAreaID === areaId)
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
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      onChange={this.onTextFieldOnChange}
                      size="small"
                      value={this.state.userName}
                      error={this.state.userNameValidated !== null && !this.state.userNameValidated}
                      helperText={this.state.userNameValidated !== null && !this.state.userNameValidated ? "Required" : ""}
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
                  <Grid item xs={12} md={12}>
                    <hr />
                    <h4>User Account Information</h4>
                  </Grid>
                  {/* <Grid item xs={6} md={6}>
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
                  </Grid> */}
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
                  {/* <Grid item xs={12} md={12}>
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
                        <div className="mb-2 col-4 col-md-3 information-label">Username </div>
                        <div className="mb-2 col-8 col-md-3">{this.state.UserProfile[0].Username}</div>
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
                        <div className="mb-2 col-4 col-md-3 information-label">Wechat ID</div>
                        <div className="mb-2 col-8 col-md-3 ">{this.state.UserProfile[0].UserWechatID}</div>
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
                <div className="col-12 col-md-4">
                  <div style={{ width: '100%', height: getWindowDimensions().screenHeight * .35 }}>
                    <ResponsiveContainer height="100%" width="100%">
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

                </div>
                <div className="col-12 col-md-8">
                  <TableComponents
                    tableOptions={{
                      dense: true,
                      tableOrderBy: 'desc',
                      sortingIndex: "PaymentID",
                      stickyTableHeader: false,
                      stickyTableHeight: 400,
                    }}
                    paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]}
                    tableHeaders={PaymentHeadCells}
                    tableRows={{
                      renderTableRows: this.renderPaymentTableRows,
                      checkbox: false,
                      onRowClickSelect: false,
                      headerColor: 'rgb(200, 200, 200)'
                    }}
                    selectedIndexKey={"PaymentID"}
                    Data={isArrayNotEmpty(this.state.Payment) ? this.state.Payment : []}
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
            tableTopRight={this.state.enableCheckbox ? this.renderTableActionButton() : ""}
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
              checkbox: this.state.enableCheckbox,
              checkboxColor: "primary",
              onRowClickSelect: false,
              headerColor: 'rgb(200, 200, 200)'
            }}
            onSelectRow={this.onSelectRow}
            onSelectAllClick={this.onSelectAllRow}
            actionIcon={this.state.enableCheckbox ? this.renderTableActionButton() : ""}
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
            BackdropProps={{ timeout: 500 }}
          >
            {/* {console.log(this.state.selectedRow)} */}
            <Box sx={style} component="main" maxWidth="xs">
              <Typography component="h1" variant="h5">Update Payment</Typography>

              <Box noValidate sx={{ mt: 3 }}>
                <div className="row my-2">
                  {this.state.selectedRow ?
                    <div>
                      {this.state.selectedRow.map((el, index) => {
                        return (
                          <Box className="col-12" key={index}>
                            <div className="clearfix">
                              <div className="float-start">
                                Trans. No: <b>{el.TransactionName}</b>
                              </div>
                              <div className="float-end">
                                Unpaid(RM): <b className="text-danger" style={{ fontSize: '14pt', marginRight: 15 }}>{el.OrderTotalAmount}</b>
                                Paid(RM): <b className="text-success" style={{ fontSize: '14pt' }}>{el.OrderPaidAmount}</b>
                              </div>
                            </div>
                          </Box>
                        )
                      })}
                      <hr />
                      <Box className="col-12" >
                        <div className="clearfix">
                          <div className="float-end">
                            Total to Pay(RM): <b className="text-danger" style={{ fontSize: '14pt', marginRight: 15 }}>{this.state.totalDebt}</b>
                          </div>
                        </div>
                      </Box>
                    </div>
                    : ""}

                </div>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <label className="my-auto col-3">Payment Method:</label>
                    <Select
                      labelId="search-filter-category"
                      id="search-filter-category"
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
                    </Select>
                  </Grid>

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
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => this.onUpdateTransactionPayment()}
                  disabled={this.state.PaymentMethod === "" || this.state.Datetime === ""}
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