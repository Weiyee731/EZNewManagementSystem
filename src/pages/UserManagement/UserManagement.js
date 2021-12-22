import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableComponents from "../../components/TableComponents/TableComponents"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from "../../components/SearchBar/SearchBar"
import AlertDialog from "../../components/modal/Modal";
import { ModalPopOut } from "../../components/modal/Modal";
import { toast } from "react-toastify";
import CsvDownloader from 'react-csv-downloader';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PublishIcon from '@mui/icons-material/Publish';
import ReportIcon from '@mui/icons-material/Report';
import Dropzone from "../../components/Dropzone/Dropzone"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { isArrayNotEmpty, getFileExtension, getWindowDimensions, getFileTypeByExtension, isStringNullOrEmpty, convertDateTimeToString112Format, extractNumberFromStrings } from "../../tools/Helpers";
import * as XLSX from 'xlsx';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '65%',
    height: '50%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
};

function mapStateToProps(state) {
    return {
        user: state.counterReducer["user"],
        registrationReturn: state.counterReducer["registrationReturn"],
        userAreaCode: state.counterReducer["userAreaCode"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserProfile: () => dispatch(GitAction.CallUserProfile()),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
        CallUserRegistration: (propData) => dispatch(GitAction.CallUserRegistration(propData))
    };
}

const headCells = [
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
        id: 'UserContactNo',
        align: 'center',
        disablePadding: false,
        label: 'Contact No.',
    },
    {
        id: 'UserEmailAddress',
        align: 'center',
        disablePadding: false,
        label: 'E-Mail',
    },
];
class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddModalOpen: false,
            UserListing: [],
            selectedRows: [],
            UserListingfiltered: [],
            name: "",
            username: "",
            password: "",
            areaId: 0,
            code: "",
            email: "",
            contact: "",
            address: "",
            lat: 0.00,
            long: 0.00,
            addWithCSVModalOpen: false,

            // dropzone
            DataHeaders: [],
            DataRows: [],
            loadingData: false,
            isSubmit: false,
            errorReportData: [],
            openErrorReport: false,
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
        this.onAddButtonClick = this.onAddButtonClick.bind(this)

        //dropzone
        this.uploadHandler = this.uploadHandler.bind(this)
        this.onRemoveAttachment = this.onRemoveAttachment.bind(this)
        this.renderDropzoneTableHeaders = this.renderDropzoneTableHeaders.bind(this)
        this.renderDropzoneTableRows = this.renderDropzoneTableRows.bind(this)
        this.publishData = this.publishData.bind(this)
        //dropzone

        this.props.CallUserProfile();
        this.props.CallUserAreaCode();
    }

    componentDidMount() {
        if (this.props.user.length !== this.state.UserListing.length) {
            if (this.props.user !== undefined && this.props.user[0] !== undefined) {
                this.setState({ UserListing: this.props.user, UserListingfiltered: this.props.user });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user.length !== this.props.user.length) {
            if (this.props.user !== undefined && this.props.user[0] !== undefined) {
                this.setState({ UserListing: this.props.user, UserListingfiltered: this.props.user });
            }
        } else {
            if (prevProps.user.length !== this.state.UserListing.length) {
                this.setState({ UserListing: prevProps.user, UserListingfiltered: prevProps.user });
            }
        }

        if (prevProps.registrationReturn !== this.props.registrationReturn) {
            if (this.props.registrationReturn[0].ReturnVal == 1) {
                this.onAddButtonClick()
                alert(`${this.props.registrationReturn[0].ReturnMsg}`)
                toast.success(`${this.props.registrationReturn[0].ReturnMsg}`)
            }
        }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.UserCode}
                </TableCell>
                <TableCell align="center">{data.AreaCode}</TableCell>
                <TableCell align="center">{data.Fullname}</TableCell>
                <TableCell align="center">{data.UserContactNo}</TableCell>
                <TableCell align="center">{data.UserEmailAddress}</TableCell>
            </>
        )
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add new user">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }

    onTableRowClick = (event, row) => {
        this.props.history.push(`/UserDetail/${row.UserID}/${row.UserCode}`)
    }

    onAddButtonClick = () => {
        this.setState({ AddModalOpen: !this.state.AddModalOpen });
    }

    onDeleteButtonClick = () => {
        const { selectedRows } = this.state
        console.log('delete button', selectedRows)
    }

    onTextFieldOnChange = (e) => {
        switch (e.target.name) {
            case "name":
                this.setState({
                    name: e.target.value
                })
                break;

            case "code":
                this.setState({
                    code: e.target.value
                })
                break;

            case "username":
                this.setState({
                    username: e.target.value
                })
                break;

            case "password":
                this.setState({
                    password: e.target.value
                })
                break;

            case "email":
                this.setState({
                    email: e.target.value
                })
                break;

            case "contact":
                this.setState({
                    contact: e.target.value
                })
                break;

            case "areaCode":
                this.setState({
                    areaId: e.target.value
                })
                break;

            case "address":
                this.setState({
                    address: e.target.value
                })
                break;

            default:
                break;
        }
    }

    onSubmitNewUser = () => {
        this.props.CallUserRegistration(this.state)
    }

    onSelectItem = (item) => {
        this.setState({
            selectedRows: item
        })
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <IconButton onClick={(event) => { this.onDeleteButtonClick() }}>
                    <DeleteIcon color="error" />
                </IconButton>
            </div>
        )
    }

    // dropzone -- START
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

        if (rows.length > 0) {
            rows.map(row => {
                row["isInvalid"] = (isStringNullOrEmpty(row["Tracking No"]) || isStringNullOrEmpty(row["Member"]) || isStringNullOrEmpty(row["Division"]))
            })
        }
        this.setState({ DataHeaders: columns.filter(x => x.name !== ""), DataRows: rows.filter(x => x[columns[0].name] !== ""), loadingData: false })
    }

    onRemoveAttachment(item) {
        this.setState({ DataHeaders: [], DataRows: [] })
    }

    renderDropzoneTableHeaders = () => {
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

    renderDropzoneTableRows = (data, index) => {
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

    publishData() {
        const { DataRows } = this.state
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
                StockDate += (isStringNullOrEmpty(DataRows[index]["Stock Date"])) ? "-" : convertDateTimeToString112Format(DataRows[index]["Stock Date"].trim(), true)
                PackagingDate += (isStringNullOrEmpty(DataRows[index]["Packaging Date"])) ? "-" : convertDateTimeToString112Format(DataRows[index]["Packaging Date"].trim(), true)
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
            }

            toast.success("The data is submitting.", { autoClose: 2000, position: "top-center" })
            this.setState({ isSubmit: true })
        }
        else{
            toast.error("Please attach a CSV file for submission.", { autoClose: 2000, position: "top-center", theme: "dark" })
        }
    }

    // dropzone -- FINISH

    render() {
        // dropzone
        const { DataHeaders, DataRows, loadingData, isSubmit } = this.state
        const isDataExtracted = DataHeaders.length > 0 || DataRows.length > 0
        const invalidRowCount = DataRows.filter(x => x.isInvalid === true).length
        // dropzone

        const renderButtonOnTableTopRight = () => {
            return (
                <div>
                    <Tooltip title="Add new user via csv">
                        <IconButton size="medium" sx={{ border: "2px solid #818181", color: "#797979" }} onClick={() => this.setState({ addWithCSVModalOpen: true })}>
                            <UploadFileIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }

        const onChange = (e) => {
            const FilterArr = this.state.UserListing.filter((searchedItem) => searchedItem.UserCode.toLowerCase().includes(e.target.value))
            this.setState({ UserListingfiltered: FilterArr });
        }

        return (
            <>
                <div className="w-100 container-fluid">
                    <div className="row d-flex">
                        <div className="col-md-10 col-10 m-auto">
                            <SearchBar onChange={onChange} />
                        </div>
                        <div className="col-md-2 col-2 m-auto">
                            <div className="d-flex w-100">
                                <CsvDownloader
                                    filename="user-list"
                                    extension=".xls"
                                    separator=","
                                    columns={headCells}
                                    datas={isArrayNotEmpty(this.state.UserListingfiltered) ? this.state.UserListingfiltered : []}>
                                    <DownloadForOfflineIcon color="primary" sx={{ fontSize: 45 }}></DownloadForOfflineIcon>
                                </CsvDownloader>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <TableComponents
                        // table settings 
                        tableTopLeft={<h3 style={{ fontWeight: 700 }}>User Management</h3>}  // optional, it can pass as string or as children elements
                        tableTopRight={renderButtonOnTableTopRight()}                 // optional, it will brings the elements to the table's top right corner

                        tableOptions={{
                            dense: false,                // optional, default is false
                            tableOrderBy: 'asc',        // optional, default is asc
                            sortingIndex: "UserCode",        // require, it must the same as the desired table header
                            stickyTableHeader: true,    // optional, default is true
                            stickyTableHeight: getWindowDimensions().screenHeight * 0.8,     // optional, default is 300px
                        }}
                        paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                        tableHeaders={headCells}        //required
                        tableRows={{
                            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                            checkbox: true,                          // optional, by default is true
                            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                            onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        }}
                        selectedIndexKey={"UserID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                        Data={this.state.UserListingfiltered}                                  // required, the data that listing in the table
                        onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                        onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                        actionIcon={this.renderTableActionButton()}
                        onSelectRow={this.onSelectItem}
                    />
                </div>
                <div>
                    <AlertDialog
                        open={this.state.AddModalOpen}              // required, pass the boolean whether modal is open or close
                        handleToggleDialog={this.onAddButtonClick}  // required, pass the toggle function of modal
                        handleConfirmFunc={this.onSubmitNewUser}   // required, pass the confirm function 
                        showAction={true}                           // required, to show the footer of modal display
                        title={"Add new user"}                      // required, title of the modal
                        buttonTitle={"Add"}                         // required, title of button
                        singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
                    >
                        <Box component="form" noValidate sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Full Name"
                                        autoFocus
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="code"
                                        label="User Code"
                                        name="code"
                                        autoComplete="family-name"
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        type={'text'}
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        name="password"
                                        type={'password'}
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="contact"
                                        label="Contact"
                                        id="contact"
                                        autoComplete="contact"
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="areaCode">Area Code</InputLabel>
                                        <Select
                                            id="areaCode"
                                            value={this.state.areaId}
                                            label="Area Code"
                                            name="areaCode"
                                            required
                                            placeholder="Select an area code"
                                            onChange={this.onTextFieldOnChange}
                                        >
                                            <MenuItem disabled value={0}>Select an area code</MenuItem>
                                            {this.props.userAreaCode.length > 0 &&
                                                this.props.userAreaCode.map((i, id) => {
                                                    return (
                                                        <MenuItem
                                                            id="areaCode"
                                                            key={id}
                                                            value={i.UserAreaID}
                                                        >
                                                            {i.AreaName} ({i.AreaCode})
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="address"
                                        label="Address"
                                        id="address"
                                        autoComplete="address"
                                        onChange={this.onTextFieldOnChange}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </AlertDialog>
                </div>

                {/* Dropzone - BEGIN */}
                <div>
                    <ModalPopOut
                        open={this.state.addWithCSVModalOpen}        // required, pass the boolean whether modal is open or close
                        handleToggleDialog={() => { this.setState({ addWithCSVModalOpen: false }) }}                // required, pass the toggle function of modal
                        handleConfirmFunc={() => { this.publishData() }}               // required, pass the confirm function 
                        showAction={true}                           // required, to show the footer of modal display
                        title={"Add new user with csv"}             // required, title of the modal
                        fullScreen={true}                         // required, to decide whether to show a single full width button or 2 buttons
                    >
                        <div className="container-fluid">
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
                                            stickyTableHeight: (getWindowDimensions().screenHeight * 0.45),
                                        }}
                                        paginationOptions={[50, 100, 250, { label: 'All', value: -1 }]}
                                        tableHeaders={this.renderDropzoneTableHeaders()}
                                        tableRows={{
                                            renderTableRows: this.renderDropzoneTableRows,
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
                    </ModalPopOut>
                </div>
                {/* Dropzone - FINISH */}
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserManagement));