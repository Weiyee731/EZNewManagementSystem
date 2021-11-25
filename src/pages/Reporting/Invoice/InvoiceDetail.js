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
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";
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
  height: '30%',
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
    label: 'item',
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
    label: 'M³',
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
  fontSize: "25px",
  textAlign: "center"
};

const companyDetailTitle = {
  fontWeight: "bold",
  fontSize: "16px",
  float: "center",
  textAlign: "center"
};

const companyDetail = {
  fontSize: "14px",
  fontWeight: "bold",
};

const quotation = {
  float: "right",
  fontSize: "20px",
  fontWeight: "bold",
};

const tncTitle = {
  fontSize: "16px",
  color: "#0070C0",
};

const tncDiv = {
  margin: "1%",
  fontWeight: "bold",
  fontSize: "14px",
};

function printPDF() {
  return (
    <ReactToPrint
      content={() => this.componentRef}
      documentTitle="post.pdf"
    ></ReactToPrint>
  );
}

class InvoicerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Transaction: [],
      TransactionID: this.props.match.params.transactionid,
      OrderDate: "",
      TransactionName: "",
      TransportationType: 1,
      Fullname: "",
      Email: "",
      Contact: "",
      Address: "",
      OrderTotalAmount: "",
      OrderPaidAmount: "",
      AddModalOpen: false,
      AddModalOpen2: false,
      DeliveryFee: 0.00,
      Remark: "",
      TransactionDetail: []
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.onClickConfirmInvoice = this.onClickConfirmInvoice.bind(this)
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
          Fullname: this.props.transaction[0].Fullname,
          UserCode: this.props.transaction[0].UserCode,
          AreaCode: this.props.transaction[0].AreaCode,
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
          Fullname: this.props.transaction[0].Fullname,
          UserCode: this.props.transaction[0].UserCode,
          AreaCode: this.props.transaction[0].AreaCode,
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
          Fullname: prevProps.transaction[0].Fullname,
          UserCode: prevProps.transaction[0].UserCode,
          AreaCode: prevProps.transaction[0].AreaCode,
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
    const fontsize = '9pt'
    return (
      <>
        <TableCell
          component="th"
          id={`table-checkbox-${index}`}
          scope="row"
          sx={{ fontSize: fontsize }}
        >
          {index}
        </TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.TrackingNumber}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductQuantity}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight).toFixed(2)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductPrice}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductPrice * data.ProductQuantity)}</TableCell>
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
    console.log('delete button')

  }

  onClickConfirmInvoice = (items) => {
    this.props.CallUpdateTransaction(this.state);
    this.state.TransactionDetail.push({ TrackingNumber: "Delivery Fee", ProductQuantity: 1, ProductDimensionDeep: "", ProductDimensionWidth: "", ProductDimensionHeight: "", ProductPrice: this.state.DeliveryFee })
    this.setState({ AddModalOpen: false, AddModalOpen2: true });
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

  render() {
    return (
      <div>
        <Card>
          <CardContent>
            <div className="d-flex align-items-center row">
              <div className="col-1">
                <IconButton
                  color="primary"
                  aria-label="back"
                  component="span"
                  onClick={() => this.props.history.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className="col-9"></div>
              <div className="col-1" style={{ textAlign: "end" }}>
                <IconButton
                  color="primary"
                  aria-label="back"
                  component="span"
                  onClick={this.onAddButtonClick}>
                  <PrintIcon />
                </IconButton>
              </div>
            </div>
            <div style={{ width: "100%", padding: "3%" }}
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

              <TableComponents
                tableTopLeft={""}
                tableTopRight={this.renderTableActionButton}
                tableOptions={{
                  dense: false,
                  tableOrderBy: 'asc',
                  sortingIndex: "fat",
                  stickyTableHeader: true,
                  stickyTableHeight: 300,
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
                      Sub Total :
                      <br />
                      Total     : {this.state.OrderTotalAmount}
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
                <Box sx={style} component="main" maxWidth="xs">
                  <Typography component="h1" variant="h5" style={{textAlign:"center"}}>Additional Charges</Typography>
                  <Box component="form" noValidate sx={{ mt: 3 }}>
                    <div className="row">
                      <p style={{textAlign:"center"}}>
                        Before Print, please select the delivery method
                      </p>
                      <div className="row">
                        <div className="col-2">Self Pick</div>
                        <Switch className="col-2" defaultChecked />
                        <div className="col-2">Delivery</div>
                        <div className="col-6"></div>
                      </div>

                      <div className="col-6 col-sm-8">
                        <TextField
                          variant="standard"
                          size="small"
                          fullWidth
                          id="remark"
                          label={"Remark "}
                          name="AdditionalChargedRemark"
                          value={this.state.Remark}
                          onChange={(e) => { this.handleInputChange(e) }}
                          error={false}
                        />
                        {false && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid</FormHelperText>}
                      </div>
                      <div className="col-4 col-sm-3">
                        <FormControl variant="standard" size="small" fullWidth>
                          <InputLabel htmlFor="AdditionalChargedAmount"></InputLabel>
                          <Input
                            variant="standard"
                            size="small"
                            name="AdditionalChargedAmount"
                            value={this.state.DeliveryFee}
                            id="deliveryfee"
                            onChange={(e) => { this.handleInputChange(e) }}
                            startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                            error={false}
                          />
                          {false && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid Amount</FormHelperText>}

                        </FormControl>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={(e1) => this.onClickConfirmInvoice(e1)}
                    >Add Additional Charge
                    </Button>

                  </Box>
                </Box>
              </Modal>

            </div>
            <div>
              <Modal
                open={this.state.AddModalOpen2}
                onClose={this.handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
              ><Box sx={style} component="main" maxWidth="xs">
                  <Typography component="h1" variant="h5">Printing Invoice</Typography>
                  <Box component="form" noValidate sx={{ mt: 3 }}>
                    <div className="row">
                      <p>
                        Please select deliver option
                      </p>
                    </div>
                    <ReactToPrint
                      trigger={(e) => {
                        return (<Button variant="contained">Print The Invoice</Button>);
                      }}
                      content={() => this.componentRef}
                    />
                  </Box>
                </Box>
              </Modal>
            </div>
          </CardContent>
        </Card>
      </div >
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoicerDetail));
