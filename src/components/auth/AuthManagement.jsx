import { toast } from "react-toastify";
import { isStringNullOrEmpty } from "../../tools/Helpers";

/**
 *   Documentation of this class methods
 *   @function setLogonUser => @param loginUser => @returns void
 *   @function isUserLogon =>  @returns bool
 *   @function updateLogonUser => @param key, @param value => @returns void
 *   @function resetLogonUser => void
 */
export const setLogonUser = (loginUser, sidebarItem) => {
    if (typeof loginUser !== "undefined" && loginUser !== null) {
        try {
            localStorage.setItem("userToken", true);
            localStorage.setItem("loginUser", JSON.stringify(loginUser));
            localStorage.setItem("sidebarItem", JSON.stringify(sidebarItem));
            localStorage.setItem("systemInfo", "EZLogistic");
            window.location.href = "/Ez/Dashboard"
        }
        catch (e) {
            toast.error("Error: 1101: Unable to set login status. Please contact your software warehouse.")
        }
    }
    else {
        toast.error("Error: 1101.1: Unable to set login status. Passing parameter is empty or undefined.")
    }
}

export const getSidebaritems = () => {
    return localStorage.getItem("sidebarItem")
}

export const isUserLogon = () => {
    if (!isStringNullOrEmpty(localStorage.getItem("systemInfo")) && localStorage.getItem("systemInfo") !== "EZLogistic")
        resetLogonUser();
    else
        return localStorage.getItem("userToken")
}

export const resetLogonUser = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("loginUser")
    localStorage.removeItem("sidebarItem");
    window.location.href = "/Ez/Login"
}

export const updateLogonUser = (key, value) => {
    localStorage.setItem(key, value);
}