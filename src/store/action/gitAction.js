export class GitAction {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  static Login = "USER_LOGIN";
  static LoginSuccess = "USER_LOGIN_SUCCESS";
  static CallUserLogin(propsData) {
    return {
      type: GitAction.Login,
      payload: propsData
    };
  }


  static UpdatePassword = "UpdatePassword";
  static PasswordUpdated = "PasswordUpdated";
  static CallUpdatePassword(propsData) {
    return {
      type: GitAction.UpdatePassword,
      payload: propsData
    };
  }


  static Logout = "USER_LOGOUT";
  static LoggedOutSuccess = "USER_LOGGED_OUT_SUCCESS";
  static ClearLogonUser = "USER_CLEAR_CACHE";
  static CallUserLogout(propsData) {
    return {
      type: GitAction.Logout,
      payload: propsData
    };
  }

  static CallClearLogonUserCache() {
    return {
      type: GitAction.ClearLogonUser,
    };
  }

  static GetUserProfileByID = "GET_USER_PROFILEBYID";
  static GotUserProfileByID = "GOT_USER_PROFILEBYID";
  static ResetUserProfileByID = "RESET-USER_PROFILEBYID";
  static CallUserProfileByID(propsData) {
    return {
      type: GitAction.GetUserProfileByID,
      payload: propsData
    };
  }
  static CallResetUserProfile() {
    return {
      type: GitAction.ResetUserProfileByID,
    };
  }

  static GetUserProfile = "GET_USER_PROFILE";
  static GotUserProfile = "GOT_USER_PROFILE";
  static CallUserProfile() {
    return {
      type: GitAction.GetUserProfile
    };
  }



  static UpdateUserAccountPassword = "UPDATE_USER_ACCOUNT_PASSWORD";
  static UserAccountPasswordUpdated = "USER_ACCOUNT_PASSWORD_UPDATED";
  static CallUpdateUserAccountPassword() {
    return {
      type: GitAction.UpdateUserAccountPassword
    };
  }

  ///////////////////////////////////////////////////  sidebar configuration  ///////////////////////////////////////////////////
  static FetchSidebar = "FETCH_SIDEBAR";
  static SidebarFetched = "SIDEBAR_FETCHED";
  static ResetSidebar = "RESET-SIDEBAR";
  static CallFetchSidebar(propsData) {
    return {
      type: GitAction.FetchSidebar,
      payload: propsData
    };
  }
  static CallResetSidebar() {
    return {
      type: GitAction.ResetSidebar,
    };
  }


  ///////////////////////////////////////////////////  stock management  ///////////////////////////////////////////////////

  static FetchStocks = "FETCH_ALL_STOCKS";
  static StocksFetched = "ALL_STOCKS_FETCHED";
  static ResetStocksList = "RESET-STOCKS_LIST";
  static CallFetchAllStock(propsData) {
    return {
      type: GitAction.FetchStocks,
      payload: propsData
    };
  }
  static CallResetStocks() {
    return {
      type: GitAction.ResetStocksList,
    };
  }

  static InsertNewStock = "INSERT_NEW_STOCK";
  static NewStockInserted = "NEW_STOCK_INSERTED";
  static ResetStockReturn = "RESET-STOCK_RETURN";
  static CallInsertStock(propsData) {
    return {
      type: GitAction.InsertNewStock,
      payload: propsData
    };
  }
  static CallResetStockReturn() {
    return {
      type: GitAction.ResetStockReturn,
    };
  }


  static UpdateInventoryStockStatus = "UPDATE-INVENTORY-STOCK-STATUS";
  static UpdatedInventoryStockStatus = "UPDATED-INVENTORY-STOCK-STATUS";
  static ResetStockStatusReturn = "RESET-STOCK-STATUS_RETURN";
  static CallUpdateStockStatus(propsData) {
    return {
      type: GitAction.UpdateInventoryStockStatus,
      payload: propsData
    };
  }
  static CallResetStockStatusReturn() {
    return {
      type: GitAction.ResetStockStatusReturn,
    };
  }

  static UpdateStockDetailByPost = "UPDATE-STOCKDETAIL-BY-POST";
  static UpdatedStockDetailByPost = "UPDATED-STOCKDETAIL-BY-POST";
  static CallUpdateStockDetailByPost(propsData) {
    return {
      type: GitAction.UpdateStockDetailByPost,
      payload: propsData
    };
  }
  static UpdateStockDetailByGet = "UPDATE-STOCKDETAIL-BY-GET";
  static UpdatedStockDetailByGet = "UPDATED-STOCKDETAIL-BY-GET";
  static CallUpdateStockDetailByGet(propsData) {
    return {
      type: GitAction.UpdateStockDetailByGet,
      payload: propsData
    };
  }
  static ResetUpdatedStockDetail = "RESET-UPDATED-STOCKDETAIL-BY-POST";
  static CallResetUpdatedStockDetail() {
    return {
      type: GitAction.ResetUpdatedStockDetail,
    };
  }

  // static ViewContainer = "VIEW-CONTAINER";
  // static ViewedContainer = "VIEWED-CONTAINER";
  // static ResetViewedContainer = "RESET-VIEWED-CONTAINER";
  // static CallViewContainer(propsData) {
  //   return {
  //     type: GitAction.ViewContainer,
  //     payload: propsData
  //   };
  // }
  // static CallResetViewedContainerReturn() {
  //   return {
  //     type: GitAction.ResetViewedContainer,
  //   };
  // }

  static InsertStockByPost = "INSERT-STOCK-BY-POST";
  static StockInsertedByPost = "STOCK-INSERTED-BY-POST";
  static ResetInsertedStockReturn = "RESET-INSERTED-STOCK-RETURN";
  static CallInsertStockByPost(propsData) {
    return {
      type: GitAction.InsertStockByPost,
      payload: propsData
    };
  }
  static CallResetInsertedStockReturnValue() {
    return {
      type: GitAction.ResetInsertedStockReturn,
    };
  }

  static GetFilteredInventory = "GET-FILTERED-INVENTORY";
  static GotFilteredInventory = "GOT-FILTERED-INVENTORY";
  static CallFilterInventory(propsData) {
    return {
      type: GitAction.GetFilteredInventory,
      payload: propsData
    };
  }

  static GetFilteredInventoryByDate = "GET-FILTERED-INVENTORY-BY-DATE";
  static GotFilteredInventoryByDate = "GOT-FILTERED-INVENTORY-BY-DATE";
  static CallFilterInventoryByDate(propsData) {
    return {
      type: GitAction.GetFilteredInventoryByDate,
      payload: propsData
    };
  }

  ///////////////////////////////////////////////////   Transaction Management  ///////////////////////////////////////////////////
  static InsertNewTransaction = "INSERT_NEW_TRANSACTION";
  static NewTransactionInserted = "NEW_TRANSACTION_INSERTED";
  static ResetTransactionReturn = "RESET-TRANSACTION_RETURN";
  static CallInsertTransaction(propsData) {
    return {
      type: GitAction.InsertNewTransaction,
      payload: propsData
    };
  }

  static UpdateTransaction = "UPDATE_TRANSACTION";
  static UpdatedTransaction = "TRANSACTION_UPDATEED";
  static CallUpdateTransaction(propsData) {
    return {
      type: GitAction.UpdateTransaction,
      payload: propsData
    };
  }

  static UpdateTransactionWithoutStatus = "UPDATE_TRANSACTIONWITHOUTSTATUS";
  static UpdatedTransactionWithoutStatus = "TRANSACTIONWITHOUTSTATUS_UPDATEED";
  static CallUpdateTransactionWithoutStatus(propsData) {
    return {
      type: GitAction.UpdateTransactionWithoutStatus,
      payload: propsData
    };
  }



  static UpdateTransactionDetailHandling = "UPDATE_TRANSACTION_DETAIL_HANDLING";
  static UpdatedTransactionDetailHandling = "TRANSACTION_DETAIL_HANDLING_UPDATEED";
  static CallUpdateTransactionDetailHandling(propsData) {
    return {
      type: GitAction.UpdateTransactionDetailHandling,
      payload: propsData
    };
  }


  static UpdateTransactionPayment = "UPDATE_TRANSACTION_PAYMENT";
  static UpdatedTransactionPayment = "TRANSACTION_UPDATEED_PAYMENT";
  static CallUpdateTransactionPayment(propsData) {
    return {
      type: GitAction.UpdateTransactionPayment,
      payload: propsData
    };
  }

  static CancelTransaction = "CANCEL_TRANSACTION";
  static CancelledTransaction = "TRANSACTION_CANCELLED";
  static CallCancelTransaction(propsData) {
    return {
      type: GitAction.CancelTransaction,
      payload: propsData
    };
  }

  static CallResetTransaction() {
    return {
      type: GitAction.ResetTransactionReturn,
    };
  }

  static FetchTransaction = "FETCH_ALL_TRANSACTION";
  static TransactionFetched = "ALL_TRANSACTION_FETCHED";
  static CallFetchAllTransaction(propsData) {
    return {
      type: GitAction.FetchTransaction,
      payload: propsData
    };
  }

  static FetchTransactionByID = "FETCH_ALL_TRANSACTION_BYID";
  static TransactionByIDFetched = "ALL_TRANSACTION_BYID_FETCHED";
  static CallFetchAllTransactionByID(propsData) {
    return {
      type: GitAction.FetchTransactionByID,
      payload: propsData
    };
  }

  ///////////////////////////////////////////////////   Dashboard   ///////////////////////////////////////////////////
  static FetchDashboardData = "FETCH_DASHBOARD_DATA";
  static DashboardDataFetched = "DASHBOARD_DATA_FETCHED";
  static CallFetchDashboardData() {
    return {
      type: GitAction.FetchDashboardData,
    };
  }

  ///////////////////////////////////////////////////   Archived Data Management   ///////////////////////////////////////////////////
  static FetchArchivedStocks = "FETCH-ARCHIVED-STOCK";
  static ArchivedStocksFetched = "ARCHIVED-STOCK-FETCHED";
  static CallFetchArchivedStock(propsData) {
    return {
      type: GitAction.FetchArchivedStocks,
      payload: propsData
    };
  }

  static FetchArchivedTransaction = "FETCH-ARCHIVED-TRANSACTIONS";
  static ArchivedTransactionFetched = "ARCHIVED-TRANSACTIONS-FETCHED";
  static CallFetchArchivedTransactions(propsData) {
    return {
      type: GitAction.FetchArchivedTransaction,
      payload: propsData
    };
  }

  static ResetArchivedData = "RESET-ARCHIVED_DATA";
  static CallResetArchivedData() {
    return {
      type: GitAction.ResetArchivedData,
    };
  }

  ///////////////////////////////////////////////////   User Management   ///////////////////////////////////////////////////

  static InsertUserDataByPost = "INSERT-USER-DATA-BY-POST";
  static InsertedUserDataByPost = "INSERTED-USER-DATA-BY-POST";
  static CallInsertUserDataByPost(propsData) {
    return {
      type: GitAction.InsertUserDataByPost,
      payload: propsData
    };
  }

  static UpdateUserData = "UPDATE-USER-DATA";
  static UserDataUpdated = "USER-DATA-UPDATED";
  static CallUpdateUserData(propsData) {
    return {
      type: GitAction.UpdateUserData,
      payload: propsData
    };
  }

  static DeleteUser = "DELETE-USER";
  static UserDeleted = "USER-DELETED";
  static CallDeleteUser(propsData) {
    return {
      type: GitAction.DeleteUser,
      payload: propsData
    };
  }

  static ResetUserApprovalReturn = "RESET-USER-DATA-APPROVAL-RETURN";
  static CallResetUserApprovalReturn() {
    return {
      type: GitAction.ResetUserApprovalReturn,
    };
  }

  /////////////////////////////////////////////////// Container Management ///////////////////////////////////////////////////
  static Container_View = "Container_View";
  static Container_Viewed = "Container_Viewed";
  static CallViewContainer(propsData) {
    return {
      type: GitAction.Container_View,
      payload: propsData
    };
  }

  static Container_ViewStatus = "Container_ViewStatus";
  static Container_ViewedStatus = "Container_ViewedStatus";
  static CallViewContainerStatus(propsData) {
    return {
      type: GitAction.Container_ViewStatus,
      payload: propsData
    };
  }

  static Container_UpdateStatus = "Container_UpdateStatus";
  static Container_UpdatedStatus = "Container_UpdatedStatus";
  static CallUpdateContainerStatus(propsData) {
    return {
      type: GitAction.Container_UpdateStatus,
      payload: propsData
    };
  }

  static Container_Add = "Container_Add";
  static Container_Added = "Container_Added";
  static CallAddContainer(propsData) {
    return {
      type: GitAction.Container_Add,
      payload: propsData
    };
  }

  static Container_Update = "Container_Update";
  static Container_Updated = "Container_Updated";
  static CallUpdateContainer(propsData) {
    return {
      type: GitAction.Container_Update,
      payload: propsData
    };
  }

  static Container_Delete = "Container_Delete";
  static Container_Deleted = "Container_Deleted";
  static CallDeleteContainer(propsData) {
    return {
      type: GitAction.Container_Delete,
      payload: propsData
    };
  }

  /////////////////////////////////////////////////// Stock Inventory  Management ///////////////////////////////////////////////////
  static Inventory_ViewByFilter = "Inventory_ViewByFilter";
  static Inventory_ViewedByFilter = "Inventory_ViewedByFilter";
  static CallViewInventoryByFilter(propsData) {
    return {
      type: GitAction.Inventory_ViewByFilter,
      payload: propsData
    };
  }

  static Inventory_Add = "Inventory_Add";
  static Inventory_Added = "Inventory_Added";
  static CallAddInventory(propsData) {
    return {
      type: GitAction.Inventory_Add,
      payload: propsData
    };
  }

  static Inventory_Update = "Inventory_Update";
  static Inventory_Updated = "Inventory_Updated";
  static CallUpdateInventory(propsData) {
    return {
      type: GitAction.Inventory_Update,
      payload: propsData
    };
  }

  static Inventory_Delete = "Inventory_Delete";
  static Inventory_Deleted = "Inventory_Deleted";
  static CallDeleteInventory(propsData) {
    return {
      type: GitAction.Inventory_Delete,
      payload: propsData
    };
  }

  static Inventory_ClearAction = "Inventory_ClearAction";
  static ClearInventoryAction() {
    return {
      type: GitAction.Inventory_ClearAction,
    };
  }

  static Inventory_ClearStock = "Inventory_ClearStock";
  static ClearInventoryStock() {
    return {
      type: GitAction.Inventory_ClearStock,
    };
  }

  
  static Inventory_UpdateContainer = "Inventory_UpdateContainer";
  static Inventory_UpdatedContainer = "Inventory_UpdatedContainer";
  static CallUpdateContainerInventory(propsData) {
    return {
      type: GitAction.Inventory_UpdateContainer,
      payload: propsData
    };
  }

  static Courier_View = "Courier_View";
  static Courier_Viewed = "Courier_Viewed";
  static CallViewCourier(propsData) {
    return {
      type: GitAction.Courier_View,
      payload: propsData
    };
  }

  /////////////////////////////////////////////////// Notification  Management ///////////////////////////////////////////////////

  static Notification_View = "Notification_View";
  static Notification_Viewed = "Notification_Viewed";
  static CallViewINotification(propsData) {
    return {
      type: GitAction.Notification_View,
      payload: propsData
    };
  }

  static Notification_Add = "Notification_Add";
  static Notification_Added = "Notification_Added";
  static CallAddNotification(propsData) {
    return {
      type: GitAction.Notification_Add,
      payload: propsData
    };
  }

  static Notification_Update = "Notification_Update";
  static Notification_Updated = "Notification_Updated";
  static CallUpdateNotification(propsData) {
    return {
      type: GitAction.Notification_Update,
      payload: propsData
    };
  }

  static Notification_UpdateStatus = "Notification_UpdateStatus";
  static Notification_UpdatedStatus = "Notification_UpdatedStatus";
  static CallUpdateNotificationStatus(propsData) {
    return {
      type: GitAction.Notification_UpdateStatus,
      payload: propsData
    };
  }
  

  static Notification_Delete = "Notification_Delete";
  static Notification_Deleted = "Notification_Deleted";
  static CallDeleteNotification(propsData) {
    return {
      type: GitAction.Notification_Delete,
      payload: propsData
    };
  }

  /////////////////////////////////////////////////// Area Code  Management ///////////////////////////////////////////////////

  static GetUserAreaCode = "GET_USER_AREA_CODE";
  static GotUserAreaCode = "GOT_USER_AREA_CODE";
  static CallUserAreaCode(propsData) {
    return {
      type: GitAction.GetUserAreaCode,
      payload: propsData
    };
  }

  static AddAreaCode = "AddAreaCode";
  static AddedAreaCode = "AddedAreaCode";
  static CallUserAddAreaCode(propsData) {
    return {
      type: GitAction.AddAreaCode,
      payload: propsData
    };
  }

  static UpdateAreaCode = "UpdateAreaCode";
  static UpdatedAreaCode = "UpdatedAreaCode";
  static CallUserUpdateAreaCode(propsData) {
    return {
      type: GitAction.UpdateAreaCode,
      payload: propsData
    };
  }

  static DeleteAreaCode = "DeleteAreaCode";
  static DeletedAreaCode = "DeletedAreaCode";
  static CallUserDeleteAreaCode(propsData) {
    return {
      type: GitAction.DeletedAreaCode,
      payload: propsData
    };
  }

  static User_ViewByUserCode = "User_ViewByUserCode";
  static User_ViewedByUserCode = "User_ViewedByUserCode";
  static CallViewProfileByUserCode(propsData) {
    return {
      type: GitAction.User_ViewByUserCode,
      payload: propsData
    };
  }

  static User_ViewCommissionList = "User_ViewCommissionList";
  static User_ViewedCommissionList = "User_ViewedCommissionList";
  static CallViewCommissionByUserCode(propsData) {
    return {
      type: GitAction.User_ViewCommissionList,
      payload: propsData
    };
  }

  static User_ClearUserCode = "User_ClearUserCode";
  static ClearUserCodeData() {
    return {
      type: GitAction.User_ClearUserCode,
    };
  }



}

