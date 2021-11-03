import { toast } from "react-toastify";

/**
 *   Documentation of this class methods
 *   @function setLogonUser => @param loginUser => @returns void
 *   @function isUserLogon =>  @returns bool
 *   @function updateLogonUser => @param key, @param value => @returns void
 *   @function resetLogonUser => void
 */

export const setLogonUser = (loginUser) => {
    if (typeof loginUser !== "undefined" && loginUser !== null) {
        try {
            localStorage.setItem("userToken", true);
            localStorage.setItem("loginUser", JSON.stringify(loginUser));
        }
        catch (e) {
            toast.error("Error: 1101: Unable to set login status. Please contact your software warehouse.")
        }
    }
    else {
        toast.error("Error: 1101.1: Unable to set login status. Passing parameter is empty or undefined.")
    }
}

export const isUserLogon = () => {
    return (typeof localStorage.getItem("userToken") !== "undefined" && localStorage.getItem("userToken") !== null) ? true : false
}

export const resetLogonUser = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("loginUser")
}

export const updateLogonUser = (key, value) => {
    localStorage.setItem(key, value);
}