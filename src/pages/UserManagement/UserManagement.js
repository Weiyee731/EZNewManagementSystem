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
import { getWindowDimensions, isArrayNotEmpty } from "../../tools/Helpers";
import SearchBar from "../../components/SearchBar/SearchBar"
import AlertDialog from "../../components/modal/Modal";
import { toast } from "react-toastify";
import CsvDownloader from 'react-csv-downloader';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

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
            long: 0.00
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
        this.onAddButtonClick = this.onAddButtonClick.bind(this)
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

    render() {

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
                    <hr />
                    <TableComponents
                        // table settings 
                        tableTopLeft={<h3 style={{ fontWeight: 700 }}>Users</h3>}  // optional, it can pass as string or as children elements
                        // tableTopRight={this.renderTableActionButton}                 // optional, it will brings the elements to the table's top right corner

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
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserManagement));