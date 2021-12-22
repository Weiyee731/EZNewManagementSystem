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
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import TableComponents from "../../../components/TableComponents/TableComponents"
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull, volumeCalc, roundOffTotal, splitArray, round } from "../../../tools/Helpers";
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
    label: 'M³',
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
    align: 'left',
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
  fontSize: "14px",
  color: "#0070C0",
};

const tncDiv = {
  // margin: "1%",
  fontWeight: "bold",
  fontSize: "11px",
};

class InvoicerDetail extends Component {
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
      page: [],
      isRemarkValidated: false,
      isDeliveryFeeValidated: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.onClickConfirmInvoice = this.onClickConfirmInvoice.bind(this)
    this.props.CallFetchAllTransactionByID(this.state)
  }

  componentDidMount() {
    if (this.props.transaction.length !== this.state.Transaction.length) {
      if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
        this.setState({
          Transaction: this.props.transaction,
          OrderDate: this.props.transaction[0].OrderDate,
          TransactionName: this.props.transaction[0].TransactionName,
          Fullname: this.props.transaction[0].Fullname,
          UserCode: this.props.transaction[0].UserCode,
          AreaCode: this.props.transaction[0].AreaCode,
          Contact: this.props.transaction[0].UserContactNo,
          Address: this.props.transaction[0].UserAddress,
          OrderTotalAmount: this.props.transaction[0].OrderSubTotalAmount,
          OrderPaidAmount: this.props.transaction[0].OrderSubPaidAmount,
          TransactionDetail: JSON.parse(this.props.transaction[0].TransactionDetail),
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.transaction.length !== this.props.transaction.length) {
      if (this.props.transaction !== undefined && this.props.transaction[0] !== undefined) {
        this.setState({
          Transaction: this.props.transaction,
          OrderDate: this.props.transaction[0].OrderDate,
          TransactionName: this.props.transaction[0].TransactionName,
          Fullname: this.props.transaction[0].Fullname,
          UserCode: this.props.transaction[0].UserCode,
          AreaCode: this.props.transaction[0].AreaCode,
          Contact: this.props.transaction[0].UserContactNo,
          Address: this.props.transaction[0].UserAddress,
          OrderTotalAmount: this.props.transaction[0].OrderSubTotalAmount,
          OrderPaidAmount: this.props.transaction[0].OrderSubPaidAmount,
          TransactionDetail: this.props.transaction[0].TransactionDetail !== "null" ? JSON.parse(this.props.transaction[0].TransactionDetail) : [],
        });
      }
    } else {
      if (prevProps.transaction.length !== this.state.Transaction.length) {
        this.setState({
          Transaction: prevProps.transaction,
          OrderDate: prevProps.transaction[0].OrderDate,
          TransactionName: prevProps.transaction[0].TransactionName,
          Fullname: prevProps.transaction[0].Fullname,
          UserCode: prevProps.transaction[0].UserCode,
          AreaCode: prevProps.transaction[0].AreaCode,
          Contact: prevProps.transaction[0].UserContactNo,
          Address: prevProps.transaction[0].UserAddress,
          OrderTotalAmount: prevProps.transaction[0].OrderSubTotalAmount,
          OrderPaidAmount: prevProps.transaction[0].OrderSubPaidAmount,
          TransactionDetail: JSON.parse(prevProps.transaction[0].TransactionDetail)
        });
      }
    }
  }

  renderTableRows = (data, index) => {
    const fontsize = '9pt'
    return (
      <>
        <TableCell
          component="th"
          id={`table-checkbox-${(index + 1)}`}
          scope="row"
          sx={{ fontSize: fontsize }}
        >
          {(index + 1)}
        </TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.TrackingNumber}
          {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <TableRow><TableCell align="left" sx={{ fontSize: fontsize, borderBottom: "0px" }}>{additionalCharges.Description}</TableCell></TableRow>
          })}
        </TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductQuantity}</TableCell>
        {/* <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ContainerName}</TableCell> */}
        <TableCell align="left" sx={{ fontSize: fontsize }}>{volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{roundOffTotal(1.05)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductPrice}
          {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <TableRow><TableCell align="left" sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0" }}>{additionalCharges.ProductPrice}</TableCell></TableRow>
          })}
        </TableCell>
        <TableCell align="right" sx={{ fontSize: fontsize }}>{roundOffTotal(data.ProductPrice * data.ProductQuantity)}
          {data.TransactionDetailCharges != null && JSON.parse(data.TransactionDetailCharges).map((additionalCharges) => {
            return <TableRow><TableCell align="left" sx={{ fontSize: fontsize, borderBottom: "0px", paddingLeft: "0" }}>{(additionalCharges.ProductPrice * additionalCharges.ProductQuantity)}</TableCell></TableRow>
          })}
        </TableCell>
      </>
    )
  }

  onPrintButtonClick = () => {
    this.setState({ AddModalOpen: true });
  }

  handleClose = () => {
    this.setState({ AddModalOpen: false });
  }

  handleClose2 = () => {
    this.setState({ AddModalOpen2: false });
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
    const value = (isStringNullOrEmpty( e.target.value ) ? "" : e.target.value)

    switch (elementId) {
      case "remark":
        this.setState({ Remark:value, isRemarkValidated: !(isStringNullOrEmpty(value))  })
        break;

      case "deliveryfee":
        this.setState({ DeliveryFee: value, isDeliveryFeeValidated: (!(isStringNullOrEmpty(value)) && !isNaN(value) && (Number(value) > 0)) })
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
    return (
      <div
        className="letter-page-size w-100"
        style={{
          padding: '10px 50px 0px'
        }}
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
            <span className="col-9">{UserCode}-{AreaCode}{Fullname}</span>
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
            <span className="col-2">{`: ${index + 1} of ${splitArray(TransactionDetail, 16).length}`}</span>
          </div>
        </div>
        <div
          style={{
            // marginTop: "10px"
          }}
        >
          <div style={companyDetail}>
            <b>Container:</b> {TransactionDetail[0].ContainerName !== null ? TransactionDetail[0].ContainerName : " - "}
          </div>
          <TableComponents
            style={{
              boxShadow: "0px",
            }}
            elevation={"0"}
            tableOptions={{
              dense: true,
              tableOrderBy: 'asc',
              sortingIndex: "fat",
              stickyTableHeader: false,
            }}
            tableHeaders={headCells}
            tableRows={{
              renderTableRows: this.renderTableRows,
              checkbox: false,
              checkboxColor: "primary",
              onRowClickSelect: false
            }}
            selectedIndexKey={"TransactionDetailID"}
            Data={arr}
          />
        </div>

        <div className="d-flex">
          <div className="invoice-footer">
            <hr />
            <div className="row">
              <div style={tncDiv} className="col-7 mt-4">
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
              <div style={tncDiv} className="col-4 offset-1">
                Total Item :
                <span style={total}>{TransactionDetail.length}</span>
                <br />
                Sub Total (RM) :
                <span style={total}>{roundOffTotal(OrderTotalAmount)}</span>
                <br />
                Total (RM) :
                <span style={total}>{roundOffTotal(parseFloat(OrderTotalAmount) + parseFloat(DeliveryFee))}</span>
              </div>
            </div>
            <div className="row mt-5 text-center">
              <div style={tncDiv} className="col-4">
                __________________________________
                <div className="text-center">
                  <div>EZ TRANSIT AND LOGISTICS</div>
                  <div>SDN BHD</div>
                </div>
              </div>
              <div style={{ textAlign: 'left', ...tncDiv }} className="col-4 offset-4">
                __________________________________
                <div>Name  : </div>
                <div>IC NO : </div>
                <div>DATE  : </div>
              </div>
            </div>
          </div>
        </div>
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
            <IconButton
              color="primary"
              aria-label="back"
              component="span"
              onClick={this.onPrintButtonClick}>
              <PrintIcon />
            </IconButton>
          </div>
          <div ref={(el) => (this.componentRef = el)}>
            {splitArray(TransactionDetail, 16).map((arr, index) => {
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
                          error={ !this.state.isRemarkValidated }
                        />
                        { !this.state.isRemarkValidated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid</FormHelperText>}
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
                            onChange={(e) => { this.handleInputChange(e) }}
                            startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                            error={ !this.state.isDeliveryFeeValidated }
                          />
                          { !this.state.isDeliveryFeeValidated  && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid Amount</FormHelperText>}
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
                  onClick={(e1) => this.onClickConfirmInvoice(e1)}
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
                    return (<Button variant="contained">Print this invoice</Button>);
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoicerDetail));
