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

  static GetUserProfile = "GET_USER_PROFILE";
  static GotUserProfile = "GOT_USER_PROFILE";
  static ResetUserProfile = "RESET-USER_PROFILE";
  static CallUserProfileByID(propsData) {
    return {
      type: GitAction.GetUserProfile,
      payload: propsData
    };
  }
  static CallResetUserProfile() {
    return {
      type: GitAction.ResetUserProfile,
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


}

