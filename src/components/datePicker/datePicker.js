import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import { isObjectUndefinedOrNull, isStringNullOrEmpty } from '../../tools/Helpers';
import DateRangePicker from '@mui/lab/DateRangePicker';
import Box from '@mui/material/Box';


export default function ResponsiveDatePickers(props) {
  const [value, setValue] = React.useState(props.rangePicker ? [null, null] : new Date())
  const formats = {
    normalDate: "d/MM/yyyy",
    keyboardDate: "d/MM/yyyy",
  };
  const { startPickerPropsOptions, endPickerPropsOptions } = props

  const updateDateValue = (newValue) => {
    if (isObjectUndefinedOrNull(props.onChange) && typeof props.onChange !== "function")
      setValue(newValue)
    else{
      props.onChange(newValue)
      setValue(newValue)
    }
  }

  return (
    <LocalizationProvider dateFormats={formats} dateAdapter={AdapterDateFns}>
      {
        props.rangePicker ?
          <DateRangePicker
            startText={(isObjectUndefinedOrNull(startPickerPropsOptions) && isObjectUndefinedOrNull(startPickerPropsOptions.placeholder)) ? "From" : startPickerPropsOptions.placeholder}
            endText={(isObjectUndefinedOrNull(endPickerPropsOptions) && isObjectUndefinedOrNull(endPickerPropsOptions.placeholder)) ? "To" : endPickerPropsOptions.placeholder}
            value={value}
            onChange={(newValue) => { updateDateValue(newValue) }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField
                  {...startProps}
                  className={(isObjectUndefinedOrNull(startPickerPropsOptions) && isStringNullOrEmpty(startPickerPropsOptions.className)) ? "" : startPickerPropsOptions.className}
                  variant={(isObjectUndefinedOrNull(startPickerPropsOptions) && isStringNullOrEmpty(startPickerPropsOptions.variant)) ? "standard" : startPickerPropsOptions.varinat}
                />
                <Box sx={{ mx: 1 }}> to </Box>
                <TextField
                  {...endProps}
                  className={(isObjectUndefinedOrNull(endPickerPropsOptions) && isObjectUndefinedOrNull(endPickerPropsOptions.className)) ? {} : endPickerPropsOptions.className}
                  variant={(isObjectUndefinedOrNull(endPickerPropsOptions) && isStringNullOrEmpty(endPickerPropsOptions.variant)) ? "standard" : endPickerPropsOptions.varinat}
                />
              </React.Fragment>
            )}
          />
          :
          <Stack spacing={3}>
            <DatePicker
              disableFuture
              label={props.title}
              openTo={isStringNullOrEmpty(props.openTo) ? "day" : props.openTo}
              views={['year', 'month', 'day']}
              value={props.value}
              readOnly={props.readOnly ? props.readOnly : false}
              onChange={(e) => updateDateValue(e)}
              renderInput={(params) => <TextField {...params} variant={isStringNullOrEmpty(props.variant) ? "standard" : props.variant} />}
            />
          </Stack>

      }

    </LocalizationProvider>
  );
}