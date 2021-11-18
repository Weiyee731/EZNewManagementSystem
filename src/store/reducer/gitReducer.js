import { GitAction } from "../action/gitAction";

const INITIAL_STATE = {
  loading: false,
  logonUser: [],
  userProfile:[], 
  sidebars: [],


  ///////// RETURN VALUE ///////// 
  registrationReturn: [],
};

export function counterReducer(state = INITIAL_STATE, action) {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////
  switch (action.type) {
    case GitAction.Login:
      return Object.assign({}, state, { loading: true });
    case GitAction.LoginSuccess:
      return Object.assign({}, state, {
        loading: false,
        logonUser: action.payload
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
        userProfile: action.payload
      });
    case GitAction.ResetUserProfile:
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


    /////////////////////////////////////////////////// Default ///////////////////////////////////////////////////
    default:
      return state;
  }
}
