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

  static Logout = "USER_LOGOUT";
  static LoggedOutSuccess = "USER_LOGGED_OUT_SUCCESS";
  static CallUserLogout(propsData) {

    return {
      type: GitAction.Logout,
      payload: propsData
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
  static ResetUserProfile = "RESET-USER_PROFILE";
  static CallUserProfile() {
    return {
      type: GitAction.GetUserProfile
    };
  }

  static GetUserAreaCode = "GET_USER_AREA_CODE";
  static GotUserAreaCode = "GOT_USER_AREA_CODE";
  static CallUserAreaCode() {
    return {
      type: GitAction.GetUserAreaCode
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

  static ViewContainer = "VIEW-CONTAINER";
  static ViewedContainer = "VIEWED-CONTAINER";
  static ResetViewedContainer = "RESET-VIEWED-CONTAINER";
  static CallViewContainer(propsData) {
    return {
      type: GitAction.ViewContainer,
      payload: propsData
    };
  }
  static CallResetViewedContainerReturn() {
    return {
      type: GitAction.ResetViewedContainer,
    };
  }

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

  static ResetUserApprovalReturn = "RESET-USER-DATA-APPROVAL-RETURN";
  static CallResetUserApprovalReturn() {
    return {
      type: GitAction.ResetUserApprovalReturn,
    };
  }

}

