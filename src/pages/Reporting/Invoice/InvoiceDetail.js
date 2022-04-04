import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
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
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import TableComponents from "../../../components/TableComponents/TableComponents"
import { isArrayNotEmpty, isStringNullOrEmpty, volumeCalc, roundOffTotal, splitArray } from "../../../tools/Helpers";
import PrintIcon from '@mui/icons-material/Print';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Switch from '@mui/material/Switch';
import ReactToPrint from "react-to-print";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function mapStateToProps(state) {
  return {
    loading: state.counterReducer["loading"],
    transaction: state.counterReducer["transaction"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallFetchAllTransactionByID: (data) => dispatch(GitAction.CallFetchAllTransactionByID(data)),
    CallUpdateTransaction: (data) => dispatch(GitAction.CallUpdateTransaction(data)),
    // CallUpdateStockDetailByPost: (data) => dispatch(GitAction.CallUpdateStockDetailByPost(data)),
    CallUpdateStockDetailByGet: (data) => dispatch(GitAction.CallUpdateStockDetailByGet(data)),
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
  // {
  //   id: 'ContainerName',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'Container Name',
  // },
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

class InvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onClickConfirmInvoice = this.onClickConfirmInvoice.bind(this)
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
            handlingCharge: 0,
            totalPrice: item.ProductPrice * item.ProductQuantity
          })
        })

        let actualVolume = JSON.parse(this.props.transaction[0].TransactionDetail).reduce((dimension, item) => dimension + ((item.ProductDimensionDeep * item.ProductDimensionHeight * item.ProductDimensionWidth) / 1000000), 0).toFixed(3)

        if (this.props.transaction[0].CalculationType === "4") {
          let totalPrice = JSON.parse(this.props.transaction[0].TransactionDetail).filter((data) => data.Description !== "Delivery Fee").reduce((price, item) => price + item.ProductPrice, 0)
          let datalist = JSON.parse(this.props.transaction[0].TransactionDetail)[0]
          let m3Price = (datalist.ProductPrice / volumeCalc(datalist.ProductDimensionDeep, datalist.ProductDimensionWidth, datalist.ProductDimensionHeight)).toFixed(2)
          let extraFees = (m3Price / 2 - totalPrice).toFixed(2)

          if (actualVolume < 0.50) {
            this.props.CallUpdateTransaction({
              TransactionID: this.state.TransactionID,
              TransportationType: 2,
              DeliveryFee: extraFees
            });
            this.setState({ TransportationBool: true, Remark: "Delivery Min 0.5m³", isDeliveryFeeValidated: true, DeliveryFee: extraFees })
            if (tempArr.filter((data) => data.Description === "Delivery Fee").length === 0) {
              tempArr.push({
                TrackingNumber: "Delivery Min 0.5m³",
                ProductQuantity: 1,
                ProductDimensionDeep: "-",
                ProductDimensionWidth: "-",
                ProductDimensionHeight: "-",
                ProductPrice: extraFees,
                totalPrice: extraFees
              })
            }
          }
          this.setState({ minDelivery: extraFees })
        }

        this.setState({
          TransactionDetail: tempArr,
          transaction: this.props.transaction,
          actualVolume: actualVolume,
          TransportationBool: true
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

    this.setState({
      TransactionDetail: tempArr,
    })
  }

  handleConfirmhandlingCharge = (e, index) => {
    let tempArr = this.state.TransactionDetail
    let additionalCharge = 0

    tempArr[0].TransactionDetailCharges != null && JSON.parse(tempArr[0].TransactionDetailCharges).map((additionalCharges, index) => {
      additionalCharge = parseFloat(additionalCharge) + parseFloat(additionalCharges.ProductPrice * additionalCharges.ProductQuantity)
    })

    tempArr[index].totalPrice = Number(e) + (tempArr[index].ProductPrice * tempArr[index].ProductQuantity)

    let tempArr2 = this.state.transaction
    let total = 0;
    tempArr.map((item) => {
      total += item.totalPrice
    })
    tempArr2[0].OrderSubTotalAmount = total + additionalCharge
    tempArr2[0].OrderTotalAmount = total + additionalCharge

    this.setState({
      TransactionDetail: tempArr,
      transaction: tempArr2
    })

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

    // data.AdditionalCharges !== "[]" && data.AdditionalCharges.split(";").map((x) => {
    //   DBextraCharge.push(x.split("=")[1])
    // })

    // if (DBextraCharge.length > 0)
    //   charges = charges + DBextraCharge.reduce((price, item) => price + parseFloat(item), 0).toFixed(2)

    let dataIndex = this.state.TransactionDetail.findIndex(x => parseInt(x.TransactionDetailID) === parseInt(data.TransactionDetailID))
    let existDelivery = this.state.TransactionDetail.filter(x => x.Description === "Delivery Fee").length
    if (this.state.TransportationBool === true && data.TransactionDetailID === undefined) {
      if (existDelivery === 0) {
        dataIndex = this.state.TransactionDetail.length - 1
      }
      // if (data.TrackingNumber === "Delivery Min 0.5m³")
      //   dataIndex = this.state.TransactionDetail.length
    }

    return (
      (data.Description === "Delivery Fee" && this.state.TransportationBool === false) || (data.TrackingNumber === "Delivery Fee" && this.state.TransportationBool === false && this.props.transaction[0].CalculationType !== "4") ? "" :
        (
          <>
            <TableCell
              component="th"
              id={`table-checkbox-${(index + 1)}`}
              scope="row"
              sx={{ fontSize: fontsize }}
            >
              {dataIndex + 1}
            </TableCell>
            <TableCell align="left" sx={{ fontSize: fontsize }}>{this.props.transaction[0].CalculationType === "4" && data.Description === "Delivery Fee" || this.props.transaction[0].CalculationType === "4" && data.Description === undefined ? "Delivery Min 0.5m³" : data.TrackingNumber}
              {data.TransactionDetailCharges !== "[]" && data.TransactionDetailCharges !== undefined &&
                JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                  return (
                    <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px" }}>
                      {additionalCharges.Description}
                    </div>
                  )
                })
              }
              {/* {data.TransactionDetailCharges !== "[]" &&
                JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                 console.log("additionalCharges11", additionalCharges)
                })
              } */}
              {/* {
                data.AdditionalCharges !== "[]" && data.AdditionalCharges.split(";").map((x) => {
                  return (
                    <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px" }}>
                      {x.split("=")[0]}
                    </div>
                  )
                })
              } */}
            </TableCell>
            <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Description === "Delivery Fee" ? "-" : data.ProductQuantity}</TableCell>
            {
              this.props.transaction[0].CalculationType === "3" &&
              <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Description === "Delivery Fee" ? "-" : data.ProductWeight !== null && data.ProductWeight !== undefined && (data.ProductWeight).toFixed(2)}</TableCell>
            }
            <TableCell align="left" sx={{ fontSize: fontsize }}>
              {
                data.Description === "Delivery Fee" ? "-" : !isNaN(volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)) ?
                  volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight).toFixed(3)
                  : "-"
              }
            </TableCell>
            {this.state.isPrinting ?
              <TableCell align="left" sx={{ fontSize: fontsize }}>
                {data.handlingCharge !== 0 && data.handlingCharge !== undefined ? parseFloat(data.handlingCharge).toFixed(2) : "-"}

                {data.TransactionDetailCharges !== undefined && data.TransactionDetailCharges !== "[]" ? JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                  return (
                    <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0" }}>
                      {parseFloat(additionalCharges.ProductPrice).toFixed(2)}
                    </div>
                  )
                }) : "-"}

              </TableCell>
              :
              <TableCell align="left" sx={{ fontSize: fontsize }}>
                {
                  data.Description === "Delivery Fee" || data.Description === undefined ? "" :
                    <>
                      <TextField
                        variant="outlined"
                        label=""
                        size="small"
                        name="handlingCharge"
                        type={'number'}
                        inputProps={{
                          style: {
                            padding: '0px',
                            justifyContent: 'center',
                            flex: 1,
                            display: 'flex',
                          }
                        }}
                        onChange={(e) => this.handlehandlingChargeOnChange(e.target.value, index)}
                      />
                      <IconButton
                        color="primary"
                        aria-label="back"
                        component="span"
                        style={{
                          padding: '0 0 0 5px'
                        }}
                        onClick={() => this.handleConfirmhandlingCharge(data.handlingCharge, index)}
                      >
                        <CheckCircleIcon
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                      </IconButton>
                    </>
                }
                {data.TransactionDetailCharges != undefined && data.TransactionDetailCharges !== "[]" && JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                  return (
                    <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0" }}>
                      {(additionalCharges.ProductPrice).toFixed(2)}
                    </div>
                  )
                })}
                {/* {
                  data.AdditionalCharges !== "[]" && data.AdditionalCharges.split(";").map((x) => {
                    return (
                      <div align="left" key={index} sx={{ fontSize: fontsize, borderBottom: "0px" }}>
                        {parseFloat(x.split("=")[1]).toFixed(2)}
                      </div>
                    )
                  })
                } */}
              </TableCell>
            }

            {/* Only Show price when not using small item calculation */}
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
              {data.Description === "Delivery Fee" ? (parseFloat(data.ProductPrice) + parseFloat(charges)).toFixed(2)
                : this.props.transaction[0].CalculationType === "3" ? "-" : (parseFloat(data.totalPrice) + parseFloat(charges)).toFixed(2)}

              {/* {data.Description === "Delivery Fee" ? parseFloat(data.ProductPrice) === undefined ? "-" : parseFloat(data.ProductPrice).toFixed(2)
              : data.totalPrice === 0 ? '-' : parseFloat(data.totalPrice).toFixed(2)}
              {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges, index) => {
                return (<div key={index} sx={{ fontSize: fontsize, borderBottom: "0px" }}>{(additionalCharges.ProductPrice * additionalCharges.ProductQuantity).toFixed(2)}</div>)
              }) */}
              {/* } */}
            </TableCell>
          </>)

    )
  }

  onPrintButtonClick = () => {
    this.setState({ AddModalOpen: true });
  }

  handleClose = () => {
    this.setState({ AddModalOpen: false, isPrinting: false });
  }

  handleClose2 = () => {
    this.setState({ AddModalOpen2: false, isPrinting: false });
  }

  onClickConfirmInvoice = (items) => {
    var isDeliveryExist = false
    var minDelivery = this.state.TransactionDetail.filter((data) => data.TrackingNumber === "Delivery Min 0.5m³").length

    if (this.state.TransportationBool === true) {
      this.state.TransactionDetail.map((search) => {
        if (search.Description === "Delivery Fee" || search.TrackingNumber === "Delivery Fee") {
          this.props.CallUpdateTransaction(this.state);
          search.ProductPrice = this.state.DeliveryFee
          search.totalPrice = this.state.DeliveryFee
          isDeliveryExist = true
        }
      })

      if (!isDeliveryExist) {
        if (this.state.TransportationBool && minDelivery === 0) {
          this.state.TransactionDetail.push({
            TrackingNumber: "Delivery Fee",
            ProductQuantity: 1,
            ProductDimensionDeep: "-",
            ProductDimensionWidth: "-",
            ProductDimensionHeight: "-",
            ProductPrice: this.state.DeliveryFee,
            totalPrice: this.state.DeliveryFee
          })
          this.props.CallUpdateTransaction(this.state);
        }

        else if (this.state.TransportationBool && minDelivery > 0) {
          this.state.TransactionDetail.map((search) => {
            if (search.TrackingNumber === "Delivery Min 0.5m³") {
              this.props.CallUpdateTransaction(this.state);
              search.ProductPrice = this.state.DeliveryFee
              search.totalPrice = this.state.DeliveryFee
            }
          })
        }
      }
    }

    if (this.state.handlingArray.length > 0) {
      this.state.handlingArray.map((data) => {
        let extraCharge = ""
        if (data.AdditionalCharges !== "[]") {
          extraCharge = data.AdditionalCharges + ";Handling Charges=" + data.handlingCharge
        }
        else {
          extraCharge = "Handling Charges=" + data.handlingCharge
        }
        this.props.CallUpdateStockDetailByGet({
          STOCKID: data.StockID,
          USERCODE: data.UserCode,
          TRACKINGNUMBER: data.TrackingNumber,
          PRODUCTWEIGHT: data.ProductWeight,
          PRODUCTHEIGHT: data.ProductDimensionHeight,
          PRODUCTWIDTH: data.ProductDimensionWidth,
          PRODUCTDEEP: data.ProductDimensionDeep,
          AREACODE: data.UserAreaID,

          ITEM: data.Item,
          TRACKINGSTATUSID: data.TrackingStatusID,
          CONTAINERNAME: data.ContainerName,
          CONTAINERDATE: data.ContainerDate,
          REMARK: data.Remark,
          EXTRACHARGE: extraCharge,
        })

        //   this.props.CallUpdateStockDetailByPost({
        //     StockID: data.StockID,
        //     TrackingNumber: data.TrackingNumber,
        //     ProductWeight:  data.ProductWeight,
        //     ProductDimensionHeight: data.ProductDimensionHeight,
        //     ProductDimensionWidth: data.ProductDimensionWidth,
        //     ProductDimensionDeep: data.ProductDimensionDeep,
        //     AreaCode: data.UserAreaID,
        //     UserCode:  data.UserCode,
        //     Item: data.Item,
        //     TRACKINGSTATUSID: 2,
        //     ContainerName: data.ContainerName,
        //     ContainerDate: data.ContainerDate,
        //     Remark: data.Remark,
        //     AdditionalCharges: extraCharge
        // })

      })
    }

    this.setState({ AddModalOpen: false, AddModalOpen2: true, isPrinting: true });

  }

  handleInputChange = (e) => {
    const elementId = e.target.id
    const value = (isStringNullOrEmpty(e.target.value) ? "" : e.target.value)

    switch (elementId) {
      case "remark":
        this.setState({ Remark: value, isRemarkValidated: !(isStringNullOrEmpty(value)) })
        break;

      case "deliveryfee":
        if (this.props.transaction[0].CalculationType === "4" && this.state.actualVolume < 0.50 && value < this.state.minDelivery) {
          this.setState({ DeliveryFee: value, isDeliveryFeeValidated: false })
        }
        else
          this.setState({ DeliveryFee: value, isDeliveryFeeValidated: (!(isStringNullOrEmpty(value)) && !isNaN(value)) })
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

      // this.state.TransactionDetail.map((data) => {
      //   if (data.AdditionalCharges !== "[]") {
      //     data.AdditionalCharges.split(";").map((x) => {
      //       AdminChargesArray.push(x.split("=")[1])
      //     })
      //   }
      // })
      // AdminExtraCharges = AdminChargesArray.length > 0 && AdminChargesArray.reduce((price, item) => price + parseFloat(item), 0)
      subTotal = ((Math.ceil(finalWeight).toFixed(2) - 1) * 6 + 10 + parseFloat(handlingCharge) + parseFloat(additionalCharges)).toFixed(2) + parseFloat(AdminExtraCharges).toFixed(2)
    }

    return (
      <div
        className="letter-page-size w-100"
        style={{
          padding: '10px 50px 0px'
        }}
      >
        {isArrayNotEmpty(transaction) &&
          <>
            {/* header */}
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
                <span className="col-9">{`${transaction[0].UserCode} - ${transaction[0].AreaCode} ${transaction[0].Fullname}`}</span>
                <span className="col-1">No</span>
                <span className="col-2">: {transaction[0].TransactionName}</span>
              </div>
              <div className="row" style={companyDetail}>
                <span className="col-9">{transaction[0].UserAddress}</span>
                <span className="col-1">Terms</span>
                <span className="col-2">: C.O.D</span>
              </div>
              <div className="row" style={companyDetail} >
                <span className="col-9">Tel : {transaction[0].UserContactNo}</span>
                <span className="col-1">Date</span>
                <span className="col-2">: {transaction[0].OrderDate}</span>
              </div>
              <div className="row" style={companyDetail}>
                <span className="col-1 offset-9">Page</span>
                <span className="col-2">{`: ${index + 1} of ${splitArray(TransactionDetail, noOfArrShow).length}`}</span>
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

            {/* footer */}
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
                      <img style={img} src="https://tourism.denoo.my/Ez/spay.jpeg" ></img>
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
                        :
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(DeliveryFee) + parseFloat(AdminExtraCharges) : parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(AdminExtraCharges))}</span>
                      }
                      <br />
                      Total (RM) :
                      {this.props.transaction[0].CalculationType === "3" ?
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(subTotal) + parseFloat(DeliveryFee) : parseFloat(subTotal))}</span>
                        :
                        <span style={total}>{roundOffTotal(this.state.TransportationBool === true ? parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(DeliveryFee) + parseFloat(AdminExtraCharges) : parseFloat(transaction[0].OrderSubTotalAmount) + parseFloat(AdminExtraCharges))}</span>
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
          </>
        }
        <br />
      </div>
    )
  }

  render() {
    const {
      TransactionDetail,
      AddModalOpen,
      TransportationBool,
      Remark,
      DeliveryFee,
      AddModalOpen2,
    } = this.state

    return (
      <Card>
        <CardContent>
          <div className="d-flex align-items-center justify-content-between">
            <IconButton
              color="primary"
              aria-label="back"
              component="span"
              onClick={() => this.props.history.push('/Invoice')}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="back"
              component="span"
              onClick={this.onPrintButtonClick}>
              <PrintIcon />
            </IconButton>
          </div>
          <div ref={(el) => (this.componentRef = el)}>
            {splitArray(TransactionDetail, noOfArrShow).map((arr, index) => {
              return (
                this.renderPage(arr, index)
              )
            })}
          </div>
          <Modal
            open={AddModalOpen}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Box sx={style} component="main" maxWidth="xs">
              <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>Additional Charges</Typography>
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <div className="row">
                  <h5 style={{ textAlign: "center" }}>
                    Before Print, please select the delivery method
                  </h5>
                  <div className="row" style={{ textAlign: "center", margin: "auto" }}>
                    <div style={{ display: "inline", width: "100%" }}>
                      <Grid component="label" container alignItems="center" spacing={1} style={{ width: "100%", display: "inline" }}>
                        <div>
                          <Grid item style={{ display: "inline-grid" }}>Self Pick Up</Grid>
                          <Grid item style={{ display: "inline-grid" }}>
                            <Switch
                              checked={TransportationBool}
                              onChange={(e) => { this.handleChange(e) }}
                              value="checkedA"
                              disabled={this.props.transaction.length > 0 && this.props.transaction[0].CalculationType === "4" ? true : false}
                            />
                          </Grid>
                          <Grid item style={{ display: "inline-grid" }}>Delivery</Grid>
                        </div>
                      </Grid>
                    </div>
                  </div>
                  {TransportationBool && (
                    <div className="row">
                      <div className="col-5 col-sm-7">
                        <TextField
                          variant="standard"
                          size="small"
                          fullWidth
                          id="remark"
                          label={"Remark "}
                          name="AdditionalChargedRemark"
                          value={Remark}
                          onChange={(e) => { this.handleInputChange(e) }}
                          error={!this.state.isRemarkValidated}
                        />
                        {!this.state.isRemarkValidated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid</FormHelperText>}
                      </div>
                      <div className="col-4 col-sm-3">
                        <FormControl variant="standard" size="small" fullWidth>
                          <InputLabel htmlFor="AdditionalChargedAmount"></InputLabel>
                          <Input
                            variant="standard"
                            size="small"
                            name="AdditionalChargedAmount"
                            value={DeliveryFee}
                            id="deliveryfee"
                            type="number"
                            onChange={(e) => { this.handleInputChange(e) }}
                            startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                            error={!this.state.isDeliveryFeeValidated}
                          />
                          {!this.state.isDeliveryFeeValidated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid Amount</FormHelperText>}
                        </FormControl>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={(e) => this.onClickConfirmInvoice(e)}
                  disabled={(TransportationBool && (!this.state.isDeliveryFeeValidated || !this.state.isRemarkValidated))}
                >
                  {TransportationBool ? "Add Additional Charge" : "Submit"}
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={AddModalOpen2}
            onClose={this.handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Box sx={style} component="main" maxWidth="xs">
              <Typography component="h1" variant="h5">Printing invoice</Typography>
              <Box component="form" noValidate sx={{ mt: 3 }} style={{ textAlign: "center", margin: "auto" }}>
                <div className="row" style={{ width: "100%", display: "inline" }}>
                  <h4>
                    Please select deliver option
                  </h4>
                </div>
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
              </Box>
            </Box>
          </Modal>
        </CardContent>
      </Card>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoiceDetail));
