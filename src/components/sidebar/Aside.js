import React, { useState } from 'react';
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import sidebar_items from './data/SidebarConfiguration';
import SubMenuItems from "./SubMenuItems"
import SidebarProfile from "./SidebarProfile"
import SidebarButtons from "./SidebarButtons";
import { resetLogonUser } from "../../components/auth/AuthManagement"
// utility and icons
import { isStringNullOrEmpty } from "../../tools/Helpers"
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';

function mapStateToProps(state) {
  return {
    user: state.counterReducer["user"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUserProfile: () => dispatch(GitAction.CallUserProfile()),
  };
}

const Aside = ({ rtl, toggled, handleToggleSidebar, sidebar }) => {
  const [isCollapsed, setIsCollapsed] = useState(false) // check the sidebar is actually collapsed 
  const [collapsed, setCollapsed] = useState(false)

  const handleCollapseSidebar = (value) => {
    setIsCollapsed(typeof value !== "undefined" && value !== null ? value : !isCollapsed);
    setCollapsed(typeof value !== "undefined" && value !== null ? value : !isCollapsed);
  };

  return (
    <ProSidebar
      image={false} // can set the image background under this option
      rtl={rtl}
      toggled={toggled}
      collapsed={collapsed}
      breakPoint="md"
      onToggle={handleToggleSidebar}
      onMouseEnter={() => { isCollapsed && setCollapsed(false) }}
      onMouseLeave={() => { isCollapsed && setCollapsed(true) }}
      style={{ zIndex: 1300 }}
    >
      <SidebarHeader>
        <SidebarButtons handleCollapseSidebar={handleCollapseSidebar} isCollapsed={isCollapsed} />
        {
          !isCollapsed && <SidebarProfile />
        }
      </SidebarHeader>

      <SidebarContent className="thin-scrollbar">
        <Menu iconShape="circle" innerSubMenuArrows={false} popperArrow={false} subMenuBullets={false}>
          {
            sidebar.length > 0 && sidebar.map((item, index) => {
              console.log(item)
              return (
                typeof item.submenus === "undefined" || item.submenus === null || item.submenus === "null" ?
                  <MenuItem
                    key={item.title}
                    prefix={typeof item.prefix !== "undefined" && item.prefix !== null ? item.prefix : null}
                    icon={typeof item.icon !== "undefined" && item.icon !== null ? sidebar_items[item.icon].icon : ""}
                    suffix={typeof item.suffix !== "undefined" && item.suffix !== null ? item.suffix : null}
                  >
                    {item.title} {!isStringNullOrEmpty(item.page) ? <Link to={item.page} /> : ""}
                  </MenuItem>
                  :
                  <SubMenuItems key={'submenu-' + item.title} item={item} />

              )
            })
          }
        </Menu>
      </SidebarContent >
      <SidebarFooter style={{ textAlign: 'center' }}>
        <div className="sidebar-btn-wrapper" style={{ padding: '20px 24px', }}>
          <Button onClick={(e) => { resetLogonUser() }}><LogoutIcon /></Button>
        </div>
      </SidebarFooter>
    </ProSidebar >
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Aside));