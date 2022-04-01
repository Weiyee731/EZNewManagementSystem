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
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import TableComponents from "../../components/TableComponents/TableComponents"
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull, volumeCalc, roundOffTotal, splitArray, round } from "../../tools/Helpers";
import PrintIcon from '@mui/icons-material/Print';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ReactToPrint, { useReactToPrint } from "react-to-print";
import TableRow from '@mui/material/TableRow';
import TransactionHistory from './TransactionHistory';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { ModalPopOut } from "../../components/modal/Modal";
import CheckIcon from '@mui/icons-material/Check';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function mapStateToProps(state) {
  return {
    transaction: state.counterReducer["transaction"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallFetchAllTransactionByID: (data) => dispatch(GitAction.CallFetchAllTransactionByID(data)),
    CallUpdateTransaction: (data) => dispatch(GitAction.CallUpdateTransaction(data)),
  };
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const noOfArrShow = 16

const headCells = [
  {
    id: 'index',
    align: 'left',
    disablePadding: false,
    label: 'No.',
  },
  {
    id: 'TrackingNumber',
    align: 'left',
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'ProductQuantity',
    align: 'left',
    disablePadding: false,
    label: 'Qty',
  },
  {
    id: 'Dimension',
    align: 'left',
    disablePadding: false,
    label: 'm³',
  },
  {
    id: 'HandlingPrice',
    align: 'left',
    disablePadding: false,
    label: 'Handling Price',
  },
  {
    id: 'ProductPrice',
    align: 'left',
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'Total',
    align: 'right',
    disablePadding: false,
    label: 'Total',
  }
];

const smallItemHeadCells = [
  {
    id: 'index',
    align: 'left',
    disablePadding: false,
    label: 'No.',
  },
  {
    id: 'TrackingNumber',
    align: 'left',
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'ProductQuantity',
    align: 'left',
    disablePadding: false,
    label: 'Qty',
  },
  {
    id: 'weight',
    align: 'left',
    disablePadding: false,
    label: 'Weight (kg)',
  },
  {
    id: 'Dimension',
    align: 'left',
    disablePadding: false,
    label: 'm³',
  },
  {
    id: 'handlingCharge',
    align: 'left',
    disablePadding: false,
    label: 'Handling Price',
  },
  // {
  //   id: 'ProductPrice',
  //   align: 'center',
  //   disablePadding: false,
  //   label: 'Price',
  // },
  {
    id: 'Total',
    align: 'right',
    disablePadding: false,
    label: 'Total',
  }
];

const cashbill_headcells = [
  {
    id: 'TrackingNumber',
    align: 'left',
    disablePadding: false,
    label: 'Transactions',
  },
];

const companyTitle = {
  fontWeight: "bolder",
  fontSize: "16px",
  textAlign: "center"
};

const companyDetailTitle = {
  fontWeight: "bold",
  fontSize: "12px",
  float: "center",
  textAlign: "center"
};

const companyDetail = {
  fontSize: "11px",
  fontWeight: "bold",
};

const total = {
  float: "right",
  paddingRight: '16px'
};

const tncTitle = {
  fontSize: "12px",
  color: "#0070C0",
};

const tncDiv = {
  // margin: "1%",
  fontWeight: "bold",
  fontSize: "10px",
};

const img = {
  width: 'auto',
  height: '100px',
};

function printPDF() {
  return (
    <ReactToPrint
      content={() => this.componentRef}
      documentTitle="post.pdf"
    ></ReactToPrint>
  );
}

class TransactionHistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Transaction: [],
      TransactionID: this.props.match.params.transactionid,
      OrderDate: "",
      TransactionName: "",
      TransportationType: 1,
      TransportationBool: false,
      Fullname: "",
      Email: "",
      Contact: "",
      Address: "",
      OrderTotalAmount: "",
      OrderPaidAmount: "",
      AddModalOpen: false,
      AddModalOpen2: false,
      DeliveryFeeInd: false,
      DeliveryFee: 0.00,
      Remark: "",
      TransactionDetail: [],

      generateCashBillModalOpen: false,
      CallResetSelected: false,
      cashbillSelectedRows: [],
      cashbillRemarks: "",
      cashbillRemarksValidated: null,
      cashbillAmount: -1,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.onClickConfirmInvoice = this.onClickConfirmInvoice.bind(this)
    this.onSelectRow = this.onSelectRow.bind(this)
    this.onSelectAllRow = this.onSelectAllRow.bind(this)
    this.handleCashBillInputs = this.handleCashBillInputs.bind(this)
    this.addReferencesToRemark = this.addReferencesToRemark.bind(this)
    this.generateCashBill = this.generateCashBill.bind(this)
  }

  componentDidMount() {
    if (!isStringNullOrEmpty(this.props.match.params.transactionid))
      this.props.CallFetchAllTransactionByID({ TransactionID: this.props.match.params.transactionid })
    else
      alert("Error occured when pulling the list. Please select the transaction again.")
  }

  componentDidUpdate(prevProps, prevState) {
    if (isArrayNotEmpty(this.props.transaction) && (this.props.transaction !== prevProps.transaction) && (this.props.transaction.length !== this.state.Transaction.length)) {
      this.setState({
        Transaction: this.props.transaction,
        OrderDate: this.props.transaction[0].OrderDate,
        TransactionName: this.props.transaction[0].TransactionName,
        Fullname: this.props.transaction[0].Fullname,
        UserCode: this.props.transaction[0].UserCode,
        AreaCode: this.props.transaction[0].AreaCode,
        Contact: this.props.transaction[0].UserContactNo,
        Address: this.props.transaction[0].UserAddress,
        OrderTotalAmount: this.props.transaction[0].OrderTotalAmount,
        OrderPaidAmount: this.props.transaction[0].OrderSubPaidAmount,
        TransactionDetail: this.props.transaction[0].TransactionDetail !== "null" ? JSON.parse(this.props.transaction[0].TransactionDetail) : [],
      });
    }
    // if (prevProps.transaction.length !== this.props.transaction.length) {
    //   if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
    //     this.setState({
    //       Transaction: this.props.transaction,
    //       OrderDate: this.props.transaction[0].OrderDate,
    //       TransactionName: this.props.transaction[0].TransactionName,
    //       Fullname: this.props.transaction[0].Fullname,
    //       UserCode: this.props.transaction[0].UserCode,
    //       AreaCode: this.props.transaction[0].AreaCode,
    //       Contact: this.props.transaction[0].UserContactNo,
    //       Address: this.props.transaction[0].UserAddress,
    //       OrderTotalAmount: this.props.transaction[0].OrderTotalAmount,
    //       OrderPaidAmount: this.props.transaction[0].OrderSubPaidAmount,
    //       TransactionDetail: this.props.transaction[0].TransactionDetail !== "null" ? JSON.parse(this.props.transaction[0].TransactionDetail) : [],
    //     });
    //   }
    // }
    // else {
    //   if (prevProps.transaction.length !== this.state.Transaction.length) {
    //     this.setState({
    //       Transaction: prevProps.transaction,
    //       OrderDate: prevProps.transaction[0].OrderDate,
    //       TransactionName: prevProps.transaction[0].TransactionName,
    //       Fullname: prevProps.transaction[0].Fullname,
    //       UserCode: prevProps.transaction[0].UserCode,
    //       AreaCode: prevProps.transaction[0].AreaCode,
    //       Contact: prevProps.transaction[0].UserContactNo,
    //       Address: prevProps.transaction[0].UserAddress,
    //       OrderTotalAmount: prevProps.transaction[0].OrderSubTotalAmount,
    //       OrderPaidAmount: prevProps.transaction[0].OrderSubPaidAmount,
    //       TransactionDetail: JSON.parse(prevProps.transaction[0].TransactionDetail)
    //     });
    //   }
    // }
  }

  renderTableRows = (data, index) => {
    const fontsize = '9pt'
    let charges = data.TransactionDetailCharges != [] ? JSON.parse(data.TransactionDetailCharges).reduce((price, item) => price + item.ProductPrice, 0).toFixed(2) : 0
    let dataIndex = this.state.TransactionDetail.findIndex(x => parseInt(x.TransactionDetailID) === parseInt(data.TransactionDetailID))
    return (
      <>
        <TableCell
          component="th"
          id={`table-checkbox-${(index + 1)}`}
          scope="row"
          sx={{ fontSize: fontsize }}
        >
          {(dataIndex + 1)}
        </TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{
          this.props.transaction[0].CalculationType === "4" && data.Description === "Delivery Fee" ? "Delivery Min 0.5m³" : data.TrackingNumber}
          {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <div align="left" sx={{ fontSize: fontsize, borderBottom: "0px" }}>{additionalCharges.Description}</div>
          })}
        </TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.TrackingNumber !== "Delivery Fee") ? data.ProductQuantity : "-"}</TableCell>
        {
          this.props.transaction[0].CalculationType === "3" &&
          <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Description === "Delivery Fee" ? "-" : data.ProductWeight !== null && data.ProductWeight !== undefined && (data.ProductWeight).toFixed(2)}</TableCell>
        }
        <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.TrackingNumber !== "Delivery Fee") ? volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight) : "-"}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>
          <div>-</div>
          {data.TransactionDetailCharges != [] && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <div align="left" sx={{ fontSize: fontsize, borderBottom: "0px" }}>{parseFloat(additionalCharges.ProductPrice).toFixed(2)}</div>
          })}
          {/* {data.handlingCharge !== 0 && data.handlingCharge !== undefined ? parseFloat(data.handlingCharge).toFixed(2) : "-"} */}
        </TableCell>
        {/* <TableCell align="left" sx={{ fontSize: fontsize }}>
          {data.ProductPrice}
          {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <TableRow><TableCell align="left" sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0" }}>{additionalCharges.ProductPrice}</TableCell></TableRow>
          })}
        </TableCell> */}

        {
          this.props.transaction[0].CalculationType !== "3" &&
          <TableCell align="left" sx={{ fontSize: fontsize }}>
            {
              this.props.transaction[0].CalculationType === "1" ?
                volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight) > 0.013 ? (data.ProductPrice / volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)).toFixed(2) : parseFloat(data.ProductPrice).toFixed(2)
                :
                volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight) > 0 ? (data.ProductPrice / volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)).toFixed(2) : data.Description === "Delivery Fee" || data.Description === undefined ? "-" : <p style={{ color: "red" }}>0 m³</p>
            }
          </TableCell>
        }

        <TableCell align="right" sx={{ fontSize: fontsize }}>

          {data.Description === "Delivery Fee" ? (parseFloat(data.ProductPrice) + parseFloat(charges)).toFixed(2) : this.props.transaction[0].CalculationType === "3" ? "-" : (parseFloat(data.ProductPrice) + parseFloat(charges)).toFixed(2)}
          {/* {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <div align="right" sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0" }}>{(parseFloat(additionalCharges.ProductPrice) * additionalCharges.ProductQuantity).toFixed(2)}</div>
          })} */}

          {/* {
            data.TransactionDetailCharges != [] ? JSON.parse(data.TransactionDetailCharges).reduce((weight, item) => weight + item.ProductWeight, 0).toFixed(2)
          } */}
        </TableCell>


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

  handleClose2 = () => {
    this.setState({ AddModalOpen2: false });
  }

  onAddButtonClick = () => {
    this.setState({ AddModalOpen: true });
  }

  onDeleteButtonClick = (items) => {

  }

  onClickConfirmInvoice = (items) => {
    var isDeliveryExist = false
    this.props.CallUpdateTransaction(this.state);
    this.state.TransactionDetail.map((search) => {
      if (search.Description === "Delivery Fee") {
        search.ProductPrice = this.state.DeliveryFee
        isDeliveryExist = true
      }
    })

    this.setState({ AddModalOpen: false, AddModalOpen2: true });
    if (!isDeliveryExist) {
      this.state.TransactionDetail.push({ TrackingNumber: "Delivery Fee", ProductQuantity: 1, ProductDimensionDeep: "", ProductDimensionWidth: "", ProductDimensionHeight: "", ProductPrice: this.state.DeliveryFee })
    }
  }

  handleInputChange = (e) => {
    const elementId = e.target.id
    switch (elementId) {
      case "remark":
        this.setState({ Remark: e.target.value.trim() })
        break;

      case "deliveryfee":
        this.setState({ DeliveryFee: e.target.value })
        break;

      default:
        break;
    }
  }

  handleChange = (e) => {
    if (e.target.checked) {
      this.setState({ TransportationType: 2, TransportationBool: e.target.checked })
    } else {
      this.setState({ TransportationType: 1, TransportationBool: e.target.checked })
    }
  };

  renderPage = (arr, index) => {
    const {
      OrderDate,
      Transaction,
      TransactionName,
      Fullname,
      UserCode,
      AreaCode,
      Contact,
      Address,
      OrderTotalAmount,
      TransactionDetail,
      DeliveryFee,
    } = this.state

    // let TransactionDetail = isArrayNotEmpty(transaction) ? JSON.parse(transaction[0].TransactionDetail) : transaction
    let actualWeight = 0
    let actualVolume = 0
    let m3Weight = 0
    let finalWeight = 0
    let subTotal = 0
    let handlingCharge = 0
    let additionalCharges = 0

    if (isArrayNotEmpty(Transaction) && Transaction[0].TransactionDetail !== null) {
      actualWeight = JSON.parse(Transaction[0].TransactionDetail).reduce((weight, item) => weight + item.ProductWeight, 0).toFixed(2)
      actualVolume = JSON.parse(Transaction[0].TransactionDetail).reduce((dimension, item) => dimension + ((item.ProductDimensionDeep * item.ProductDimensionHeight * item.ProductDimensionWidth) / 1000000), 0)
      actualVolume = (Math.ceil(actualVolume * 1000) / 1000).toFixed(3)
      m3Weight = (actualVolume * 1000000 / 6000).toFixed(2)

      if (actualWeight > m3Weight)
        finalWeight = actualWeight
      else
        finalWeight = m3Weight

      handlingCharge = this.state.TransactionDetail.reduce((charges, item) => charges + item.handlingCharge, 0)
      handlingCharge = !isNaN(handlingCharge) ? handlingCharge : 0

      additionalCharges = this.state.TransactionDetail[0].TransactionDetailCharges != null && JSON.parse(this.state.TransactionDetail[0].TransactionDetailCharges).reduce((additionalCharge, item) => additionalCharge + item.ProductPrice, 0).toFixed(2)
      subTotal = ((Math.ceil(finalWeight).toFixed(2) - 1) * 6 + 10 + parseFloat(handlingCharge) + parseFloat(additionalCharges)).toFixed(2)
    }

    return (
      <div
        className="letter-page-size w-100"
        style={{
          padding: '10px 50px 0px'
        }}
        key={"page_" + index}
      >
        <div className="row">
          <div style={companyTitle}>
            EZ TRANSIT AND LOGISTICS SDN BHD
          </div>
          <div style={companyDetailTitle}>
            NO.2, LORONG A, TAMAN BDC
          </div>
          <div style={companyDetailTitle}>
            JALAN STUTONG 93350 KUCHING, SARAWAK
          </div>
          <div style={companyDetailTitle}>
            TEL: 019 - 883 6783 / 012 - 895 7769
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "none",
              borderRight: "none",
              borderLeft: "none",
              borderImage: "initial",
              borderBottom: "1pt solid rgb(0, 112, 192)",
              padding: "0 5px",
              height: "20px",
              verticalAlign: "top",
            }}
          />
          <div style={companyDetailTitle}>
            INVOICE
          </div>
          <div className="row" style={companyDetail}>
            <span className="col-9">{UserCode}-{AreaCode} {Fullname}</span>
            <span className="col-1">No</span>
            <span className="col-2">: {TransactionName}</span>
          </div>
          <div className="row" style={companyDetail}>
            <span className="col-9">{Address}</span>
            <span className="col-1">Terms</span>
            <span className="col-2">: C.O.D</span>
          </div>
          <div className="row" style={companyDetail} >
            <span className="col-9">Tel : {Contact}</span>
            <span className="col-1">Date</span>
            <span className="col-2">: {OrderDate}</span>
          </div>
          <div className="row" style={companyDetail}>
            <span className="col-1 offset-9">Page</span>
            <span className="col-2">{`: ${index + 1} of ${splitArray(TransactionDetail, noOfArrShow).length}`}</span>
          </div>
        </div>
        <div
          style={{
            // marginTop: "10px"
          }}
        >
          <div style={companyDetail}>
            <b>Container Date:</b> {TransactionDetail[0].ContainerDate !== null ? TransactionDetail[0].ContainerDate : " - "} {this.props.transaction[0].CalculationType === "4" && "( Cargo Delivery )"}
          </div>
          <TableComponents
            style={{
              boxShadow: "0px",
            }}
            elevation={0}
            tableOptions={{
              dense: true,
              tableOrderBy: 'asc',
              sortingIndex: "fat",
              stickyTableHeader: false,
            }}
            tableHeaders={this.props.transaction[0].CalculationType !== "3" ? headCells : smallItemHeadCells}
            tableRows={{
              renderTableRows: this.renderTableRows,
              checkbox: false,
              headerColor: "white",
              checkboxColor: "primary",
              onRowClickSelect: false
            }}
            selectedIndexKey={"TransactionDetailID"}
            Data={arr}
          />
        </div>

        {
          arr.length < noOfArrShow &&
          <div className="d-flex">
            <div className="invoice-footer">
              <hr />
              {this.props.transaction[0].CalculationType === "3" &&
                <>
                  <div style={tncDiv}>
                    Actual Weight : {actualWeight} kg  |  Volume : {actualVolume} m³  |  Volumetric Weight : {m3Weight} kg
                  </div>
                  <div style={tncDiv}>
                    * First kg : RM 10, Sub. kg : RM 6
                  </div>
                  <div style={tncDiv}>
                    * Volumetric weight = volume * 1000000 / 6000
                  </div>

                </>
              }
              {this.props.transaction[0].CalculationType === "4" &&
                <>
                  <div style={tncDiv}>
                    Volume : {actualVolume} m³  |  Minimum Volume = 0.50 m³
                  </div>
                </>
              }
              <div className="row">
                <div style={tncDiv} className="col-5 mt-4">
                  <div style={tncTitle}>Terms and Conditions</div>
                  <br />
                  <div>
                    <p>
                      1. All payment should be make payable to
                      <br />
                      EZ TAO BAO ENTERPRISE
                      <br />
                      25301009073
                      <br />
                      HONG LEONG BANK
                    </p>
                    <p>
                      2. Payment must be cleared within 3 days after the billing date
                    </p>
                  </div>
                </div>
                <div style={tncDiv} className="col-3 mt-4">
                  <div >Payment can be make through SPay Global</div>
                  <img style={img} src="https://tourism.denoo.my/Ez/spay.jpeg"></img>
                </div>
                <div style={tncDiv} className="col-3 offset-1">
                  {this.props.transaction[0].CalculationType === "3" &&
                    <>
                      Total Weight (kg):
                      <span style={total}>
                        {Math.ceil(finalWeight).toFixed(2)}
                      </span>
                      <br />
                    </>
                  }
                  {/* Total Item :
                  <span style={total}>{TransactionDetail.length}</span>
                  <br />
                  Sub Total (RM) :
                  <span style={total}>{roundOffTotal(OrderTotalAmount)}</span>
                  <br />
                  Total (RM) :
                  <span style={total}>{roundOffTotal(parseFloat(OrderTotalAmount) + parseFloat(DeliveryFee))}</span> */}
                  Total Item :
                  <span style={total}>{TransactionDetail.filter((el) => el.TrackingNumber === "Delivery Fee").length > 0 ? TransactionDetail.length - 1 : TransactionDetail.length}</span>
                  <br />
                  Sub Total (RM) :
                  {this.props.transaction[0].CalculationType === "3" ?
                    <span style={total}>{roundOffTotal(parseFloat(subTotal) + parseFloat(DeliveryFee))}</span>
                    :
                    <span style={total}>{roundOffTotal(parseFloat(OrderTotalAmount) + parseFloat(DeliveryFee))}</span>
                  }
                  <br />
                  Total (RM) :
                  {this.props.transaction[0].CalculationType === "3" ?
                    <span style={total}>{roundOffTotal(parseFloat(subTotal) + parseFloat(DeliveryFee))}</span>
                    :
                    <span style={total}>{roundOffTotal(parseFloat(OrderTotalAmount) + parseFloat(DeliveryFee))}</span>
                  }
                </div>
              </div>
              <div className="row mt-4">
                <div style={tncDiv} className="col-3 mt-4">
                  <div className="text-center">
                    __________________________________
                    <div>EZ TRANSIT AND LOGISTICS</div>
                    <div>SDN BHD</div>
                  </div>
                </div>
                <div style={tncDiv} className="col-5 mt-4">

                </div>
                <div style={{ textAlign: 'left', ...tncDiv }} className="col-3 mt-4">
                  __________________________________
                  <div>Name  : </div>
                  <div>IC NO : </div>
                  <div>DATE  : </div>
                </div>
              </div>
            </div>
          </div>
        }

        <br />
      </div>
    )
  }

  renderCashBillTableActionButton = () => {
    return (
      <IconButton onClick={(event) => { console.log(this.state.cashbillSelectedRows) }}>
        <CheckIcon />
      </IconButton>
    )
  }

  onAddButtonClick = () => {
    // this.setState({ openAddModal: true })
    this.setState({ AddModalOpen: true, isPrinting: true })
  }

  onSelectRow(row) {
    this.setState({ cashbillSelectedRows: row })
  }

  onSelectAllRow(rows) {
    this.setState({ cashbillSelectedRows: rows })
  }

  addReferencesToRemark() {
    if (isArrayNotEmpty(this.state.cashbillSelectedRows)) {
      let TrackingNumber = "";
      this.state.cashbillSelectedRows.map((el) => { TrackingNumber += el.TrackingNumber + "\n" })
      this.setState({
        cashbillRemarks: this.state.cashbillRemarks + "\n" + TrackingNumber,
        cashbillRemarksValidated: true
      })
    }
  }

  renderCashbillTableRows = (data, index) => {
    const fontsize = '9pt'
    return (
      <>
        <TableCell align="left" sx={{ fontSize: fontsize }}>
          <div>
            <h6 className="text-uppercase"><b>{data.TrackingNumber}</b> -- {data.Item} </h6>
            <div>
              <div><b>Weigth: </b> {data.ProductWeight + 'KG'}</div>
              <div><b>Dim: </b> {data.ProductDimensionDeep + "cm (D)"} X {data.ProductDimensionHeight + "cm (H)"} X {data.ProductDimensionWidth + "cm (W)"}, {(data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight / 1000000).toFixed(3)} m<sup>3</sup></div>
              <div><b>Price: </b>{"RM " + data.ProductPrice + " x " + (isStringNullOrEmpty(data.ProductQuantity) ? 0 : data.ProductQuantity)}</div>
              <div><b>Remark: </b>{data.Remark}</div>
            </div>
          </div>
        </TableCell>
      </>
    )
  }

  handleCashBillInputs(e) {
    const { name, value } = e.target
    switch (name) {
      case "CashBillAmount":
        this.setState({
          cashbillAmount: value
        })
        break;
      case "CashBillRemarks":
        this.setState({
          cashbillRemarks: value, cashbillRemarksValidated: !(isStringNullOrEmpty(value))
        })
        break;
      default:
        break;
    }
  }

  generateCashBill() {
    const { cashbillAmount, cashbillRemarks, cashbillRemarksValidated, cashbillSelectedRows } = this.state
    console.log(cashbillAmount, cashbillRemarks, cashbillRemarksValidated, cashbillSelectedRows)
  }

  render() {
    const {
      TransactionDetail,
      AddModalOpen,
      TransportationBool,
      Remark,
      DeliveryFee,
      AddModalOpen2
    } = this.state

    return (
      <Card>
        <CardContent>
          <div className="d-flex align-items-center justify-content-between">
            <IconButton
              color="primary"
              aria-label="back"
              component="span"
              onClick={() => this.props.history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
            <div>
              {
                // <Button sx={{ marginRight: 2 }} variant="contained" startIcon={<NoteAddIcon />} onClick={() => this.setState({ generateCashBillModalOpen: true })}>
                //   Generate Cash Bill
                // </Button>
              }
              <IconButton color="primary" aria-label="back" component="span" onClick={this.onAddButtonClick}>
                <PrintIcon />
              </IconButton>
            </div>
          </div>
          <div ref={(el) => (this.componentRef = el)}>
            {splitArray(TransactionDetail, noOfArrShow).map((arr, index) => {
              return (
                this.renderPage(arr, index)
              )
            })}
          </div>
          {/* <div style={{ width: "100%", padding: "3%" }}
            className="Post"
            ref={(el) => (this.componentRef = el)}>
            <div className="row">
              <div>
                <div>
                  <div>
                    <div style={companyTitle}>
                      EZ TRANSIT AND LOGISTICS SDN BHD
                    </div>
                    <div style={companyDetailTitle}>
                      NO.2, LORONG A, TAMAN BDC
                    </div>
                    <div style={companyDetailTitle}>
                      JALAN STUTONG 93350 KUCHING, SARAWAK
                    </div>
                    <div style={companyDetailTitle}>
                      EL: 019 - 883 6783 / 012 - 895 7769
                    </div>
                    <div
                      style={{
                        width: "100%",
                        borderTop: "none",
                        borderRight: "none",
                        borderLeft: "none",
                        borderImage: "initial",
                        borderBottom: "1pt solid rgb(0, 112, 192)",
                        padding: "0 5px",
                        height: "20px",
                        verticalAlign: "top",
                      }}
                    />
                  </div>
                  <div style={companyDetailTitle}>
                    INVOICE:
                  </div>
                  <div className="row" style={companyDetail}>
                    <span className="col-6">{this.state.UserCode}-{this.state.AreaCode}{this.state.Fullname}</span>
                    <span className="col-1"></span>
                    <span className="col-1">No</span>
                    <span className="col-4">: {this.state.TransactionName}</span>
                  </div>
                  <div className="row" style={companyDetail}>
                    <span className="col-6">{this.state.Address}</span>
                    <span className="col-1"></span>
                    <span className="col-1">Terms</span>
                    <span className="col-4">: C.O.D</span>
                  </div>
                  <div className="row" style={companyDetail} >
                    <span className="col-6">Tel : {this.state.Contact}</span>
                    <span className="col-1"></span>
                    <span className="col-1">Date</span>
                    <span className="col-4">: {this.state.OrderDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <TableComponents style={{ boxShadow: "0px" }}
              // tableTopLeft={""}
              // tableTopRight={this.renderTableActionButton}
              elevation={0}
              tableOptions={{
                dense: false,
                tableOrderBy: 'asc',
                sortingIndex: "fat",
                stickyTableHeader: false,
                stickyTableHeight: 100,
              }}
              tableHeaders={headCells}
              tableRows={{
                renderTableRows: this.renderTableRows,
                checkbox: false,
                checkboxColor: "primary",
                onRowClickSelect: false
              }}
              selectedIndexKey={"pid"}
              Data={this.state.TransactionDetail}
            />
            <div className="row">
              <div style={tncDiv} className="col-7">
                <div style={tncTitle}>Terms and Conditions</div>
                <br />
                <div>
                  <p>
                    1. All payment should be make payable to
                    <br />
                    EZ TAO BAO ENTERPRISE
                    <br />
                    25301009073
                    <br />
                    HONG LEONG BANK
                  </p>
                  <p>
                    2. Payment must be cleared within 3 days after the billing date
                  </p>
                </div>
              </div>
              <div style={tncDiv} className="col-4">
                <div>
                  <p>
                    Sub Total : {this.state.OrderTotalAmount}
                    <br />
                    Total     : {(parseFloat(this.state.OrderTotalAmount) + parseFloat(this.state.DeliveryFee))}
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div style={tncDiv} className="col-7">
                __________________________________
                <p>EZ TRANSIT AND LOGISTICS SDN BHD</p>
              </div>
              <div style={tncDiv} className="col-4">
                __________________________________
                <p>Name  : </p>
                <p>IC NO : </p>
                <p>DATE  : </p>
              </div>
            </div>
          </div> */}

          <div>
            <Modal
              open={this.state.AddModalOpen}
              onClose={this.handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{ timeout: 500 }}
            ><Box sx={style} component="main" maxWidth="xs">
                <Typography component="h1" variant="h5">Printing Invoice</Typography>
                <Box component="form" noValidate sx={{ mt: 3 }} style={{ textAlign: "center", margin: "auto" }}>
                  <div className="row" style={{ width: "100%", display: "inline" }}>
                    <h4>
                      Please select deliver option
                    </h4>
                  </div>
                  <ReactToPrint style={{ width: "100%", display: "inline" }}
                    trigger={(e) => {
                      return (<Button variant="contained">Print The Invoice</Button>);
                    }}
                    content={() => this.componentRef}
                  />
                </Box>
              </Box>
            </Modal>

            <ModalPopOut
              title="Generate Cash Bill"
              fullScreen={true}
              handleToggleDialog={() => this.setState({ generateCashBillModalOpen: false })}
              open={this.state.generateCashBillModalOpen}
              onClose={() => this.setState({ generateCashBillModalOpen: false })}
              showCancel={false}
            // handleConfirmFunc={() => { console.log('cnfirm ') }}
            >
              <div className="row">
                <div className="col-12 col-md-6">
                  {
                    isArrayNotEmpty(this.state.cashbillSelectedRows) &&
                    <div className="thin-scrollbar " style={{ height: "150px", overflowY: 'auto', padding: '0px 0px 10px', marginBottom: '15px' }}>
                      <div className="d-flex justify-content-between" style={{ position: "sticky", top: 0, background: "white" }}>
                        <h5><b>*Selected Tracking Number for References</b></h5>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {
                            this.setState({ CallResetSelected: true, cashbillSelectedRows: [] })
                            setTimeout(() => { this.setState({ CallResetSelected: false }) }, 300)
                          }}
                          startIcon={<DeleteOutlineIcon />}
                        >
                          Clear
                        </Button>
                      </div>

                      {
                        this.state.cashbillSelectedRows.map((el, idx) => {
                          return (
                            <div className="w-100 border-bottom-2"><b>{el.TrackingNumber}</b> {" ( " + el.Item + " )"}</div>
                          )
                        })
                      }
                    </div>
                  }
                  {
                    isArrayNotEmpty(this.state.cashbillSelectedRows) &&
                    <Button style={{ marginBottom: "10px" }} variant="outlined" onClick={() => this.addReferencesToRemark()} startIcon={<ArrowDownwardIcon />} endIcon={<ArrowDownwardIcon />} fullWidth>
                      Add selected Tracking Numbers to Remark
                    </Button>
                  }
                  <div>
                    <TextField
                      id="CashBillRemarks"
                      name="CashBillRemarks"
                      label="Remarks"
                      placeholder="Write the description about the cashbill "
                      multiline
                      required
                      fullWidth
                      size="small"
                      onChange={(e) => this.handleCashBillInputs(e)}
                      value={this.state.cashbillRemarks}
                      error={!this.state.cashbillRemarksValidated && this.state.cashbillRemarksValidated !== null}
                      helperText={!this.state.cashbillRemarksValidated && this.state.cashbillRemarksValidated !== null ? "This is require valid remark for references" : ""}
                    />
                    <FormControl sx={{ marginTop: "10px" }} variant="standard" size="small" fullWidth>
                      <Input
                        id="CashBillAmount"
                        name="CashBillAmount"
                        variant="standard"
                        size="small"
                        required
                        type="number"
                        onChange={(e) => this.handleCashBillInputs(e)}
                        value={this.state.cashbillAmount}
                        startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                      />
                    </FormControl>
                    <Button
                      sx={{ marginTop: "10px" }}
                      color="primary"
                      variant="contained"
                      fullWidth
                      startIcon={<PrintIcon />}
                      endIcon={<PrintIcon />}
                      disabled={!this.state.cashbillRemarksValidated}
                      onClick={() => this.generateCashBill()}
                    >
                      Generate Cash Bill
                    </Button>
                  </div>
                </div>
                <div className="col-12 col-md-6 thin-scrollbar" style={{ height: "87vh", overflowY: 'auto' }}>
                  <TableComponents
                    style={{
                      boxShadow: "0px",
                    }}
                    paginationOptions={[100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    elevation={0}
                    tableOptions={{
                      dense: true,
                      tableOrderBy: 'asc',
                      sortingIndex: "fat",
                      stickyTableHeader: false,
                    }}
                    tableHeaders={cashbill_headcells}
                    tableRows={{
                      renderTableRows: this.renderCashbillTableRows,
                      checkbox: true,
                      headerColor: "white",
                      checkboxColor: "primary",
                      onRowClickSelect: true
                    }}
                    selectedIndexKey={"TrackingNumber"}
                    Data={TransactionDetail}
                    onActionButtonClick={this.onAddButtonClick}
                    onSelectRow={this.onSelectRow}
                    onSelectAllClick={this.onSelectAllRow}
                    CallResetSelected={this.state.CallResetSelected}
                  />
                </div>
              </div>
            </ModalPopOut>
          </div>
        </CardContent>
      </Card>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TransactionHistoryDetail));
