import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import TableCell from '@mui/material/TableCell';
import TableComponents from "../../components/TableComponents/TableComponents"
import SearchBar from "../../components/SearchBar/SearchBar"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { withRouter } from "react-router";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { isArrayNotEmpty } from "../../tools/Helpers";
import CsvDownloader from "react-csv-downloader"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import { Typography } from "@mui/material"
import { toast, Flip } from "react-toastify"
import AddCircleIcon from '@mui/icons-material/AddCircle';

function mapStateToProps(state) {
    return {
        inventoryStock: state.counterReducer["inventoryStock"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallViewInventoryByFilter: (propsData) => dispatch(GitAction.CallViewInventoryByFilter(propsData)),
    };
}

const INITIAL_STATE = {
    searchKeywords: "",
    searchCategory: "Tracking",
    searchArea: "",

    openModal: false,
    containerNo: "",
    containerDate: "",

    filteredProduct: [],
    isFiltered: false,
    isDataSet: false,
    OveralStock: []
}

const headCells = [
    {
        id: 'Index',
        align: 'left',
        disablePadding: false,
        label: '序號',
    },
    {
        id: 'UserCode',
        align: 'left',
        disablePadding: false,
        label: '会员',
    },
    {
        id: 'AreaCode',
        align: 'center',
        disablePadding: false,
        label: '分区',
    },
    {
        id: 'CourierName',
        align: 'center',
        disablePadding: false,
        label: '快递',
    },
    {
        id: 'TrackingNumber',
        align: 'left',
        disablePadding: false,
        label: '单号',
    },
    {
        id: 'ProductQuantity',
        align: 'left',
        disablePadding: false,
        label: '件数',
    },
    {
        id: 'ProductWeight',
        align: 'left',
        disablePadding: false,
        label: '重量',
    },
    {
        id: 'ProductDimensionDeep',
        align: 'left',
        disablePadding: false,
        label: '尺寸长',
    },
    {
        id: 'ProductDimensionWidth',
        align: 'left',
        disablePadding: false,
        label: '尺寸宽',
    },
    {
        id: 'ProductDimensionHeight',
        align: 'left',
        disablePadding: false,
        label: '尺寸高',
    },

    {
        id: 'Volume',
        align: 'left',
        disablePadding: false,
        label: '体积',
    },

    {
        id: 'Item',
        align: 'left',
        disablePadding: false,
        label: '商品',
    },

    {
        id: 'CreatedDate',
        align: 'left',
        disablePadding: false,
        label: '时间',
    },
];


class PendingToLoad extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.renderTableRows = this.renderTableRows.bind(this)
        this.handleSearchInput = this.handleSearchInput.bind(this)
        this.handleSearchCategory = this.handleSearchCategory.bind(this)
        this.props.CallViewInventoryByFilter({ FilterColumn: "and T_Inventory_Stock.ContainerID=0" })
    }

    componentDidMount() { }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.inventoryStock.length > 0 && this.props.inventoryStock[0].ReturnVal !== "0" && this.state.isDataSet === false) {
            this.setState({ OveralStock: this.props.inventoryStock, isDataSet: true })
        }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="normal">{index + 1}</TableCell>
                <TableCell>{data.UserCode}</TableCell>
                <TableCell>{data.AreaCode}</TableCell>
                <TableCell>{data.CourierName}</TableCell>
                <TableCell >{data.TrackingNumber}</TableCell>
                <TableCell >{data.ProductQuantity}</TableCell>
                <TableCell >{data.ProductWeight}</TableCell>
                <TableCell>{data.ProductDimensionDeep}</TableCell>
                <TableCell>{data.ProductDimensionWidth}</TableCell>
                <TableCell>{data.ProductDimensionHeight}</TableCell>
                <TableCell >{data.Volume}</TableCell>
                <TableCell >{data.Item}</TableCell>
                <TableCell>{data.CreatedDate}</TableCell>
            </>
        )
    }



    handleSearchInput(value) {
        const { searchCategory, OveralStock } = this.state
        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        let DataSet = OveralStock
        let filteredListing = []
        if (searchCategory === "Tracking") {
            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.TrackingNumber !== null && searchedItem.TrackingNumber.toLowerCase().includes(
                    value.toLowerCase()
                )
            ).map((filteredItem) => {
                filteredListing.push(filteredItem);
            })
        } else if (searchCategory === "Member") {
            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.UserCode !== null && searchedItem.UserCode.includes(
                    value
                )
            ).map((filteredItem) => {
                filteredListing.push(filteredItem);
            })
        }
        else {
            toast.error("Please select a filter to search")
        }
        this.setState({ isFiltered: true, filteredProduct: filteredListing })
    }

    handleSearchCategory(e) {
        this.setState({ searchCategory: e.target.value })
    }

    renderTotal() {
        let listing = this.props.inventoryStock
        let data = 0.00

        if (listing.length > 0)
            data = listing.reduce((volume, item) => volume + item.Volume, 0)

        return data
    }

    render() {
        const { searchCategory, searchArea, isFiltered, filteredProduct, OveralStock } = this.state
        const renderTableTopRightButtons = () => {
            return (
                <div className="d-flex">
                    <Tooltip title="Add Stock">
                        <IconButton size="small">
                            <AddCircleIcon fontSize="large"   color="primary" onClick={() => window.location.href = "./WarehouseStockManagement"} />
                        </IconButton>
                    </Tooltip>
                    <CsvDownloader
                        filename="未装箱包裹资料"
                        extension=".xls"
                        wrapColumnChar="'"
                        separator=","
                        columns={headCells}
                        datas={isArrayNotEmpty(OveralStock) ? OveralStock : []}
                    >
                        <Tooltip title="Download">
                            <IconButton size="small">
                                <DownloadForOfflineIcon
                                    color="primary"
                                    fontSize="large"
                                    sx={{}}
                                />
                            </IconButton>
                        </Tooltip>
                    </CsvDownloader>
                </div >
            )
        }

        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-3 col-6 mb-2">
                        <div className="filter-dropdown row">
                            <div className="d-inline-flex w-100">
                                <label className="my-auto col-3">Filter By:</label>
                                <Select
                                    labelId="search-filter-category"
                                    id="search-filter-category"
                                    value={searchCategory}
                                    label="Search By"
                                    onChange={this.handleSearchCategory}
                                    size="small"
                                    IconComponent={FilterListOutlinedIcon}
                                    className="col-9"
                                    placeholder="filter by"
                                >
                                    <MenuItem key="search_tracking" value="Tracking">Tracking Number</MenuItem>
                                    <MenuItem key="search_member" value="Member">Member</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 col-6 d-flex">
                        <div className="pr-1 w-100">
                            <SearchBar
                                id=""
                                placeholder=""
                                label="Enter Member No, Tracking number to search"
                                buttonOnClick={() => this.onSearch("", "")}
                                onChange={(e) => this.handleSearchInput(e.target.value)}
                                className="searchbar-input mb-auto"
                                disableButton={this.state.isDataFetching}
                                tooltipText="Search with current data"
                                value={this.state.searchKeywords}
                            />
                        </div>
                    </div>
                </div>
                <div className="row" style={{ paddingTop: "5pt" }} >
                    <div className="col-2">
                        <Typography style={{ fontWeight: "600", fontSize: "12pt", color: "#253949", letterSpacing: 1 }}>总数量 : {this.props.inventoryStock.length}</Typography>
                    </div>
                    <div className="col-2">
                        <Typography style={{ fontWeight: "600", fontSize: "12pt", color: "#253949", letterSpacing: 1 }}>总立方 : {parseFloat(this.renderTotal()).toFixed(3)}</Typography>
                    </div>
                </div>
                <hr />
                <TableComponents
                    // table settings 
                    tableTopLeft={<h3 style={{ fontWeight: 700 }}>未装箱包裹资料</h3>}  // optional, it can pass as string or as children elements
                    tableTopRight={renderTableTopRightButtons()}
                    tableOptions={{
                        dense: true,                // optional, default is false
                        tableOrderBy: 'asc',        // optional, default is asc
                        sortingIndex: "fat",        // require, it must the same as the desired table header
                        stickyTableHeader: true,    // optional, default is true
                        // stickyTableHeight: 300,     // optional, default is 300px
                    }}
                    paginationOptions={[20, 50, 100, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={headCells}        //required
                    tableRows={{
                        renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: false,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false,                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        headerColor: 'rgb(200, 200, 200)'
                    }}

                    selectedIndexKey={"pid"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={isFiltered === true ? filteredProduct : OveralStock}                                  // required, the data that listing in the table
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PendingToLoad));