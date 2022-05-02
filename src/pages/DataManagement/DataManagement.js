import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from "react-router";
import Dropzone from "../../components/Dropzone/Dropzone"
import * as XLSX from 'xlsx';
import { isArrayNotEmpty, getFileExtension, getWindowDimensions, getFileTypeByExtension, isStringNullOrEmpty, convertDateTimeToString112Format, extractNumberFromStrings } from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import PublishIcon from '@mui/icons-material/Publish';
import ReportIcon from '@mui/icons-material/Report';
import { toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { ModalPopOut } from "../../components/modal/Modal";
import ResponsiveDatePickers from '../../components/datePicker/datePicker';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import moment from 'moment';

function mapStateToProps(state) {
    return {
        stockApproval: state.counterReducer["stockApproval"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallInsertStockByPost: propsData => dispatch(GitAction.CallInsertStockByPost(propsData)),
        CallResetUpdatedStockDetail: () => dispatch(GitAction.CallResetUpdatedStockDetail()),
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
}

class DataManagement extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.uploadHandler = this.uploadHandler.bind(this)
        this.publishData = this.publishData.bind(this)
        this.renderTableHeaders = this.renderTableHeaders.bind(this)
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onRemoveAttachment = this.onRemoveAttachment.bind(this)
        this.onViewErrorReport = this.onViewErrorReport.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
        this.onContainerNameChange = this.onContainerNameChange.bind(this)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (isArrayNotEmpty(this.props.stockApproval)) {
            if (this.props.stockApproval[0].ReturnVal == 0) {
                this.props.CallResetUpdatedStockDetail()
                toast.error(this.props.stockApproval[0].ReturnMsg, { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark", onClose: () => { this.setState(INITIAL_STATE) } })
            }
            else {
                this.props.CallResetUpdatedStockDetail()
                toast.success("Data is uploaded successfully", { autoClose: 2000, position: "top-center", transition: Flip, theme: "dark", onClose: () => this.props.history.push('/StockGoods') })
                this.setState(INITIAL_STATE)
            }
        }
    }

    uploadHandler = (files) => {
        if (isArrayNotEmpty(files)) {
            const excelFile = files[0]
            const fileExt = getFileExtension(excelFile.name)

            if (getFileTypeByExtension(fileExt) === 'excel') {
                this.setState({ loadingData: true })
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
                row["isInvalid"] = (isStringNullOrEmpty(row["Tracking No"]) || isStringNullOrEmpty(row["Member"]) || isStringNullOrEmpty(row["Division"]))
            })
        }
        this.setState({ DataHeaders: columns.filter(x => x.name !== ""), DataRows: rows.filter(x => x[columns[0].name] !== ""), loadingData: false })
    }

    publishData() {
        const { DataRows, ContainerName, ContainerNameValidated, ContainerDate, ContainerDateValidated } = this.state
        if (isArrayNotEmpty(DataRows)) {
            let Courier = ""
            let TrackingNo = ""
            let Weight = ""
            let Depth = ""
            let Width = ""
            let Height = ""
            let Item = ""
            let Member = ""
            let Division = ""
            let StockDate = ""
            let PackagingDate = ""
            let AdditionalCost = ""
            let Remarks = ""
            for (let index = 0; index < DataRows.length; index++) {
                Courier += (isStringNullOrEmpty(DataRows[index]["Courier"])) ? "-" : DataRows[index]["Courier"].trim();
                TrackingNo += (isStringNullOrEmpty(DataRows[index]["Tracking No"])) ? "-" : DataRows[index]["Tracking No"].trim();
                Weight += (isStringNullOrEmpty(DataRows[index]["Weight"])) ? "0" : DataRows[index]["Weight"];
                Depth += (isStringNullOrEmpty(DataRows[index]["Depth"])) ? "0" : DataRows[index]["Depth"];
                Height += (isStringNullOrEmpty(DataRows[index]["Height"])) ? "0" : DataRows[index]["Height"];
                Width += (isStringNullOrEmpty(DataRows[index]["Width"])) ? "0" : DataRows[index]["Width"];
                Item += (isStringNullOrEmpty(DataRows[index]["Item"])) ? "-" : DataRows[index]["Item"].trim();
                Member += (isStringNullOrEmpty(DataRows[index]["Member"])) ? "-" : DataRows[index]["Member"].trim();
                Division += (isStringNullOrEmpty(DataRows[index]["Division"])) ? "-" : DataRows[index]["Division"].trim();
                StockDate += (isStringNullOrEmpty(DataRows[index]["Stock Date"])) ? "-" : moment(DataRows[index]["Stock Date"].trim(), 'YYYY-MM-DD HH:mm:ss', false).format('YYYY/MM/DD HH:mm:ss')
                PackagingDate += (isStringNullOrEmpty(DataRows[index]["Packaging Date"])) ? "-" : moment(DataRows[index]["Packaging Date"].trim(), 'DD/MM/YYYY HH:mm:ss', false).format('YYYY/MM/DD HH:mm:ss')
                AdditionalCost += (isStringNullOrEmpty(DataRows[index]["Additional Cost"])) ? "-" : DataRows[index]["Additional Cost"].trim();
                Remarks += (isStringNullOrEmpty(DataRows[index]["Remarks"])) ? "-" : DataRows[index]["Remarks"];
                if (index !== DataRows.length - 1) {
                    Courier += ",";
                    TrackingNo += ",";
                    Weight += ",";
                    Depth += ",";
                    Width += ",";
                    Height += ",";
                    Item += ",";
                    Member += ",";
                    Division += ",";
                    StockDate += ",";
                    PackagingDate += ",";
                    AdditionalCost += ",";
                    Remarks += ",";
                }
            }


            let object = {
                USERCODE: Member,
                TRACKINGNUMBER: TrackingNo,
                PRODUCTWEIGHT: Weight,
                PRODUCTHEIGHT: Height,
                PRODUCTWIDTH: Width,
                PRODUCTDEEP: Depth,
                AREACODE: Division,
                ITEM: Item,
                STOCKDATE: StockDate,
                PACKAGINGDATE: PackagingDate,
                REMARK: Remarks,
                EXTRACHARGE: AdditionalCost,
                CONTAINERNAME: ContainerName,
                CONTAINERDATE: convertDateTimeToString112Format(ContainerDate)
            }



            if (ContainerNameValidated === false || ContainerNameValidated === null || ContainerDateValidated === false) {
                this.setState({ ContainerNameValidated: false })
                toast.warning("Container Name or Container Date is empty or invalid.", { autoClose: 2000, position: "top-center", theme: "dark" })
            }
            else {
                toast.success("The data is submitting.", { autoClose: 2000, position: "top-center" })
                this.setState({ isSubmit: true })
                console.log("object", object)
                this.props.CallInsertStockByPost(object)
            }
        }
    }

    renderTableHeaders = () => {
        const { DataHeaders } = this.state
        let headers = []
        // eslint-disable-next-line array-callback-return
        DataHeaders.filter(x => x.name !== "").map((el, index) => {
            let obj = {
                id: el.name,
                align: 'left',
                disablePadding: false,
                label: el.name,
            }
            headers.push(obj)
        })
        return headers
    }

    renderTableRows = (data, index) => {
        const fontsize = '9pt'
        const { DataHeaders } = this.state
        return (
            <>
                {
                    DataHeaders.filter(x => x.name !== "").map((el, index) => {
                        return (<TableCell key={"tc_" + index} align="left" sx={{ fontSize: fontsize, bgcolor: (data.isInvalid === true) ? '#FFD700' : "#ffffff" }}>{data[el.name]}</TableCell>)
                    })
                }
            </>
        )
    }

    onDateChange = (e, type) => {
        this.setState({ ContainerDate: isStringNullOrEmpty(e) ? "Invalid Date" : e, ContainerDateValidated: (!isStringNullOrEmpty(e) && e !== "Invalid Date") })
    }

    onContainerNameChange = (e) => {
        const { value } = e.target
        this.setState({ ContainerName: isStringNullOrEmpty(value) ? value : value.toUpperCase(), ContainerNameValidated: !isStringNullOrEmpty(value) })
    }

    render() {
        const { DataHeaders, DataRows, loadingData, isSubmit } = this.state
        const isDataExtracted = DataHeaders.length > 0 || DataRows.length > 0
        const invalidRowCount = DataRows.filter(x => x.isInvalid === true).length
        return (
            <div>
                <div className="container">
                    <div className="d-flex px-3">
                        <div className="d-md-flex my-2" style={{ marginLeft: 'auto' }}>
                            <TextField
                                label="Container Name"
                                variant="standard"
                                name="ContainerName"
                                value={this.state.ContainerName}
                                required
                                sx={{ width: '200px', }}
                                onChange={this.onContainerNameChange}
                                helperText={this.state.ContainerNameValidated !== null && !this.state.ContainerNameValidated ? "This is required" : ""}
                                error={this.state.ContainerNameValidated !== null && !this.state.ContainerNameValidated}
                            />
                            <div style={{ width: '200px', marginLeft: 5 }}>
                                <ResponsiveDatePickers variant="standard" title="Stock In Date" value={this.state.ContainerDate} onChange={(e) => this.onDateChange(e)} />
                                {!this.state.ContainerDateValidated && <FormHelperText className='text-danger' >Invalid Date</FormHelperText>}
                            </div>
                        </div>
                    </div>
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
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DataManagement));