import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from "react-router";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { isArrayNotEmpty, isStringNullOrEmpty, isObjectUndefinedOrNull } from "../../../tools/Helpers";

function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
        userAreaCode: state.counterReducer["userAreaCode"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
    };
}

const INITIAL_STATE = {

    TrackingNumberVerified: null,
    MemberNumberVerified: null,
    DepthVerified: null,
    WidthVerified: null,
    HeightVerified: null,
    WeightVerified: null,
    formData: ""
}

class EditStockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallUserAreaCode();
        this.state.formData = this.formValue;
        this.handleAdditionalCostInputs = this.handleAdditionalCostInputs.bind(this)
        this.RenderAdditionalCost = this.RenderAdditionalCost.bind(this)
        this.handleRemoveAdditionalCosts = this.handleRemoveAdditionalCosts.bind(this)
        this.removeAllAdditionalCost = this.removeAllAdditionalCost.bind(this)
    }
    formValue = this.props.data ? this.props.data : [];


    componentDidMount() {
        let additionalCharges = this.formValue.AdditionalCharges
        try { additionalCharges = JSON.parse(additionalCharges) } catch (e) { console.log(e); additionalCharges = [] }
        this.formValue.AdditionalCost = isObjectUndefinedOrNull(additionalCharges) ? [] : additionalCharges
        this.formValue.AdditionalCost.length > 0 && this.formValue.AdditionalCost.map((el, idx) => {
            el.validated = !(isStringNullOrEmpty(el.Charges)) && !(isStringNullOrEmpty(el.Value)) && !isNaN(el.Value) && (Number(el.Value) > 0)
        })

        this.state.TrackingNumberVerified = !isStringNullOrEmpty(this.formValue.TrackingNumber);
        this.state.MemberNumberVerified = !isStringNullOrEmpty(this.formValue.UserCode);
        this.state.DepthVerified = !isStringNullOrEmpty(this.formValue.ProductDimensionDeep) && !isNaN(this.formValue.ProductDimensionDeep)
        this.state.WidthVerified = !isStringNullOrEmpty(this.formValue.ProductDimensionWidth) && !isNaN(this.formValue.ProductDimensionDeep)
        this.state.HeightVerified = !isStringNullOrEmpty(this.formValue.ProductDimensionHeight) && !isNaN(this.formValue.ProductDimensionHeight)
        this.state.WeightVerified = !isStringNullOrEmpty(this.formValue.ProductWeight) && !isNaN(this.formValue.ProductWeight)

    }

    componentDidUpdate(prevProps, prevState) {

    }

    onTrigger = (event, statement) => {
        const value = event.target.value

        if (statement === "TrackingNumber") {
            this.setState({ TrackingNumberVerified: !isStringNullOrEmpty(value) })
            this.props.parentCallback({ "TrackingNumber": value });
            event.preventDefault();
        }
        if (statement === "UserCode") {
            this.setState({ MemberNumberVerified: !isStringNullOrEmpty(value) })
            this.props.parentCallback({ "UserCode": value });
            event.preventDefault();
        }
        if (statement === "ProductDimensionWidth") {
            this.setState({ WidthVerified: !isStringNullOrEmpty(value) && !isNaN(value) })
            this.props.parentCallback({ "ProductDimensionWidth": value });
            event.preventDefault();
        }
        if (statement === "ProductDimensionHeight") {
            this.setState({ HeightVerified: !isStringNullOrEmpty(value) && !isNaN(value) })
            this.props.parentCallback({ "ProductDimensionHeight": value });
            event.preventDefault();
        }
        if (statement === "ProductDimensionDeep") {
            this.setState({ DepthVerified: !isStringNullOrEmpty(value) && !isNaN(value) })
            this.props.parentCallback({ "ProductDimensionDeep": value });
            event.preventDefault();
        }
        if (statement === "ProductWeight") {
            this.setState({ WeightVerified: !isStringNullOrEmpty(value) && !isNaN(value) })
            this.props.parentCallback({ "ProductWeight": value });
            event.preventDefault();
        }
        if (statement === "UserAreaID") {
            this.props.parentCallback({ "AreaCode": value });
            event.preventDefault();
        }
        if (statement === "Item") {
            this.props.parentCallback({ "Item": value });
            event.preventDefault();
        }
        if (statement === "AdditionalCharges") {
            this.props.parentCallback({ "AdditionalCharges": value });
            event.preventDefault();
        }
        if (statement === "Remark") {
            this.props.parentCallback({ "Remark": value });
            event.preventDefault();
        }
        if (statement === "Item") {
            this.props.parentCallback({ "Item": value });
            event.preventDefault();
        }
    }

    handleAdditionalCostInputs = (e, index) => {
        let validated;
        const { value, name } = e.target
        let tempFormValue = this.formValue
        let additionalCostItems = tempFormValue.AdditionalCost

        switch (name) {
            case "AdditionalChargedRemark":
                const Value = additionalCostItems[index].Value
                validated = (!isStringNullOrEmpty(value)) && ((!isStringNullOrEmpty(Value)) && (!isNaN(Value) && (Number(Value) > 0)))
                additionalCostItems[index].Charges = value
                additionalCostItems[index].validated = validated
                tempFormValue.AdditionalCost = additionalCostItems

                this.setState({ formData: tempFormValue })
                this.props.parentCallback({ "AdditionalCharges": tempFormValue.AdditionalCost });
                break;

            case "AdditionalChargedAmount":
                const Charges = additionalCostItems[index].Charges
                validated = (!isStringNullOrEmpty(Charges)) && ((!isStringNullOrEmpty(value)) && (!isNaN(e.target.value) && (Number(value) > 0)))
                additionalCostItems[index].Value = value
                additionalCostItems[index].validated = validated
                tempFormValue.AdditionalCost = additionalCostItems

                this.setState({ formData: tempFormValue })
                this.props.parentCallback({ "AdditionalCharges": tempFormValue.AdditionalCost });
                break;

            default:
        }
    }

    RenderAdditionalCost = () => {
        // const { formValue } = this.state

        let tempFormValue = this.state.formData

        let additionalCostItems = (!isObjectUndefinedOrNull(tempFormValue.AdditionalCost)) ? this.formValue.AdditionalCost : []
        let obj = {
            Charges: "",
            Value: "",
            validated: null
        }

        if (additionalCostItems.length > 0) {
            if (additionalCostItems[additionalCostItems.length - 1].validated)
                additionalCostItems.push(obj)
        }
        else
            additionalCostItems.push(obj)

        tempFormValue.AdditionalCost = additionalCostItems
        // this.state.validation = tempFormValue;
        this.setState({ formData: tempFormValue })
    }

    handleRemoveAdditionalCosts(index) {
        // const { formValue } = this.state
        let tempFormValue = this.state.formData
        let additionalCostItems = (!isObjectUndefinedOrNull(tempFormValue.AdditionalCost)) ? tempFormValue.AdditionalCost : []

        if (additionalCostItems.length > 0) {
            additionalCostItems.splice(index, 1)
            // this.state.validation = tempFormValue;
            this.setState({ formData: tempFormValue })
        }
    }

    removeAllAdditionalCost() {
        let tempFormValue = this.formValue
        tempFormValue.AdditionalCost = []
        this.setState({ formData: tempFormValue })
    }

    render() {
        const formValue = this.state.formData ? this.state.formData : [];
        const ContainerDate = this.props.ContainerDate ? this.props.ContainerDate : [];
        const ContainerName = this.props.ContainerName ? this.props.ContainerName : [];
        const addOrder = this.props.addOrder;
        return (
            <div>
                <div className="py-md-3 py-1">
                    <div className="row">
                        <div className="col-12" style={{ fontSize: '9pt' }}>
                            <div className="clearfix">
                                <div className="float-start"> <b>Container: </b>{!isStringNullOrEmpty(ContainerName) ? ContainerName : " N/A "}  </div>
                                <div className="float-end"> <b>Container Date: </b> {!isStringNullOrEmpty(ContainerDate) ? ContainerDate : " N/A "}  </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-12 col-md-4">
                            <TextField variant="standard" size="small" fullWidth label="Tracking Number" name="TrackingNumber" defaultValue={formValue.TrackingNumber} onChange={(e) => this.onTrigger(e, "TrackingNumber")} error={!this.state.TrackingNumberVerified} />
                            {!this.state.TrackingNumberVerified && <FormHelperText sx={{ color: 'red' }} id="TrackingNumber-error-text">Invalid</FormHelperText>}
                        </div>
                        <div className="col-12 col-md-4">
                            <TextField variant="standard" size="small" fullWidth label="Member Number" name="MemberNumber" defaultValue={formValue.UserCode} onChange={(e) => this.onTrigger(e, "UserCode")} error={!this.state.MemberNumberVerified} />
                            {!this.state.MemberNumberVerified && <FormHelperText sx={{ color: 'red' }} id="MemberNumber-error-text">Invalid</FormHelperText>}
                        </div>
                        <div className="col-12 col-md-4">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel id="Division-label">Division</InputLabel>
                                <Select
                                    labelId="Division"
                                    id="Division"
                                    name="Division"
                                    defaultValue={formValue.AreaCode ? formValue.AreaCode : ""}
                                    onChange={(e) => this.onTrigger(e, "UserAreaID")}
                                    label="Division"
                                >
                                    {console.log(formValue)}
                                    {
                                        isArrayNotEmpty(this.props.userAreaCode) && this.props.userAreaCode.map((el, idx) => {
                                            return <MenuItem value={el.AreaCode} key={idx}>{el.AreaName + " - " + el.AreaCode}</MenuItem>
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
                                    defaultValue={formValue.ProductDimensionDeep}
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionDeep")}
                                    endAdornment={<InputAdornment position="start">cm</InputAdornment>}
                                    error={!this.state.DepthVerified}
                                />
                                {!this.state.DepthVerified && <FormHelperText sx={{ color: 'red' }} id="Depth-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className="col-4 col-sm-3">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel htmlFor="Width">Width</InputLabel>
                                <Input
                                    variant="standard"
                                    size="small"
                                    name="Width"
                                    defaultValue={formValue.ProductDimensionWidth}
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionWidth")}
                                    endAdornment={<InputAdornment position="start">cm</InputAdornment>}
                                    error={!this.state.WidthVerified}
                                />
                                {!this.state.WidthVerified && <FormHelperText sx={{ color: 'red' }} id="Width-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className="col-4 col-sm-3">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel htmlFor="Height">Height</InputLabel>
                                <Input
                                    variant="standard"
                                    size="small"
                                    name="Height"
                                    defaultValue={formValue.ProductDimensionHeight}
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionHeight")}
                                    endAdornment={<InputAdornment position="start">cm</InputAdornment>}
                                    error={!this.state.HeightVerified}
                                />
                                {!this.state.HeightVerified && <FormHelperText sx={{ color: 'red' }} id="Height-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className="col-12 col-sm-3">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel htmlFor="Weight">Weight</InputLabel>
                                <Input
                                    variant="standard"
                                    size="small"
                                    name="Weight"
                                    defaultValue={formValue.ProductWeight}
                                    onChange={(e) => this.onTrigger(e, "ProductWeight")}
                                    endAdornment={<InputAdornment position="start">KG</InputAdornment>}
                                    error={!this.state.WeightVerified}
                                />
                                {!this.state.WeightVerified && <FormHelperText sx={{ color: 'red' }} id="Weight-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                    </div>
                    {addOrder &&
                        <div className="row mt-2">
                            <div className="col-12">
                                {/* <Box sx={{ width: '100%' }}> */}
                                <TextField
                                    variant="standard"
                                    name="Item"
                                    label="Item"
                                    defaultValue={""}
                                    onChange={(e) => this.onTrigger(e, "Item")}
                                    fullWidth
                                />
                                {/* </Box> */}
                            </div>
                        </div>
                    }
                    <div className="my-1 row">
                        <div className="col-12">
                            <Button className="my-1 w-100" color="success" variant="contained" size="small" onClick={() => { this.RenderAdditionalCost() }}>Add Additional Costs</Button>
                        </div>
                    </div>
                    {
                        isArrayNotEmpty(formValue.AdditionalCost) && formValue.AdditionalCost.map((el, idx) => {
                            return (
                                <div className="row" key={idx}>
                                    <div className="col-6 col-sm-8">
                                        <TextField
                                            variant="standard"
                                            size="small"
                                            fullWidth
                                            label={"Add. Chg. " + (idx + 1)}
                                            name="AdditionalChargedRemark"
                                            value={el.Charges}
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
                                                value={el.Value}
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
                    <div className="row mt-2">
                        <div className="col-12">
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    variant="outlined"
                                    size="large"
                                    name="Remark"
                                    label="Remark"
                                    defaultValue={formValue.Remark}
                                    onChange={(e) => this.onTrigger(e, "Remark")}
                                    fullWidth
                                />
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditStockGoods));