import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { isArrayNotEmpty, isStringNullOrEmpty } from '../../tools/Helpers';

export default function ColorToggleButton(props) {
    const { Tabs, fullWidth, size, orientation } = props
    const [alignment, setAlignment] = React.useState(isArrayNotEmpty(Tabs) ? Tabs[0].key : "");

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) 
            setAlignment(newAlignment);

        if (typeof props.onChange === "function")
            props.onChange(newAlignment)
    };

    return (
        <ToggleButtonGroup
            color="standard"
            value={alignment}
            exclusive
            onChange={handleChange}
            fullWidth={isStringNullOrEmpty(fullWidth) ? true : fullWidth}
            size={isStringNullOrEmpty(size) ? "medium" : size}
            orientation={isStringNullOrEmpty(orientation) ? "horizontal" : orientation}
        >
            {isArrayNotEmpty(Tabs) && Tabs.map((tab, index) => { return <ToggleButton key={"tab" + tab.key} value={tab.key}>{tab.children}</ToggleButton> })}
        </ToggleButtonGroup>
    );
}

