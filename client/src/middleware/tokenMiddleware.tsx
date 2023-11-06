import Cookies from "js-cookie";

export const config = {
headers: {
    Authorization: "Bearer " + Cookies.get("accessToken"),
},
};

export const headers = {
    Authorization: "Bearer " + Cookies.get("accessToken"),
};

export default {config, headers}