import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../middleware/tokenMiddleware";

export const getDoctors = async () => {
  const response = await axios.get(`${BASE_URL}/pharmacist/allDoctors`, config);
  return response;
};
