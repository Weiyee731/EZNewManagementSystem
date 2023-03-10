import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MuiTooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { withRouter } from "react-router";
import { isArrayNotEmpty, isStringNullOrEmpty, isObjectUndefinedOrNull, getWindowDimensions } from "../../tools/Helpers";
import { ResponsiveContainer, ComposedChart, Line, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import "./Dashboard.css"
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
    dashboard_data: null,
    chart_data: []
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
            let CardView = [], Sales = [], SalesByContainer = [];
            if (!isStringNullOrEmpty(this.props.dashboard[0].CardView))
                CardView = JSON.parse(this.props.dashboard[0].CardView)

            if (!isStringNullOrEmpty(this.props.dashboard[0].Sales))
                Sales = JSON.parse(this.props.dashboard[0].Sales)

            if (!isStringNullOrEmpty(this.props.dashboard[0].SalesByContainer))
                SalesByContainer = JSON.parse(this.props.dashboard[0].SalesByContainer)

            let obj = { CardView: CardView, Sales: Sales, SalesByContainer: SalesByContainer }
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
                                    key={"CardID_" + idx}
                                    className="col-6 col-md mb-2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => { this.redirectToPage(row.PageDirect) }}
                                    onMouseDown={(e) => { e.preventDefault(); this.redirectToPage(row.PageDirect) }}
                                >
                                    <MuiTooltip title={"Click to view " + row.TitleColumn + " details"}>
                                        <Card sx={{ minWidth: 140 }}>
                                            <CardContent>
                                                <Typography variant={"h5"} color="text.primary" gutterBottom>
                                                    <div dangerouslySetInnerHTML={{ __html: row.TitleColumn }}></div>
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <div style={{ fontSize: '18pt', marginLeft: 'auto', fontWeight: 600 }}>
                                                    <div dangerouslySetInnerHTML={{ __html: row.DataColumn }}></div>
                                                </div>
                                            </CardActions>
                                        </Card>
                                    </MuiTooltip>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="row mt-2">
                    <ResponsiveContainer width={getWindowDimensions().screenWidth * .8} height={getWindowDimensions().screenHeight * 0.4}>
                        <ComposedChart
                            width={500}
                            height={400}
                            data={!isObjectUndefinedOrNull(dashboard_data) && isArrayNotEmpty(dashboard_data.Sales) ? dashboard_data.Sales : []}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="Month" scale="band" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ActualSaleCollected" stackId="Sales" barSize={20} fill="#2a9d8f" />
                            <Bar dataKey="ActualSaleNoCollected" stackId="Sales" barSize={20} fill="#e76f51" />
                            <Line type="monotone" dataKey="TotalSales" stroke="#9b2226" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="row mt-2">
                    <ResponsiveContainer width={getWindowDimensions().screenWidth * .8} height={getWindowDimensions().screenHeight * 0.4}>
                        <ComposedChart
                            width={500}
                            height={400}
                            data={!isObjectUndefinedOrNull(dashboard_data) && isArrayNotEmpty(dashboard_data.SalesByContainer) ? dashboard_data.SalesByContainer : []}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="ContainerName" scale="band" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ActualSaleCollected" stackId="TotalItem" barSize={20} fill="#2a9d8f" />
                            <Line type="monotone" dataKey="TotalSales" stroke="#9b2226" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));