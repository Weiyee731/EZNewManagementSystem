import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TableComponents from '../../../components/TableComponents/TableComponents';
import Button from '@mui/material/Button';
import { isArrayNotEmpty, isStringNullOrEmpty, getWindowDimensions, isObjectUndefinedOrNull } from "../../../tools/Helpers";
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';

const ProformaList = (props) => {
    const { selected, items } = props

    const [unitPrice, setUnitPrice] = useState(420)
    const [selfPickupPrice, setSelfPickupPrice] = useState(5)
    const [productPrice, setProductPrice] = useState([])

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

    const totalVolume = () => {
        let total = 0
        items.map((item) => {
            let volume = item.ProductDimensionDeep * item.ProductDimensionWidth * item.ProductDimensionHeight
            total += volume
        })
        return total
    }

    const totalPrice = () => {
        let total = []
        items.map((item) => {
            let volume = item.ProductDimensionDeep * item.ProductDimensionWidth * item.ProductDimensionHeight
            let price = unitPrice * volume
            if (volume < 0.013) {
                total.push(selfPickupPrice)
            } else {
                total.push(price)
            }
        })
        // setProductPrice(total)
        // props.handleProductPrice(total)
        return total.reduce((a, b) => a + b)
    }

    const renderTableRows = (data, index) => {
        const fontsize = '9pt'
        const volume = data.ProductDimensionDeep * data.ProductDimensionWidth * data.ProductDimensionHeight
        const price = volume * unitPrice

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
                {selected !== 3 &&
                    <>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>{volume < 0.013 ? "-" : unitPrice}</TableCell>
                        <TableCell align="left" sx={{ fontSize: fontsize }}>{volume < 0.013 ? selfPickupPrice : price}</TableCell>
                    </>
                }
            </>
        )
    }

    return (
        <Box width={'100%'}>
            <TableComponents
                // table settings 
                tableTopLeft={
                    <>
                        <TextField
                            variant="standard"
                            size="small"
                            label="Unit Price"
                            name="unitPrice"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                        />
                    </>
                }
                tableOptions={{
                    dense: false,                // optional, default is false
                    tableOrderBy: 'asc',        // optional, default is asc
                    sortingIndex: "TrackingNo",        // require, it must the same as the desired table header
                    stickyTableHeader: true,    // optional, default is true
                    stickyTableHeight: (getWindowDimensions().screenHeight * 0.7),     // optional, default is 300px
                }}
                paginationOptions={[]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                tableHeaders={selected !== 3 ? headCellsWithPrice : headCellsWithoutPrice}        //required
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
                <div className='col-10'>
                    Sub total:
                </div>
                <div className='col-2'>
                    {totalPrice()}
                </div>
                {selected === 4 && totalVolume() < 0.5 &&
                    <>
                        <div className='col-10'>
                            * Does not meet minimum requirement:
                        </div>
                        <div className='col-2'>
                            20.00
                        </div>
                    </>
                }
                <div className='col-10'>
                    Total:
                </div>
                <div className='col-2'>
                    120.00
                </div>
            </div>
            <Button
                onClick={() => props.handleCreateProforma(productPrice)}
                variant='contained'
                fullWidth
            >
                Create
            </Button>
        </Box>
    )
}

export default ProformaList