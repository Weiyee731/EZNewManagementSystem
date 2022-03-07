import React from "react";
import { SubMenu, MenuItem } from 'react-pro-sidebar'
import { Link } from 'react-router-dom';
import { isStringNullOrEmpty } from "../../tools/Helpers"
import sidebar_items from './data/SidebarConfiguration';

const SubMenuItems = (props) => {
    const { item } = props
    const submenus = JSON.parse(item.submenus)
    return (
        <SubMenu
            key={'submenu-' + item.title}
            prefix={typeof item.prefix !== "undefined" && item.prefix !== null ? item.prefix : null}
            icon={typeof item.icon !== "undefined" && item.icon !== null ? sidebar_items[item.icon].icon : ""}
            suffix={typeof item.suffix !== "undefined" && item.suffix !== null ? item.suffix : null}
            title={item.title}
        >
            {
                typeof submenus !== "undefined" && submenus !== null && submenus.map((menuitem, index) => {
                    return (

                        typeof menuitem.submenus !== "undefined" && menuitem.submenus !== null && menuitem.submenus.length > 0 ?
                            <SubMenuItems key={'submenu-' + menuitem.item} item={menuitem} />
                            :
                            <MenuItem
                                key={"submenu-items-" + index}
                                prefix={typeof menuitem.prefix !== "undefined" && menuitem.prefix !== null ? menuitem.prefix : null}
                                icon={typeof menuitem.icon !== "undefined" && menuitem.icon !== null ? sidebar_items[menuitem.icon].icon : ""}
                                suffix={typeof menuitem.suffix !== "undefined" && menuitem.suffix !== null ? menuitem.suffix : null}
                            >
                                {menuitem.title} {!isStringNullOrEmpty(menuitem.page) ? <Link to={{ pathname: menuitem.page, state: menuitem.type }} /> : ""}
                            </MenuItem>
                    )
                })
            }
        </SubMenu>
    )
}

export default SubMenuItems