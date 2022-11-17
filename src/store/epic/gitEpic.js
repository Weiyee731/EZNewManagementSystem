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
const url = ServerConfiguration.LiveServerUrl;
const postUrl = ServerConfiguration.LiveServerUrl;
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
        }
        else {
          // alert("Invalid credential")
          return {
            payload2: [],
            type: GitAction.LoginSuccess,
            payload: json,
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



  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////





  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////
  User_ViewPage = action$ =>
    action$.ofType(GitAction.FetchSidebar).switchMap(async ({ payload }) => {
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

  // Container_ViewContainer = action$ =>
  //   action$.ofType(GitAction.ViewContainer).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(url +
  //         "Container_ViewContainer"
  //       );

  //       let json = await response.json();
  //       json = JSON.parse(json)
  //       return {
  //         type: GitAction.ViewedContainer,
  //         payload: json,
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: Inventory_InsertStock")
  //       return {
  //         type: GitAction.ViewedContainer,
  //         payload: [],
  //       };
  //     }
  //   });

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
        const response = await fetch(url +
          "Inventory_ViewStockListByDate?" +
          "STARTDATE=" + payload.STARTDATE +
          "&ENDDATE=" + payload.ENDDATE
        );

        let json = await response.json();
        json = JSON.parse(json)

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
          "&DELIVERYFEE=" + payload.DELIVERYFEE +
          "&ORDERSUBTOTALMOUNT=" + payload.ORDERSUBTOTALMOUNT +
          "&ORDERTOTALMOUNT=" + payload.ORDERTOTALMOUNT +
          "&ORDERPAIDMOUNT=" + payload.ORDERPAIDMOUNT +
          "&FIRSTKG=" + payload.FIRSTKG +
          "&SUBSEQUENCEKG=" + payload.SUBSEQUENCEKG +
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

  Transaction_UpdateTransactionWithoutStatus = action$ =>
    action$.ofType(GitAction.UpdateTransactionWithoutStatus).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Transaction_UpdateTransactionWithoutStatus?" +
          "TRANSACTIONID=" + payload.TransactionID +
          "&TRANSPORTATIONTYPE=" + payload.TransportationType +
          "&DELIVERYFEE=" + payload.DeliveryFee
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UpdatedTransactionWithoutStatus,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Transaction_UpdateTransactionWithoutStatus")
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
        json = JSON.parse(json)[0]
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
          "&USERWECHATID=" + payload.WECHATID +
          "&USERNICKNAME=" + payload.USERNICKNAME +
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



  ///////////////////////////////////////////////////   Container Management  ///////////////////////////////////////////////////

  Container_ViewContainer = action$ =>
    action$.ofType(GitAction.Container_View).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_ViewContainer"
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Container_Viewed,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Container_ViewContainer")
        return {
          type: GitAction.Container_Viewed,
          payload: [],
        };
      }
    });

  Container_ViewContainerStatus = action$ =>
    action$.ofType(GitAction.Container_ViewStatus).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_ViewContainerStatus"
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Container_ViewedStatus,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Container_ViewContainerStatus")
        return {
          type: GitAction.Container_ViewedStatus,
          payload: [],
        };
      }
    });


  Container_UpdateContainerStatus = action$ =>
    action$.ofType(GitAction.Container_UpdateStatus).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_UpdateContainerStatus?" +
          "&CONTAINERID=" + payload.CONTAINERID +
          "&CONTAINERSTATUSID=" + payload.CONTAINERSTATUSID +
          "&MODIFY=" + payload.MODIFY
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Container_UpdatedStatus,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Container_UpdateContainerStatus")
        return {
          type: GitAction.Container_UpdatedStatus,
          payload: [],
        };
      }
    });


  Container_AddContainer = action$ =>
    action$.ofType(GitAction.Container_Add).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_AddContainer?" +
          "CONTAINERNAME=" + payload.ContainerName +
          "&CONTAINERDATE=" + payload.ContainerDate +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Container_Added,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Container_AddContainer")
        return {
          type: GitAction.Container_Added,
          payload: [],
        };
      }
    });


  Container_UpdateContainer = action$ =>
    action$.ofType(GitAction.Container_Update).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_UpdateContainer?" +
          "CONTAINERID=" + payload.ContainerID +
          "&CONTAINERNAME=" + payload.ContainerName +
          "&CONTAINERREMARK=" + payload.ContainerRemark +
          "&CONTAINERDATE=" + payload.ContainerDate +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Container_Updated,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Container_UpdateContainer")
        return {
          type: GitAction.Container_Updated,
          payload: [],
        };
      }
    });

  Container_DeleteContainer = action$ =>
    action$.ofType(GitAction.Container_Delete).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Container_DeleteContainer?" +
          "CONTAINERID=" + payload.ContainerID +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Container_Deleted,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Container_DeleteContainer")
        return {
          type: GitAction.Container_Deleted,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////   Stock Inventory Management  ///////////////////////////////////////////////////

  Inventory_ViewStockByFilter = action$ =>
    action$.ofType(GitAction.Inventory_ViewByFilter).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_ViewStockByFilter?" +
          "FILTERCOLUMN=" + payload.FilterColumn
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Inventory_ViewedByFilter,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_ViewStockByFilter")
        return {
          type: GitAction.Inventory_ViewedByFilter,
          payload: [],
        };
      }
    });

  Inventory_AddStock = action$ =>
    action$.ofType(GitAction.Inventory_Add).switchMap(async ({ payload }) => {
      toast.warning("Inventory_AddStock IN GIT")
      try {
        const response = await fetch(url +
          "Inventory_AddStock?" +
          "USERCODE=" + payload.UserCode +
          "&TRACKINGNUMBER=" + payload.TrackingNumber +
          "&PRODUCTWEIGHT=" + payload.ProductWeight +
          "&PRODUCTHEIGHT=" + payload.ProductHeight +
          "&PRODUCTWIDTH=" + payload.ProductWidth +
          "&PRODUCTDEEP=" + payload.ProductDeep +
          "&COURIERID=" + payload.CourierID +
          "&ITEM=" + payload.Item +
          "&REMARK=" + payload.Remark +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        toast.success("Inventory_AddStock GIT RETURN ", json)
        return {
          type: GitAction.Inventory_Added,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_AddStock")
        return {
          type: GitAction.Inventory_Added,
          payload: [],
        };
      }
    });

  Inventory_UpdateStock = action$ =>
    action$.ofType(GitAction.Inventory_Update).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_UpdateStock?" +
          "STOCKID=" + payload.StockID +
          "USERCODE=" + payload.UserCode +
          "&TRACKINGNUMBER=" + payload.TrackingNumber +
          "&PRODUCTWEIGHT=" + payload.ProductWeight +
          "&PRODUCTHEIGHT=" + payload.ProductHeight +
          "&PRODUCTWIDTH=" + payload.ProductWidth +
          "&PRODUCTDEEP=" + payload.ProductDeep +
          "&COURIERID=" + payload.CourierID +
          "&ITEM=" + payload.Item +
          "&REMARK=" + payload.Remark +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Inventory_Updated,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_UpdateStock")
        return {
          type: GitAction.Inventory_Updated,
          payload: [],
        };
      }
    });

  Inventory_DeleteStock = action$ =>
    action$.ofType(GitAction.Inventory_Delete).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_DeleteStock?" +
          "STOCKID=" + payload.StockID +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Inventory_Deleted,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_DeleteStock")
        return {
          type: GitAction.Inventory_Deleted,
          payload: [],
        };
      }
    });

  Inventory_UpdateStockContainer = action$ =>
    action$.ofType(GitAction.Inventory_UpdateContainer).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Inventory_UpdateStockContainer?" +
          "TRACKINGNUMBER=" + payload.TrackingNum +
          "&CONTAINERID=" + payload.ContainerID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Inventory_UpdatedContainer,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Inventory_DeleteStock")
        return {
          type: GitAction.Inventory_UpdatedContainer,
          payload: [],
        };
      }
    });



  ///////////////////////////////////////////////////   Courier Management  ///////////////////////////////////////////////////

  Courier_ViewCourier = action$ =>
    action$.ofType(GitAction.Courier_View).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Courier_ViewCourier"
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Courier_Viewed,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Courier_ViewCourier")
        return {
          type: GitAction.Courier_Viewed,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////   Notification Management  ///////////////////////////////////////////////////

  Notification_ViewNotification = action$ =>
    action$.ofType(GitAction.Notification_View).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Notification_ViewNotification2?" +
          "&NOTIFICATIONSTATUSID=" + payload.NotificationStatusID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.Notification_Viewed,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: Notification_ViewNotification")
        return {
          type: GitAction.Notification_Viewed,
          payload: [],
        };
      }
    });

  Notification_AddNotification = action$ =>
    action$.ofType(GitAction.Notification_Add).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Notification_AddNotification?" +
          "NOTIFICATIONTITLE=" + payload.NotificationTitle +
          "&NOTIFICATIONDESC=" + payload.NotificationDesc +
          "&NOTIFICATIONSTATUSID=" + payload.NotificationStatusID +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        // return {
        //   type: GitAction.Notification_Added,
        //   payload: json,
        // };

        try {
          const response = await fetch(url +
            "Notification_ViewNotification2?" +
            "&NOTIFICATIONSTATUSID=0"
          );

          let json = await response.json();
          json = JSON.parse(json)
          return {
            type: GitAction.Notification_Viewed,
            payload: json,
          };
        }
        catch (error) {
          toast.error("Error Code: Notification_ViewNotification")
          return {
            type: GitAction.Notification_Viewed,
            payload: [],
          };
        }

      }
      catch (error) {
        toast.error("Error Code: Notification_AddNotification")
        return {
          type: GitAction.Notification_Added,
          payload: [],
        };
      }
    });

  Notification_UpdateNotification = action$ =>
    action$.ofType(GitAction.Notification_Update).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Notification_UpdateNotification?" +
          "NOTIFICATIONTITLE=" + payload.NotificationTitle +
          "&NOTIFICATIONSTATUSID=" + payload.NotificationStatusID +
          "&NOTIFICATIONID=" + payload.NotificationID +
          "&NOTIFICATIONDESC=" + encodeURIComponent(payload.NotificationDesc) +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        // return {
        //   type: GitAction.Notification_Updated,
        //   payload: json,
        // };

        try {
          const response = await fetch(url +
            "Notification_ViewNotification2?" +
            "&NOTIFICATIONSTATUSID=0"
          );

          let json = await response.json();
          json = JSON.parse(json)
          return {
            type: GitAction.Notification_Viewed,
            payload: json,
          };
        }
        catch (error) {
          toast.error("Error Code: Notification_ViewNotification")
          return {
            type: GitAction.Notification_Viewed,
            payload: [],
          };
        }
      }
      catch (error) {
        toast.error("Error Code: Notification_UpdateNotification" + error)
        return {
          type: GitAction.Notification_Updated,
          payload: [],
        };
      }
    });

  Notification_UpdateNotificationStatus = action$ =>
    action$.ofType(GitAction.Notification_UpdateStatus).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Notification_UpdateNotificationStatus?" +
          "NOTIFICATIONSTATUSID=" + payload.NotificationStatusID +
          "&NOTIFICATIONID=" + payload.NotificationID +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        try {
          const response = await fetch(url +
            "Notification_ViewNotification2?" +
            "&NOTIFICATIONSTATUSID=0"
          );

          let json = await response.json();
          json = JSON.parse(json)
          return {
            type: GitAction.Notification_Viewed,
            payload: json,
          };
        }
        catch (error) {
          toast.error("Error Code: Notification_ViewNotification")
          return {
            type: GitAction.Notification_Viewed,
            payload: [],
          };
        }
      }
      catch (error) {
        toast.error("Error Code: Notification_UpdateNotification" + error)
        return {
          type: GitAction.Notification_UpdatedStatus,
          payload: [],
        };
      }
    });

  Notification_DeleteNotification = action$ =>
    action$.ofType(GitAction.Notification_Delete).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "Notification_DeleteNotification?" +
          "NOTIFICATIONID=" + payload.NotificationID +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        // return {
        //   type: GitAction.Notification_Deleted,
        //   payload: json,
        // };
        try {
          const response = await fetch(url +
            "Notification_ViewNotification2?" +
            "&NOTIFICATIONSTATUSID=0"
          );

          let json = await response.json();
          json = JSON.parse(json)
          return {
            type: GitAction.Notification_Viewed,
            payload: json,
          };
        }
        catch (error) {
          toast.error("Error Code: Notification_ViewNotification")
          return {
            type: GitAction.Notification_Viewed,
            payload: [],
          };
        }
      }
      catch (error) {
        toast.error("Error Code: Notification_DeleteNotification")
        return {
          type: GitAction.Notification_Deleted,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////   Area Code Management  ///////////////////////////////////////////////////


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

  User_AddUserAreaCode = action$ =>
    action$.ofType(GitAction.AddAreaCode).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_AddUserAreaCode?" +
          "AREACODE=" + payload.AreaCode +
          "&AREANAME=" + payload.AreaName +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.AddedAreaCode,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_AddUserAreaCode")
        return {
          type: GitAction.AddedAreaCode,
          payload: [],
        };
      }
    });

  User_UpdateUserAreaCode = action$ =>
    action$.ofType(GitAction.UpdateAreaCode).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_UpdateUserAreaCode?" +
          "USERAREAID=" + payload.UserAreaID +
          "&AREACODE=" + payload.AreaCode +
          "&AREANAME=" + payload.AreaName +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UpdatedAreaCode,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_UpdateUserAreaCode")
        return {
          type: GitAction.UpdatedAreaCode,
          payload: [],
        };
      }
    });

  User_DeleteUserAreaCode = action$ =>
    action$.ofType(GitAction.DeleteAreaCode).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_DeleteUserAreaCode?" +
          "USERAREAID=" + payload.UserAreaID +
          "&MODIFY=" + payload.ModifyBy
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.DeletedAreaCode,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_DeleteUserAreaCode")
        return {
          type: GitAction.DeletedAreaCode,
          payload: [],
        };
      }
    });

  User_ViewProfileByUserCode = action$ =>
    action$.ofType(GitAction.User_ViewByUserCode).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_ViewProfileByUserCode?" +
          "USERCODE=" + payload.UserCode
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.User_ViewedByUserCode,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_ViewProfileByUserCode")
        return {
          type: GitAction.User_ViewedByUserCode,
          payload: [],
        };
      }
    });

}
export let gitEpic = new GitEpic();