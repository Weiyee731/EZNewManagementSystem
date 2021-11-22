/**
 * Bsaic use of template for the sidebar configuration, 
 * if wish to pass the parameter such as 'page/Id',
 * you can use page/:Id, and the passing param can be accessed using "this.props.params.match.Id",
 * ** REMARK :-> You should configure in Router Configuration as well
 *   {
        to: "/",    //if you are rendering submenu, leave 'to:' option to be blank, else put the link
        title: "Dashboard",
        icon: <MenuOutlinedIcon />,
        prefix: <span className="badge gray">3</span>,
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
        ]
    }
 */

import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FeedIcon from '@mui/icons-material/Feed';

const sidebar_items = [
    { icon: <DashboardIcon />},
    { icon: <AssignmentIndIcon />},
    { icon: <IndeterminateCheckBoxIcon />},
    { icon: <InsertDriveFileIcon />},
    { icon: <ReceiptLongIcon /> },
    { icon: <DescriptionIcon /> },
    { icon: <LocalAtmIcon /> },
    { icon: <FileUploadIcon /> },
    { icon: <AccountBalanceIcon /> },
    { icon: <PaymentsIcon /> },
    { icon: <ReceiptIcon />},
    { icon: <FeedIcon /> },
]

export default sidebar_items