import Dashboard from "../../../pages/Dashboard/Dashboard";
import Login from "../../../pages/Login/Login";
import UserManagement from '../../../pages/UserManagement/UserManagement';
import OverallStock from "../../../pages/Stock/OverallStock/OverallStock";
import StockGoods from "../../../pages/Stock/StockGoods/StockGoods";
import CreditNote from '../../../pages/Reporting/CreditNote/CreditNote';
import DeliveryOrder from "../../../pages/Reporting/DeliveryOrder/DeliveryOrder";
import Invoice from "../../../pages/Reporting/Invoice/Invoice";
import CreateInvoice from "../../../pages/Reporting/Invoice/CreateInvoice";
import InvoiceDetail from "../../../pages/Reporting/Invoice/InvoiceDetail";
import DataManagement from "../../../pages/DataManagement/DataManagement";
import AllPayments from "../../../pages/Payments/AllPayments/AllPayments";
import BalanceSettlement from "../../../pages/Payments/BalanceSettlement/BalanceSettlement";
import Statements from "../../../pages/Statements/Statements";
import TransactionHistory from "../../../pages/Statements/TransactionHistory";
import TransactionHistoryDetail from "../../../pages/Statements/TransactionHistoryDetail";
import UserDetail from "../../../pages/UserManagement/UserDetail"
// import AddUser from "../../../pages/UserManagement/AddUser";
import EditStockGoods from "../../../pages/Stock/StockGoods/EditStockGoods";
import ProformaList from "../../../pages/Reporting/Invoice/ProformaList";
import ArchivedStock from "../../../pages/ArchivedData/ArchivedStock/ArchivedStock.jsx";
import ArchivedTransaction from "../../../pages/ArchivedData/ArchivedTransaction/ArchivedTransaction.js";
import PendingToLoad from "../../../pages/Container/PendingToLoad";
import { WarehouseStock } from "../../../pages/Stock/WarehouseStockManagement";
import NotificationList from "../../../pages/Notification/NotificationList"
import ContainerListing from "../../../pages/Container/ContainerListing/ContainerListing.js";

const routes = [
    {
        path: "/",
        exact: true,
        element: <Login />,
    },
    {
        path: "/Dashboard",
        exact: true,
        element: <Dashboard />,
    },
    {
        path: "/UserManagement",
        exact: true,
        element: <UserManagement />,
    },
    {
        path: "/OverallStockListing",
        exact: true,
        element: <OverallStock typeIndicator="overall" />,
    },
    {
        path: "/StockGoods",
        exact: true,
        element: <OverallStock typeIndicator="approve" />,
        // typeIndicator="approve"
    },
    {
        path: "/EditStockGoods",
        exact: true,
        element: <OverallStock />,
    },
    {
        path: "/Invoice",
        exact: true,
        element: <Invoice />,
    },
    {
        path: "/CreateInvoice",
        exact: true,
        element: <CreateInvoice />,
    },
    {
        path: "/InvoiceDetail/:transactionid",
        exact: true,
        element: <InvoiceDetail />,
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
    {
        path: "/TransactionHistory",
        exact: true,
        element: <TransactionHistory />,
    },
    {
        path: "/TransactionHistoryDetail/:transactionid",
        exact: true,
        element: <TransactionHistoryDetail />,
    },
    {
        path: "/UserDetail/:userid/:usercode",
        exact: true,
        element: <UserDetail />,
    },
    {
        path: "/ProformaList",
        exact: true,
        element: <ProformaList />,
    },
    {
        path: "/ArchivedStock",
        exact: true,
        element: <ArchivedStock />,
    },
    {
        path: "/ArchivedTransaction",
        exact: true,
        element: <ArchivedTransaction />,
    },
    {
        path: "/PendingToLoad",
        exact: true,
        element: <PendingToLoad />,
    },
    {
        path: "/WarehouseStockManagement",
        exact: true,
        element: <WarehouseStock />,
    },
    {
        path: "/notification",
        exact: true,
        element: <NotificationList />,
    },


    {
        path: "/ContainerListing",
        exact: true,
        element: <ContainerListing typeIndicator="overall" />,
    },
]

export default routes