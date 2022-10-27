// let { remote } = require("electron");
// const { PosPrinter } = remote.require("electron-pos-printer");
const {PosPrinter} = require("electron-pos-printer");

const path = require("path");


// function date() {
//     const x = new Date();
  
//     const y = "0" + x.getHours();
//     const z = "0" + x.getMinutes();
//     const s = "0" + x.getSeconds();
//     const h = "0" + x.getDate();
//     const ano = x.getFullYear().toString().substr(-2);
//     const ms = x.getMonth();
//     const meses = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "June",
//       "July",
//       "Aug",
//       "Sept",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
  
//     return (
//       h.substr(-2) +
//       "/" +
//       meses[ms] +
//       "/2021 -  " +
//       y.substr(-2) +
//       ":" +
//       z.substr(-2) +
//       ":" +
//       s.substr(-2) 
//     );
//   }
  