import React, { useState } from 'react';
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

// utility and icons
import { isStringNullOrEmpty } from "../../tools/Helpers"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Aside = ({ rtl, toggled, handleToggleSidebar }) => {
  const [isCollapsed, setCollapse] = useState(false)

  const handleCollapseSidebar = (value) => {
    setCollapse(typeof value !== "undefined" && value !== null ? value : !isCollapsed);
  };


  return (
    <ProSidebar
      image={false} // can set the image background under this option
      rtl={rtl}
      toggled={toggled}
      collapsed={isCollapsed}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <SidebarButtons handleCollapseSidebar={handleCollapseSidebar} isCollapsed={isCollapsed} />
        {
          !isCollapsed && <SidebarProfile />
        }
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          {
            sidebar_items.length > 0 && sidebar_items.map((item, index) => {
              return (
                typeof item.submenus === "undefined" || item.submenus === null ?
                  <MenuItem
                    key={item.title}
                    prefix={typeof item.prefix !== "undefined" && item.prefix !== null ? item.prefix : null}
                    icon={typeof item.icon !== "undefined" && item.icon !== null ? item.icon : ""}
                    suffix={typeof item.suffix !== "undefined" && item.suffix !== null ? item.suffix : null}
                  >
                    {item.title} {!isStringNullOrEmpty(item.to) ? <Link to={item.to} /> : ""}
                  </MenuItem>
                  :
                  <SubMenuItems key={'submenu-' + item.title} item={item} handleCollapseSidebar={handleCollapseSidebar} />

              )
            })
          }
        </Menu>
      </SidebarContent >


      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{ padding: '20px 24px', }}
        >
          <a
            href="https://github.com/azouaoui-med/react-pro-sidebar"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <MenuOutlinedIcon />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              View Source
            </span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar >
  );
};

export default Aside;