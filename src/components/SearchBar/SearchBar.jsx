import React, { useEffect } from "react"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import {
  isStringNullOrEmpty,
} from "../../tools/Helpers"
import Tooltip from "@mui/material/Tooltip"
import PropTypes from "prop-types"
import "./Searchbar.css"

const SearchBox = (props) => {
  const [searchKeywords, setSearchKeywords] = React.useState(props.value)
  useEffect(() => {
    setSearchKeywords(isStringNullOrEmpty(props.value) ? "" : props.value)
  }, [props.value])
  return (
    <TextField
      className={
        isStringNullOrEmpty(props.className)
          ? "searchbar-input"
          : props.className
      }
      fullWidth
      label={isStringNullOrEmpty(props.label) ? "" : props.label}
      id="search-bar"
      placeholder={
        isStringNullOrEmpty(props.placeholder)
          ? "Type to search"
          : props.placeholder
      }
      helperText={isStringNullOrEmpty(props.helperText) ? "" : props.helperText}
      onChange={(e) =>
        typeof props.onChange === "function" ? props.onChange(e) : {}
      }
      onKeyDown={(e) =>
        (e.key === "Enter" || e.keyCode === 13) &&
          typeof props.onChange === "function"
          ? props.onChange(e)
          : {}
      }
      autoFocus={props.autoFocus ? props.autoFocus : false}
      size="small"
      margin="normal"
      variant="outlined"
      value={searchKeywords}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              title={
                isStringNullOrEmpty(props.tooltipText)
                  ? "Search"
                  : props.tooltipText
              }
            >
              <IconButton
                onClick={() =>
                  typeof props.buttonOnClick === "function"
                    ? props.buttonOnClick()
                    : {}
                }
                disabled={
                  typeof props.disableButton !== "undefined" &&
                    typeof props.disableButton === "boolean"
                    ? props.disableButton
                    : false
                }
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  )
}

SearchBox.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
}
export default SearchBox
