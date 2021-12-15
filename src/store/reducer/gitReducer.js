import { GitAction } from "../action/gitAction";

const INITIAL_STATE = {
  loading: false,
  logonUser: [],
  user: [],
  userProfile: [],
  registrationReturn: [],
  userAreaCode: [],
  sidebars: [],
  stocks: [],
  stockReturn: [],
  stockApproval: [],
  AllContainer: [],
  transactions: [],
  transaction: [],
  transactionReturn: [],
  dashboard: [],
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

    case GitAction.RegisterUser:
      return Object.assign({}, state, { loading: true });
    case GitAction.UserRegistered:
      return Object.assign({}, state, {
        loading: false,
        registrationReturn: action.payload
      });
    case GitAction.ResetRegistrationReturn:
      return Object.assign({}, state, { registrationReturn: [] });

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

    case GitAction.GetUserAreaCode:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotUserAreaCode:
      return Object.assign({}, state, {
        loading: false,
        userAreaCode: action.payload
      });

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

    case GitAction.ViewContainer:
      return Object.assign({}, state, { loading: true });
    case GitAction.ViewedContainer:
      return Object.assign({}, state, {
        loading: false,
        AllContainer: action.payload
      });
    case GitAction.ResetViewedContainer:
      return Object.assign({}, state, { stockReturn: [] });

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
        loading: false
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

    /////////////////////////////////////////////////// Default ///////////////////////////////////////////////////
    default:
      return state;
  }
}
