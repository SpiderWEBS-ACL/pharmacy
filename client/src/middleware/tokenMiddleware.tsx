import Cookies from "js-cookie";

export const config = {
headers: {
    Authorization: "Bearer " + Cookies.get("accessToken"),
},
};

export const headers = {
    Authorization: "Bearer " + Cookies.get("accessToken"),
};

export interface JwtPayload {
    id: string;
    role: string;
  }
  
export default {config, headers}