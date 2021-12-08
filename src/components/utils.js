import React from 'react'

export function roundOffTotal(val) {
  try {
      if (Number(val) % 0)
          return 0
      else {
          let amount = Number(val).toFixed(2).toString();
          let decimal = amount.split(".").pop()
          amount = amount.split(".")[0]
          decimal = decimal.toString().split("")

          let firstDigit = decimal[0]
          let lastDigit = decimal.pop()

          let roundingOff;
          switch (Number(lastDigit)) {
              case 0:
              case 1:
              case 2:
                  roundingOff = firstDigit.toString() + "0"
                  return (amount.toString().concat("." + roundingOff.toString()))
                  break;

              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
                  roundingOff = firstDigit.toString() + "5"
                  return (amount.toString().concat("." + roundingOff.toString()))
                  break;

              case 8:
              case 9:
                  if (firstDigit == 9) {
                      amount = Number(amount) + 1
                      roundingOff = amount.toString() + ".00"
                  }
                  else {
                      firstDigit = Number(firstDigit) + 1
                      roundingOff = amount.toString() + "." + firstDigit.toString() + "0"
                  }
                  return (roundingOff)
                  break;

              default:
                  // alert("Error Code: function -> roundingOff() received non-numeric value")
                  break;
          }
      }
  }
  catch (e) { console.error("Error: " + e) }
}

export function roundOffUnit(val) {
  try {
      if (Number(val) % 0)
          return 0
      else {
          let amount = Number(val).toFixed(3).toString();
          let decimal = amount.split(".").pop()
          amount = amount.split(".")[0]
          decimal = decimal.toString().split("")

          let firstDigit = decimal[0]
          let lastDigit = decimal.pop()

          let roundingOff;
          switch (Number(lastDigit)) {
              case 0:
              case 1:
              case 2:
                  roundingOff = firstDigit.toString() + "0"
                  return (amount.toString().concat("." + roundingOff.toString()))
                  break;

              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
                  roundingOff = firstDigit.toString() + "5"
                  return (amount.toString().concat("." + roundingOff.toString()))
                  break;

              case 8:
              case 9:
                  if (firstDigit == 9) {
                      amount = Number(amount) + 1
                      roundingOff = amount.toString() + ".00"
                  }
                  else {
                      firstDigit = Number(firstDigit) + 1
                      roundingOff = amount.toString() + "." + firstDigit.toString() + "0"
                  }
                  return (roundingOff)
                  break;

              default:
                  // alert("Error Code: function -> roundingOff() received non-numeric value")
                  break;
          }
      }
  }
  catch (e) { console.error("Error: " + e) }
}