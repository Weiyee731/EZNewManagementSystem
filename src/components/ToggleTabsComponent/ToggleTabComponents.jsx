import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { isArrayNotEmpty, isStringNullOrEmpty } from '../../tools/Helpers';
import PropTypes from 'prop-types'

export default function ToggleTabComponents(props) {
    const { Tabs, fullWidth, size, orientation, color, style } = props
    const [alignment, setAlignment] = React.useState(isArrayNotEmpty(Tabs) ? Tabs[0].key : "");

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null)
            setAlignment(newAlignment);

        if (typeof props.onChange === "function")
            props.onChange(newAlignment)
    };

    return (
        <ToggleButtonGroup
            color={isStringNullOrEmpty(color) ? "standard" : color}
            value={alignment}
            exclusive
            onChange={handleChange}
            fullWidth={isStringNullOrEmpty(fullWidth) ? true : fullWidth}
            size={isStringNullOrEmpty(size) ? "medium" : size}
            orientation={isStringNullOrEmpty(orientation) ? "horizontal" : orientation}
        >
            {isArrayNotEmpty(Tabs) && Tabs.map((tab, index) => { return <ToggleButton style={{ fontWeight: 'bold' }} key={"tab" + tab.key} value={tab.key}>{tab.children}</ToggleButton> })}
        </ToggleButtonGroup>
    );
}

ToggleTabComponents.propTypes = {
    Tabs: PropTypes.array.isRequired,
    color: PropTypes.string,
    onChange: PropTypes.func,
    fullWidth: PropTypes.bool,
    size: PropTypes.string,
    orientation: PropTypes.string,
};
