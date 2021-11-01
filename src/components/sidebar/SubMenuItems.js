import React from "react";
import { SubMenu, MenuItem } from 'react-pro-sidebar'
import { Link } from 'react-router-dom';
import { isStringNullOrEmpty } from "../../tools/Helpers"

const SubMenuItems = (props) => {
    const { item } = props
    console.log(item)
    return (
        <SubMenu
            prefix={typeof item.prefix !== "undefined" && item.prefix !== null ? item.prefix : null}
            icon={typeof item.icon !== "undefined" && item.icon !== null ? item.icon : ""}
            suffix={typeof item.suffix !== "undefined" && item.suffix !== null ? item.suffix : null}
            title={item.title}
        >
            {
                typeof item.submenus !== "undefined" && item.submenus !== null && item.submenus.map((menuitem, index) => {
                    return (
                        typeof menuitem.submenus !== "undefined" && menuitem.submenus !== null && menuitem.submenus.length > 0 ?
                            <SubMenuItems item={menuitem} />
                            :
                            <MenuItem
                                prefix={typeof menuitem.prefix !== "undefined" && menuitem.prefix !== null ? menuitem.prefix : null}
                                icon={typeof menuitem.icon !== "undefined" && menuitem.icon !== null ? menuitem.icon : ""}
                                suffix={typeof menuitem.suffix !== "undefined" && menuitem.suffix !== null ? menuitem.suffix : null}
                            >
                                {menuitem.title} {!isStringNullOrEmpty(menuitem.to) ? <Link to={menuitem.to} /> : ""}
                            </MenuItem>
                    )
                })
            }
        </SubMenu>
    )
}

export default SubMenuItems