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

}

class EditStockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
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
        if (statement === "AreaCode") {
            this.props.parentCallback({ "AreaCode": event.target.value });
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

    render() {
        const Data = this.props.data ? this.props.data : [];
        return (
            <div>
                <Card>
                    <CardContent>
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
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "TrackingNumber")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Trading Number"
                                    defaultValue={Data.TrackingNumber}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "UserCode")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Member Number"
                                    defaultValue={Data.UserCode}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionWidth")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Width (m)"
                                    defaultValue={Data.ProductDimensionWidth}
                                />
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionHeight")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Height (m)"
                                    defaultValue={Data.ProductDimensionHeight}
                                />
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "ProductDimensionDeep")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Depth (m)"
                                    defaultValue={Data.ProductDimensionDeep}
                                />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "ProductWeight")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Weight (kg)"
                                    defaultValue={Data.ProductWeight}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "AreaCode")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Area Code"
                                    defaultValue={Data.AreaCode}
                                />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "Item")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Items"
                                    defaultValue={Data.Item}
                                />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-6">
                                <TextField
                                    onChange={(e) => this.onTrigger(e, "AdditionalCharges")}
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Extra Charge(RM)"
                                    defaultValue={Data.AdditionalCharges}
                                />
                            </div>
                        </div>
                        <TextField
                            onChange={(e) => this.onTrigger(e, "Remark")}
                            className="w-100 my-3"
                            // required
                            multiline
                            rows={4}
                            id="outlined-required"
                            label="Remark"
                            defaultValue={Data.Remark}
                        />
                        <Typography sx={{ mb: 1.5 }} component="div" color="text.secondary">
                            Reminder
                        </Typography>
                        <Typography variant="body2" component="div">
                            Please fill in all the required information
                            <br />
                            {/* {'-'} */}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/* <Button size="small">Learn More</Button> */}
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditStockGoods));