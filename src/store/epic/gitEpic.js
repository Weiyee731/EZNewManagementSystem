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
const postUrl = ServerConfiguration.postUrl;
export class GitEpic {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  User_Login = action$ =>
    action$.ofType(GitAction.Login).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_Login?" +
          "username=" + payload.username +
          "&password=" + payload.password
        );

        let json = await response.json();
        json = JSON.parse(json)
        if (json[0].ReturnVal !== "0") {
          const response2 = await fetch(url +
            "User_ViewPage?" +
            "ROLEGROUPID=" + json[0].UserTypeID +
            "&USERID=" + json[0].UserID
          );
          let json2 = await response2.json();
          json2 = JSON.parse(json2)
          return {
            payload2: json2,
            type: GitAction.LoginSuccess,
            payload: json,
          };
        } else {
          alert("Invalid credential")
          return {
            payload2: [],
            type: GitAction.LoginSuccess,
            payload: [],
          };
        }
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

  User_Profile = action$ =>
    action$.ofType(GitAction.GetUserProfile).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_ViewProfile"
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

  User_ProfileByID = action$ =>
    action$.ofType(GitAction.GetUserProfileByID).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_ViewProfileByID?" +
          "USERID=" + payload.UserID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.GotUserProfileByID,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: GetUserProfileByID")
        return {
          type: GitAction.GotUserProfileByID,
          payload: [],
        };
      }
    });

  User_ViewAreaCode = action$ =>
    action$.ofType(GitAction.GetUserAreaCode).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_ViewAreaCode"
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.GotUserAreaCode,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: GotUserAreaCode")
        return {
          type: GitAction.GotUserAreaCode,
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
      try {
        console.log(url +
          "Inventory_ViewStockList?" +
          "TRACKINGSTATUSID=" + payload.TRACKINGSTATUSID)
        const response = await fetch(url +
          "Inventory_ViewStockList?" +
          "TRACKINGSTATUSID=" + payload.TRACKINGSTATUSID
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

  Inventory_UpdateStockDetailByGet = action$ =>
    action$.ofType(GitAction.UpdateStockDetailByGet).switchMap(async ({ payload }) => {
      console.log(url +
        "Inventory_UpdateStockDetail?" +
        "STOCKID=" + payload.STOCKID +
        "&USERCODE=" + payload.USERCODE +
        "&TRACKINGNUMBER=" + payload.TRACKINGNUMBER +
        "&PRODUCTWEIGHT=" + payload.PRODUCTWEIGHT +
        "&PRODUCTHEIGHT=" + payload.PRODUCTHEIGHT +
        "&PRODUCTWIDTH=" + payload.PRODUCTWIDTH +
        "&PRODUCTDEEP=" + payload.PRODUCTDEEP +
        "&AREACODE=" + payload.AREACODE +
        "&ITEM=" + payload.ITEM +
        "&TRACKINGSTATUSID=" + payload.TRACKINGSTATUSID +
        "&CONTAINERNAME=" + payload.CONTAINERNAME +
        "&CONTAINERDATE=" + payload.CONTAINERDATE +
        "&REMARK=" + payload.REMARK +
        "&EXTRACHARGE=" + payload.EXTRACHARGE
      );
      try {
        const response = await fetch(url +
          "Inventory_UpdateStockDetail?" +
          "STOCKID=" + payload.STOCKID +
          "&USERCODE=" + payload.USERCODE +
          "&TRACKINGNUMBER=" + payload.TRACKINGNUMBER +
          "&PRODUCTWEIGHT=" + payload.PRODUCTWEIGHT +
          "&PRODUCTHEIGHT=" + payload.PRODUCTHEIGHT +
          "&PRODUCTWIDTH=" + payload.PRODUCTWIDTH +
          "&PRODUCTDEEP=" + payload.PRODUCTDEEP +
          "&AREACODE=" + payload.AREACODE +
          "&ITEM=" + payload.ITEM +
          "&TRACKINGSTATUSID=" + payload.TRACKINGSTATUSID +
          "&CONTAINERNAME=" + payload.CONTAINERNAME +
          "&CONTAINERDATE=" + payload.CONTAINERDATE +
          "&REMARK=" + payload.REMARK +
          "&EXTRACHARGE=" + payload.EXTRACHARGE
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UpdatedStockDetailByGet,
          payload: json,
        };

      }
      catch (error) {
        toast.error("Error Code: Inventory_UpdateStockDetailByGet")
        return {
          type: GitAction.UpdatedStockDetailByGet,
          payload: [],
        };
      }
    });

  Inventory_UpdateStockDetailByPost = action$ =>
    action$.ofType(GitAction.UpdateStockDetailByPost).switchMap(async ({ payload }) => {
      return fetch(
        url + "Inventory_UpdateStockDetailByPost"
        , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            STOCKID: payload.StockID,
            USERCODE: payload.UserCode,
            TRACKINGNUMBER: payload.TrackingNumber,
            PRODUCTWEIGHT: payload.ProductWeight,
            PRODUCTHEIGHT: payload.ProductDimensionHeight,
            PRODUCTWIDTH: payload.ProductDimensionWidth,
            PRODUCTDEEP: payload.ProductDimensionDeep,
            AREACODE: payload.AreaCode,
            ITEM: payload.Item,
            TRACKINGSTATUSID: payload.TRACKINGSTATUSID,
            CONTAINERNAME: payload.ContainerName,

            CONTAINERDATE: payload.ContainerDate,
            REMARK: payload.Remark,
            EXTRACHARGE: payload.AdditionalCharges
          })
        }
      )
        .then(response => response.json())
        .then(json => {
          if (json !== "fail") {
            json = json;
            toast.success("Successfully update stock. Fetching the latest data..", { autoClose: 3000 })
          } else {
            json = [];
          }
          return {
            type: GitAction.UpdatedStockDetailByPost,
            payload: json,
          };
        })
        .catch(error => toast.error("Error code: 8003"));
    });

  Container_ViewContainer = action$ =>
    action$.ofType(GitAction.ViewContainer).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_ViewContainer"
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.ViewedContainer,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_InsertStock")
        return {
          type: GitAction.ViewedContainer,
          payload: [],
        };
      }
    });

  Inventory_InsertStockByPost = action$ =>
    action$.ofType(GitAction.InsertStockByPost).switchMap(async ({ payload }) => {
      return fetch(
        url + "Inventory_InsertStockByPost"
        , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            USERCODE: payload.USERCODE,
            TRACKINGNUMBER: payload.TRACKINGNUMBER,
            PRODUCTWEIGHT: payload.PRODUCTWEIGHT,
            PRODUCTHEIGHT: payload.PRODUCTHEIGHT,
            PRODUCTWIDTH: payload.PRODUCTWIDTH,
            PRODUCTDEEP: payload.PRODUCTDEEP,
            AREACODE: payload.AREACODE,
            ITEM: payload.ITEM,
            STOCKDATE: payload.STOCKDATE,
            PACKAGINGDATE: payload.PACKAGINGDATE,
            REMARK: payload.REMARK,
            EXTRACHARGE: payload.EXTRACHARGE,
            CONTAINERNAME: payload.CONTAINERNAME,
            CONTAINERDATE: payload.CONTAINERDATE
          })
        }
      )
        .then(response => response.json())
        .then(json => {
          if (json !== "fail") {
            json = json;
            console.log(json)
          } else {
            json = [];
          }
          return {
            type: GitAction.StockInsertedByPost,
            payload: json,
          };
        })
        .catch(error => {
          toast.error("Error code: 8003")
          return {
            type: GitAction.StockInsertedByPost,
            payload: [],
          };
        });
    });

  Inventory_GetFilteredStockList = action$ =>
    action$.ofType(GitAction.GetFilteredInventory).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_ViewStockListByFilter?" +
          "FILTERCOLUMN=" + payload.FILTERCOLUMN +
          "&FILTERKEYWORD=" + payload.FILTERKEYWORD
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.GotFilteredInventory,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_GetFilteredStockList")
        return {
          type: GitAction.GotFilteredInventory,
          payload: [],
        };
      }
    });

  Inventory_ViewStockListByDate = action$ =>
    action$.ofType(GitAction.GetFilteredInventoryByDate).switchMap(async ({ payload }) => {
      try {
        console.log(url +
          "Inventory_ViewStockListByDate?" +
          "STARTDATE=" + payload.STARTDATE +
          "&ENDDATE=" + payload.ENDDATE)
        const response = await fetch(url +
          "Inventory_ViewStockListByDate?" +
          "STARTDATE=" + payload.STARTDATE +
          "&ENDDATE=" + payload.ENDDATE
        );

        let json = await response.json();
        json = JSON.parse(json)
        console.log(json)
        return {
          type: GitAction.GotFilteredInventoryByDate,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_ViewStockListByDate")
        return {
          type: GitAction.GotFilteredInventoryByDate,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  stocks management ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////   Transaction Management  ///////////////////////////////////////////////////

  Transaction_ViewTransaction = action$ =>
    action$.ofType(GitAction.FetchTransaction).switchMap(async ({ payload }) => {

      try {
        const response = await fetch(url +
          "Transaction_ViewTransaction?TrackingStatusID=" + payload.TrackingStatusID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.TransactionFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_ViewTransaction")
        return {
          type: GitAction.TransactionFetched,
          payload: [],
        };
      }
    });

  Transaction_ViewTransactionByID = action$ =>
    action$.ofType(GitAction.FetchTransactionByID).switchMap(async ({ payload }) => {

      try {
        const response = await fetch(url + "Transaction_ViewTransactionByID?TRANSACTIONID=" + payload.TransactionID);
        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.TransactionByIDFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_ViewTransactionByID")
        return {
          type: GitAction.TransactionByIDFetched,
          payload: [],
        };
      }
    });

  Transaction_InsertTransaction = action$ =>
    action$.ofType(GitAction.InsertNewTransaction).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Transaction_InsertTransaction?" +
          "USERID=" + payload.USERID +
          "&CALCULATIONTYPE=" + payload.TYPE +
          "&ORDERTOTALMOUNT=" + payload.ORDERTOTALMOUNT +
          "&ORDERPAIDMOUNT=" + payload.ORDERPAIDMOUNT +
          "&STOCKID=" + payload.STOCKID +
          "&PRODUCTPRICE=" + payload.PRODUCTPRICE + 
          "&PRODUCTQUANTITY=" + payload.PRODUCTQUANTITY + 
          "&PRODUCTDIMENSION=" + payload.PRODUCTDIMENSION + 
          "&PRODUCTUNITPRICE=" + payload.PRODUCTUNITPRICE 
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

  Transaction_UpdateTransactionStatus = action$ =>
    action$.ofType(GitAction.UpdateTransaction).switchMap(async ({ payload }) => {

      try {
        const response = await fetch(url +
          "Transaction_UpdateTransactionStatus?" +
          "TRANSACTIONID=" + payload.TransactionID +
          "&TRANSPORTATIONTYPE=" + payload.TransportationType +
          "&DELIVERYFEE=" + payload.DeliveryFee
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UpdatedTransaction,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_UpdateTransactionStatus")
        return {
          type: GitAction.UpdatedTransaction,
          payload: [],
        };
      }
    });
    Transaction_UpdateTransactionDetailHandling = action$ =>
    action$.ofType(GitAction.UpdateTransactionDetailHandling).switchMap(async ({ payload }) => {

      try {
        const response = await fetch(url +
          "Transaction_UpdateTransactionDetailHandling?" +
          "TRANSACTIONDETAILID=" + payload.TransactionDetailID +
          "&PRODUCTHANDLINGPRICE=" + payload.ProductHandlingPrice 
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UpdatedTransactionDetailHandling,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_UpdateTransactionDetailHandling")
        return {
          type: GitAction.UpdatedTransaction,
          payload: [],
        };
      }
    });
    

  Transaction_UpdateTransactionPayment = action$ =>
    action$.ofType(GitAction.UpdateTransactionPayment).switchMap(async ({ payload }) => {
      console.log(url +
        "Transaction_UpdateTransactionPayment?" +
        "TRANSACTIONID=" + payload.TransactionID +
        "&PAYMENTAMMOUNT=" + payload.PaymentAmmount +
        "&PAYMENTMETHOD=" + payload.PaymentMethod +
        "&REFERENCENO=" + payload.ReferenceNo +
        "&DATETIME=" + payload.Datetime)
      try {
        const response = await fetch(url +
          "Transaction_UpdateTransactionPayment?" +
          "TRANSACTIONID=" + payload.TransactionID +
          "&PAYMENTAMMOUNT=" + payload.PaymentAmmount +
          "&PAYMENTMETHOD=" + payload.PaymentMethod +
          "&REFERENCENO=" + payload.ReferenceNo +
          "&DATETIME=" + payload.Datetime
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UpdatedTransactionPayment,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_UpdateTransactionPayment")
        return {
          type: GitAction.UpdatedTransactionPayment,
          payload: [],
        };
      }
    });

  Transaction_DeleteTransaction = action$ =>
    action$.ofType(GitAction.CancelTransaction).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Transaction_DeleteTransaction?" +
          "TRANSACTIONID=" + payload
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.CancelledTransaction,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_DeleteTransaction")
        return {
          type: GitAction.CancelledTransaction,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////   Transaction Management  ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////   Dashboard  ///////////////////////////////////////////////////
  Dashboard_View = action$ =>
    action$.ofType(GitAction.FetchDashboardData).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Dashboard_View"
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.DashboardDataFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Dashboard_View")
        return {
          type: GitAction.DashboardDataFetched,
          payload: [],
        };
      }
    });
  ///////////////////////////////////////////////////   Dashboard  ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////   Archived Data  ///////////////////////////////////////////////////
  Inventory_ViewArchiveStockListByDate = action$ =>
    action$.ofType(GitAction.FetchArchivedStocks).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_ViewArchiveStockListByDate?" +
          "&STARTDATE=" + payload.STARTDATE +
          "&ENDDATE=" + payload.ENDDATE
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.ArchivedStocksFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_ViewArchiveStockListByDate")
        return {
          type: GitAction.ArchivedStocksFetched,
          payload: [],
        };
      }
    });

  Inventory_ViewArchiveStockListByDate = action$ =>
    action$.ofType(GitAction.FetchArchivedStocks).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_ViewArchiveStockListByDate?" +
          "STARTDATE=" + payload.STARTDATE +
          "&ENDDATE=" + payload.ENDDATE
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.ArchivedStocksFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_ViewArchiveStockListByDate")
        return {
          type: GitAction.ArchivedStocksFetched,
          payload: [],
        };
      }
    });

  Transaction_ViewArchiveTransaction = action$ =>
    action$.ofType(GitAction.FetchArchivedTransaction).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Transaction_ViewArchiveTransaction?" +
          "STARTDATE=" + payload.STARTDATE +
          "&ENDDATE=" + payload.ENDDATE
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.ArchivedTransactionFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_ViewArchiveTransaction")
        return {
          type: GitAction.ArchivedTransactionFetched,
          payload: [],
        };
      }
    });
  ///////////////////////////////////////////////////   Archived Data  ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////   User Management  ///////////////////////////////////////////////////
  User_RegisterUsersByPost = action$ =>
    action$.ofType(GitAction.InsertUserDataByPost).switchMap(async ({ payload }) => {
      return fetch(
        url + "User_RegisterUsersByPost"
        , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            USERCODE: payload.USERCODE,
            AREACODE: payload.AREACODE,
            FULLNAME: payload.FULLNAME,
            USERCONTACTNO: payload.USERCONTACTNO,
            USEREMAILADDRESS: payload.USEREMAILADDRESS,
            USERADDRESS: payload.USERADDRESS,
            MINSELFPICKUPPRICE: payload.MINSELFPICKUPPRICE,
            CUBICSELFPICKUPPRICE: payload.CUBICSELFPICKUPPRICE,
            CONSOLIDATEPRICE: payload.CONSOLIDATEPRICE,
            DELIVERYCARGO: payload.DELIVERYCARGO,
            DELIVERYFIRSTPRICE: payload.DELIVERYFIRSTPRICE,
            DELIVERYSUBPRICE: payload.DELIVERYSUBPRICE
          })
        }
      )
        .then(response => response.json())
        .then(json => {
          if (json !== "fail") {
            json = json;
          } else {
            json = [];
          }
          return {
            type: GitAction.InsertedUserDataByPost,
            payload: json,
          };
        })
        .catch(error => toast.error("Error code: 8003"));
    });

  User_UpdateUserProfile = action$ =>
    action$.ofType(GitAction.UpdateUserData).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_UpdateUserProfile?" +
          "USERID=" + payload.USERID +
          "&USERCODE=" + payload.USERCODE +
          "&USERAREAID=" + payload.USERAREAID +
          "&FULLNAME=" + payload.FULLNAME +
          "&CONTACTNO=" + payload.CONTACTNO +
          "&USEREMAIL=" + payload.USEREMAIL +
          "&USERADDRESS=" + payload.USERADDRESS +
          "&MINSELFPICKUPPRICE=" + payload.MINSELFPICKUPPRICE +
          "&CUBICSELFPICKUPPRICE=" + payload.CUBICSELFPICKUPPRICE +
          "&CONSOLIDATEPRICE=" + payload.CONSOLIDATEPRICE +
          "&DELIVERYCARGO=" + payload.DELIVERYCARGO +
          "&DELIVERYFIRSTPRICE=" + payload.DELIVERYFIRSTPRICE +
          "&DELIVERYSUBPRICE=" + payload.DELIVERYSUBPRICE
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UserDataUpdated,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_UpdateUserProfile")
        return {
          type: GitAction.UserDataUpdated,
          payload: [],
        };
      }
    });

  User_DeleteUserProfile = action$ =>
    action$.ofType(GitAction.DeleteUser).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_DeleteUserProfile?" +
          "USERID=" + payload.USERID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UserDeleted,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_DeleteUserProfile")
        return {
          type: GitAction.UserDeleted,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////   User Management  ///////////////////////////////////////////////////

}
export let gitEpic = new GitEpic();