import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";
import Dropzone from "../../components/Dropzone/Dropzone"
import * as XLSX from 'xlsx';
import { isArrayNotEmpty, getFileExtension, getWindowDimensions, getFileTypeByExtension } from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import PublishIcon from '@mui/icons-material/Publish';

function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
    };
}


const INITIAL_STATE = {
    DataHeaders: [],
    DataRows: [],
    loadingData: false,
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
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {

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
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
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

        this.setState({ DataHeaders: columns.filter(x => x.name !== ""), DataRows: rows.filter(x => x[columns[0].name] !== ""), loadingData: false })
    }

    publishData() {
        const { DataHeaders, DataRows } = this.state
        console.log(DataRows)
    }

    renderTableHeaders = () => {
        const { DataHeaders } = this.state
        let headers = []
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
                        return (<TableCell align="left" sx={{ fontSize: fontsize }}>{data[el.name].toString()}</TableCell>)
                    })
                }
            </>
        )
    }

    render() {
        const { DataHeaders, DataRows, loadingData } = this.state
        const isDataExtracted = DataHeaders.length > 0 || DataRows.length > 0

        return (
            <div>
                <div className="container">
                    <Dropzone
                        placeholder={{
                            text: "Drag and Drop Excel here, or click to select file",
                            fontSize: '16px'
                        }}
                        acceptedFormats={".xls, .xlsx, .csv"}
                        styles={{ height: isDataExtracted ? '10vh' : loadingData ? '70vh' : '90vh' }}
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
                                <Button onClick={() => this.publishData()} variant="contained" endIcon={<PublishIcon />}> Upload  </Button>
                            }
                            tableOptions={{
                                dense: true,
                                tableOrderBy: 'asc',
                                sortingIndex: isArrayNotEmpty(DataHeaders) ? DataHeaders[0].name : "",
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
                        />

                    </div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataManagement);