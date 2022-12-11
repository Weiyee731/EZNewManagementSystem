import * as React from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { visuallyHidden } from "@mui/utils";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import AddIcon from "@mui/icons-material/Add";
import {
  isObjectUndefinedOrNull,
  isArrayNotEmpty,
  isStringNullOrEmpty,
  round,
  volumeCalc
} from "../../tools/Helpers";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  if (isArrayNotEmpty(array)) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  } else return [];
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    tableHeaders,
    renderCheckbox,
    checkboxColor,
    headerColor
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {renderCheckbox === true && (
          <TableCell padding="checkbox" sx={{ bgcolor: headerColor }}>
            <Checkbox
              color={checkboxColor}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onClick={onSelectAllClick}
              inputProps={{ "aria-label": "select all elements" }}
            />
          </TableCell>
        )}
        {isArrayNotEmpty(tableHeaders) &&
          tableHeaders.map((headCell) => (
            <TableCell
              style={{ backgroundColor: headerColor }}
              key={headCell.id}
              align={
                isStringNullOrEmpty(headCell.align) ? "left" : headCell.align
              }
              padding={headCell.disablePadding ? "none" : "normal"}
              // //cheetat
              // className={headCell.className ? headCell.className : {}}
              // //
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{
                fontWeight: "medium",
                bgcolor: headerColor,
                fontSize: "9pt",
                // fontSize: "8.5pt",
              }} // change table header bg color
            >
              <TableSortLabel
                className="fw-bold"
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {
    selectedRows,
    tableTopLeft,
    OnActionButtonClick,
    tableTopRight,
    actionIcon,
    extraInfo,
  } = props;
  const numSelected = selectedRows.length;
  let mCube = 0;
  let weight = 0;
  let itemDimension = 0;

  if (extraInfo) {
    selectedRows.map((item) => {
      weight = weight + item.ProductWeight;

      itemDimension = volumeCalc(item.ProductDimensionDeep, item.ProductDimensionWidth, item.ProductDimensionHeight)
      // itemDimension = ((item.ProductDimensionDeep *
      //   item.ProductDimensionWidth *
      //   item.ProductDimensionHeight) /
      //   1000000).toFixed(3)

      mCube = parseFloat(mCube) + parseFloat(itemDimension)
    });
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected{" "}
          {extraInfo && ` | ${round(mCube, 3)} m³ | ${round(weight, 2)} kg`}
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} id="tableTitle" component="div">
          {tableTopLeft}
        </Typography>
      )}
      {numSelected > 0 ? (
        <div>{actionIcon}</div>
      ) : tableTopRight === null ? (
        typeof OnActionButtonClick === "function" && (
          <IconButton
            onClick={() => {
              OnActionButtonClick(selectedRows);
            }}
          >
            <AddIcon />
          </IconButton>
        )
      ) : (
        tableTopRight
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  selectedRows: PropTypes.array.isRequired,
};

TableComponents.propTypes = {
  tableOptions: PropTypes.object.isRequired,
  paginationOptions: PropTypes.array,
  tableHeaders: PropTypes.array.isRequired,
  tableRows: PropTypes.object.isRequired,
  Data: PropTypes.array.isRequired,
  selectedIndexKey: PropTypes.string.isRequired,
};

export default function TableComponents(props) {
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [elevation, setElevation] = React.useState(
    isStringNullOrEmpty(props.elevation) ? 1 : props.elevation
  );
  // render from props
  // table settings
  const [stickyTableHeader, setTableHeaderSticky] = React.useState(
    isObjectUndefinedOrNull(props.tableOptions) &&
      props.tableOptions.stickyTableHeader === null
      ? true
      : props.tableOptions.stickyTableHeader
  );
  const [stickyTableHeight, setTableStickyHeight] = React.useState(
    isObjectUndefinedOrNull(props.tableOptions) &&
      props.tableOptions.stickyTableHeight === null
      ? 300
      : props.tableOptions.stickyTableHeight
  );
  const [dense, setDense] = React.useState(
    isObjectUndefinedOrNull(props.tableOptions) &&
      props.tableOptions.dense === null
      ? false
      : props.tableOptions.dense
  );
  const [tableTopRight, setTableTopRight] = React.useState(
    isObjectUndefinedOrNull(props.tableTopRight) || props.tableTopRight === null
      ? null
      : props.tableTopRight
  );

  //pagination settings
  const [rowsPerPage, setRowsPerPage] = React.useState(
    isArrayNotEmpty(props.paginationOptions) ? props.paginationOptions[0] : props.Data.length
  );
  const [pagePaginationOptions, setPagePaginationOptions] = React.useState(
    isArrayNotEmpty(props.paginationOptions) ? props.paginationOptions : []
  );

  //table and table data settings
  const [order, setOrder] = React.useState(
    isObjectUndefinedOrNull(props.tableOptions) &&
      props.tableOptions.tableOrderBy === null
      ? "asc"
      : props.tableOptions.tableOrderBy
  );
  const [orderBy, setOrderBy] = React.useState(
    isObjectUndefinedOrNull(props.tableOptions) &&
      props.tableOptions.sortingIndex === null
      ? ""
      : props.tableOptions.sortingIndex
  );
  const [objectKey, setObjectKey] = React.useState(
    !isStringNullOrEmpty(props.selectedIndexKey) ? props.selectedIndexKey : "id"
  );
  const [rows, setRows] = React.useState(props.Data);
  const [tableHeaders, setTableHeaders] = React.useState(
    isArrayNotEmpty(props.tableHeaders) ? props.tableHeaders : []
  );
  const [renderCheckbox, setRenderCheckbox] = React.useState(
    !isObjectUndefinedOrNull(props.tableRows.checkbox)
      ? props.tableRows.checkbox
      : true
  );
  const [onRowSelect, setOnRowSelect] = React.useState(
    !isObjectUndefinedOrNull(props.tableRows.onRowClickSelect)
      ? props.tableRows.onRowClickSelect
      : false
  );

  // useEffect(() => {
  // }, [props.Data]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setTableHeaders(props.tableHeaders);
      setRows(props.Data);
      setTableTopRight(props.tableTopRight);
      setObjectKey(props.selectedIndexKey);
    }
    return () => {
      setTableHeaders([]);
      setRows([]);
      setTableTopRight(null);
      setObjectKey("id");
      isMounted = false;
    };
  }, [props]);

  useEffect(() => {
    if (props.CallResetSelected === true) {
      setSelected([]);
    }
  }, [props.CallResetSelected]);

  useEffect(() => {
    setRenderCheckbox(props.tableRows.checkbox);
  }, [props.tableRows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked && !isArrayNotEmpty(selected)) {
      let newSelecteds;
      if (typeof rows[0].ProductDimensionDeep !== "undefined") {
        newSelecteds = rows.map((n) => n).filter(el => el.ProductDimensionDeep > 0 && el.ProductDimensionWidth > 0 && el.ProductDimensionHeight > 0 && el.ProductWeight > 0);
      } else {
        newSelecteds = rows.map((n) => n);
      }
      setSelected(newSelecteds);
      if (typeof props.onSelectAllClick === "function")
        props.onSelectAllClick(newSelecteds)
      return;
    } else {
      setSelected([]);
      if (typeof props.onSelectAllClick === "function")
        props.onSelectAllClick([])
    }
  };

  const handleSelectItem = (event, key, index) => {
    event.stopPropagation();

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
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    props.onSelectRow && props.onSelectRow(newSelected, index);
  };

  const handleRowClick = (event, row, index) => {
    if (!onRowSelect) {
      if (typeof props.onTableRowClick !== "undefined")
        props.onTableRowClick(event, row);
    } else {
      handleSelectItem(event, row, index);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const TableData =
    rowsPerPage !== -1
      ? stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
      : stableSort(rows, getComparator(order, orderBy));
  const checkboxColor = !isObjectUndefinedOrNull(props.tableRows.checkboxColor)
    ? props.tableRows.checkboxColor
    : "primary";
  const headerColor = !isObjectUndefinedOrNull(props.tableRows.headerColor)
    ? props.tableRows.headerColor
    : "";
  const emptyRowColSpan = renderCheckbox
    ? tableHeaders.length + 1
    : tableHeaders.length;

  return (
    <Box className="my-1" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} elevation={elevation}>
        {(typeof props.tableTopRight !== "undefined" || typeof props.tableTopLeft !== "undefined" || selected.length > 0) && (
          <EnhancedTableToolbar
            selectedRows={selected}
            tableTopLeft={props.tableTopLeft}
            tableTopRight={tableTopRight}
            OnActionButtonClick={props.onActionButtonClick}
            actionIcon={props.actionIcon}
            extraInfo={props.extraInfo}
          />
        )}

        <TableContainer
          sx={{ maxHeight: stickyTableHeader ? stickyTableHeight : "100%" }}
        >
          <Table
            stickyHeader={stickyTableHeader}
            sx={{ width: "100%" }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={isArrayNotEmpty(rows) ? rows.length : 0}
              tableHeaders={tableHeaders}
              renderCheckbox={renderCheckbox}
              checkboxColor={checkboxColor}
              headerColor={headerColor}
            />
            <TableBody>
              {isArrayNotEmpty(TableData) &&
                TableData.map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const volume = volumeCalc(row.ProductDimensionDeep, row.ProductDimensionWidth, row.ProductDimensionHeight)
                  let errorData = (!isObjectUndefinedOrNull(row.ProductWeight) && row.ProductWeight === 0) || (!isObjectUndefinedOrNull(volume) && volume === 0)

                  if (!isObjectUndefinedOrNull(row.Description) && row.Description === 'Delivery Fee') {
                    errorData = false
                  }

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, row, index)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={"row_" + index}
                      selected={isItemSelected}
                      style={{ cursor: "pointer", backgroundColor: errorData ? '#FF9494' : '' }}
                    >
                      {renderCheckbox && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color={checkboxColor}
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={(event) => !errorData && handleSelectItem(event, row, index)}
                          />
                        </TableCell>
                      )}
                      {!isObjectUndefinedOrNull(
                        props.tableRows.renderTableRows
                      ) && props.tableRows.renderTableRows(row, index)}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={emptyRowColSpan}></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {pagePaginationOptions.length !== 0 && (
          <TablePagination
            rowsPerPageOptions={pagePaginationOptions}
            component="div"
            colSpan={3}
            count={isArrayNotEmpty(rows) ? rows.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        )}
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

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 1 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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
