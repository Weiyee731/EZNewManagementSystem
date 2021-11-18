/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
import { Observable } from "rxjs";
import { ActionsObservable } from "redux-observable";
import { GitAction } from "../action/gitAction";
import { toast } from "react-toastify";
import axios from "axios";
import { ServerConfiguration } from "../serverConf";


/**
 * ** IMPORTANT! Never do any file uploads or save data to the local storage here!! This Git EPIC is highly focus on call APIs to communicate to the server 
 * 
 * ** you can set your server url by switch the option as below 
 */
//           options          //
//   1. testing server url    //
//   2. live server url       // 
const url = ServerConfiguration.testingServerUrl;
export class GitEpic {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  User_Login = action$ =>
    action$.ofType(GitAction.Login).switchMap(async ({ payload }) => {
      console.log(
        url +
        "User_Login?" +
        "username=" + payload.username +
        "&password=" + payload.password
      )
      try {
        const response = await fetch(url +
          "User_Login?" +
          "username=" + payload.username +
          "&password=" + payload.password
        );



        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoginSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_Login")
        return {
          type: GitAction.LoginSuccess,
          payload: [],
        };
      }
    });

  User_Logout = action$ =>
    action$.ofType(GitAction.Logout).switchMap(async ({ payload }) => {
      // console.log(url + 
      //   double_click_and_paste_url_here
      // )
      try {
        const response = await fetch(url +
          "User_Logout?UserId=" + payload.UserId
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoggedOutSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_Logout")
        return {
          type: GitAction.LoggedOutSuccess,
          payload: [],
        };
      }
    });

  User_Register = action$ =>

    action$.ofType(GitAction.RegisterUser).switchMap(async ({ payload }) => {
      // console.log(url + 
      //   double_click_and_paste_url_here
      // )
      try {
        const response = await fetch(url +
          "User_Register?" +
          "userFirstName=" + payload.userFirstName +
          "&userLastName=" + payload.userLastName +
          "&username=" + payload.username +
          "&userEmail=" + payload.userEmail +
          "&password=" + payload.password
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UserRegistered,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: RegisterUser")
        return {
          type: GitAction.UserRegistered,
          payload: [],
        };
      }
    });

  User_ProfileByID = action$ =>
    action$.ofType(GitAction.GetUserProfile).switchMap(async ({ payload }) => {
      // console.log(url + 
      //   double_click_and_paste_url_here
      // )
      try {
        const response = await fetch(url +
          "User_ProfileByID?" +
          "USERID=" + payload.USERID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.GotUserProfile,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: GetUserProfile")
        return {
          type: GitAction.GotUserProfile,
          payload: [],
        };
      }
    });



  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////





  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////
  User_ViewPage = action$ =>
    action$.ofType(GitAction.FetchSidebar).switchMap(async ({ payload }) => {
      // console.log(url + 
      //   double_click_and_paste_url_here
      // )
      try {
        const response = await fetch(url +
          "User_ViewPage?" +
          "ROLEGROUPID=" + payload.ROLEGROUPID +
          "&USERID=" + payload.USERID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.SidebarFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: FetchSidebar")
        return {
          type: GitAction.SidebarFetched,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////  stocks management ///////////////////////////////////////////////////
  Inventory_ViewStockList = action$ =>
    action$.ofType(GitAction.FetchStocks).switchMap(async ({ payload }) => {
      console.log(url +
        "Inventory_ViewStockList?" +
        "USERID=" + payload.USERID
      )
      try {
        const response = await fetch(url +
          "Inventory_ViewStockList?" +
          "USERID=" + payload.USERID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.StocksFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: FetchStocks")
        return {
          type: GitAction.StocksFetched,
          payload: [],
        };
      }
    });

  Inventory_InsertStock = action$ =>
    action$.ofType(GitAction.InsertNewStock).switchMap(async ({ payload }) => {
      // console.log(url + 
      //   double_click_and_paste_url_here
      // )
      try {
        const response = await fetch(url +
          "Inventory_InsertStock?" +
          "USERID=" + payload.USERID +
          "&TRACKINGNUMBER=" + payload.TRACKINGNUMBER +
          "&PRODUCTWEIGHT=" + payload.PRODUCTWEIGHT +
          "&PRODUCTHEIGHT=" + payload.PRODUCTHEIGHT +
          "&PRODUCTWIDTH=" + payload.PRODUCTWIDTH +
          "&PRODUCTDEEP=" + payload.PRODUCTDEEP +
          "&CARRYABLE=" + payload.CARRYABLE
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.NewStockInserted,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_InsertStock")
        return {
          type: GitAction.NewStockInserted,
          payload: [],
        };
      }
    });
  ///////////////////////////////////////////////////  stocks management ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////   Transaction Management  ///////////////////////////////////////////////////

  Transaction_InsertTransaction = action$ =>
    action$.ofType(GitAction.InsertNewTransaction).switchMap(async ({ payload }) => {
      // console.log(url + 
      //   double_click_and_paste_url_here
      // )
      try {
        const response = await fetch(url +
          "Transaction_InsertTransaction?" +
          "USERID=" + payload.USERID +
          "&ORDERTOTALMOUNT=" + payload.ORDERTOTALMOUNT +
          "&ORDERPAIDMOUNT=" + payload.ORDERPAIDMOUNT +
          "&STOCKID=" + payload.STOCKID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.NewTransactionInserted,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_InsertTransaction")
        return {
          type: GitAction.NewTransactionInserted,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////   Transaction Management  ///////////////////////////////////////////////////

}
export let gitEpic = new GitEpic();