import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from "react-router";
import Dropzone from "../../components/Dropzone/Dropzone"
import * as XLSX from 'xlsx';
import { isArrayNotEmpty, getFileExtension, getWindowDimensions, getFileTypeByExtension, isStringNullOrEmpty, convertDateTimeToString112Format, extractNumberFromStrings, isObjectUndefinedOrNull } from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";
import PublishIcon from '@mui/icons-material/Publish';
import ReportIcon from '@mui/icons-material/Report';
import { toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { ModalPopOut } from "../../components/modal/Modal";
import ResponsiveDatePickers from '../../components/datePicker/datePicker';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import moment from 'moment';
import { Typography, TableCell, Box, IconButton, LinearProgress, Button, TextField, FormHelperText } from '@mui/material';
import { WarehouseStock } from "../Stock/WarehouseStockManagement";

function mapStateToProps(state) {
    return {
        inventoryStockAction: state.counterReducer["inventoryStockAction"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUpdateContainerInventory: propsData => dispatch(GitAction.CallUpdateContainerInventory(propsData)),
        ClearInventoryAction: propsData => dispatch(GitAction.ClearInventoryAction(propsData)),
        CallViewInventoryByFilter: (propsData) => dispatch(GitAction.CallViewInventoryByFilter(propsData)),
    };
}

const INITIAL_STATE = {
    DataHeaders: [],
    DataRows: [],
    loadingData: false,
    isSubmit: false,
    errorReportData: [],
    openErrorReport: false,
    ContainerName: "",
    ContainerNameValidated: null,
    ContainerDate: convertDateTimeToString112Format(new Date()),
    ContainerDateValidated: true,
    IsReturnedDataError: false,
    openModalForAddStock: false,
    onDropFile: []
}

class DataManagement extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.toastRef = React.createRef();

        this.uploadHandler = this.uploadHandler.bind(this)
        this.publishData = this.publishData.bind(this)
        this.renderTableHeaders = this.renderTableHeaders.bind(this)
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onRemoveAttachment = this.onRemoveAttachment.bind(this)
        this.onViewErrorReport = this.onViewErrorReport.bind(this)
    }

    componentDidMount() {
        if (isObjectUndefinedOrNull(this.props.propsData)) {
            console.log("do nothing")
        } else {
            this.setState({
                ContainerName: this.props.propsData.ContainerName,
                ContainerDate: this.props.propsData.ContainerDate
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (isArrayNotEmpty(this.props.inventoryStockAction) && this.props.inventoryStockAction !== prevProps.inventoryStockAction && this.state.isSubmit) {
            this.dismissloadingToast()
            var row = this.props.propsData ? this.props.propsData : "empty"

            if (row !== "empty") {
                this.props.CallViewInventoryByFilter({ FilterColumn: "and T_Inventory_Stock.ContainerID=" + row.ContainerID })
            }

            //to handle if the inventoryStockAction return have error code
            var errorRow = []

            var existError = this.props.inventoryStockAction.map((result, index) => {
                if (result.StockID === "0") {
                    errorRow.push(result)
                }
                return result.StockID === "0"
            })

            if (existError.length > 0 && existError.includes(true)) {
                toast.error("Data is successfully update, but there are some data with error. Please check", {
                    autoClose: 3000, position: "top-center", transition: Flip, theme: "dark"
                })
                this.setState({ IsReturnedDataError: true, errorReportData: errorRow, openErrorReport: !this.state.openErrorReport, isSubmit: false })

            } else {
                toast.success(this.props.inventoryStockAction[0].ReturnMsg, {
                    autoClose: 2000, position: "top-center", transition: Flip, theme: "dark"
                })
                const fileDelete = this.state.onDropFile ? this.state.onDropFile[0].name : ""
                this.onRemoveAttachment(fileDelete)
                this.setState({ IsReturnedDataError: false, isSubmit: false })
            }
            this.props.ClearInventoryAction()
        }
    }

    loadingToast = () => this.toastRef.current = toast.loading("The data is submitting.", { autoClose: 2000, position: "top-center" })
    dismissloadingToast = () => toast.dismiss(this.toastRef.current);

    uploadHandler = (files) => {
        if (isArrayNotEmpty(files)) {
            const excelFile = files[0]
            const fileExt = getFileExtension(excelFile.name)

            if (getFileTypeByExtension(fileExt) === 'excel') {
                this.setState({ loadingData: true, onDropFile: files })
                const reader = new FileReader();
                reader.onload = (evt) => {
                    /* Parse data */
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                    this.processData(data);
                };
                reader.readAsBinaryString(excelFile);
            }
        }
    }

    onRemoveAttachment(item) {
        this.setState({ DataHeaders: [], DataRows: [] })
    }

    onViewErrorReport() {
        this.setState({ errorReportData: this.state.DataRows.filter(x => x.isInvalid === true), openErrorReport: !this.state.openErrorReport })
    }

    processData(dataString) {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        const rows = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length === headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] === '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] === '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j])
                        obj[headers[j]] = d;
                }

                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    rows.push(obj);
                }
            }
        }

        // prepare columns list from headers
        const columns = headers.map(c => ({
            name: c,
            selector: c,
        }));

        if (rows.length > 0) {
            rows.map(row => {
                row["isInvalid"] = (isStringNullOrEmpty(row["Tracking No"]) || (row["ContainerDate"] !== this.props.propsData.ContainerDate) || (row["ContainerName"] !== this.props.propsData.ContainerName))
            })
        }
        this.setState({ DataHeaders: columns.filter(x => x.name !== ""), DataRows: rows.filter(x => x[columns[0].name] !== ""), loadingData: false })
    }

    publishData() {
        const { DataRows, ContainerName, ContainerNameValidated, ContainerDate, ContainerDateValidated } = this.state
        if (isArrayNotEmpty(DataRows)) {
            let TrackingNo = ""
            for (let index = 0; index < DataRows.length; index++) {
                TrackingNo += (isStringNullOrEmpty(DataRows[index]["Tracking No"])) ? "-" : DataRows[index]["Tracking No"].trim();
                if (index !== DataRows.length - 1) {
                    TrackingNo += ",";
                }
            }
            let object = {
                TrackingNum: TrackingNo,
                ContainerID: this.props.propsData.ContainerID

            }
            this.loadingToast()
            // toast.loading("The data is submitting.", { autoClose: 2000, position: "top-center" })
            this.setState({ isSubmit: true })
            this.props.CallUpdateContainerInventory(object)
        }
    }

    renderTableHeaders = () => {
        const { DataHeaders, IsReturnedDataError } = this.state
        let headers = []

        if (IsReturnedDataError) {
            let obj = {
                id: "TrackingNo",
                align: 'left',
                disablePadding: false,
                label: "TrackingNo",
            }
            headers.push(obj)
        } else {
            DataHeaders.filter(x => x.name !== "").map((el, index) => {
                let obj = {
                    id: el.name,
                    align: 'left',
                    disablePadding: false,
                    label: el.name,
                }
                headers.push(obj)
            })
        }
        return headers
    }

    renderTableRows = (data, index) => {
        const fontsize = '9pt'
        const { DataHeaders, IsReturnedDataError } = this.state
        return (
            <>
                {
                    IsReturnedDataError ?
                        (
                            <TableCell key={"tc_" + index} align="left" sx={{ fontSize: fontsize, bgcolor: '#FFD700' }} onClick={(e) => this.ErrorRowClick(e, data)}>{data.TrackingNumber}</TableCell>

                        ) :
                        (
                            DataHeaders.filter(x => x.name !== "").map((el, index) => {
                                return (<TableCell key={"tc_" + index} align="left" sx={{ fontSize: fontsize, bgcolor: (data.isInvalid === true) ? '#FFD700' : "#ffffff" }}>{data[el.name]}</TableCell>)
                            })
                        )

                }
            </>
        )
    }

    ErrorRowClick = (event, data) => {
        this.setState({ openModalForAddStock: true, selectedRow: data })
    }

    render() {
        const { DataHeaders, DataRows, loadingData, isSubmit, IsReturnedDataError, openModalForAddStock, selectedRow } = this.state
        const isDataExtracted = DataHeaders.length > 0 || DataRows.length > 0
        const invalidRowCount = DataRows.filter(x => x.isInvalid === true).length

        return (
            <div>
                <div className="container">
                    <Dropzone
                        placeholder={{
                            text: "Drag and Drop Excel here, or click to select file",
                            fontSize: '16px'
                        }}
                        acceptedFormats={".xls, .xlsx, .csv"}
                        styles={{ height: isDataExtracted ? '10vh' : loadingData ? '70vh' : '80vh' }}
                        onChange={this.uploadHandler}
                        onRemoveAttachment={this.onRemoveAttachment}
                        maxFiles={1}
                        imageStyles={{
                            display: 'inline-flex',
                            borderRadius: 2,
                            border: '1px solid #eaeaea',
                            marginBottom: 4,
                            marginRight: 4,
                            width: 60,
                            height: 60,
                            padding: 2,
                            boxSizing: 'border-box'
                        }}
                    />
                    {
                        loadingData &&
                        <Box sx={{ width: '100%' }}>
                            <div><i>Loading data, please wait...</i></div>
                            <LinearProgress sx={{ height: 15 }} />
                        </Box>
                    }
                </div>
                {
                    isDataExtracted &&
                    <div>
                        <TableComponents
                            tableTopRight={
                                <div className="d-flex">
                                    {
                                        invalidRowCount > 0 &&
                                        <IconButton size="medium" variant="contained" color="error" onClick={() => this.onViewErrorReport()}>
                                            <ReportIcon />
                                        </IconButton>
                                    }
                                    <Button
                                        onClick={() => this.publishData()}
                                        variant="contained"
                                        endIcon={<PublishIcon />}
                                        disabled={(invalidRowCount > 0 || isSubmit === true)}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            }
                            tableOptions={{
                                dense: true,
                                tableOrderBy: 'asc',
                                sortingIndex: "Error",
                                stickyTableHeader: true,
                                stickyTableHeight: (getWindowDimensions().screenHeight * 0.6),
                            }}
                            paginationOptions={[50, 100, 250, { label: 'All', value: -1 }]}
                            tableHeaders={this.renderTableHeaders()}
                            tableRows={{
                                renderTableRows: this.renderTableRows,
                                checkbox: false,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            selectedIndexKey={isArrayNotEmpty(DataHeaders) ? DataHeaders[0].name : ""}
                            Data={DataRows}
                            headerColor={'rgb(200, 200, 200)'}
                        />
                    </div>
                }
                <ModalPopOut fullScreen={true} open={this.state.openErrorReport} handleToggleDialog={() => this.onViewErrorReport()} title="Error Report" showAction={false}>
                    <TableComponents
                        tableOptions={{
                            dense: true,
                            tableOrderBy: 'asc',
                            sortingIndex: "Error",
                            stickyTableHeader: true,
                            stickyTableHeight: (getWindowDimensions().screenHeight * 0.6),
                        }}
                        paginationOptions={[50, 100, 250, { label: 'All', value: -1 }]}
                        tableHeaders={this.renderTableHeaders()}
                        tableRows={{
                            renderTableRows: this.renderTableRows,
                            checkbox: false,
                            checkboxColor: "primary",
                            onRowClickSelect: false,
                            headerColor: 'rgb(200, 200, 200)'
                        }}
                        selectedIndexKey={isArrayNotEmpty(DataHeaders) ? DataHeaders[0].name : ""}

                        Data={this.state.errorReportData}
                        fullScreen={true}
                    />
                </ModalPopOut>
                <ModalPopOut fullScreen={true} open={openModalForAddStock} handleToggleDialog={() => { this.setState({ openModalForAddStock: !openModalForAddStock }) }} title=" Report" showAction={false}>
                    <WarehouseStock selectedRow={selectedRow} />
                </ModalPopOut>

            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DataManagement));