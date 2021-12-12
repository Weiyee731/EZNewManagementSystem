import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { browserHistory, withRouter } from "react-router";
import { isArrayNotEmpty, isStringNullOrEmpty, isObjectUndefinedOrNull } from "../../tools/Helpers";

function mapStateToProps(state) {
    return {
        dashboard: state.counterReducer["dashboard"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallFetchDashboardData: () => dispatch(GitAction.CallFetchDashboardData()),
    };
}


const INITIAL_STATE = {
    dashboard_data: null
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.props.CallFetchDashboardData();
        this.redirectToPage = this.redirectToPage.bind(this)
    }

    componentDidMount() { }

    componentDidUpdate(prevProps, prevState) {
        if (isArrayNotEmpty(this.props.dashboard) && this.state.dashboard_data === null) {
            let CardView = [], Sales = [];
            if (!isStringNullOrEmpty(this.props.dashboard[0].CardView))
                CardView = JSON.parse(this.props.dashboard[0].CardView)

            if (!isStringNullOrEmpty(this.props.dashboard[0].Sales))
                Sales = JSON.parse(this.props.dashboard[0].Sales)

            let obj = { CardView: CardView, Sales: Sales }
            this.setState({ dashboard_data: obj })
        }
    }

    redirectToPage = (pageName) => {
        this.props.history.push(`/${pageName}`)
    }

    render() {
        const { dashboard_data } = this.state

        return (
            <div className="container-fluid">
                <div className="row">
                    {
                        !isObjectUndefinedOrNull(dashboard_data) && isArrayNotEmpty(dashboard_data.CardView) && dashboard_data.CardView.map((row, idx) => {
                            return (
                                <div
                                    key={row.TitleColumn}
                                    className="col-12 col-md-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => { this.redirectToPage(row.PageDirect) }}
                                    onMouseDown={(e) => { e.preventDefault(); this.redirectToPage(row.PageDirect) }}
                                >
                                    <Card sx={{ minWidth: 275 }}>
                                        <CardContent>
                                            <Typography variant={"h5"} color="text.secondary" gutterBottom>
                                                {row.TitleColumn}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {row.DataColumn}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Learn More</Button>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="row mt-2">
                    {
                        !isObjectUndefinedOrNull(dashboard_data) && isArrayNotEmpty(dashboard_data.Sales) && dashboard_data.Sales.map((row, idx) => {
                            return (
                                <div key={"card_" + idx} className="col-12 col-lg-4">
                                    <Card sx={{ minWidth: "250px" }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                ActualSaleCollected: {row.ActualSaleCollected}
                                                ActualSaleNoCollected: {row.ActualSaleNoCollected}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                TotalSales: {row.TotalSales}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Learn More</Button>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));