import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBar from "../../../components/SearchBar/SearchBar"
import TableComponents from "../../../components/TableComponents/TableComponents";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Stack from '@mui/material/Stack';
import AlertDialog from "../../../components/modal/Modal";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";

function mapStateToProps(state) {
    return {
        stocks: state.counterReducer["stocks"],
        userAreaCode: state.counterReducer["userAreaCode"],
        transactionReturn: state.counterReducer["transactionReturn"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchAllStock: (propsData) => dispatch(GitAction.CallFetchAllStock(propsData)),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
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
    openProformaModal: false,
    openDeliveryModal: false,
    selectedItems: [],
    selectedProductPrice: [],
    selectedUserID: null,
    selectedDeliveryType: null,
    totalVolumeSelected: null,
    totalWeightSelected: null,
    searchCategory: "All",

    formValue: {
        TrackingNumber: "",
        TrackingNumberVerified: null,

        MemberNumber: "",
        MemberNumberVerified: null,

        Division: "1",

        Depth: "",
        DepthVerified: null,

        Width: "",
        WidthVerified: null,

        Height: "",
        HeightVerified: null,

        Weight: "",
        WeightVerified: null,

        AdditionalCost: []
    }
}

class CreateInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallFetchAllStock({ USERID: 2 })
        this.props.CallUserAreaCode()
        this.onAddButtonClick = this.onAddButtonClick.bind(this)
        this.handleRemarkModal = this.handleRemarkModal.bind(this)
        this.handleUpdateRemark = this.handleUpdateRemark.bind(this)
        this.handleFormInput = this.handleFormInput.bind(this)
        this.handleAdditionalCostInputs = this.handleAdditionalCostInputs.bind(this)
        this.RenderAdditionalCost = this.RenderAdditionalCost.bind(this)
        this.handleRemoveAdditionalCosts = this.handleRemoveAdditionalCosts.bind(this)
        this.removeAllAdditionalCost = this.removeAllAdditionalCost.bind(this)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        const { stocks } = this.props
        if (this.state.filteredList === null && isArrayNotEmpty(stocks)) {
            this.setState({
                filteredList: stocks[0].ReturnVal == '0' ? [] : stocks
            })
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
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductWeight ? data.ProductWeight.toFixed(2) : ""}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductDimensionDeep ? data.ProductDimensionDeep.toFixed(2) : ""}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductDimensionWidth ? data.ProductDimensionWidth.toFixed(2) : ""}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductDimensionHeight ? data.ProductDimensionHeight.toFixed(2) : ""}</TableCell>
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
        tempFormValue.Division = Number(row.UserAreaID)

        this.setState({
            openRemarkModal: true,
            formValue: tempFormValue,
        })
    }

    onAddButtonClick = () => {
        console.log('add button')
    }

    onDeleteButtonClick = (items) => {
        let arr = []
        console.log('delete button')
        console.log(items)
        items.map((item) => {
            console.log(item.UserID)
            arr.push(item.UserID)
        })
        console.log(items[0].UserID)
        console.log((arr.filter((el) => el === items[0].UserID)).length === arr.length)
        if ((arr.filter((el) => el === items[0].UserID)).length === arr.length) {
            this.setState({
                selectedItems: items,
                selectedUserID: items[0].UserID
            })
            this.handleDeliveryModal()
        } else {
            alert("Please select the tracking records with the same user")
        }
    }
    
    handleSelectDeliveryType = (i) => {
        const { selectedItems, selectedUserID } = this.state

        let mCube = 0
        let weight = 0
        this.state.selectedItems.map((item) => {
            weight = weight + item.ProductWeight
            mCube = mCube + ((item.ProductDimensionDeep * item.ProductDimensionWidth * item.ProductDimensionHeight))
        })
        this.handleDeliveryModal()
        this.props.history.push({
            pathname: '/ProformaList',
            selectedType: i,
            state: selectedItems,
            userId: selectedUserID,
            totalVolume: mCube,
            totalWeight: weight
        })
    }

    handleDeliveryModal = () => {
        this.setState({
            openDeliveryModal: !this.state.openDeliveryModal
        })
    }

    handleRemarkModal = () => {
        this.setState({ openRemarkModal: !this.state.openRemarkModal })
    }

    handleUpdateRemark = () => {
        const { formValue } = this.state
        console.log('update remark')
        console.log(formValue)
    }


    handleProductPrice = (item) => {
        console.log(item)
        // this.setState({
        //     selectedProductPrice: item
        // })
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

            default:
                break;
        }
    }

    handleAdditionalCostInputs = (e, index) => {
        let validated;
        const { value, name } = e.target
        let tempFormValue = this.state.formValue
        let additionalCostItems = tempFormValue.AdditionalCost

        switch (name) {
            case "AdditionalChargedRemark":
                const chargedAmount = additionalCostItems[index].chargedAmount
                validated = !(isStringNullOrEmpty(value)) && !(isStringNullOrEmpty(chargedAmount)) && !isNaN(chargedAmount) && (Number(value) > 0)
                additionalCostItems[index].chargedRemark = value
                additionalCostItems[index].validated = validated
                tempFormValue.AdditionalCost = additionalCostItems

                this.setState({ formValue: tempFormValue })
                break;

            case "AdditionalChargedAmount":
                const chargedRemark = additionalCostItems[index].chargedRemark
                validated = !(isStringNullOrEmpty(value)) && !(isStringNullOrEmpty(chargedRemark)) && !isNaN(e.target.value) && (Number(value) > 0)
                additionalCostItems[index].chargedAmount = value
                additionalCostItems[index].validated = validated
                tempFormValue.AdditionalCost = additionalCostItems

                this.setState({ formValue: tempFormValue })
                break;

            default:
        }
    }

    RenderAdditionalCost = () => {
        const { formValue } = this.state
        let tempFormValue = formValue
        let additionalCostItems = (!isObjectUndefinedOrNull(tempFormValue.AdditionalCost)) ? formValue.AdditionalCost : []
        let obj = {
            chargedRemark: "",
            chargedAmount: "",
            validated: null
        }

        if (additionalCostItems.length > 0) {
            if (additionalCostItems[additionalCostItems.length - 1].validated)
                additionalCostItems.push(obj)
        }
        else
            additionalCostItems.push(obj)

        tempFormValue.AdditionalCost = additionalCostItems
        this.setState({ formValue: tempFormValue })
    }

    handleRemoveAdditionalCosts(index) {
        const { formValue } = this.state
        let tempFormValue = formValue
        let additionalCostItems = (!isObjectUndefinedOrNull(tempFormValue.AdditionalCost)) ? tempFormValue.AdditionalCost : []

        if (additionalCostItems.length > 0) {
            additionalCostItems.splice(index, 1)
            console.log(tempFormValue)
            this.setState({ formValue: tempFormValue })
        }

    }

    removeAllAdditionalCost() {
        let tempFormValue = this.state.formValue
        tempFormValue.AdditionalCost = []
        this.setState({ formValue: tempFormValue })
    }

    handleSearchCategory(e) {
        this.setState({ searchCategory: e.target.value })
    }

    render() {
        const { filteredList, formValue, openDeliveryModal, openRemarkModal, searchCategory } = this.state
        console.log(filteredList)
        return (
            <div className="container-fluid">
                <div className="row d-flex">
                    <div className="col-2 m-auto">
                        <div className="w-100 d-flex filter-dropdown">
                            <Select
                                labelId="search-filter-category"
                                id="search-filter-category"
                                value={searchCategory}
                                label="Search By"
                                onChange={this.handleSearchCategory}
                                size="small"
                                IconComponent={FilterListOutlinedIcon}
                                className="w-75"
                                placeholder="filter by"
                            >
                                <MenuItem key="search_all" value="All">All</MenuItem>
                                <MenuItem key="search_tracking" value="Tracking">KU</MenuItem>
                                <MenuItem key="search_member" value="Member">SKU</MenuItem>
                                <MenuItem key="search_container" value="Container">MSU</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="col-md-10 col-12 m-auto">
                        <SearchBar id="" placeholder="Enter Member No, Tracking No or Container No to search" buttonOnClick={() => this.onSearch()} onChange={this.handleSearchInput} />
                    </div>
                </div>
                <hr />
                {/* <ToggleTabsComponent Tabs={ToggleTabs} size="small" onChange={this.changeTab} /> */}
                <TableComponents
                    // table settings 
                    tableTopLeft={<h3 style={{ fontWeight: 700 }}>Proforma Invoice</h3>}
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
                        checkbox: true,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                    }}
                    selectedIndexKey={"StockID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={isArrayNotEmpty(filteredList) ? filteredList : []}                                  // required, the data that listing in the table
                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
                    onActionButtonClick={this.onAddButtonClick}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    onDeleteButtonClick={this.onDeleteButtonClick}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
                    actionIcon={<DriveFileRenameOutlineIcon />}
                    extraInfo={true}
                />

                <AlertDialog
                    open={openRemarkModal}              // required, pass the boolean whether modal is open or close
                    handleToggleDialog={this.handleRemarkModal}  // required, pass the toggle function of modal
                    handleConfirmFunc={this.handleUpdateRemark}    // required, pass the confirm function 
                    showAction={true}                           // required, to show the footer of modal display
                    title={formValue.TrackingNumber}                                  // required, title of the modal
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
                                        {
                                            isArrayNotEmpty(this.props.userAreaCode) && this.props.userAreaCode.map((el, idx) => {
                                                return <MenuItem value={el.UserAreaID} >{el.AreaName + " - " + el.AreaCode}</MenuItem>
                                            })
                                        }
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
                        <div className="my-1 row">
                            <div className="col-12">
                                <Button className="my-1 w-100" color="success" variant="contained" size="small" onClick={() => { this.RenderAdditionalCost() }}>Add Additional Costs</Button>
                            </div>

                        </div>
                        {
                            isArrayNotEmpty(formValue.AdditionalCost) && formValue.AdditionalCost.map((el, idx) => {
                                return (
                                    <div className="row">
                                        <div className="col-6 col-sm-8">
                                            <TextField
                                                variant="standard"
                                                size="small"
                                                fullWidth
                                                label={"Add. Chg. " + (idx + 1)}
                                                name="AdditionalChargedRemark"
                                                value={el.chargedRemark}
                                                onChange={(e) => { this.handleAdditionalCostInputs(e, idx) }}
                                                error={!el.validated}
                                            />
                                            {!el.validated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid</FormHelperText>}
                                        </div>
                                        <div className="col-4 col-sm-3">
                                            <FormControl variant="standard" size="small" fullWidth>
                                                <InputLabel htmlFor="AdditionalChargedAmount"></InputLabel>
                                                <Input
                                                    variant="standard"
                                                    size="small"
                                                    name="AdditionalChargedAmount"
                                                    value={el.chargedAmount}
                                                    onChange={(e) => { this.handleAdditionalCostInputs(e, idx) }}
                                                    startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                                                    error={!el.validated}
                                                />
                                                {!el.validated && <FormHelperText sx={{ color: 'red' }} id="AdditionalCost-error-text">Invalid Amount</FormHelperText>}

                                            </FormControl>
                                        </div>
                                        <div className="col-2 col-sm-1 d-flex">
                                            <IconButton className='m-auto' color="primary" size="small" aria-label="remove-additional-cost" component="span" onClick={() => this.handleRemoveAdditionalCosts(idx)}>
                                                <DeleteIcon size="inherit" />
                                            </IconButton>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            isArrayNotEmpty(formValue.AdditionalCost) &&
                            <div className="mt-3 col-12">
                                <Button className="my-1 w-100" color="error" variant="contained" size="small" onClick={() => { this.removeAllAdditionalCost() }} startIcon={<DeleteIcon />}>Clear Additional Costs</Button>
                            </div>
                        }
                    </div>
                </AlertDialog>

                <AlertDialog
                    open={openDeliveryModal}              // required, pass the boolean whether modal is open or close
                    handleToggleDialog={this.handleDeliveryModal}  // required, pass the toggle function of modal
                    handleConfirmFunc={this.handleUpdateRemark}    // required, pass the confirm function 
                    showAction={false}                           // required, to show the footer of modal display
                    title={"Delivery Type"}                                  // required, title of the modal
                    buttonTitle={"Select"}                         // required, title of button
                    singleButton={true}                         // required, to decide whether to show a single full width button or 2 buttons
                    maxWidth={"xs"}
                >
                    <Stack
                        spacing={2}
                        direction="row"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center'
                        }}
                    >
                        <Button
                            variant="text"
                            onClick={() => this.handleSelectDeliveryType(1)}
                        >
                            Self Pickup
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => this.handleSelectDeliveryType(2)}
                        >
                            Consolidate
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => this.handleSelectDeliveryType(3)}
                        >
                            Small Item
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => this.handleSelectDeliveryType(4)}
                        >
                            Large Item
                        </Button>
                    </Stack>
                </AlertDialog>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateInvoice));