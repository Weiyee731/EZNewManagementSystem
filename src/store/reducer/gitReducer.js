import { GitAction } from "../action/gitAction";

const INITIAL_STATE = {
  loading: false,
  logonUser: [],
  user: [],
  userProfile: [],

  sidebars: [],
  stocks: [],
  stockReturn: [],
  stockApproval: [],
  // AllContainer: [],
  transactions: [],
  transaction: [],
  transactionReturn: [],
  dashboard: [],
  archivedData: [],
  userManagementApproval: [],
  handlingChargeReturn: [],

  container: [],
  containerAction: [],
  containerStatus: [],
  inventoryStock: [],
  inventoryStockAction: [],
  courier: [],
  notificationAction: [],
  notification: [],
  userAreaCode: [],
  userAreaCodeAction :[]
};

export function counterReducer(state = INITIAL_STATE, action) {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////
  switch (action.type) {
    case GitAction.Login:
      return Object.assign({}, state, { loading: true });
    case GitAction.LoginSuccess:
      return Object.assign({}, state, {
        loading: false,
        logonUser: action.payload,
        sidebars: action.payload2
      });

    case GitAction.Logout:
      return Object.assign({}, state, { loading: true });
    case GitAction.UserLoggedOut:
      return Object.assign({}, state, {
        loading: false,
        logonUser: action.payload
      });
    case GitAction.ClearLogonUser:
      return Object.assign({}, state, {
        loading: false,
        logonUser: []
      });

    case GitAction.GetUserProfile:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotUserProfile:
      return Object.assign({}, state, {
        loading: false,
        user: action.payload
      });
    case GitAction.ResetUserProfile:
      return Object.assign({}, state, { userProfile: [] });

    case GitAction.GetUserProfileByID:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotUserProfileByID:
      return Object.assign({}, state, {
        loading: false,
        userProfile: action.payload
      });
    case GitAction.ResetUserProfileByID:
      return Object.assign({}, state, { userProfile: [] });


    ///////////////////////////////////////////////////  sidebar configuration ///////////////////////////////////////////////////

    case GitAction.FetchSidebar:
      return Object.assign({}, state, { loading: true });
    case GitAction.SidebarFetched:
      return Object.assign({}, state, {
        loading: false,
        sidebars: action.payload
      });
    case GitAction.ResetSidebar:
      return Object.assign({}, state, { sidebars: [] });


    ///////////////////////////////////////////////////  stock management ///////////////////////////////////////////////////

    case GitAction.FetchStocks:
      return Object.assign({}, state, { loading: true });
    case GitAction.StocksFetched:
      return Object.assign({}, state, {
        loading: false,
        stocks: action.payload
      });
    case GitAction.GetFilteredInventory:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotFilteredInventory:
      return Object.assign({}, state, {
        loading: false,
        stocks: action.payload
      });
    case GitAction.GetFilteredInventoryByDate:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotFilteredInventoryByDate:
      return Object.assign({}, state, {
        loading: false,
        stocks: action.payload
      });
    case GitAction.ResetStocksList:
      return Object.assign({}, state, { stocks: [] });

    case GitAction.InsertNewStock:
      return Object.assign({}, state, { loading: true });
    case GitAction.NewStockInserted:
      return Object.assign({}, state, {
        loading: false,
        stockReturn: action.payload
      });
    case GitAction.ResetStockReturn:
      return Object.assign({}, state, { stockReturn: [] });

    case GitAction.UpdateInventoryStockStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdateDInventoryStockStatus:
      return Object.assign({}, state, {
        loading: false,
        stockApproval: action.payload
      });
    case GitAction.ResetStockStatusReturn:
      return Object.assign({}, state, { stockApproval: [] });

    case GitAction.UpdateStockDetailByPost:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedStockDetailByPost:
      return Object.assign({}, state, {
        loading: false,
        stockApproval: action.payload
      });
    case GitAction.UpdateStockDetailByGet:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedStockDetailByGet:
      return Object.assign({}, state, {
        loading: false,
        stockApproval: action.payload
      });
    case GitAction.ResetUpdatedStockDetail:
      return Object.assign({}, state, { stockApproval: [] });

    // case GitAction.ViewContainer:
    //   return Object.assign({}, state, { loading: true });
    // case GitAction.ViewedContainer:
    //   return Object.assign({}, state, {
    //     loading: false,
    //     AllContainer: action.payload
    //   });
    // case GitAction.ResetViewedContainer:
    //   return Object.assign({}, state, { stockReturn: [] });

    case GitAction.InsertStockByPost:
      return Object.assign({}, state, { loading: true });
    case GitAction.StockInsertedByPost:
      return Object.assign({}, state, {
        loading: false,
        stockApproval: action.payload
      });
    case GitAction.ResetInsertedStockReturn:
      return Object.assign({}, state, { stockApproval: [] });

    /////////////////////////////////////////////////// Transaction Management ///////////////////////////////////////////////////

    case GitAction.InsertNewTransaction:
      return Object.assign({}, state, { loading: true });
    case GitAction.NewTransactionInserted:
      return Object.assign({}, state, {
        loading: false,
        transactionReturn: action.payload
      });
    case GitAction.UpdateTransaction:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedTransaction:
      return Object.assign({}, state, {
        loading: false
      });
    case GitAction.UpdateTransactionWithoutStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedTransactionWithoutStatus:
      return Object.assign({}, state, {
        loading: false
      });
    case GitAction.UpdateTransactionDetailHandling:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedTransactionDetailHandling:
      return Object.assign({}, state, {
        loading: false,
        handlingChargeReturn: action.payload
      });
    case GitAction.CancelTransaction:
      return Object.assign({}, state, { loading: true });
    case GitAction.CancelledTransaction:
      return Object.assign({}, state, {
        loading: false,
        transactionReturn: action.payload
      });
    case GitAction.UpdateTransactionPayment:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedTransactionPayment:
      return Object.assign({}, state, {
        loading: false,
        transactionReturn: action.payload
      });
    case GitAction.ResetTransactionReturn:
      return Object.assign({}, state, { transactionReturn: [] });
    case GitAction.FetchTransaction:
      return Object.assign({}, state, { loading: true });
    case GitAction.TransactionFetched:
      return Object.assign({}, state, {
        loading: false,
        transactions: action.payload
      });
    case GitAction.FetchTransactionByID:
      return Object.assign({}, state, { loading: true });
    case GitAction.TransactionByIDFetched:
      return Object.assign({}, state, {
        loading: false,
        transaction: action.payload
      });

    /////////////////////////////////////////////////// Transaction Management ///////////////////////////////////////////////////
    case GitAction.FetchDashboardData:
      return Object.assign({}, state, { loading: true });
    case GitAction.DashboardDataFetched:
      return Object.assign({}, state, {
        loading: false,
        dashboard: action.payload
      });

    /////////////////////////////////////////////////// Archived Data Management ///////////////////////////////////////////////////
    case GitAction.FetchArchivedStocks:
      return Object.assign({}, state, { loading: true });
    case GitAction.ArchivedStocksFetched:
      return Object.assign({}, state, {
        loading: false,
        archivedData: action.payload
      });

    case GitAction.FetchArchivedTransaction:
      return Object.assign({}, state, { loading: true });
    case GitAction.ArchivedTransactionFetched:
      return Object.assign({}, state, {
        loading: false,
        archivedData: action.payload
      });

    case GitAction.ResetArchivedData:
      return Object.assign({}, state, {
        loading: false,
        archivedData: []
      });

    /////////////////////////////////////////////////// User Management ///////////////////////////////////////////////////
    case GitAction.InsertUserDataByPost:
      return Object.assign({}, state, { loading: true });
    case GitAction.InsertedUserDataByPost:
      return Object.assign({}, state, {
        loading: false,
        userManagementApproval: action.payload
      });

    case GitAction.UpdateUserData:
      return Object.assign({}, state, { loading: true });
    case GitAction.UserDataUpdated:
      return Object.assign({}, state, {
        loading: false,
        userManagementApproval: action.payload
      });

    case GitAction.DeleteUser:
      return Object.assign({}, state, { loading: true });
    case GitAction.UserDeleted:
      return Object.assign({}, state, {
        loading: false,
        userManagementApproval: action.payload
      });

    case GitAction.ResetUserApprovalReturn:
      return Object.assign({}, state, {
        loading: false,
        userManagementApproval: []
      });

    /////////////////////////////////////////////////// Container Management ///////////////////////////////////////////////////
    case GitAction.Container_View:
      return Object.assign({}, state, { loading: true });
    case GitAction.Container_Viewed:
      return Object.assign({}, state, {
        loading: false,
        container: action.payload
      });

    case GitAction.Container_ViewStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.Container_ViewedStatus:
      return Object.assign({}, state, {
        loading: false,
        containerStatus: action.payload
      });

    case GitAction.Container_Add:
      return Object.assign({}, state, { loading: true });
    case GitAction.Container_Added:
      return Object.assign({}, state, {
        loading: false,
        containerAction: action.payload
      });


    case GitAction.Container_Update:
      return Object.assign({}, state, { loading: true });
    case GitAction.Container_Updated:
      return Object.assign({}, state, {
        loading: false,
        containerAction: action.payload
      });

    case GitAction.Container_Delete:
      return Object.assign({}, state, { loading: true });
    case GitAction.Container_Deleted:
      return Object.assign({}, state, {
        loading: false,
        containerAction: action.payload
      });



    /////////////////////////////////////////////////// Stock Inventory Management ///////////////////////////////////////////////////

    case GitAction.Inventory_ViewByFilter:
      return Object.assign({}, state, { loading: true });
    case GitAction.Inventory_ViewedByFilter:
      return Object.assign({}, state, {
        loading: false,
        inventoryStock: action.payload
      });

    case GitAction.Inventory_Add:
      return Object.assign({}, state, { loading: true });
    case GitAction.Inventory_Added:
      return Object.assign({}, state, {
        loading: false,
        inventoryStockAction: action.payload
      });

    case GitAction.Inventory_Update:
      return Object.assign({}, state, { loading: true });
    case GitAction.Inventory_Updated:
      return Object.assign({}, state, {
        loading: false,
        inventoryStockAction: action.payload
      });

    case GitAction.Inventory_Delete:
      return Object.assign({}, state, { loading: true });
    case GitAction.Inventory_Deleted:
      return Object.assign({}, state, {
        loading: false,
        inventoryStockAction: action.payload
      });

    case GitAction.Inventory_UpdateContainer:
      return Object.assign({}, state, { loading: true });
    case GitAction.Inventory_UpdatedContainer:
      return Object.assign({}, state, {
        loading: false,
        inventoryStock: action.payload
      });


    /////////////////////////////////////////////////// Stock Inventory Management ///////////////////////////////////////////////////

    case GitAction.Courier_View:
      return Object.assign({}, state, { loading: true });
    case GitAction.Courier_Viewed:
      return Object.assign({}, state, {
        loading: false,
        courier: action.payload
      });

    /////////////////////////////////////////////////// Notification Management ///////////////////////////////////////////////////

    case GitAction.Notification_View:
      return Object.assign({}, state, { loading: true });
    case GitAction.Notification_Viewed:
      return Object.assign({}, state, {
        loading: false,
        notification: action.payload
      });

    case GitAction.Notification_Add:
      return Object.assign({}, state, { loading: true });
    case GitAction.Notification_Added:
      return Object.assign({}, state, {
        loading: false,
        notificationAction: action.payload
      });

    case GitAction.Notification_Update:
      return Object.assign({}, state, { loading: true });
    case GitAction.Notification_Updated:
      return Object.assign({}, state, {
        loading: false,
        notificationAction: action.payload
      });

    case GitAction.Notification_Delete:
      return Object.assign({}, state, { loading: true });
    case GitAction.Notification_Deleted:
      return Object.assign({}, state, {
        loading: false,
        notificationAction: action.payload
      });

      
    case GitAction.GetUserAreaCode:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotUserAreaCode:
      return Object.assign({}, state, {
        loading: false,
        userAreaCode: action.payload
      });

      
    case GitAction.AddAreaCode:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedAreaCode:
      return Object.assign({}, state, {
        loading: false,
        userAreaCodeAction: action.payload
      });

      
    case GitAction.UpdateAreaCode:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedAreaCode:
      return Object.assign({}, state, {
        loading: false,
        userAreaCodeAction: action.payload
      });

      
    case GitAction.DeleteAreaCode:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedAreaCode:
      return Object.assign({}, state, {
        loading: false,
        userAreaCodeAction: action.payload
      });


    /////////////////////////////////////////////////// Default ///////////////////////////////////////////////////
    default:
      return state;
  }
}
