import { combineReducers, createStore, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { counterReducer } from "./reducer/gitReducer"; //reducers
import { gitEpic } from "./epic/gitEpic"; //epics

const rootEpic = combineEpics(
  //========================== USER ==========================//
  gitEpic.UserLogin,
  gitEpic.UserLogout,
  gitEpic.UserRegistration,
  gitEpic.FetchUserProfileByID,
  gitEpic.FetchSidebarConfigurations,
);

const rootReducer = combineReducers({ counterReducer });
const epicMiddleware = createEpicMiddleware(rootEpic);
const createStoreWithMiddleware = applyMiddleware(epicMiddleware)(createStore);
export default createStoreWithMiddleware(rootReducer);
