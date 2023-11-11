import React, { useEffect } from 'react'
import axios from "axios";
import { config, headers } from '../../middleware/tokenMiddleware';

const Success: React.FC = () =>{
    const api = axios.create({
        baseURL: "http://localhost:5000/cart",
      });
    


    useEffect(() => {
            api
            .put(`/emptyCart`,{}, {headers: headers})
            .then((response) =>{
                console.log("RES",response.data);
            })
    });

  return (
    <div>
      SUCCESS!
      <button>Go to Orders</button>
    </div>
  )
}

export default Success
