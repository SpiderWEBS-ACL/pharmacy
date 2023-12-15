import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { config } from "../../middleware/tokenMiddleware";

export const getPharmacists = async () => {
  const response = await axios.get(
    `${BASE_URL}/patient/allPharmacists`,
    config
  );
  return response;
};
