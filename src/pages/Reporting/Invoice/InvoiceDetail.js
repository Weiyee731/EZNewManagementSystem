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
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TableComponents from "../../../components/TableComponents/TableComponents"
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";

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
    id: 'TrackingNo',
    align: 'left',
    disablePadding: false,
    label: 'Tracking No. ',
  },
  {
    id: 'Weight',
    align: 'left',
    disablePadding: false,
    label: 'Weight (KG)',
  },
  {
    id: 'Depth',
    align: 'left',
    disablePadding: false,
    label: 'Depth',
  },
  {
    id: 'Width',
    align: 'left',
    disablePadding: false,
    label: 'Width',
  },
  {
    id: 'Height',
    align: 'left',
    disablePadding: false,
    label: 'Height',
  },
  {
    id: 'Dimension',
    align: 'left',
    disablePadding: false,
    label: 'Dimension',
  },
  {
    id: 'Item',
    align: 'left',
    disablePadding: false,
    label: 'Item',
  },
  {
    id: 'Member',
    align: 'left',
    disablePadding: false,
    label: 'Member',
  },
  {
    id: 'Division',
    align: 'left',
    disablePadding: false,
    label: 'Division',
  },
  {
    id: 'Stockdate',
    align: 'left',
    disablePadding: false,
    label: 'Stock Date',
  },
  {
    id: 'packagingDate',
    align: 'left',
    disablePadding: false,
    label: 'Packaging Date',
  },
  {
    id: 'ContainerNo',
    align: 'left',
    disablePadding: false,
    label: 'Container',
  },
  {
    id: 'Remarks',
    align: 'left',
    disablePadding: false,
    label: 'Remarks',
  },
];

const companyTitle = {
  fontWeight: "bolder",
  fontSize: "32px",
  textAlign: "center"
};

const companyDetailTitle = {
  fontWeight: "bold",
  fontSize: "20px",
  float: "center",
  textAlign: "center"
};

const companyDetail = {
  fontSize: "18px",
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
};


class InvoicerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Transaction: [],
      TransactionID: this.props.match.params.transactionid,
      OrderDate: "",
      TransactionName: "",
      Fullname: "",
      Email: "",
      Contact: "",
      Address: "",
      OrderTotalAmount: "",
      OrderPaidAmount: "",
      TransactionDetail: []
    }
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
          {data.TrackingNumber}
        </TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductWeight.toFixed(2)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductDimensionDeep.toFixed(2)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductDimensionWidth.toFixed(2)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductDimensionHeight.toFixed(2)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{(data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight).toFixed(2)}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Item}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.UserCode}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.AreaCode + " - " + data.AreaName}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.StockDate}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.PackagingDate}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ContainerName}</TableCell>
        <TableCell align="left" sx={{ fontSize: fontsize }}>{data.Remark}</TableCell>
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

            </div>
            <div className="row">
              <div
                style={{ width: "100%", padding: "3%" }}
                className="Post"
                ref={(el) => (this.componentRef = el)}
              >
                <div style={{ padding: "1%" }}>
                  <div>
                    <div style={{ float: "left" }}>
                      <img src="" width="200px" />
                    </div>
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
                    <span className="col-8">{this.state.UserCode}-{this.state.AreaCode}{this.state.Fullname}</span>
                    <span className="col-1">No</span>
                    <span className="col-3">: {this.state.TransactionName}</span>
                  </div>
                  <div className="row" style={companyDetail}>
                    <span className="col-8">{this.state.Address}</span>
                    <span className="col-1">Terms</span>
                    <span className="col-3">: C.O.D</span>
                  </div>
                  <div className="row" style={companyDetail} >
                    <span className="col-8">Tel : {this.state.Contact}</span>
                    <span className="col-1">Date</span>
                    <span className="col-3">: {this.state.OrderDate}</span>
                  </div>
                </div>
              </div>
            </div>
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
            Data={this.state.TransactionDetail}
            onTableRowClick={this.onTableRowClick}

          />
        </div>
        <div style={tncDiv}>
          <div style={tncTitle}>Terms and Conditions</div>
          <br />
          <div>
            <p>
              1. Customer will be billed after indicating acceptance of this
              quote.
            </p>
            <p>
              2. Payment will be due prior to delivery of service and goods.
            </p>
            <p>To accept this Quotation ,sign here and return :</p>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoicerDetail));