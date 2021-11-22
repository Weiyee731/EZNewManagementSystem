import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableComponents from "../../../components/TableComponents/TableComponents"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import SearchBar from "../../../components/SearchBar/SearchBar"

function mapStateToProps(state) {
    return {
        user: state.counterReducer["user"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserProfile: () => dispatch(GitAction.CallUserProfile()),
    };
}

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
class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddModalOpen: false,
            UserListing: [],
            UserListingfiltered: []
        }
        this.renderTableRows = this.renderTableRows.bind(this)
        this.onTableRowClick = this.onTableRowClick.bind(this)
        this.props.CallUserProfile();
    }



    componentDidMount() {
        console.log("www")
        if (this.props.user.length !== this.state.UserListing.length) {
            if (this.props.user !== undefined && this.props.user[0] !== undefined) {
                this.setState({ UserListing: this.props.user, UserListingfiltered: this.props.user });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("www")
        if (prevProps.user.length !== this.props.user.length) {
            console.log(this.props.user !== undefined && this.props.user[0] !== undefined)
            if (this.props.user !== undefined && this.props.user[0] !== undefined) {
                this.setState({ UserListing: this.props.user, UserListingfiltered: this.props.user });
            }
        } else {
            if (prevProps.user.length !== this.state.UserListing.length) {
                this.setState({ UserListing: prevProps.user, UserListingfiltered: prevProps.user });
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
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
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
        const onChange = (e) => {
            const FilterArr = this.state.UserListing.filter((searchedItem) =>searchedItem.UserCode.toLowerCase().includes(e.target.value))
            this.setState({ UserListingfiltered: FilterArr });
        }

        return (
            <>
                <div className="w-100 container-fluid">
                    <SearchBar onChange={onChange} />
                    <TableComponents
                        // table settings 
                        tableTopLeft={<h3 style={{ fontWeight: 700 }}>Users</h3>}  // optional, it can pass as string or as children elements
                        tableTopRight={this.renderTableActionButton}                 // optional, it will brings the elements to the table's top right corner

                        tableOptions={{
                            dense: false,                // optional, default is false
                            tableOrderBy: 'asc',        // optional, default is asc
                            sortingIndex: "fat",        // require, it must the same as the desired table header
                            stickyTableHeader: true,    // optional, default is true
                            stickyTableHeight: 300,     // optional, default is 300px
                        }}
                        paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                        tableHeaders={headCells}        //required
                        tableRows={{
                            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                            checkbox: false,                          // optional, by default is true
                            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                            onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        }}
                        selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                        Data={this.state.UserListingfiltered}                                  // required, the data that listing in the table
                        onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                        onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                        onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                    />
                </div>
                <div>
                    <Modal
                        open={this.state.AddModalOpen}
                        onClose={this.handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500 }}>
                        <Box sx={style} component="main" maxWidth="xs">
                            <Typography component="h1" variant="h5">Sign up</Typography>
                            <Box component="form" noValidate sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="Full Name"
                                            required
                                            fullWidth
                                            id="Fullname"
                                            label="Full Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="UserCode"
                                            label="User Code"
                                            name="UserCode"
                                            autoComplete="family-name"
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="Contact"
                                            label="Contact"
                                            id="contact"
                                            autoComplete="contact"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="Address"
                                            label="Address"
                                            id="address"
                                            autoComplete="address"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Add New User
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);