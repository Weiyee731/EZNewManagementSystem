import React from "react"

// validation functions
export const isStringNullOrEmpty = (value) => { return (typeof value === 'undefined') ? true : (value === null || value == null) ? true : (typeof value === "string" && value.trim() === "") ? true : false }
export const isObjectUndefinedOrNull = (obj) => { return (typeof obj === 'undefined' || obj === null) ? true : false }
export const isArrayNotEmpty = (list) => {
    try {
        if (typeof list !== 'undefined' && Array.isArray(list) && list.length > 0)
            return true
        else
            return false
    }
    catch (e) {
        console.log(e)
        return false
    }
}
export const isContactValid = (contact) => { return (typeof contact !== 'undefined' && contact !== '' && /^(0|1)[0-46-9.\-]*[0-9.\-]{7,8}?$/.test(contact)) }
export const isEmailValid = (email) => { return (typeof email === 'undefined' || email === '' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) ? false : true }
export const isLongitude = (longitude) => { return isFinite(longitude) && Math.abs(longitude) <= 180; }
export const isLatitude = (latitude) => { return isFinite(latitude) && Math.abs(latitude) <= 90; }
export const isDecimalValid = (number) => { return (typeof number === 'undefined' || number == '' || !/^[0-9]\d*(\.\d+)?$/.test(number)) ? true : false }

//time functions
export const convertDateTimeToString = (date) => {
    try {
        let date112 = typeof date !== "undefined" && date !== "" ? new Date(date) : new Date();
        let dd = (date112.getDate().toString().length <= 1) ? "0" + date112.getDate() : date112.getDate().toString()
        let mm = ((date112.getMonth() + 1).toString().length <= 1) ? "0" + (date112.getMonth() + 1) : (date112.getMonth() + 1).toString()
        let yyyy = date112.getFullYear();
        let HH = (date112.getHours().toString().length <= 1) ? "0" + date112.getHours() : date112.getHours().toString()
        let MM = (date112.getMinutes().toString().length <= 1) ? "0" + date112.getMinutes() : date112.getMinutes().toString()
        let ss = (date112.getSeconds().toString().length <= 1) ? "0" + date112.getSeconds() : date112.getSeconds().toString()

        return (yyyy.toString() + mm + dd + HH + MM + ss)
    }
    catch (e) {
        let date112 = new Date();
        let dd = (date112.getDate().toString().length <= 1) ? "0" + date112.getDate() : date112.getDate().toString()
        let mm = ((date112.getMonth() + 1).toString().length <= 1) ? "0" + (date112.getMonth() + 1) : (date112.getMonth() + 1).toString()
        let yyyy = date112.getFullYear();
        let HH = (date112.getHours().toString().length <= 1) ? "0" + date112.getHours() : date112.getHours().toString()
        let MM = (date112.getMinutes().toString().length <= 1) ? "0" + date112.getMinutes() : date112.getMinutes().toString()
        let ss = (date112.getSeconds().toString().length <= 1) ? "0" + date112.getSeconds() : date112.getSeconds().toString()

        return (yyyy.toString() + mm + dd + HH + MM + ss)
    }
}

export const convertDateTimeTo112Format_Moment = (date) => {
    return date.getFullYear() + "" + leftPad(parseInt(date.getMonth() + 1), 2) + "" + leftPad(date.getDate(), 2)
}


// text transformation functions
export const capitalizeFirstLetterOfSentences = (text) => { return (typeof text !== "undefined" ? text.slice(0, 1).toUpperCase() + text.slice(1, text.length) : "") }
export const capitalizeEveryFirstLetter = (text) => { return (typeof text !== "undefined" ? text.replace(/\b(\w)/g, s => s.toUpperCase()) : "") }
export const convertArrayToStringWithSpecialCharacter = (list, sc) => {
    sc = (sc !== null) ? sc : ", "
    if (!Array.isArray(list))
        return "";
    else {
        let text = ""
        for (let i = 0; i < list.length; i++) {
            text += list[i]
            if (i == list.length - 1)
                break;
            else
                text += sc
        }
        return text;
    }
}

// image utilities functions
export const getImageOrientationType = (imageWidth, imageHeight) => {
    if (Number(imageWidth) > Number(imageHeight))
        return "Landscape"
    else if (Number(imageWidth) < Number(imageHeight))
        return "Potrait"
    else
        return "Square"
}

// file handler
export const getFileExtension = (file) => {
    if (typeof file !== "undefined" && typeof file === 'string')
        return file.split('.').pop();
    else {
        try {
            if (file.length > 0) {
                let fileExts = []
                file.map(el => { return fileExts.push(el.name.split('.').pop()) })
                return fileExts
            }
            else {
                return file.name.split('.').pop()
            }
        } catch (e) {
            console.log("getFileExtension: this is not a file")
            return "";
        }
    }
}

export const getFileTypeByExtension = (ext) => {
    if (typeof ext !== "string") {
        console.log("getFileTypeByExtension: this is not a string")
        return ""
    }
    else {
        ext = ext.replace(".", "")
        ext = ext.toLowerCase()
        switch (ext) {
            case "jpg":
            case "jpeg":
            case "png":
                return "image";

            case "mp4":
            case "avi":
            case "mov":
                return "video";

            case "txt":
            case "pdf":
            case "ppt":
                return "file";

            case "docx":
            case "doc":
                return "docs";

            case "xls":
            case "xlsx":
            case "csv":
                return "excel";

            default:
                console.log("getFileTypeByExtension: the value is not found in the library")
                return ""
        }
    }
}

// screen function
export function getWindowDimensions() {
    const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
    return { screenWidth, screenHeight };
}

// currency / money handler functions
export const roundOffTotal = (val) => {
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
                    alert("Error Code: function -> roundingOff() received non-numeric value")
                    break;
            }
        }
    }
    catch (e) { console.error("Error: " + e) }
}


// localStorage
export const resetLocalStorage = () => { localStorage.clear() }

// self-class function
const leftPad = (number, targetLength) => {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
