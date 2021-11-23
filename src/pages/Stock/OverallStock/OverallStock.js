import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";

import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import SearchBar from "../../../components/SearchBar/SearchBar"
import TableComponents from "../../../components/TableComponents/TableComponents";
import ToggleTabsComponent from "../../../components/ToggleTabsComponent/ToggleTabComponents";
import AlertDialog from "../../../components/modal/Modal";
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";

function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllStock: (propsData) => dispatch(GitAction.CallFetchAllStock(propsData)),
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

const INITIAL_STATE = {
    filteredList: null,
    openRemarkModal: false,

    formValue: {
        TrackingNumber: "",
        TrackingNumberVerified: null,

        MemberNumber: "",
        MemberNumberVerified: null,

        Division: "",

        Depth: "",
        DepthVerified: null,

        Width: "",
        WidthVerified: null,

        Height: "",
        HeightVerified: null,

        Weight: "",
        WeightVerified: null,

        AdditionalCost: "",
        AdditionalCostVerified: null,

        Remarks: "",
        RemarksVerified: null,
    }
}

class OverallStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallFetchAllStock({ USERID: 1 })
        this.changeTab = this.changeTab.bind(this)
        this.onAddButtonClick = this.onAddButtonClick.bind(this)
        this.handleRemarkModal = this.handleRemarkModal.bind(this)
        this.handleUpdateRemark = this.handleUpdateRemark.bind(this)
        this.handleFormInput = this.handleFormInput.bind(this)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.filteredList === null && isArrayNotEmpty(this.props.stocks)) {
            const { stocks } = this.props
            console.log(stocks)
            this.setState({
                filteredList: (isStringNullOrEmpty(stocks.ReturnVal) && stocks.ReturnVal == 0) ? [] : stocks
            })

        }
    }

    changeTab = (key) => {
        switch (key) {
            case "All":
                this.setState({
                    filteredList: this.props.stocks
                })
                break;

            case "Unchecked":
                this.setState({
                    filteredList: this.props.stocks.filter(x => x.TrackingStatus === "Pending")
                })
                break;

            case "Checked":
                this.setState({
                    filteredList: this.props.stocks.filter(x => x.TrackingStatus === "Completed")
                })
                break;

            case "Collected":
                this.setState({
                    filteredList: this.props.stocks.filter(x => x.TrackingStatus === "Pending")
                })
                break;

            default:
                break;
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

    onTableRowClick = (event, row) => {
        let tempFormValue = this.state.formValue

        tempFormValue.TrackingNumber = row.TrackingNumber;
        tempFormValue.TrackingNumberVerified = !isStringNullOrEmpty(row.TrackingNumber);
        tempFormValue.MemberNumber = row.UserCode;
        tempFormValue.MemberNumberVerified = !isStringNullOrEmpty(row.UserCode);
        tempFormValue.Depth = row.ProductDimensionDeep;
        tempFormValue.DepthVerified = !isStringNullOrEmpty(row.ProductDimensionDeep) && !isNaN(row.ProductDimensionDeep)
        tempFormValue.Width = row.ProductDimensionWidth;
        tempFormValue.WidthVerified = !isStringNullOrEmpty(row.ProductDimensionWidth) && !isNaN(row.ProductDimensionDeep)
        tempFormValue.Height = row.ProductDimensionHeight;
        tempFormValue.HeightVerified = !isStringNullOrEmpty(row.ProductDimensionHeight) && !isNaN(row.ProductDimensionHeight)
        tempFormValue.Weight = row.ProductWeight;
        tempFormValue.WeightVerified = !isStringNullOrEmpty(row.ProductWeight) && !isNaN(row.ProductWeight)
        tempFormValue.AdditionalCost = isStringNullOrEmpty(row.AdditionalCost) ? "" : row.AdditionalCost;
        tempFormValue.AdditionalCostVerified = isStringNullOrEmpty(row.AdditionalCost) || !isNaN(row.AdditionalCost)
        tempFormValue.Remarks = isStringNullOrEmpty(row.Remark) ? "" : row.Remark;
        tempFormValue.RemarksVerified = true;

        this.setState({
            openRemarkModal: true,
            formValue: tempFormValue,
        })
    }

    onAddButtonClick = () => {
        console.log('add button')
    }

    onDeleteButtonClick = (items) => {
        console.log('delete button')
        console.log(items)
    }

    handleRemarkModal = () => {
        this.setState({ openRemarkModal: !this.state.openRemarkModal })
    }

    handleUpdateRemark = () => {
        const { formValue } = this.state
        console.log('update remark')
        console.log(formValue)
    }

    handleFormInput = (e) => {
        const { formValue } = this.state
        const { value, name } = e.target
        let tempForm = formValue
        switch (name) {
            case "TrackingNumber":
                tempForm.TrackingNumber = value
                tempForm.TrackingNumberVerified = !isStringNullOrEmpty(value)
                this.setState({ formValue: tempForm })
                break;

            case "MemberNumber":
                tempForm.MemberNumber = value
                tempForm.MemberNumberVerified = !isStringNullOrEmpty(value)
                this.setState({ formValue: tempForm })
                break;

            case "Division":
                console.log(e)
                console.log(value)
                tempForm.Division = value
                this.setState({ formValue: tempForm })
                break;

            case "Depth":
                tempForm.Depth = value
                tempForm.DepthVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Width":
                tempForm.Width = value
                tempForm.WidthVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Height":
                tempForm.Height = value
                tempForm.HeightVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Weight":
                tempForm.Weight = value
                tempForm.WeightVerified = !isStringNullOrEmpty(value) && !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "AdditionalCost":
                tempForm.AdditionalCost = value
                tempForm.AdditionalCostVerified = isStringNullOrEmpty(value) || !isNaN(value)
                this.setState({ formValue: tempForm })
                break;

            case "Remarks":
                tempForm.Remarks = value
                tempForm.RemarksVerified = true
                this.setState({ formValue: tempForm })
                break;

            default:
                break;
        }
    }


    render() {
        const ToggleTabs = [
            { children: "All", key: "All" },
            { children: "Unchecked", key: "Unchecked" },
            { children: "Checked", key: "Checked" },
            { children: "Collected", key: "Collected" },
        ]

        const { filteredList, formValue } = this.state

        return (
            <div className="container-fluid">
                <SearchBar />
                <hr />
                <ToggleTabsComponent Tabs={ToggleTabs} size="small" onChange={this.changeTab} />
                <TableComponents
                    // table settings 
                    tableOptions={{
                        dense: true,                // optional, default is false
                        tableOrderBy: 'asc',        // optional, default is asc
                        sortingIndex: "TrackingNo",        // require, it must the same as the desired table header
                        stickyTableHeader: true,    // optional, default is true
                        stickyTableHeight: (getWindowDimensions().screenHeight * 0.7),     // optional, default is 300px
                    }}
                    paginationOptions={[50, 100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={headCells}        //required
                    tableRows={{
                        renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: false,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                    }}
                    selectedIndexKey={"StockID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={isArrayNotEmpty(filteredList) ? filteredList : []}                                  // required, the data that listing in the table
                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                    onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                />

                <AlertDialog
                    open={this.state.openRemarkModal}              // required, pass the boolean whether modal is open or close
                    handleToggleDialog={this.handleRemarkModal}  // required, pass the toggle function of modal
                    handleConfirmFunc={this.handleUpdateRemark}    // required, pass the confirm function 
                    showAction={true}                           // required, to show the footer of modal display
                    title={""}                                  // required, title of the modal
                    buttonTitle={"Update"}                         // required, title of button
                    singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"md"}
                >
                    <div className="py-md-3 py-1">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <TextField variant="standard" size="small" fullWidth label="Tracking Number" name="TrackingNumber" value={formValue.TrackingNumber} onChange={this.handleFormInput} error={!formValue.TrackingNumberVerified} />
                                {!formValue.TrackingNumberVerified && <FormHelperText sx={{ color: 'red' }} id="TrackingNumber-error-text">Invalid</FormHelperText>}
                            </div>
                            <div className="col-12 col-md-4">
                                <TextField variant="standard" size="small" fullWidth label="Member Number" name="MemberNumber" value={formValue.MemberNumber} onChange={this.handleFormInput} error={!formValue.MemberNumberVerified} />
                                {!formValue.MemberNumberVerified && <FormHelperText sx={{ color: 'red' }} id="MemberNumber-error-text">Invalid</FormHelperText>}
                            </div>
                            <div className="col-12 col-md-4">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel id="Division-label">Division</InputLabel>
                                    <Select
                                        labelId="Division"
                                        id="Division"
                                        name="Division"
                                        value={formValue.Division}
                                        onChange={this.handleFormInput}
                                        label="Division"
                                    >
                                        <MenuItem value={"DU"} >DU</MenuItem>
                                        <MenuItem value={"KU"} >KU</MenuItem>
                                        <MenuItem value={"SU"} >SKU</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 col-sm-3">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Depth">Depth</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Depth"
                                        value={formValue.Depth}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">m</InputAdornment>}
                                        error={!formValue.DepthVerified}
                                    />
                                    {!formValue.DepthVerified && <FormHelperText sx={{ color: 'red' }} id="Depth-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-4 col-sm-3">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Width">Width</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Width"
                                        value={formValue.Width}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">m</InputAdornment>}
                                        error={!formValue.WidthVerified}
                                    />
                                    {!formValue.WidthVerified && <FormHelperText sx={{ color: 'red' }} id="Width-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-4 col-sm-3">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Height">Height</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Height"
                                        value={formValue.Height}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">m</InputAdornment>}
                                        error={!formValue.HeightVerified}
                                    />
                                    {!formValue.HeightVerified && <FormHelperText sx={{ color: 'red' }} id="Height-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-12 col-sm-3">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="Weight">Weight</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="Weight"
                                        value={formValue.Weight}
                                        onChange={this.handleFormInput}
                                        endAdornment={<InputAdornment position="start">KG</InputAdornment>}
                                        error={!formValue.WeightVerified}
                                    />
                                    {!formValue.WeightVerified && <FormHelperText sx={{ color: 'red' }} id="Weight-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 col-sm-3">
                                <FormControl variant="standard" size="small" fullWidth>
                                    <InputLabel htmlFor="AdditionalCost">Additional Cost</InputLabel>
                                    <Input
                                        variant="standard"
                                        size="small"
                                        name="AdditionalCost"
                                        value={formValue.AdditionalCost}
                                        onChange={this.handleFormInput}
                                        startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                                        error={!formValue.AdditionalCostVerified}
                                    />
                                    {!formValue.AdditionalCostVerified && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className="col-6 col-sm-9">
                                <TextField variant="standard" size="small" fullWidth label="Remarks" name="Remarks" value={formValue.Remarks} onChange={this.handleFormInput} multiline maxRows={3} />
                            </div>
                        </div>
                    </div>
                </AlertDialog>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverallStock);