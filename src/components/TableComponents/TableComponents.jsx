import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import AddIcon from '@mui/icons-material/Add';

import { isObjectUndefinedOrNull, isArrayNotEmpty, isStringNullOrEmpty } from "../../tools/Helpers"

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, tableHeaders, renderCheckbox, checkboxColor } = props;
    const createSortHandler = (property) => (event) => { onRequestSort(event, property); };

    return (
        <TableHead>
            <TableRow>
                {
                    renderCheckbox === true &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            color={checkboxColor}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts', }}
                        />
                    </TableCell>
                }

                {
                    isArrayNotEmpty(tableHeaders) && tableHeaders.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={isStringNullOrEmpty(headCell.align) ? "left" : headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {
                                    orderBy === headCell.id ?
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                        : null
                                }
                            </TableSortLabel>
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { selectedRows, tableTopLeft, OnActionButtonClick, OnDeleteButtonClick, tableTopRight } = props;
    const numSelected = selectedRows.length

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {
                numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        id="tableTitle"
                        component="div"
                    >
                        {tableTopLeft}
                    </Typography>
                )
            }

            {
                numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={() => { OnDeleteButtonClick(selectedRows) }} >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    tableTopRight === null ?
                        <Tooltip title="Add New Items">
                            <IconButton onClick={(event) => { typeof OnActionButtonClick === "function" && OnActionButtonClick(selectedRows) }}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        : tableTopRight
                )
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    selectedRows: PropTypes.array.isRequired,
};

TableComponents.propTypes = {
    tableOptions: PropTypes.object.isRequired,
    paginationOptions: PropTypes.array.isRequired,
    tableHeaders: PropTypes.array.isRequired,
    tableRows: PropTypes.object.isRequired,
    Data: PropTypes.array.isRequired,
    selectedIndexKey: PropTypes.string.isRequired,
};

export default function TableComponents(props) {
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);

    // render from props
    // table settings
    const [stickyTableHeader, setTableHeaderSticky] = React.useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.stickyTableHeader === null ? true : props.tableOptions.stickyTableHeader);
    const [stickyTableHeight, setTableStickyHeight] = React.useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.stickyTableHeight === null ? 300 : props.tableOptions.stickyTableHeight);
    const [dense, setDense] = React.useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.dense === null ? false : props.tableOptions.dense);
    const [tableTopRight, setTableTopRight] = React.useState(isObjectUndefinedOrNull(props.tableTopRight) || props.tableTopRight === null ? null : props.tableTopRight);

    //pagination settings
    const [rowsPerPage, setRowsPerPage] = React.useState((isArrayNotEmpty(props.paginationOptions) ? props.paginationOptions[0] : 25));
    const [pagePaginationOptions, setPagePaginationOptions] = React.useState((isArrayNotEmpty(props.paginationOptions)) ? props.paginationOptions : []);
    
    //table and table data settings
    const [order, setOrder] = React.useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.tableOrderBy === null ? 'asc' : props.tableOptions.tableOrderBy);
    const [orderBy, setOrderBy] = React.useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.sortingIndex === null ? "" : props.tableOptions.sortingIndex);
    const [objectKey, setObjectKey] = React.useState(!isStringNullOrEmpty(props.selectedIndexKey) ? props.selectedIndexKey : "id")
    const [rows, setRows] = React.useState((isArrayNotEmpty(props.Data) ? props.Data : []));
    const [tableHeaders, setTableHeaders] = React.useState((isArrayNotEmpty(props.tableHeaders) ? props.tableHeaders : []));
    const [renderCheckbox, setRenderCheckbox] = React.useState(!isObjectUndefinedOrNull(props.tableRows.checkbox) ? props.tableRows.checkbox : true);
    const [onRowSelect, setOnRowSelect] = React.useState(!isObjectUndefinedOrNull(props.tableRows.onRowClickSelect) ? props.tableRows.onRowClickSelect : false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n[objectKey]);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleSelectItem = (event, key) => {
        const selectedIndex = selected.indexOf(key);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, key);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    }

    const handleRowClick = (event, row) => { (onRowSelect) ? handleSelectItem(event, row[objectKey]) : props.onTableRowClick(event, row) };
    const handleChangePage = (event, newPage) => { setPage(newPage); };
    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
    const isSelected = (name) => selected.indexOf(name) !== -1;
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const TableData = (rowsPerPage !== -1) ? stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(rows, getComparator(order, orderBy))
    const checkboxColor = !isObjectUndefinedOrNull(props.tableRows.checkboxColor) ? props.tableRows.checkboxColor : "primary"
    const emptyRowColSpan = renderCheckbox ? tableHeaders.length + 1 : tableHeaders.length

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    selectedRows={selected}
                    tableTopLeft={props.tableTopLeft}
                    tableTopRight={tableTopRight}
                    OnActionButtonClick={props.onActionButtonClick}
                    OnDeleteButtonClick={props.onDeleteButtonClick}
                />
                <TableContainer sx={(stickyTableHeader) ? { maxHeight: stickyTableHeight } : { maxHeight: '100%' }}>
                    <Table
                        stickyHeader={stickyTableHeader}
                        sx={{ width: "100%" }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            tableHeaders={tableHeaders}
                            renderCheckbox={renderCheckbox}
                            checkboxColor={checkboxColor}

                        />
                        <TableBody>
                            {
                                isArrayNotEmpty(TableData) && TableData.map((row, index) => {
                                    const isItemSelected = isSelected(row[objectKey]);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleRowClick(event, row)}
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row[objectKey]}
                                            selected={isItemSelected}
                                        >
                                            {
                                                renderCheckbox &&
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color={checkboxColor}
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId, }}
                                                        onClick={(event) => handleSelectItem(event, row[objectKey])}
                                                    />
                                                </TableCell>
                                            }
                                            {!isObjectUndefinedOrNull(props.tableRows.renderTableRows) && props.tableRows.renderTableRows(row, index)}
                                        </TableRow>
                                    );
                                })
                            }
                            {
                                emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }} >
                                        <TableCell colSpan={emptyRowColSpan} ></TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    pagePaginationOptions.length !== 0 &&
                    <TablePagination
                        rowsPerPageOptions={pagePaginationOptions}
                        component="div"
                        colSpan={3}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                }

            </Paper>
        </Box>
    );
}


/**
 *   Pagination Buttons Props
 *   DO NOT TOUCH IT UNLESS THE NECESSARARY CHANGES REQUIRED!!
 */
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
    const handleFirstPageButtonClick = (event) => { onPageChange(event, 0); };
    const handleBackButtonClick = (event) => { onPageChange(event, page - 1); };
    const handleNextButtonClick = (event) => { onPageChange(event, page + 1); };
    const handleLastPageButtonClick = (event) => { onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1)); };
    return (
        <Box sx={{ flexShrink: 0, ml: 1 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}



/***************************************
 * Example:
 *
 * 1. how to set the table cells according to desired settngs
 * renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.name}
                </TableCell>
                <TableCell align="center">{data.calories}</TableCell>
                <TableCell align="center">{data.fat}</TableCell>
                <TableCell align="center">{data.carbs}</TableCell>
                <TableCell align="center">{data.protein}</TableCell>
            </>
        )
    }
 *
 * 2. how to render the top right side of the table corner
 *   renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Buton">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }
 *
 *
 *
 */