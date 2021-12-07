import React, { useState, useEffect, useRef } from 'react'
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableComponents from '../../../components/TableComponents/TableComponents';
import Button from '@mui/material/Button';
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        loading: state.counterReducer["loading"],
        userProfile: state.counterReducer["userProfile"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserProfileByID: (propsData) => dispatch(GitAction.CallUserProfileByID(propsData)),
        CallInsertTransaction: (propsData) => dispatch(GitAction.CallInsertTransaction(propsData)),
    };
}

const ProformaList = (props) => {
    console.log(props)
    const { selectedType, state, userId, totalVolume, totalWeight } = props.location
    const { userProfile } = props

    const [unitPrice, setUnitPrice] = useState(420)
    const [selfPickupPrice, setSelfPickupPrice] = useState(5)
    const [minPrice, setMinPrice] = useState(500)
    const [firstKg, setFirstKg] = useState(10)
    const [subsequentKg, setSubsequentKg] = useState(6)
    const [items, setItems] = useState(state)
    const ref = useRef(false)

    console.log(totalVolume)

    useEffect(() => {
        props.CallUserProfileByID({ UserID: userId })

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
            label: 'm3',
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
            label: 'Price',
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
            label: 'm3',
        },
    ];

    const totalPrice = () => {
        if(selectedType != 3) {
            let total = []
            items.map((item) => {
                let volume = item.ProductDimensionDeep * item.ProductDimensionWidth * item.ProductDimensionHeight
                let price = item.isFollowStandard ? unitPrice * volume : item.unitPrice * volume
                if (volume < 0.013) {
                    if (selectedType == 1) {
                        total.push(selfPickupPrice)
                    } else {
                        total.push(price)
                    }
                } else {
                    total.push(price)
                }
            })
            return total.reduce((a, b) => a + b)
        } else {
            let subKg = weightCompare() - 1
            return (firstKg + (subKg * subsequentKg)).toFixed(2)
        }
    }

    const handleChangeSingleUnitPrice = (index, value) => {
        const newItems = [...items];
        newItems[index]['isFollowStandard'] = false;
        newItems[index]['unitPrice'] = value;
        setItems(newItems)
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
        } else {
            return unitPrice
        }
    }

    const handleCreateProformaInvoice = () => {
        let productPrices = []
        let stockIds = []

        items.map((item) => {
            let volume = item.ProductDimensionDeep * item.ProductDimensionWidth * item.ProductDimensionHeight
            if (selectedType == 1) {
                if (volume < 0.013) {
                    productPrices.push(item.unitPrice)
                } else {
                    productPrices.push(volume * item.unitPrice)
                }
            }
            stockIds.push(item.StockID)
        })

        props.CallInsertTransaction({
            USERID: userId,
            TYPE: selectedType,
            ORDERTOTALMOUNT: totalPrice(),
            ORDERPAIDMOUNT: "-",
            STOCKID: stockIds,
            PRODUCTPRICE: productPrices
        })
    }

    const volumeWeight = () => {
        return (totalVolume * 1000000 / 6000).toFixed(3)
    }

    const weightCompare = () => {
        if(volumeWeight() > totalWeight) {
            return volumeWeight()
        } else {
            return totalWeight
        }
    }

    const renderTableRows = (data, index) => {
        const fontsize = '9pt'
        const volume = data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight
        const price = data.isFollowStandard ? volume * unitPrice : volume * data.unitPrice

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
                <TableCell align="left" sx={{ fontSize: fontsize }}>{volume.toFixed(3)}</TableCell>
                {selectedType !== 3 &&
                    <>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                // label="Unit Price"
                                name="unitPrice"
                                value={data.isFollowStandard ? singleUnitPrice(volume) : data.unitPrice}
                                onChange={(e) => handleChangeSingleUnitPrice(index, e.target.value)}
                            />
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>{volume < 0.013 ? selfPickupPrice : price}</TableCell>
                    </>
                }
            </>
        )
    }

    console.log(userProfile)
    console.log(volumeWeight(totalVolume))

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
                    tableTopLeft={
                        <>
                            {selectedType == 1 &&
                                <TextField
                                    variant="standard"
                                    size="small"
                                    label="Unit Price (min.)"
                                    name="unitPrice"
                                    value={selfPickupPrice}
                                    onChange={(e) => setSelfPickupPrice(e.target.value)}
                                />
                            }
                            {selectedType != 3 &&
                                <TextField
                                    className="mx-3"
                                    variant="standard"
                                    size="small"
                                    label="Unit Price per m3"
                                    name="unitPrice"
                                    value={unitPrice}
                                    onChange={(e) => handleChangeAllUnitPrice(e)}
                                />
                            }
                            {selectedType == 3 &&
                                <>
                                    <TextField
                                        className="mx-3"
                                        variant="standard"
                                        size="small"
                                        label="First KG price"
                                        name="unitPrice"
                                        value={firstKg}
                                        onChange={(e) => setFirstKg(e.target.value)}
                                    />

                                    <TextField
                                        className="mx-3"
                                        variant="standard"
                                        size="small"
                                        label="Subsequent KG price"
                                        name="unitPrice"
                                        value={subsequentKg}
                                        onChange={(e) => setSubsequentKg(e.target.value)}
                                    />
                                </>
                            }
                        </>
                    }
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
                                Actual Weight:
                            </div>
                            <div className='col-2'>
                                {totalWeight}
                            </div>
                            <div className='col-10'>
                                m3:
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
                        {totalPrice()}
                    </div>
                    {selectedType === 4 && totalPrice() < minPrice / 2 &&
                        <>
                            <div className='col-10'>
                                * Does not meet minimum requirement:
                            </div>
                            <div className='col-2'>
                                {minPrice - totalPrice()}
                            </div>
                        </>
                    }
                    <div className='col-10'>
                        Total:
                    </div>
                    <div className='col-2'>
                        {selectedType === 4 && totalPrice() < minPrice / 2 ?
                            <>
                                {minPrice}
                            </>
                            :
                            <>
                                {totalPrice()}
                            </>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProformaList))