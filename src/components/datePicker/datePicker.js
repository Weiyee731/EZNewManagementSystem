import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';

export default function ResponsiveDatePickers(props) {
  const [value, setValue] = React.useState(new Date());
  const formats = {
    normalDate: "d/MM/yyyy",
    keyboardDate: "d/MM/yyyy",
  };
// console.log(props.value)
  return (
    <LocalizationProvider dateFormats={formats} dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <DatePicker
          disableFuture
          label={props.title}
          openTo="year"
          views={['year', 'month', 'day']}
          value={props.value}
          readOnly={props.readOnly?props.readOnly:false}
          onChange={(e) => props.onChange(e)}  
          renderInput={(params) => <TextField {...params} variant="standard" />}
        />
      </Stack>
    </LocalizationProvider>
  );
}