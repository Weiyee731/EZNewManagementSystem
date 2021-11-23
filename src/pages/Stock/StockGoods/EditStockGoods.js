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
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Trading Number"
                                    defaultValue={Data.Tracking_No}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextField
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Member Number"
                                    defaultValue={Data.Member_No}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <TextField
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Width (m)"
                                    defaultValue={Data.Width}
                                />
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <TextField
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Height (m)"
                                    defaultValue={Data.Height}
                                />
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <TextField
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Depth (m)"
                                    defaultValue={Data.Depth}
                                />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-6">
                                <TextField
                                    className="w-100 my-3"
                                    required
                                    id="outlined-required"
                                    label="Weight (kg)"
                                    defaultValue={Data.Weight}
                                />
                            </div>
                        </div>

                        <TextField
                            className="w-100 my-3"
                            // required
                            multiline
                            rows={4}
                            id="outlined-required"
                            label="Remark"
                            defaultValue={Data.Charged_remark}
                        />
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Reminder
                        </Typography>
                        <Typography variant="body2">
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