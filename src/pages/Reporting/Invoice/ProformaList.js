import React, { useState, useEffect, useRef } from 'react'
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from 'react-router'
import TableComponents from '../../../components/TableComponents/TableComponents';
import Button from '@mui/material/Button';
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull, roundOffTotal, round, volumeCalc, isNumber } from "../../../tools/Helpers";
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
import { FormHelperText } from '@mui/material';

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
    const { userProfile, userAreaCode, transactionReturn, loading } = props
    const [unitPrice, setUnitPrice] = useState(0)
    const [consolidatePrice, setConsolidatePrice] = useState(0)
    const [selfPickupPrice, setSelfPickupPrice] = useState(0)
    const [LargeItemMinPrice, setLargeItemMinPrice] = useState(0)
    const [firstKg, setFirstKg] = useState(0)
    const [subsequentKg, setSubsequentKg] = useState(0)
    const [items, setItems] = useState(state)
    const [area, setArea] = useState('')
    const [minCubic, setMinCubic] = useState(0.5)

    const [selfPickupPriceValidated, setSelfPickupPriceValidated] = useState(true)
    const [consolidatePriceValidated, setConsolidatePriceValidated] = useState(true)
    const [unitPriceValidated, setUnitPriceValidated] = useState(true)
    const [firstKgValidated, setFirstKgValidated] = useState(true)
    const [subsequentKgValidated, setSubsequentKgValidated] = useState(true)
    const [LargeItemMinPriceValidated, setLargeItemMinPriceValidated] = useState(true)
    let total = 0
    const ref = useRef(transactionReturn)

    useEffect(() => {
        props.CallUserAreaCode()
        if (userId !== undefined && typeof userId !== 'undefined') {
            localStorage.setItem('proformaUserId', userId)
        }

        props.CallUserProfileByID({ UserID: userId !== undefined && typeof userId !== 'undefined' ? userId : localStorage.getItem('proformaUserId') })

        let tempArr = []

        items !== null && items.length > 0 && items.map((item) => {
            tempArr.push({
                ...item,
                unitPrice: unitPrice,
                isFollowStandard: true
            })
        })
        setItems(tempArr)
    }, [])

    useEffect(() => {
        if (isArrayNotEmpty(userProfile)) {
            if (userProfile[0].ReturnVal && userProfile[0].ReturnVal == "0") {
                toast.error("Invalid user information. Please try again")
                setTimeout(() => {
                    props.history.goBack()
                }, 2000);
            } else {
                setSelfPickupPrice(userProfile[0].MinimumPrice)
                setLargeItemMinPrice(userProfile[0].LargeDeliveryPrice)
                setConsolidatePrice(userProfile[0].ConsolidatedPrice)
                setUnitPrice(userProfile[0].SelfPickOverCubic)
                setFirstKg(userProfile[0].SmallDeliveryFirstPrice)
                setSubsequentKg(userProfile[0].SmallDeliverySubPrice)
                setArea(userProfile[0].AreaCode)
                let area = userAreaCode.filter((el) => el.UserAreaID === userProfile[0].UserAreaID)
                setMinCubic(area[0].MinimumCubic)
            }
        }
    }, [userProfile, userAreaCode])

    useEffect(() => {
        if (ref.current !== transactionReturn) {
            if (isArrayNotEmpty(transactionReturn) && transactionReturn[0].ReturnVal == 1) {
                toast.success(transactionReturn[0].ReturnMsg, { autoClose: 2000, position: "top-center" })
                props.history.push({
                    pathname: `/InvoiceDetail/${transactionReturn[0].TransactionID}`,
                    state: {
                        ind: 'proforma'
                    }
                })
            }
        }
    }, [ref, transactionReturn])

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
            label: 'Volume (m??)',
        },
        {
            id: 'additional',
            align: 'left',
            disablePadding: false,
            label: 'Additional Charges',
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
            label: 'Volume (m??)',
        },
        {
            id: 'price',
            align: 'left',
            disablePadding: false,
            label: 'Price (RM)',
        },
    ];

    const totalPrice = () => {
        if (selectedType !== 3) {
            let totalArr = []
            items !== null && items.length > 0 && items.map((item) => {
                totalArr.push(Number(subTotal(item).toFixed(2)))
            })
            total = totalArr.length > 0 && !isNaN(roundOffTotal(totalArr.reduce((a, b) => a + b))) ? (parseFloat(roundOffTotal(totalArr.reduce((a, b) => a + b))) - parseFloat(totalArr.reduce((a, b) => a + b))) < 0 ? (parseFloat(roundOffTotal(totalArr.reduce((a, b) => a + b))) + 0.1).toFixed(2) : roundOffTotal(totalArr.reduce((a, b) => a + b)) : 0.00
            return  totalArr.length > 0 &&  !isNaN(roundOffTotal(totalArr.reduce((a, b) => a + b))) ? (parseFloat(roundOffTotal(totalArr.reduce((a, b) => a + b))) - parseFloat(totalArr.reduce((a, b) => a + b))) < 0 ? (parseFloat(roundOffTotal(totalArr.reduce((a, b) => a + b))) + 0.1).toFixed(2) : roundOffTotal(totalArr.reduce((a, b) => a + b)) : 0.00
        } else {
            let subKg = weightCompare() - 1
            return !isNaN(roundOffTotal(firstKg + (subKg * subsequentKg))) ? roundOffTotal(firstKg + (subKg * subsequentKg)) : 0.00
        }
    }

    const AddTotalPrice = () => {
        let totalArr = 0
        items !== null && items.length > 0 &&  items.map((item) => {
            let addprice = 0;
            try {
                if (JSON.parse(item.AdditionalCharges).length > 0) {
                    JSON.parse(item.AdditionalCharges).map((addcharge) => {
                        if (addcharge.Charges !== "[]" && addcharge.Charges !== '-') {
                            addprice = parseFloat(addprice) + parseFloat(addcharge.Value)
                        } else {
                            addprice = parseFloat(addprice) + parseFloat("0")
                        }
                    })
                }
                totalArr = parseFloat(totalArr) + parseFloat(addprice)
            }
            catch (e) {
                console.log('error', e)
                totalArr = parseFloat(totalArr) + parseFloat(addprice)
            }
        })
        return totalArr
    }

    const handleChangeSingleUnitPrice = (value, data) => {
        const newItems = [...items];
        let index = newItems.findIndex(x => parseInt(x.StockID) === parseInt(data.StockID))

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
        setSelfPickupPriceValidated(isNumber(e.target.value))
    }

    const handleChangeAllUnitPrice = (e) => {
        const newItems = [...items];
        newItems.map((item) => {
            item.isFollowStandard = true
        })
        setItems(newItems)

        if (selectedType === 2) {
            setConsolidatePriceValidated(isNumber(e.target.value))
            setConsolidatePrice(e.target.value)
        }
        else {
            setUnitPrice(e.target.value)
            setUnitPriceValidated(isNumber(e.target.value))
        }
    }

    const singleUnitPrice = (volume) => {
        if (selectedType === 1) {
            if (totalVolume < 5) {
                if (volume < 0.01) {
                    return selfPickupPrice
                } else {
                    return unitPrice
                }
            } else {
                if (volume < 0.01) {
                    return selfPickupPrice
                } else {
                    return unitPrice
                }
            }
        } else if (selectedType === 2) {
            return consolidatePrice
        } else if (selectedType === 4) {
            return LargeItemMinPrice
        }
    }

    const handleCreateProformaInvoice = () => {
        let productPrices = []
        let stockIds = []
        let productQuantity = []
        let productDimension = []
        let productUnitPrices = []
        let TotalAddPrice = 0;
        items.map((item) => {
            let addprice = 0;

            try {
                if (JSON.parse(item.AdditionalCharges).length > 0) {
                    JSON.parse(item.AdditionalCharges).map((addcharge) => {
                        if (addcharge.Charges !== "[]" && addcharge.Charges !== '-') {
                            addprice = parseFloat(addprice) + parseFloat(addcharge.Value)
                        } else {
                            addprice = parseFloat(addprice) + parseFloat("0")
                        }
                    })
                }
            }
            catch (e) {
                console.log('error', e)
            }

            TotalAddPrice = parseFloat(TotalAddPrice) + parseFloat(addprice)
            productPrices.push(subTotal(item).toFixed(2))
            stockIds.push(item.StockID)
            productQuantity.push(item.ProductQuantity)
            productDimension.push(volumeCalc(item.ProductDimensionDeep, item.ProductDimensionWidth, item.ProductDimensionHeight))
            productUnitPrices.push(selectedType !== 3 ? item.isFollowStandard ? singleUnitPrice(volumeCalc(item.ProductDimensionDeep, item.ProductDimensionWidth, item.ProductDimensionHeight)) : item.unitPrice : 1)
        })

        let object = {
            USERID: userId,
            TYPE: selectedType,
            DELIVERYFEE: selectedType === 4 && (totalVolume) < minCubic ? (parseFloat(LargeItemMinPrice / 2 - totalPrice())).toFixed(2) : parseFloat("0").toFixed(2),
            ORDERSUBTOTALMOUNT: (parseFloat(totalPrice()) + parseFloat(TotalAddPrice)).toFixed(2),
            ORDERTOTALMOUNT: selectedType === 4 && (totalVolume) < minCubic ? (parseFloat(LargeItemMinPrice / 2) + parseFloat(TotalAddPrice)).toFixed(2) : (parseFloat(totalPrice()) + parseFloat(TotalAddPrice)).toFixed(2),
            ORDERPAIDMOUNT: 0,
            FIRSTKG: selectedType === 3 ? firstKg : 0,
            SUBSEQUENCEKG: selectedType === 3 ? subsequentKg : 0,
            STOCKID: stockIds,
            PRODUCTPRICE: productPrices,
            PRODUCTQUANTITY: productQuantity,
            PRODUCTDIMENSION: productDimension,
            PRODUCTUNITPRICE: productUnitPrices
        }
        props.CallInsertTransaction(object)
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

    const subTotal = (data) => {
        let price = 0
        let volume = volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)
        if (selectedType === 1) {
            if (volume < 0.01) {
                if (data.isFollowStandard && selfPickupPrice !== "") {
                    return Number(selfPickupPrice)
                } else if (!data.isFollowStandard) {
                    return Number(data.unitPrice)
                } else {
                    return 0
                }
            } else {
                if (data.isFollowStandard) {
                    price = volume * unitPrice
                } else {
                    price = volume * data.unitPrice
                }
                return price
            }
        } else if (selectedType === 2) {
            if (data.isFollowStandard) {
                price = volume * consolidatePrice
                return price
            } else {
                price = volume * data.unitPrice
                return price
            }
        } else if (selectedType === 4) {
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

    const renderTableRows = (data, index) => {
        let fontsize = '9pt'
        let volume = volumeCalc(data.ProductDimensionDeep, data.ProductDimensionWidth, data.ProductDimensionHeight)
        let addprice = 0;
        try {
            if (JSON.parse(data.AdditionalCharges).length > 0) {
                JSON.parse(data.AdditionalCharges).map((addcharge) => {
                    if (addcharge.Charges !== "[]" && addcharge.Charges !== '-') {
                        addprice = parseFloat(addprice) + parseFloat(addcharge.Value)
                    } else {
                        addprice = parseFloat(addprice) + parseFloat("0")
                    }
                })
            }
        }
        catch (e) {
            console.log('error', e)
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
                <TableCell align="left" sx={{ fontSize: fontsize }}>{addprice.toFixed(2)}</TableCell>
                {selectedType !== 3 &&
                    <>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                name="unitPrice"
                                label=""
                                value={data.isFollowStandard ? singleUnitPrice(volume) : data.unitPrice}
                                onChange={(e) => handleChangeSingleUnitPrice(e.target.value, data)}
                            />
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>{(parseFloat(subTotal(data)) + parseFloat(addprice)).toFixed(2)} </TableCell>
                    </>
                }
            </>
        )
    }

    const renderTableTopLeft = () => {
        return (
            <div className='d-flex'>
                {selectedType === 1 && (isArrayNotEmpty(items) && items.filter(x => volumeCalc(x.ProductDimensionDeep, x.ProductDimensionWidth, x.ProductDimensionHeight) < 0.01).length > 0) &&
                    <>
                        <TextField
                            variant="standard"
                            size="small"
                            type={'number'}
                            label="Unit Price (< 0.01 m??)"
                            name="unitPrice"
                            value={selfPickupPrice}
                            onChange={(e) => handleChangeMinSingleUnitPrice(e)}
                            error={!selfPickupPriceValidated}
                            helperText={(!selfPickupPriceValidated) ? "It should be a valid digit" : ""}
                        />
                    </>

                }
                {selectedType === 1 && (isArrayNotEmpty(items) && items.filter(x => volumeCalc(x.ProductDimensionDeep, x.ProductDimensionWidth, x.ProductDimensionHeight) >= 0.01).length > 0) &&
                    <TextField
                        className="mx-3"
                        variant="standard"
                        size="small"
                        type={'number'}
                        label="Unit Price per m??"
                        name="unitPrice"
                        value={selectedType === 2 ? consolidatePrice : unitPrice}
                        onChange={(e) => handleChangeAllUnitPrice(e)}
                        error={selectedType === 2 ? !consolidatePriceValidated : !unitPriceValidated}
                        helperText={selectedType === 2 ? !consolidatePriceValidated ? "It should be a valid digit" : "" : !unitPriceValidated ? "It should be a valid digit" : ""}
                    />
                }
                {selectedType === 2 &&
                    <TextField
                        className="mx-3"
                        variant="standard"
                        size="small"
                        type={'number'}
                        label="Unit Price per m??"
                        name="unitPrice"
                        value={selectedType === 2 ? consolidatePrice : unitPrice}
                        onChange={(e) => handleChangeAllUnitPrice(e)}
                        error={selectedType === 2 ? !consolidatePriceValidated : !unitPriceValidated}
                        helperText={selectedType === 2 ? !consolidatePriceValidated ? "It should be a valid digit" : "" : !unitPriceValidated ? "It should be a valid digit" : ""}
                    />
                }
                {selectedType === 3 &&
                    <>
                        <TextField
                            className="mx-3"
                            variant="standard"
                            size="small"
                            type={'number'}
                            label="First KG price"
                            name="unitPrice"
                            value={firstKg}
                            onChange={(e) => { setFirstKg(parseFloat(e.target.value)); setFirstKgValidated(isNumber(e.target.value)) }}
                            error={!firstKgValidated}
                            helperText={(!firstKgValidated) ? "It should be a valid digit" : ""}
                        />

                        <TextField
                            className="mx-3"
                            variant="standard"
                            size="small"
                            type={'number'}
                            label="Subsequent KG price"
                            name="unitPrice"
                            value={subsequentKg}
                            onChange={(e) => { setSubsequentKg(parseFloat(e.target.value)); setSubsequentKgValidated(isNumber(e.target.value)) }}
                            error={!subsequentKgValidated}
                            helperText={(!subsequentKgValidated) ? "It should be a valid digit" : ""}
                        />
                    </>
                }
                {selectedType === 4 &&
                    <TextField
                        className="mx-3"
                        variant="standard"
                        size="small"
                        type={'number'}
                        label="Minimum price"
                        name="unitPrice"
                        value={LargeItemMinPrice}
                        onChange={(e) => { setLargeItemMinPrice(e.target.value); setLargeItemMinPriceValidated(isNumber(e.target.value)) }}
                        error={!LargeItemMinPriceValidated}
                        helperText={(!LargeItemMinPriceValidated) ? "It should be a valid digit" : ""}
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
                {selectedType === 4 &&
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

    const checkValidation = () => {
        switch (selectedType) {
            case 1: return !selfPickupPriceValidated || !unitPriceValidated
            case 2: return !consolidatePriceValidated
            case 3: return !firstKgValidated
            case 4: return !LargeItemMinPriceValidated
            default: return false
        }
    }

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
                            disabled={checkValidation()}
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
                        onRowClickSelect: false,                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                        headerColor: 'rgb(200, 200, 200)'
                    }}
                    selectedIndexKey={"StockID"}                     // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                    Data={isArrayNotEmpty(items) ? items : []}                                  // required, the data that listing in the table
                />
                <hr />
                <div className='row text-end mb-3'>
                    {selectedType === 3 &&
                        <>
                            <div className='col-10'>
                                Actual Weight (kg):
                            </div>
                            <div className='col-2'>
                                {Math.ceil(totalWeight).toFixed(2)}
                            </div>
                            <div className='col-10'>
                                Total Volume (m??):
                            </div>
                            <div className='col-2'>
                                {totalVolume.toFixed(3)}
                            </div>
                            <div className='col-10'>
                                Volumetric Weight (kg):
                            </div>
                            <div className='col-2'>
                                {volumeWeight().toFixed(2)}
                            </div>
                        </>
                    }
                    <div className='col-10'>
                        Sub total:
                    </div>
                    <div className='col-2'>
                        RM {(parseFloat(totalPrice()) + parseFloat(AddTotalPrice())).toFixed(2)}
                    </div>
                    {selectedType === 4 && (totalVolume) < minCubic &&
                        <>
                            <div className='col-10'>
                                * Min 0.5m??:
                            </div>
                            <div className='col-2'>
                                RM {(LargeItemMinPrice / 2 - totalPrice()).toFixed(2)}
                            </div>
                        </>
                    }
                    <div className='col-10'>
                        Total:
                    </div>
                    <div className='col-2'>
                        {selectedType === 4 && (totalVolume) < minCubic ?
                            <>
                                RM {(LargeItemMinPrice / 2 + parseFloat(AddTotalPrice())).toFixed(2)}
                            </>
                            :
                            <>
                                RM {(parseFloat(totalPrice()) + parseFloat(AddTotalPrice())).toFixed(2)}
                            </>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProformaList))