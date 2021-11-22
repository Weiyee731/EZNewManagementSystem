import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { isArrayNotEmpty } from "../../tools/Helpers"
import "./Tabs.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs(props) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  React.useEffect(() => {

  }, [])

  const { Headers, Body } = props
  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
          centered
          sx={{ bgcolor: "#0c1e35", color: "white" }}
          selectionFollowsFocus
        >
          {
            isArrayNotEmpty(Headers) && Headers.map((el, index) => {
              return <Tab wrapped key={index} label={el} {...a11yProps(index)} />
            })
          }
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {
          isArrayNotEmpty(Body) && Body.map((children, index) => {
            return (
              <TabPanel key={index} value={value} index={index} dir={theme.direction}>
                {children}
              </TabPanel>
            )
          })
        }
      </SwipeableViews>
    </Box>
  );
}

FullWidthTabs.propTypes = {
  Headers: PropTypes.array.isRequired,
  Body: PropTypes.array.isRequired,
};

/***************************************
 * Tutorial on using this components
 *
 * 1. In render function(), just follow the settings below
 *  <div className='w-100'>
      <FullWidthTabs 
          Headers={TabsHeaders}
          Body={TabsBody}
      />
    </div>

    whereby the settings is

    const TabsHeaders = ["All", "Tab 2"]        //headers, in strings
    const TabsBody = [<Table1 />, <Table2 />]   //body, the components that will be rendered in the tab
 *
 *
 *
 *
 *
 */