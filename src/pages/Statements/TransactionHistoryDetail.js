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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import TableComponents from "../../components/TableComponents/TableComponents"
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull, volumeCalc, roundOffTotal, splitArray, round } from "../../tools/Helpers";
import PrintIcon from '@mui/icons-material/Print';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ModalPopOut } from "../../components/modal/Modal";
import CheckIcon from '@mui/icons-material/Check';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import EZSpay from "../../assets/EZ_Spay.jpg"

function mapStateToProps(state) {
  return {
    transaction: state.counterReducer["transaction"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUpdateTransactionWithoutStatus: (data) => dispatch(GitAction.CallUpdateTransactionWithoutStatus(data)),
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

const noOfArrShow = 20

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
  fontFamily: "Arial",
  textAlign: "center"
};

const companyDetailTitle = {
  fontWeight: "bold",
  fontSize: "12px",
  float: "center",
  fontFamily: "Arial",
  textAlign: "center"
};

const companyDetail = {
  fontSize: "11px",
  fontFamily: "Arial",
  fontWeight: "bold",
};

const total = {
  float: "right",
  paddingRight: '16px',

  fontFamily: "Arial",
};

const tncTitle = {
  fontSize: "12px",
  color: "#0070C0",
};

const tncDiv = {
  // margin: "1%",
  fontWeight: "bold",
  fontSize: "10px",
  fontFamily: "Arial",
};

const tableCellStyle = {
  fontSize: "9pt",
  fontFamily: "Arial",
  fontWeight: "bolder"
}


const img = {
  width: 'auto',
  height: '100px',
};
class TransactionHistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.props.CallFetchAllTransactionByID({ TransactionID: this.props.match.params.transactionid })
  }

  state = {
    transaction: [],
    TransactionID: this.props.match.params.transactionid,
    TransportationType: 1,
    TransportationBool: false,
    AddModalOpen: false,
    AddModalOpen2: false,
    DeliveryFeeInd: false,
    DeliveryFee: 0.00,
    Remark: "Delivery Fee",
    TransactionDetail: [],
    page: [],
    isRemarkValidated: true,
    isDeliveryFeeValidated: true,
    totalhandlingCharge: 0,
    handlingCharge: '-',
    isPrinting: false,
    detailsIndex: 0,
    actualVolume: 0,
    minDelivery: 0,
    handlingArray: []
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.transaction !== this.props.transaction) {
      if (isArrayNotEmpty(this.props.transaction)) {
        let tempArr = []
        !isStringNullOrEmpty(this.props.transaction[0].TransactionDetail) && JSON.parse(this.props.transaction[0].TransactionDetail).map((item) => {
          tempArr.push({
            ...item,
            handlingCharge: item.ProductHandlingPrice,
            totalPrice: item.ProductPrice * item.ProductQuantity
          })
        })

        let actualVolume = JSON.parse(this.props.transaction[0].TransactionDetail).reduce((dimension, item) => dimension + volumeCalc(item.ProductDimensionDeep, item.ProductDimensionHeight, item.ProductDimensionWidth), 0).toFixed(3)

        if (this.props.transaction[0].CalculationType === "4") {
          let totalPrice = JSON.parse(this.props.transaction[0].TransactionDetail).filter((data) => data.Description !== "Delivery Fee").reduce((price, item) => price + item.ProductPrice, 0)
          let datalist = JSON.parse(this.props.transaction[0].TransactionDetail)[0]
          let m3Price = (datalist.ProductPrice / volumeCalc(datalist.ProductDimensionDeep, datalist.ProductDimensionWidth, datalist.ProductDimensionHeight)).toFixed(2)
          let extraFees = (m3Price / 2 - totalPrice).toFixed(2)



          if (actualVolume < 0.50) {
            // this.props.CallUpdateTransactionWithoutStatus({
            //   TransactionID: this.state.TransactionID,
            //   TransportationType: 2,
            //   DeliveryFee: this.props.transaction && this.props.transaction[0].DeliveryFee ? this.props.transaction[0].DeliveryFee : extraFees
            // });
            this.setState({ TransportationBool: true, Remark: "Delivery Min 0.5m³", isDeliveryFeeValidated: true, DeliveryFee: extraFees })
            if (tempArr.filter((data) => data.Description === "Delivery Fee").length === 0) {
              tempArr.push({
                TrackingNumber: "Delivery Min 0.5m³",
                ProductQuantity: 1,
                ProductDimensionDeep: "-",
                ProductDimensionWidth: "-",
                ProductDimensionHeight: "-",
                handlingCharge: 0,
                ProductPrice: extraFees,
                totalPrice: extraFees
              })
            }
          }
          this.setState({ minDelivery: extraFees })
        }

        let tempTotalhandlingCharge = 0

        tempArr.map((item) => {
          tempTotalhandlingCharge += item.handlingCharge
        })

        this.setState({
          TransactionDetail: tempArr,
          transaction: this.props.transaction,
          actualVolume: actualVolume,
          TransportationBool: this.props.transaction[0].TransportationTypeInd === 2 ? true : false,
          totalhandlingCharge: tempTotalhandlingCharge
          // TransportationBool: tempArr.filter((x) => x.Description === "Delivery Fee").length > 0 ? true : false
        })

        if (this.props.transaction[0].DeliveryFee > 0) {
          this.setState({ DeliveryFee: this.props.transaction[0].DeliveryFee, isDeliveryFeeValidated: true })
        }
      }
    }
  }

  componentWillUnmount() {
    this.setState(this.state)
  }


  handlehandlingChargeOnChange = (e, index) => {
    let tempArr = this.state.TransactionDetail
    tempArr[index].handlingCharge = Number(e)
    let tempTotalhandlingCharge = 0

    tempArr.map((item) => {
      tempTotalhandlingCharge += item.handlingCharge
    })

    this.setState({
      TransactionDetail: tempArr, totalhandlingCharge: tempTotalhandlingCharge
    })
  }

  handleConfirmhandlingCharge = (e, index) => {
    let tempArr = this.state.TransactionDetail
    let additionalCharge = 0
    this.props.CallUpdateTransactionDetailHandling({ TransactionDetailID: tempArr[index].TransactionDetailID, ProductHandlingPrice: e })

    tempArr[0].TransactionDetailCharges != null && JSON.parse(tempArr[0].TransactionDetailCharges).map((additionalCharges, index) => {
      additionalCharge = parseFloat(additionalCharge) + parseFloat(additionalCharges.ProductPrice * additionalCharges.ProductQuantity)
    })

    tempArr[index].totalPrice = (tempArr[index].ProductPrice * tempArr[index].ProductQuantity)
    if (this.state.handlingArray.length > 0) {
      if (this.state.handlingArray.filter((data) => parseInt(data.TransactionDetailID) === parseInt(tempArr[index].TransactionDetailID)).length > 0) {
        let arrayIndex = this.state.handlingArray.findIndex((data) => parseInt(data.TransactionDetailID) === parseInt(tempArr[index].TransactionDetailID))
        this.state.handlingArray[arrayIndex] = tempArr[index]
      } else
        this.state.handlingArray.push(tempArr[index])
    }
    else
      this.state.handlingArray.push(tempArr[index])
  }

  renderTableRows = (data, index) => {
    const fontsize = '9pt'
    let DBextraCharge = []
    let charges = data.TransactionDetailCharges !== "[]" && data.TransactionDetailCharges !== undefined ? JSON.parse(data.TransactionDetailCharges).reduce((price, item) => price + parseFloat(item.ProductPrice), 0).toFixed(2) : 0
    let dataIndex = this.state.TransactionDetail.findIndex(x => parseInt(x.TransactionDetailID) === parseInt(data.TransactionDetailID))
    let existDelivery = this.state.TransactionDetail.filter(x => x.Description === "Delivery Fee").length
    if (this.state.TransportationBool === true && data.TransactionDetailID === undefined) {
      if (existDelivery === 0) {
        dataIndex = this.state.TransactionDetail.length - 1
      }
    }

    return (
      (data.Description === "Delivery Fee" && this.state.TransportationBool === false) || (data.TrackingNumber === "Delivery Fee" && this.state.TransportationBool === false && this.props.transaction[0].CalculationType !== "4") ? "" :
        (
          <>
            <TableCell
              component="th"
              id={`table-checkbox-${(index + 1)}`}
              scope="row"
              sx={tableCellStyle}
            >
              {dataIndex + 1}
            </TableCell>
            <TableCell align="left" sx={tableCellStyle}>{this.props.transaction[0].CalculationType === "4" && data.Description === "Delivery Fee" || this.props.transaction[0].CalculationType === "4" && data.Description === undefined ? "Delivery Min 0.5m³" : data.TrackingNumber}
              {data.TransactionDetailCharges !== "[]" && data.TransactionDetailCharges !== undefined &&
                JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                  return (
                    <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px" }}>
                      {additionalCharges.Description}
                    </div>
                  )
                })
              }
            </TableCell>
            <TableCell align="left" sx={tableCellStyle}>{data.Description === "Delivery Fee" ? "-" : data.ProductQuantity}</TableCell>
            {
              this.props.transaction[0].CalculationType === "3" &&
              <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Description === "Delivery Fee" ? "-" : data.ProductWeight !== null && data.ProductWeight !== undefined && (data.ProductWeight).toFixed(2)}</TableCell>
            }
            <TableCell align="left" sx={tableCellStyle}>
              {
                data.Description === "Delivery Fee" ? "-" : !isNaN(volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)) ?
                  volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight).toFixed(3)
                  : "-"
              }
            </TableCell>
            {this.state.isPrinting ?
              <TableCell align="left" sx={tableCellStyle}>
                {data.handlingCharge !== 0 && data.handlingCharge !== undefined ? parseFloat(data.handlingCharge).toFixed(2) : "-"}
              </TableCell>
              :
              <TableCell align="left" sx={tableCellStyle}>
                {data.Description === "Delivery Fee" || data.Description === undefined ? "" :
                  <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0", fontFamily: "Arial", fontWeight: "bolder" }}>
                    {data.handlingCharge}
                  </div>
                }
                {data.TransactionDetailCharges !== undefined && data.TransactionDetailCharges !== "[]" && JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                  return (
                    <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0", fontFamily: "Arial", fontWeight: "bolder" }}>
                      {(additionalCharges.ProductPrice).toFixed(2)}
                    </div>
                  )
                })}
              </TableCell>
            }
            {
              this.props.transaction[0].CalculationType !== "3" &&
              <TableCell align="left" sx={tableCellStyle}>
                {
                  this.props.transaction[0].CalculationType === "1" ?
                    volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight) > 0.013 ? (data.ProductPrice / volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)).toFixed(2) : parseFloat(data.ProductPrice).toFixed(2)
                    :
                    volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight) > 0 ? (data.ProductPrice / volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)).toFixed(2) : data.Description === "Delivery Fee" || data.Description === undefined ? "-" : <p style={{ color: "red" }}>0 m³</p>
                }
              </TableCell>
            }
            <TableCell align="right" sx={tableCellStyle}>
              {data.Description === "Delivery Fee" ? (parseFloat(data.ProductPrice) + parseFloat(this.state.TransactionDetail[index].handlingCharge) + parseFloat(charges)).toFixed(2)
                : this.props.transaction[0].CalculationType === "3" ? "-" : (parseFloat(data.totalPrice) + parseFloat(this.state.TransactionDetail[index].handlingCharge) + parseFloat(charges)).toFixed(2)}
            </TableCell>
          </>)

    )
  }

  renderPage = (arr, index, lastArray) => {
    const {
      DeliveryFee,
      transaction,
    } = this.state

    let TransactionDetail = isArrayNotEmpty(transaction) ? JSON.parse(transaction[0].TransactionDetail) : transaction
    let actualWeight = 0
    let actualVolume = 0
    let m3Weight = 0
    let finalWeight = 0
    let subTotal = 0
    let handlingCharge = 0
    let additionalCharges = 0
    let AdminChargesArray = []
    let AdminExtraCharges = 0

    if (isArrayNotEmpty(transaction) && transaction[0].TransactionDetail !== null) {
      actualWeight = JSON.parse(transaction[0].TransactionDetail).reduce((weight, item) => weight + item.ProductWeight, 0).toFixed(2)
      actualVolume = JSON.parse(transaction[0].TransactionDetail).reduce((dimension, item) => dimension + ((item.ProductDimensionDeep * item.ProductDimensionHeight * item.ProductDimensionWidth) / 1000000), 0)
      actualVolume = (Math.ceil(actualVolume * 1000) / 1000).toFixed(3)
      m3Weight = Math.ceil(actualVolume * 1000000 / 6000)

      if (actualWeight > m3Weight)
        finalWeight = actualWeight
      else
        finalWeight = m3Weight

      handlingCharge = this.state.TransactionDetail.reduce((charges, item) => charges + item.handlingCharge, 0)
      handlingCharge = !isNaN(handlingCharge) ? handlingCharge : 0
      additionalCharges = this.state.TransactionDetail[0].TransactionDetailCharges != null && JSON.parse(this.state.TransactionDetail[0].TransactionDetailCharges).reduce((additionalCharge, item) => additionalCharge + parseFloat(item.ProductPrice), 0).toFixed(2)
      subTotal = ((Math.ceil(finalWeight).toFixed(2) - 1) * (transaction[0].SubSequenceKG) + (transaction[0].FirstKG) + parseFloat(handlingCharge) + parseFloat(additionalCharges)).toFixed(2) + parseFloat(AdminExtraCharges).toFixed(2)
    }

    return (
      <div
        className="letter-page-size w-100"
      // style={{
      //   padding: '10px 50px 0px'
      // }}
      >
        {isArrayNotEmpty(transaction) &&
          <>
            {/* header */}
            <div className="row">
              <div style={companyTitle}>
                EZ TAO BAO ENTERPRISE
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
                <span className="col-9">{`${transaction[0].UserCode}  ${transaction[0].AreaCode} `}</span>
                <span className="col-1">No</span>
                <span className="col-2">: {transaction[0].TransactionName}</span>
              </div>
              <div className="row" style={companyDetail}>
                <span className="col-9">
                  {/* {transaction[0].UserAddress} */}
                </span>
                <span className="col-1">Terms</span>
                <span className="col-2">: C.O.D</span>
              </div>
              <div className="row" style={companyDetail} >
                <span className="col-9">
                  {/* Tel : {transaction[0].UserContactNo} */}
                </span>
                <span className="col-1">Date</span>
                <span className="col-2">: {transaction[0].OrderDate}</span>
              </div>
              <div className="row" style={companyDetail}>
                <span className="col-1 offset-9">Page</span>
                <span className="col-2">{`: ${index + 1} of ${splitArray(this.checkDelivery(TransactionDetail), noOfArrShow).length}`}</span>
              </div>
            </div>

            {/* content */}

            <div>
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
                  checkboxColor: "primary",
                  onRowClickSelect: false,
                  headerColor: ''
                }}
                selectedIndexKey={"TransactionDetailID"}
                Data={arr}
              />
            </div>
            {
              // arr.length < noOfArrShow &&
              //  || splitArray(this.checkDelivery(TransactionDetail), noOfArrShow).length === 1 &&
              index === lastArray - 1 &&
              <div className="d-flex">
                <div className="invoice-footer">
                  <hr />
                  {this.props.transaction[0].CalculationType === "3" &&
                    <>
                      <div style={tncDiv}>
                        Actual Weight : {actualWeight} kg  |  Volume : {actualVolume} m³  |  Volumetric Weight : {m3Weight} kg
                      </div>
                      <div style={tncDiv}>
                        * First kg : RM {this.props.transaction[0].FirstKG}, Sub. kg : RM {this.props.transaction[0].SubSequenceKG}
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
                      <img style={img} src={EZSpay} alt="SPAY_QR" ></img>
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
                      Total Item :
                      <span style={total}>{TransactionDetail.filter((el) => el.TrackingNumber === "Delivery Fee").length > 0 ? TransactionDetail.length - 1 : TransactionDetail.length}</span>
                      <br />
                      Sub Total (RM) :
                      {this.props.transaction[0].CalculationType === "3" ?
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(subTotal) + parseFloat(DeliveryFee) : parseFloat(subTotal))}</span>
                        // <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(subTotal) + parseFloat(this.state.totalhandlingCharge) + parseFloat(DeliveryFee) : parseFloat(this.state.totalhandlingCharge) + parseFloat(subTotal))}</span>
                        :
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(this.state.totalhandlingCharge) + parseFloat(DeliveryFee) + parseFloat(AdminExtraCharges) : parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(this.state.totalhandlingCharge) + parseFloat(AdminExtraCharges))}</span>
                      }
                      <br />
                      Total (RM) :
                      {this.props.transaction[0].CalculationType === "3" ?
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(subTotal) + parseFloat(DeliveryFee) : parseFloat(subTotal))}</span>
                        // <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(subTotal) + parseFloat(this.state.totalhandlingCharge) + parseFloat(DeliveryFee) : parseFloat(this.state.totalhandlingCharge) + parseFloat(subTotal))}</span>
                        :
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(this.state.totalhandlingCharge) + parseFloat(DeliveryFee) + parseFloat(AdminExtraCharges) : parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(this.state.totalhandlingCharge) + parseFloat(AdminExtraCharges))}</span>
                      }
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div style={tncDiv} className="col-3 mt-4">
                      <div className="text-center">
                        __________________________________
                        <div>EZ TAO BAO ENTERPRISE</div>
                        <div></div>
                      </div>
                    </div>
                    <div style={tncDiv} className="col-5 mt-4">

                    </div>
                    <div style={{ textAlign: 'left', ...tncDiv }} className="col-3 mt-4">
                      __________________________________
                      <div>Name  : </div>
                      <div>IC NO : </div>
                      <div>Date  : </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </>
        }
        <br />
      </div>
    )
  }

  checkDelivery = (data) => {
    let detailsData = data
    if (isArrayNotEmpty(data)) {
      if (data.filter((x) => x.Description === "Delivery Fee" && x.ProductPrice === 0).length > 0) {
        detailsData = data.filter((x) => x.Description !== "Delivery Fee")
      }
    }
    console.log("checkDelivery3", detailsData)
    return detailsData
  }

  render() {
    const { TransactionDetail } = this.state

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
            <ReactToPrint
              style={{ width: "100%", display: "inline" }}
              trigger={(e) => {
                return (
                  <Button
                    variant="contained"
                  >
                    Print this invoice
                  </Button>
                );
              }}
              content={() => this.componentRef}
            />
          </div>
          <div ref={(el) => (this.componentRef = el)}>
            {splitArray(this.checkDelivery(TransactionDetail), noOfArrShow).map((arr, index) => {
              return (
                this.renderPage(arr, index, splitArray(this.checkDelivery(TransactionDetail), noOfArrShow).length)
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TransactionHistoryDetail));