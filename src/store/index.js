import { combineReducers, createStore, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { counterReducer } from "./reducer/gitReducer"; //reducers
import { gitEpic } from "./epic/gitEpic"; //epics

const rootEpic = combineEpics(
  gitEpic.User_Login,
  gitEpic.User_Logout,
  gitEpic.User_Profile,
  gitEpic.User_ProfileByID,
  gitEpic.User_ViewPage,
  gitEpic.Inventory_ViewStockList,
  gitEpic.Inventory_InsertStock,
  gitEpic.Inventory_UpdateStockDetailByGet,
  gitEpic.Inventory_UpdateStockDetailByPost,
  // gitEpic.Container_ViewContainer,
  gitEpic.Transaction_InsertTransaction,
  gitEpic.Transaction_UpdateTransactionStatus,
  gitEpic.Transaction_UpdateTransactionDetailHandling,
  gitEpic.Transaction_UpdateTransactionPayment,
  gitEpic.Transaction_ViewTransaction,
  gitEpic.Transaction_ViewTransactionByID,
  gitEpic.Transaction_DeleteTransaction,
  gitEpic.Inventory_InsertStockByPost,
  gitEpic.Inventory_GetFilteredStockList,
  gitEpic.Dashboard_View,
  gitEpic.Inventory_ViewStockListByDate,
  gitEpic.Inventory_ViewArchiveStockListByDate,
  gitEpic.Transaction_ViewArchiveTransaction,
  gitEpic.User_RegisterUsersByPost,
  gitEpic.User_UpdateUserProfile,
  gitEpic.User_DeleteUserProfile,

  gitEpic.Container_ViewContainer,
  gitEpic.Container_ViewContainerStatus,
  gitEpic.Container_AddContainer,
  gitEpic.Container_UpdateContainer,
  gitEpic.Container_DeleteContainer,
  gitEpic.Inventory_ViewStockByFilter,
  gitEpic.Inventory_AddStock,
  gitEpic.Inventory_UpdateStock,
  gitEpic.Inventory_DeleteStock,
  gitEpic.Inventory_UpdateStockContainer,

  gitEpic.Courier_ViewCourier,
  gitEpic.Notification_ViewNotification,
  gitEpic.Notification_AddNotification,
  gitEpic.Notification_UpdateNotification,
  gitEpic.Notification_DeleteNotification,

  
  gitEpic.User_ViewAreaCode,
  gitEpic.User_AddUserAreaCode,
  gitEpic.User_UpdateUserAreaCode,
  gitEpic.User_DeleteUserAreaCode,


);

const rootReducer = combineReducers({ counterReducer });
const epicMiddleware = createEpicMiddleware(rootEpic);
const createStoreWithMiddleware = applyMiddleware(epicMiddleware)(createStore);
export default createStoreWithMiddleware(rootReducer);
