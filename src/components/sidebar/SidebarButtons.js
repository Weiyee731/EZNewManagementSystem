import React from 'react';
import IconButton from '@mui/material/IconButton';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

export default function SidebarButtons(props) {
    console.log(props)
    return (
        !props.isCollapsed ?
            <div className="p-2 w-100 clearfix">
                <div className="float-start">
                    <IconButton aria-label="notification icon" size="medium" style={{ color: 'white' }}>
                        <NotificationsActiveIcon />
                    </IconButton>
                </div>
                <div className="float-end">
                    {
                        <IconButton aria-label="collapse sidebar" size="medium" style={{ color: 'white' }} onClick={() => props.handleCollapseSidebar()}>
                            <MenuOpenIcon />
                        </IconButton>
                    }
                </div>
            </div >
            :
            <div className="w-100 d-flex">
                <IconButton aria-label="notification icon" size="large" style={{ color: 'white', margin: 'auto', padding: '20px' }} onClick={() => props.handleCollapseSidebar()}>
                    <MenuIcon />
                </IconButton>
            </div>

    )
}