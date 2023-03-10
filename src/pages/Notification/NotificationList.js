import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import UndoIcon from '@mui/icons-material/Undo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableComponents from "../../components/TableComponents/TableComponents"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from "../../components/SearchBar/SearchBar"
import AlertDialog from "../../components/modal/Modal";
import { ModalPopOut } from "../../components/modal/Modal";
import { toast, Flip } from 'react-toastify';
import CsvDownloader from 'react-csv-downloader';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PublishIcon from '@mui/icons-material/Publish';
import ReportIcon from '@mui/icons-material/Report';
import Dropzone from "../../components/Dropzone/Dropzone"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { isArrayNotEmpty, getFileExtension, getWindowDimensions, getFileTypeByExtension, isStringNullOrEmpty } from "../../tools/Helpers";
import * as XLSX from 'xlsx';
import DescriptionFunction from "../../components/editor/editor";
import { RowingRounded } from "@mui/icons-material";

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
    notification: state.counterReducer["notification"]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallViewINotification: (props) => dispatch(GitAction.CallViewINotification(props)),
    CallAddNotification: (props) => dispatch(GitAction.CallAddNotification(props)),
    CallUpdateNotification: (props) => dispatch(GitAction.CallUpdateNotification(props)),
    CallUpdateNotificationStatus: (props) => dispatch(GitAction.CallUpdateNotificationStatus(props)),
    CallDeleteNotification: (props) => dispatch(GitAction.CallDeleteNotification(props))
  };
}

