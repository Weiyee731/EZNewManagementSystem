import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from "react-router";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";

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

}

class EditStockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallUserAreaCode();

        this.handleAdditionalCostInputs = this.handleAdditionalCostInputs.bind(this)
        this.RenderAdditionalCost = this.RenderAdditionalCost.bind(this)
        this.handleRemoveAdditionalCosts = this.handleRemoveAdditionalCosts.bind(this)
        this.removeAllAdditionalCost = this.removeAllAdditionalCost.bind(this)
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    onTrigger = (event, statement) => {
        if (statement === "TrackingNumber") {
            this.props.parentCallback({ "TrackingNumber": event.target.value });
            event.preventDefault();
        }
        if (statement === "UserCode") {
            this.props.parentCallback({ "UserCode": event.target.value });
            event.preventDefault();
        }
        if (statement === "ProductDimensionWidth") {
            this.props.parentCallback({ "ProductDimensionWidth": event.target.value });
            event.preventDefault();
        }
        if (statement === "ProductDimensionHeight") {
            this.props.parentCallback({ "ProductDimensionHeight": event.target.value });
            event.preventDefault();
        }
        if (statement === "ProductDimensionDeep") {
            this.props.parentCallback({ "ProductDimensionDeep": event.target.value });
            event.preventDefault();
        }
        if (statement === "ProductWeight") {
            this.props.parentCallback({ "ProductWeight": event.target.value });
            event.preventDefault();
        }
        if (statement === "UserAreaID") {
            this.props.parentCallback({ "UserAreaID": event.target.value });
            event.preventDefault();
        }
        if (statement === "Item") {
            this.props.parentCallback({ "Item": event.target.value });
            event.preventDefault();
        }
        if (statement === "AdditionalCharges") {
            this.props.parentCallback({ "AdditionalCharges": event.target.value });
            event.preventDefault();
        }
        if (statement === "Remark") {
            this.props.parentCallback({ "Remark": event.target.value });
            event.preventDefault();
        }
    }


    //     <div className="col-lg-6 col-md-6 col-sm-12">
    //     <TextField
    //         onChange={(e) => this.onTrigger(e, "TrackingNumber")}
    //         className="w-100 my-3"
    //         required
    //         variant="standard"
    //         id="outlined-required"
    //         label="Trading Number"
    //         defaultValue={formValue.TrackingNumber}
    //     />
    // </div>
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


    render() {
        const formValue = this.props.data ? this.props.data : [];
        var validation = {
            TrackingNumberVerified: false,
            MemberNumberVerified: false,
            DepthVerified: false,
            WidthVerified: false,
            HeightVerified: false,
            WeightVerified: false,

        }
        console.log(formValue.UserAreaID)
        return (
            <div>

                <div className="d-flex align-items-center">
                    <IconButton
                        color="primary"
                        aria-label="back"
                        component="span"
                        onClick={() => this.props.history.goBack()}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" component="div">
                        Order Details
                    </Typography>
                </div>

                <div className="py-md-3 py-1">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <TextField variant="standard" size="small" fullWidth label="Tracking Number" name="TrackingNumber" value={formValue.TrackingNumber}  onChange={(e) => this.onTrigger(e, "TrackingNumber")} error={!validation.TrackingNumberVerified} />
                            {!formValue.TrackingNumberVerified && <FormHelperText sx={{ color: 'red' }} id="TrackingNumber-error-text">Invalid</FormHelperText>}
                        </div>
                        <div className="col-12 col-md-4">
                            <TextField variant="standard" size="small" fullWidth label="Member Number" name="MemberNumber" value={formValue.UserCode}  onChange={(e) => this.onTrigger(e, "UserCode")} error={!validation.MemberNumberVerified} />
                            {!formValue.MemberNumberVerified && <FormHelperText sx={{ color: 'red' }} id="MemberNumber-error-text">Invalid</FormHelperText>}
                        </div>
                        <div className="col-12 col-md-4">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel id="Division-label">Division</InputLabel>
                                <Select
                                    labelId="Division"
                                    id="Division"
                                    name="Division"
                                    defaultValue={formValue.UserAreaID}
                                    onChange={(e) => this.onTrigger(e, "UserAreaID")}
                                    label="Division"
                                >
                                    {/* {console.log()} */}
                                    {
                                        isArrayNotEmpty(this.props.userAreaCode) && this.props.userAreaCode.map((el, idx) => {
                                            return <MenuItem value={el.UserAreaID} key={idx}>{el.AreaName + " - " + el.AreaCode}</MenuItem>

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
                                    value={formValue.ProductDimensionDeep}
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionDeep")}
                                    endAdornment={<InputAdornment position="start">m</InputAdornment>}
                                    error={!validation.DepthVerified}
                                />
                                {!validation.DepthVerified && <FormHelperText sx={{ color: 'red' }} id="Depth-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className="col-4 col-sm-3">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel htmlFor="Width">Width</InputLabel>
                                <Input
                                    variant="standard"
                                    size="small"
                                    name="Width"
                                    value={formValue.ProductDimensionWidth}
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionWidth")}
                                    endAdornment={<InputAdornment position="start">m</InputAdornment>}
                                    error={!validation.WidthVerified}
                                />
                                {!validation.WidthVerified && <FormHelperText sx={{ color: 'red' }} id="Width-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className="col-4 col-sm-3">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel htmlFor="Height">Height</InputLabel>
                                <Input
                                    variant="standard"
                                    size="small"
                                    name="Height"
                                    value={formValue.ProductDimensionHeight}
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionHeight")}
                                    endAdornment={<InputAdornment position="start">m</InputAdornment>}
                                    error={!validation.HeightVerified}
                                />
                                {!validation.HeightVerified && <FormHelperText sx={{ color: 'red' }} id="Height-error-text">Invalid</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className="col-12 col-sm-3">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel htmlFor="Weight">Weight</InputLabel>
                                <Input
                                    variant="standard"
                                    size="small"
                                    name="Weight"
                                    value={formValue.ProductWeight}
                                    onChange={(e) => this.onTrigger(e, "ProductWeight")}
                                    endAdornment={<InputAdornment position="start">KG</InputAdornment>}
                                    error={!validation.WeightVerified}
                                />
                                {!validation.WeightVerified && <FormHelperText sx={{ color: 'red' }} id="Weight-error-text">Invalid</FormHelperText>}
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
                                            value={el.Remark}
                                            onChange={(e) => { this.handleAdditionalCostInputs(e, idx) }}
                                            error={!el.validated}
                                        />
                                        {console.log(el)}
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditStockGoods));