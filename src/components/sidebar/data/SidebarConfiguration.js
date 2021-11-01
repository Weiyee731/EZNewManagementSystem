import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const sidebar_items = [
    {
        to: "/",
        title: "Dashboard",
        icon: <MenuOutlinedIcon />,
        prefix: <span className="badge gray">3</span>,
        suffix: <span className="badge red">3</span>,
    },
    {
        to: "/",
        title: "Submenu",
        icon: <MenuOutlinedIcon />,
        suffix: <span className="badge red">3</span>,
        submenus: [
            {
                to: "/Report",
                title: "Submenu1",
                icon: <MenuOutlinedIcon />,
                suffix: <span className="badge red"> 2.1 </span>,
                submenus: [
                    {
                        to: "/Report",
                        title: "Submenu1.1.1.1",
                        icon: <MenuOutlinedIcon />,
                        suffix: <span className="badge red"> 2.1 </span>,
                    }
                ]
            },
            {
                to: "/",
                title: "Submenu2",
                icon: <MenuOutlinedIcon />,
                suffix: <span className="badge red"> 2.2 </span>
            }
        ]
    },
]

export default sidebar_items