import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { isObjectUndefinedOrNull, isStringNullOrEmpty } from "../../tools/Helpers";
import PropTypes from "prop-types";
import "./Searchbar.css"

const SearchBox = (props) => {
    return (
        <TextField
            className={(isStringNullOrEmpty(props.className)) ? "searchbar-input mb-2" : props.className}
            fullWidth
            label={isStringNullOrEmpty(props.label) ? "" : props.label}
            id="search-bar"
            placeholder={isStringNullOrEmpty(props.placeholder) ? "Type to search" : props.placeholder}
            helperText={isStringNullOrEmpty(props.helperText) ? "" : props.helperText}
            onChange={(e) => props.onChange(e)}
            autoFocus={props.autoFocus?props.autoFocus:false}
            size="small"
            margin="dense"
            variant="outlined"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

SearchBox.propTypes = {
    style: PropTypes.object,
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,

}
export default SearchBox;
