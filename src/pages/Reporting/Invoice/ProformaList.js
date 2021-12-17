import React, { useState, useEffect, useRef } from 'react'
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableComponents from '../../../components/TableComponents/TableComponents';
import Button from '@mui/material/Button';
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull, roundOffTotal, round, volumeCalc } from "../../../tools/Helpers";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

function mapStateToProps(state) {
    return {
        loading: state.counterReducer["loading"],
        userProfile: state.counterReducer["userProfile"],
        userAreaCode: state.counterReducer["userAreaCode"],
        transactionReturn: state.counterReducer["transactionReturn"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserProfileByID: (propsData) => dispatch(GitAction.CallUserProfileByID(propsData)),
        CallInsertTransaction: (propsData) => dispatch(GitAction.CallInsertTransaction(propsData)),
        CallUserAreaCode: () => dispatch(GitAction.CallUserAreaCode()),
    };
}

const ProformaList = (props) => {
    const { selectedType, state, userId, totalVolume, totalWeight } = props.location
    const { userProfile, userAreaCode } = props

    const [unitPrice, setUnitPrice] = useState(0)
    const [consolidatePrice, setConsolidatePrice] = useState(0)
    const [selfPickupPrice, setSelfPickupPrice] = useState(0)
    const [LargeItemMinPrice, setLargeItemMinPrice] = useState(0)
    const [firstKg, setFirstKg] = useState(0)
    const [subsequentKg, setSubsequentKg] = useState(0)
    const [items, setItems] = useState(state)
    const [area, setArea] = useState('')
    const [minCubic, setMinCubic] = useState(0.5)
    const ref = useRef(false)

    useEffect(() => {
        props.CallUserProfileByID({ UserID: userId })
        props.CallUserAreaCode()
        let abc = []

        items.map((item) => {
            abc.push({
                ...item,
                unitPrice: unitPrice,
                isFollowStandard: true
            })
        })
        setItems(abc)
    }, [])

    useEffect(() => {
        if (isArrayNotEmpty(userProfile)) {
            setSelfPickupPrice(userProfile[0].MinimumPrice)
            setLargeItemMinPrice(userProfile[0].LargeDeliveryPrice)
            setConsolidatePrice(userProfile[0].ConsolidatedPrice)
            setUnitPrice(userProfile[0].SelfPickOverCubic)
            setFirstKg(userProfile[0].SmallDeliveryFirstPrice)
            setSubsequentKg(userProfile[0].SmallDeliverySubPrice)
            setArea(userProfile[0].AreaCode)
            let area = userAreaCode.filter((el) => el.UserAreaID == userProfile[0].UserAreaID)
            setMinCubic(area[0].MinimumCubic)
        }
    }, [userProfile])

    useEffect(() => {
        if (isArrayNotEmpty(props.transactionReturn)) {
            if (props.transactionReturn[0].ReturnVal == 1) {
                toast.success(props.transactionReturn[0].ReturnMsg)
                props.history.push(`/InvoiceDetail/${props.transactionReturn[0].TransactionID}`)
            } else {
                toast.error("Something went wrong. Please try again")
            }
        }
    }, [props.transactionReturn])

    const headCellsWithPrice = [
        {
            id: 'no',
            align: 'left',
            disablePadding: false,
            label: 'No. ',
        },
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
            id: 'volume',
            align: 'left',
            disablePadding: false,
            label: 'Volume (m3)',
        },
        {
            id: 'unitPrice',
            align: 'left',
            disablePadding: false,
            label: 'Unit Price',
        },
        {
            id: 'price',
            align: 'left',
            disablePadding: false,
            label: 'Price (RM)',
        },
    ];

    const headCellsWithoutPrice = [
        {
            id: 'no',
            align: 'left',
            disablePadding: false,
            label: 'No. ',
        },
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
            id: 'volume',
            align: 'left',
            disablePadding: false,
            label: 'Volume (m3)',
        },
    ];

    const totalPrice = () => {
        if (selectedType != 3) {
            let total = []
            items.map((item) => {
                let volume = volumeCalc(item.ProductDimensionDeep, item.ProductDimensionWidth, item.ProductDimensionHeight)
                let price = item.isFollowStandard ? unitPrice * volume : item.unitPrice * volume
                if (volume < 0.013) {
                    if (selectedType == 1) {
                        total.push(item.isFollowStandard ? Number(selfPickupPrice) : Number(item.unitPrice))
                    } else {
                        total.push(price)
                    }
                } else {
                    total.push(price)
                }
            })
            return !isNaN(roundOffTotal(total.reduce((a, b) => a + b))) ? roundOffTotal(total.reduce((a, b) => a + b)) : 0.00
        } else {
            let subKg = weightCompare() - 1
            return !isNaN(roundOffTotal(firstKg + (subKg * subsequentKg))) ? roundOffTotal(firstKg + (subKg * subsequentKg)) : 0.00
        }
    }

    const handleChangeSingleUnitPrice = (index, value) => {
        const newItems = [...items];
        newItems[index]['isFollowStandard'] = false;
        newItems[index]['unitPrice'] = value;
        setItems(newItems)
    }

    const handleChangeMinSingleUnitPrice = (e) => {
        const newItems = [...items];
        newItems.map((item) => {
            item.isFollowStandard = true
        })
        setItems(newItems)
        setSelfPickupPrice(e.target.value)
    }

    const handleChangeAllUnitPrice = (e) => {
        const newItems = [...items];
        newItems.map((item) => {
            item.isFollowStandard = true
        })
        setItems(newItems)
        setUnitPrice(e.target.value)
    }

    const singleUnitPrice = (volume) => {
        if (selectedType == 1) {
            if (totalVolume < 5) {
                if (volume < 0.013) {
                    return selfPickupPrice
                } else {
                    return unitPrice
                }
            } else {
                if (volume < 0.013) {
                    return selfPickupPrice
                } else {
                    return unitPrice
                }
            }
        } else if (selectedType == 2) {
            return consolidatePrice
        } else if (selectedType == 4) {
            return LargeItemMinPrice
        }
    }

    const handleCreateProformaInvoice = () => {
        let productPrices = []
        let stockIds = []

        items.map((item) => {
            let volume = volumeCalc(item.ProductDimensionDeep, item.ProductDimensionWidth, item.ProductDimensionHeight)
            if (volume < 0.013 && selectedType == 1) {
                if (item.isFollowStandard && selfPickupPrice != "") {
                    productPrices.push(Number(selfPickupPrice).toFixed(2))
                } else if (!item.isFollowStandard) {
                    productPrices.push(Number(item.unitPrice).toFixed(2))
                }
            } else {
                productPrices.push(volume * item.unitPrice)
            }
            stockIds.push(item.StockID)
        })

        props.CallInsertTransaction({
            USERID: userId,
            TYPE: selectedType,
            ORDERTOTALMOUNT: totalPrice(),
            ORDERPAIDMOUNT: 0,
            STOCKID: stockIds,
            PRODUCTPRICE: productPrices
        })
    }

    const volumeWeight = () => {
        return Math.ceil(totalVolume * 1000000 / 6000)
    }

    const weightCompare = () => {
        if (volumeWeight() > totalWeight) {
            return volumeWeight()
        } else {
            return Math.ceil(totalWeight)
        }
    }

    const renderTableRows = (data, index) => {
        let fontsize = '9pt'
        let volume = volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)

        const subTotal = () => {
            let price = 0
            if (selectedType == 1) {
                if (volume < 0.013) {
                    if (data.isFollowStandard && selfPickupPrice != "") {
                        return Number(selfPickupPrice).toFixed(2)
                    } else if (!data.isFollowStandard) {
                        return Number(data.unitPrice).toFixed(2)
                    } else {
                        return 0
                    }
                } else {
                    price = volume * unitPrice
                    return price
                }
            } else if (selectedType == 2) {
                if (data.isFollowStandard) {
                    price = volume * consolidatePrice
                    return price
                } else {
                    price = volume * data.unitPrice
                    return price
                }
            } else if (selectedType == 4) {
                if (data.isFollowStandard) {
                    price = volume * LargeItemMinPrice
                    return price
                } else {
                    price = volume * data.unitPrice
                    return price
                }
            } else {
                return 0
            }
        }

        return (
            <>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{index + 1}</TableCell>
                <TableCell
                    component="th"
                    id={`table-checkbox-${index}`}
                    scope="row"
                    sx={{ fontSize: fontsize }}
                >
                    {data.TrackingNumber}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{data.ProductWeight.toFixed(2)}</TableCell>
                <TableCell align="left" sx={{ fontSize: fontsize }}>{volume}</TableCell>
                {selectedType !== 3 &&
                    <>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                name="unitPrice"
                                value={data.isFollowStandard ? singleUnitPrice(volume) : data.unitPrice}
                                onChange={(e) => handleChangeSingleUnitPrice(index, e.target.value)}
                            />
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>{subTotal().toFixed(2)}</TableCell>
                    </>
                }
            </>
        )
    }

    const renderTableTopLeft = () => {
        return (
            <div className='d-flex'>
                {selectedType == 1 &&
                    <TextField
                        variant="standard"
                        size="small"
                        type={'number'}
                        label="Unit Price (min.)"
                        name="unitPrice"
                        value={selfPickupPrice}
                        onChange={(e) => handleChangeMinSingleUnitPrice(e)}
                    />
                }
                {selectedType != 3 && selectedType != 4 &&
                    <TextField
                        className="mx-3"
                        variant="standard"
                        size="small"
                        type={'number'}
                        label="Unit Price per m3"
                        name="unitPrice"
                        value={selectedType == 2 ? consolidatePrice : unitPrice}
                        onChange={(e) => handleChangeAllUnitPrice(e)}
                    />
                }
                {selectedType == 3 &&
                    <>
                        <TextField
                            className="mx-3"
                            variant="standard"
                            size="small"
                            type={'number'}
                            label="First KG price"
                            name="unitPrice"
                            value={firstKg}
                            onChange={(e) => setFirstKg(e.target.value)}
                        />

                        <TextField
                            className="mx-3"
                            variant="standard"
                            size="small"
                            type={'number'}
                            label="Subsequent KG price"
                            name="unitPrice"
                            value={subsequentKg}
                            onChange={(e) => setSubsequentKg(e.target.value)}
                        />
                    </>
                }
                {selectedType == 4 &&
                    <TextField
                        className="mx-3"
                        variant="standard"
                        size="small"
                        type={'number'}
                        label="Minimum price"
                        name="unitPrice"
                        value={LargeItemMinPrice}
                        onChange={(e) => setLargeItemMinPrice(e.target.value)}
                    />
                }
            </div>
        )
    }

    const renderTableTopRight = () => {
        const renderValue = (value) => {
            return (
                <div>
                    {value}
                </div>
            )
        }

        return (
            <>
                {selectedType == 4 &&
                    <Select
                        labelId="search-filter-category"
                        id="search-filter-category"
                        value={area}
                        onChange={(e) => handleAreaOnChange(e)}
                        size="small"
                        renderValue={() => renderValue(area)}
                    >
                        {props.userAreaCode.map((data, index) => {
                            return (
                                <MenuItem key={`area_${index}`} value={index}>{data.AreaCode}</MenuItem>
                            )
                        })}
                    </Select>
                }
            </>
        )
    }

    const handleAreaOnChange = (e) => {
        let index = e.target.value
        setArea(userAreaCode[index].AreaCode)
        setLargeItemMinPrice(userAreaCode[index].AreaCharges)
    }

    console.log(userProfile)

    return (
        <Card>
            <CardContent>
                <div className="d-flex align-items-center mb-3">
                    <IconButton
                        color="primary"
                        aria-label="back"
                        component="span"
                        onClick={() => props.history.goBack()}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" component="div">
                        {userProfile.length > 0 && `${userProfile[0].UserCode} ${userProfile[0].AreaCode}`}
                    </Typography>
                    <div
                        style={{
                            textAlign: 'end',
                            flex: 1
                        }}
                    >
                        <LoadingButton
                            loading={props.loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            onClick={() => handleCreateProformaInvoice()}
                        >
                            Create
                        </LoadingButton>
                    </div>
                </div>
                <TableComponents
                    // table settings 
                    tableTopLeft={renderTableTopLeft()}
                    tableTopRight={renderTableTopRight()}
                    tableOptions={{
                        dense: false,                // optional, default is false
                        tableOrderBy: 'asc',        // optional, default is asc
                        sortingIndex: "TrackingNo",        // require, it must the same as the desired table header
                        stickyTableHeader: true,    // optional, default is true
                        stickyTableHeight: (getWindowDimensions().screenHeight * 0.7),     // optional, default is 300px
                    }}
                    paginationOptions={[10, 25, 50, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                    tableHeaders={selectedType !== 3 ? headCellsWithPrice : headCellsWithoutPrice}        //required
                    tableRows={{
                        renderTableRows: renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                        checkbox: false,                          // optional, by default is true
                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                    }}
                    selectedIndexKey={"StockID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={isArrayNotEmpty(items) ? items : []}                                  // required, the data that listing in the table
                />
                <hr />
                <div className='row text-end mb-3'>
                    {selectedType == 3 &&
                        <>
                            <div className='col-10'>
                                Actual Weight (kg):
                            </div>
                            <div className='col-2'>
                                {Math.ceil(totalWeight)}
                            </div>
                            <div className='col-10'>
                                Volumatric Weight (kg):
                            </div>
                            <div className='col-2'>
                                {volumeWeight()}
                            </div>
                        </>
                    }
                    <div className='col-10'>
                        Sub total:
                    </div>
                    <div className='col-2'>
                        RM {totalPrice()}
                    </div>
                    {selectedType === 4 && (totalVolume) < minCubic &&
                        <>
                            <div className='col-10'>
                                * Extra add-on:
                            </div>
                            <div className='col-2'>
                                {(LargeItemMinPrice / 2 - totalPrice()).toFixed(2)}
                            </div>
                        </>
                    }
                    <div className='col-10'>
                        Total:
                    </div>
                    {console.log(minCubic)}
                    <div className='col-2'>
                        {selectedType === 4 && (totalVolume) < minCubic ?
                            <>
                                RM {(LargeItemMinPrice / 2).toFixed(2)}
                            </>
                            :
                            <>
                                RM {totalPrice()}
                            </>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProformaList))