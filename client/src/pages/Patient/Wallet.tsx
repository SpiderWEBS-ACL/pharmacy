import React, { useEffect, useState } from "react";
import WalletBalance from "../WalletBalance";
import axios from "axios";
import { config } from "../../middleware/tokenMiddleware";

const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });
  useEffect(() => {
    api
      .get("patient/wallet", config)
      .then((response) => {
        setBalance(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return <WalletBalance balance={balance} />;
};

export default Wallet;
