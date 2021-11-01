import React from 'react';
import { Link } from 'react-router-dom';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import sidebar_items from './data/SidebarConfiguration';
import SubMenuItems from "./SubMenuItems"

// utility and icons
import { isStringNullOrEmpty } from "../../tools/Helpers"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Aside = ({ collapsed, rtl, toggled, handleToggleSidebar }) => {
  return (
    <ProSidebar
      image={false} // can set the image background under this option
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Testing
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          {
            sidebar_items.length > 0 && sidebar_items.map((item, index) => {
              return (
                typeof item.submenus === "undefined" || item.submenus === null  ?
                  <MenuItem
                    prefix={typeof item.prefix !== "undefined" && item.prefix !== null ? item.prefix : null}
                    icon={typeof item.icon !== "undefined" && item.icon !== null ? item.icon : ""}
                    suffix={typeof item.suffix !== "undefined" && item.suffix !== null ? item.suffix : null}
                  >
                    {item.title} {!isStringNullOrEmpty(item.to) ? <Link to={item.to} /> : ""}
                  </MenuItem>
                  :
                  <SubMenuItems item={item} />

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