const headCells = [
  {
    id: 'No',
    align: 'left',
    disablePadding: false,
    label: 'No',
  },
  {
    id: 'NotificationTitle',
    align: 'left',
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'NotificationStatus',
    align: 'center',
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'NotificationDesc',
    align: 'center',
    disablePadding: false,
    label: 'Content',
  },
  {
    id: 'CreatedDate',
    align: 'center',
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'DeleteButton',
    align: 'center',
    disablePadding: false,
    label: '',
  },
];
class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AddModalOpen: false,
      UserListing: [],
      selectedRows: [],
      DataHeaders: [],
      DataRows: [],
      loadingData: false,
      isSubmit: false,
      errorReportData: [],
      openErrorReport: false,
      searchArea: "All",
      ButtonTitle: "PUBLISH",
      NotificationID: 0,
      NotificationStatusID: 1,
      NotificationTitle: "",
      NotificationTitleValidated: false,
      NotificationDesc: "",
      searchKeywords: "",
      filteredList: [],
      NotificationDescValidated: false,
      isFiltered: false
    }
    this.renderTableRows = this.renderTableRows.bind(this)
    this.onTableRowClick = this.onTableRowClick.bind(this)
    this.onAddButtonClick = this.onAddButtonClick.bind(this)
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this)
    this.onChangeButtonClick = this.onChangeButtonClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderDropzoneTableHeaders = this.renderDropzoneTableHeaders.bind(this)
    this.renderDropzoneTableRows = this.renderDropzoneTableRows.bind(this)
    this.props.CallViewINotification({ NotificationStatusID: 0 })
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.notification.length > 0 && this.props.notification !== prevProps.notification) {
      this.setState({ filteredList: this.props.notification })
    }
  }

  renderTableRows = (data, index) => {
    return (
      <>
        <TableCell onClick={(e) => this.onTableRowClick(e, data)} align="left">{(index + 1)}</TableCell>
        <TableCell onClick={(e) => this.onTableRowClick(e, data)} align="left">{data.NotificationTitle}</TableCell>
        <TableCell onClick={(e) => this.onTableRowClick(e, data)} align="left"><div dangerouslySetInnerHTML={{ __html: data.NotificationStatus }}></div></TableCell>
        <TableCell onClick={(e) => this.onTableRowClick(e, data)} align="center"><div dangerouslySetInnerHTML={{ __html: data.NotificationDesc }}></div></TableCell>
        <TableCell onClick={(e) => this.onTableRowClick(e, data)} align="left">{data.CreatedDate}</TableCell>
        <TableCell align="left"><Tooltip sx={{ marginLeft: 5 }} title={"Delete " + data.NotificationTitle} ><IconButton onClick={(e) => this.onDeleteButtonClick(e, data)} ><CancelIcon /></IconButton></Tooltip>
          {data.NotificationStatusID === 2 ? <Tooltip sx={{ marginLeft: 5 }} title={"Change " + data.NotificationTitle} ><IconButton onClick={(e) => this.onChangeButtonClick(e, data)} ><UndoIcon /></IconButton></Tooltip> : null}
        </TableCell>
      </>
    )
  }

  renderTableActionButton = () => {
    return (
      <div className="d-flex">
        <Tooltip sx={{ marginLeft: 5 }} title="Add Nt">
          <IconButton >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }

  onTableRowClick = (e, row) => {
    this.setState({ AddModalOpen: this.state.user !== null && !this.state.AddModalOpen, NotificationTitle: row.NotificationTitle, NotificationDesc: row.NotificationDesc, NotificationID: row.NotificationID, ButtonTitle: "UPDATE", selectedRows: row, NotificationTitleValidated: !isStringNullOrEmpty(row.NotificationDesc), NotificationDescValidated: !isStringNullOrEmpty(row.NotificationTitle), NotificationStatusID: row.NotificationStatusID });
  }

  onAddButtonClick = () => {
    this.setState({ AddModalOpen: this.state.user !== null && !this.state.AddModalOpen, NotificationTitle: "", NotificationDesc: "", NotificationID: 0, ButtonTitle: "PUBLISH", selectedRows: [], NotificationTitleValidated: false, NotificationDescValidated: false, NotificationStatusID: 1 });
  }

  onDeleteButtonClick = (event, row) => {
    this.props.CallDeleteNotification({
      NotificationID: row.NotificationID,
      ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
    })
  }

  onChangeButtonClick = (event, row) => {
    this.props.CallUpdateNotificationStatus({
      NotificationID: row.NotificationID,
      NotificationStatusID: 1,
      ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
    })

  }

  onTextFieldOnChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case "NotificationTitle":
        this.setState({
          NotificationTitle: value,
          NotificationTitleValidated: !isStringNullOrEmpty(value)
        })
        break;
      case "NotificationDesc":
        this.setState({
          NotificationDesc: value,
          NotificationDescValidated: !isStringNullOrEmpty(value)
        })
        break;
      default:
        break;
    }
  }

  onSubmit = () => {
    const { userAreaCode } = this.props
    const {
      NotificationID,
      NotificationTitle,
      NotificationDesc,
      NotificationTitleValidated,
      NotificationDescValidated,
      ButtonTitle,
      selectedRows
    } = this.state

    const isValidated = (
      NotificationTitleValidated &&
      NotificationDescValidated
    )
    if (isValidated) {
      if (NotificationID === 0) {
        this.props.CallAddNotification({
          NotificationTitle: NotificationTitle,
          NotificationDesc: NotificationDesc,
          NotificationStatusID: 2,
          ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
      } else {
        this.props.CallUpdateNotification({
          NotificationID: NotificationID,
          NotificationTitle: NotificationTitle,
          NotificationDesc: NotificationDesc,
          NotificationStatusID: 2,
          ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
      }
      this.setState({ AddModalOpen: this.state.user !== null && !this.state.AddModalOpen })
    }

  }

  onSave = () => {
    const { userAreaCode } = this.props
    const {
      NotificationID,
      NotificationTitle,
      NotificationDesc,
      NotificationTitleValidated,
      NotificationDescValidated,
      ButtonTitle,
      selectedRows
    } = this.state

    const isValidated = (
      NotificationTitleValidated &&
      NotificationDescValidated
    )
    if (isValidated) {
      if (NotificationID === 0) {
        this.props.CallAddNotification({
          NotificationTitle: NotificationTitle,
          NotificationDesc: NotificationDesc,
          NotificationStatusID: 1,
          ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
      } else {
        this.props.CallUpdateNotification({
          NotificationID: NotificationID,
          NotificationTitle: NotificationTitle,
          NotificationDesc: NotificationDesc,
          NotificationStatusID: 1,
          ModifyBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
      }
      this.setState({ AddModalOpen: this.state.user !== null && !this.state.AddModalOpen })
    }

  }

  onSelectItem = (item) => {
    this.setState({ selectedRows: item })
  }

  onViewErrorReport() {
    this.setState({ errorReportData: this.state.DataRows.filter(x => x.isInvalid === true), openErrorReport: this.state.user !== null && !this.state.openErrorReport })
  }

  renderDropzoneTableHeaders = () => {
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

  handleChange(value, editor) {  // Pass child back to parents like this  
    this.setState({
      NotificationDesc: value,
      NotificationDescValidated: !isStringNullOrEmpty(value)
    }, () => {
      console.log(this.state.NotificationDesc)
    });
  }

  handleSearchInput(value) {
    if (isStringNullOrEmpty(value)) {
      this.setState({ searchKeywords: value, filteredList: this.props.notification })
    } else {
      var tempList = this.props.notification.filter(x => (x.NotificationTitle.toLowerCase().includes(value.toLowerCase())))
      this.setState({ searchKeywords: value, filteredList: tempList, isFiltered: true })
    }
  }

  render() {
    const { DataHeaders, DataRows, loadingData, isSubmit } = this.state
    const renderButtonOnTableTopRight = () => {
      return (
        <div className="d-flex">
          <Tooltip title="Add Notice">
            <IconButton size="medium" sx={{ border: "2px solid #0074ea", color: "#0074ea", marginRight: 1 }} onClick={this.onAddButtonClick}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    }

    return (
      <>
        <div className="w-100 container-fluid">
          <div className="row" style={{ padding: "10pt 10pt 10pt" }}>
            <SearchBar
              id="SearchBarMain"
              placeholder=""
              label="Enter title to search"
              onChange={(e) => this.handleSearchInput(e.target.value)}
              className="searchbar-input mb-auto"
              disableButton={true}
              tooltipText="Search with current data"
              value={this.state.searchKeywords}
            />
          </div>
          <TableComponents
            tableTopLeft={<h3 style={{ fontWeight: 700 }}>Notifications</h3>}  // optional, it can pass as string or as children elements
            tableTopRight={renderButtonOnTableTopRight()}                 // optional, it will brings the elements to the table's top right corner
            tableOptions={{
              dense: false,                // optional, default is false
              tableOrderBy: 'asc',        // optional, default is asc
              sortingIndex: "UserCode",        // require, it must the same as the desired table header
              stickyTableHeader: true,    // optional, default is true
              stickyTableHeight: getWindowDimensions().screenHeight * 0.8,     // optional, default is 300px
            }}
            paginationOptions={[50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
            tableHeaders={headCells}        //required
            tableRows={{
              renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
              checkbox: false,                          // optional, by default is true
              checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
              onRowClickSelect: false,                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
              headerColor: 'rgb(200, 200, 200)'
            }}
            selectedIndexKey={"UserID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
            Data={this.state.isFiltered ? this.state.filteredList : this.props.notification}                                  // required, the data that listing in the table// optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
            onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
            actionIcon={this.renderTableActionButton()}
            onSelectRow={this.onSelectItem}
          />
        </div>
        <div>
          <AlertDialog
            open={this.state.AddModalOpen}              // required, pass the boolean whether modal is open or close
            handleToggleDialog={() => this.setState({ AddModalOpen: this.state.user !== null && !this.state.AddModalOpen })}  // required, pass the toggle function of modal
            handleConfirmFunc={this.onSubmit}    // required, pass the confirm function 
            handleSaveFunc={this.onSave}
            DraftInd={this.state.NotificationStatusID === 1 ? true : false}
            showAction={true}                           // required, to show the footer of modal display
            title={this.state.ButtonTitle + " NOTICE"}                      // required, title of the modal
            buttonTitle={this.state.NotificationStatusID === 1 ? "PUBLISH" : this.state.ButtonTitle}
            buttonSaveTitle={"SAVE"}                         // required, title of button
            singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
            handleBackdrop={() => this.setState({ AddModalOpen: this.state.user !== null && !this.state.AddModalOpen, NotificationTitle: "", NotificationDesc: "", NotificationID: 0, ButtonTitle: "PUBLISH", selectedRows: [], NotificationTitleValidated: false, NotificationDescValidated: false, NotificationStatusID: 1 })}
            maxWidth={"md"}
          >
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    required
                    fullWidth
                    id="NotificationTitle"
                    label="Notification Title"
                    name="NotificationTitle"
                    onChange={this.onTextFieldOnChange}
                    size="small"
                    value={this.state.NotificationTitle}
                    error={this.state.NotificationTitleValidated !== null && !this.state.NotificationTitleValidated}
                    helperText={this.state.NotificationTitleValidated !== null && !this.state.NotificationTitleValidated ? "Required" : ""}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <label htmlFor="NewsDesc">News Content</label>
                  <DescriptionFunction
                    post_content={this.state.NotificationDesc}
                    postId={this.state.NewsId}
                    handleChange={this.handleChange}
                    content={this.state.NotificationDesc}
                    imageFileUrl="notice"
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NotificationList));