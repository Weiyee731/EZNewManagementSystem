import React, { useState } from 'react';
import Aside from './Aside';
import Main from './Main';
import { isUserLogon, getSidebaritems } from "../auth/AuthManagement";
import Login from "../../pages/Login/Login";
import "./styles/sidebar.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  const [rtl, setRtl] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [isLogon, setIsLogon] = useState(isUserLogon());
  const [sidebaritem, setSidebaritem] = useState(getSidebaritems());
  const [count, setCount] = useState(-1);

  const handleRtlChange = (checked) => {
    setRtl(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const renderSidebarItems = () => {
    try {
      return JSON.parse(sidebaritem)
    }
    catch (e) {
      return [];
    }
  }

  return (
    <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
      <ToastContainer />
      {
        isLogon === "true" ?
          <>
            <Aside
              image={false} // can set the background image for the sidebar here
              rtl={rtl}
              sidebar={renderSidebarItems()}
              toggled={toggled}
              handleToggleSidebar={handleToggleSidebar}
            />
            <Main
              image={false} // can set the background image for the sidebar here
              toggled={toggled}
              rtl={rtl}
              handleToggleSidebar={handleToggleSidebar}
              handleRtlChange={handleRtlChange}
            />
          </>
          :
          <Login />
      }
    </div >
  )
}

export default Layout;