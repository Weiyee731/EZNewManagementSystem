import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Aside = ({  collapsed, rtl, toggled, handleToggleSidebar }) => {
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
          <MenuItem
            icon={<MenuOutlinedIcon />}
            suffix={<span className="badge red">Testing</span>}
          >
            Testing
          </MenuItem>
          <MenuItem icon={<MenuOutlinedIcon />}> Testing </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title={"Testing"}
            icon={<MenuOutlinedIcon />}
          >
            <MenuItem>{"Testing"} 1</MenuItem>
            <MenuItem>{"Testing"} 2</MenuItem>
            <MenuItem>{"Testing"} 3</MenuItem>
          </SubMenu>
          <SubMenu
            prefix={<span className="badge gray">3</span>}
            title={"Testing"}
            icon={<MenuOutlinedIcon />}
          >
            <MenuItem>{"Testing"} 1</MenuItem>
            <MenuItem>{"Testing"} 2</MenuItem>
            <MenuItem>{"Testing"} 3</MenuItem>
          </SubMenu>
          <SubMenu title={"Multi Level"} icon={<MenuOutlinedIcon />}>
            <MenuItem>{"Testing"} 1 </MenuItem>
            <MenuItem>{"Testing"} 2 </MenuItem>
            <SubMenu title={`${"Testing"} 3`}>
              <MenuItem>{"Testing"} 3.1 </MenuItem>
              <MenuItem>{"Testing"} 3.2 </MenuItem>
              <SubMenu title={`${"Testing"} 3.3`}>
                <MenuItem>{"Testing"} 3.3.1 </MenuItem>
                <MenuItem>{"Testing"} 3.3.2 </MenuItem>
                <MenuItem>{"Testing"} 3.3.3 </MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>
        </Menu>
      </SidebarContent>

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
    </ProSidebar>
  );
};

export default Aside;