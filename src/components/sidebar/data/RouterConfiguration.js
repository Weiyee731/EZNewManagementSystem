import Dashboard from "../../../pages/Dashboard/Dashboard";
import UserManagement from '../../../pages/UserManagement/UserManagement';
import OverallStock from "../../../pages/Stock/OverallStock/OverallStock";
import StockGoods from "../../../pages/Stock/StockGoods/StockGoods";
import CreditNote from '../../../pages/Reporting/CreditNote/CreditNote';
import DeliveryOrder from "../../../pages/Reporting/DeliveryOrder/DeliveryOrder";
import Invoice from "../../../pages/Reporting/Invoice/Invoice";
import DataManagement from "../../../pages/DataManagement/DataManagement";
import AllPayments from "../../../pages/Payments/AllPayments/AllPayments";
import BalanceSettlement from "../../../pages/Payments/BalanceSettlement/BalanceSettlement";
import Statements from "../../../pages/Statements/Statements";

const routes = [
    {
        path: "/",
        exact: true,
        element: <Dashboard />,
    },
    {
        path: "/UserManagement",
        exact: true,
        element: <UserManagement />,
    },
    {
        path: "/OverallStock",
        exact: true,
        element: <OverallStock />,
    },
    {
        path: "/StockGoods",
        exact: true,
        element: <StockGoods />,
    },
    {
        path: "/Invoice",
        exact: true,
        element: <Invoice />,
    },
    {
        path: "/DeliveryOrder",
        exact: true,
        element: <DeliveryOrder />,
    },
    {
        path: "/CreditNote",
        exact: true,
        element: <CreditNote />,
    },
    {
        path: "/ImportExcelData",
        exact: true,
        element: <DataManagement />,
    },
    {
        path: "/AllPayments",
        exact: true,
        element: <AllPayments />,
    },
    {
        path: "/BalanceSettlement",
        exact: true,
        element: <BalanceSettlement />,
    },
    {
        path: "/Statements",
        exact: true,
        element: <Statements />,
    },

]

export default routes