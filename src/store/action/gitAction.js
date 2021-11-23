export class GitAction {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  static Login = "USER_LOGIN";
  static LoginSuccess = "USER_LOGIN_SUCCESS";
  static CallUserLogin(propsData) {
    console.log(propsData)
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

  static RegisterUser = "REGISTER_USER";
  static UserRegistered = "USER_REGISTERED";
  static ResetRegistrationReturn = "RESET-REGISTRATION_RETURN";
  static CallUserRegistration(propsData) {
    return {
      type: GitAction.RegisterUser,
      payload: propsData
    };
  }
  static CallResetUserRegistrationReturn() {
    return {
      type: GitAction.ResetRegistrationReturn,
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
  static CallResetUserProfile() {
    return {
      type: GitAction.ResetUserProfile,
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
  

}

