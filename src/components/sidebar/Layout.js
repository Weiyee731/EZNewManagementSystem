import React, { useState } from 'react';
import Aside from './Aside';
import Main from './Main';
import { isUserLogon } from "../auth/AuthManagement"
import Login from "../../pages/Login/Login"

function Layout({ setLocale }) {
  const [rtl, setRtl] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [isLogon, setIsLogon] = useState(isUserLogon());

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  // set sidebar to the right
  const handleRtlChange = (checked) => {
    setRtl(checked);
    setLocale(checked ? 'ar' : 'en');
  };


  const handleToggleSidebar = (value) => {
    setToggled(value);
  };



  return (
    <div>
      {
        isLogon === true ?
          <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>

            <Aside
              image={false} // can set the background image for the sidebar here
              collapsed={collapsed}
              rtl={rtl}
              toggled={toggled}
              handleToggleSidebar={handleToggleSidebar}
            />
            <Main
              image={false} // can set the background image for the sidebar here
              toggled={toggled}
              collapsed={collapsed}
              rtl={rtl}
              handleToggleSidebar={handleToggleSidebar}
              handleCollapsedChange={handleCollapsedChange}
              handleRtlChange={handleRtlChange}
            />
          </div>
          :
          <Login />
      }
    </div >
  )
}

export default Layout;