import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../../middleware/tokenMiddleware";
// import { Card, Divider } from "antd";
import {
  ChakraProvider,
  Container,
  Heading,
  List,
  ListItem,
  UnorderedList,
  VStack,
  HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";

const PatientHome = () => {
  const id = localStorage.getItem("id");

  const [patientInfo, setPatientInfo] = useState<any>({});
  const [orders, setOrders] = useState<any>([]);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    api
      .get(`/patient/me`, config)
      .then((response) => {
        setPatientInfo(response.data);
        // setEmergencyContact(response.data.EmergencyContact);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    api
      .get(`/patient/orders`, config)
      .then((response) => {
        setOrders(response.data);
        console.log("Orders: " + response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  var Dob = patientInfo.Dob + "";

  const dateTimeParts: string[] = Dob.split("T");
  const datePart: string = dateTimeParts[0];

  var pron = "";
  if (patientInfo.Gender == "Male") pron = "Mr.";
  else pron = "Ms.";
  return (
    <ChakraProvider>
      <Container
        marginTop="5"
        boxShadow="lg" // Add shadow
        borderRadius="lg" // Add border radius for curved edges
        border="3px solid #052c65" // Add border
        p={6}
        maxW="container.xl"
      >
        <Heading as="h1" size="xl" mt={0}>
          Dashboard<br></br>
          <Divider borderColor="#052c65" borderWidth="2px" />
        </Heading>

        <HStack w="700" spacing={2} align="start">
          <Heading as="h5" size="lg" mt={0}>
            {pron}
            {patientInfo.Name}
            <Divider borderColor="#052c65" borderWidth="2px" />
          </Heading>
        </HStack>

        <Flex mt={8} justify="space-between">
          <VStack w="30%" align="start" spacing={1}>
            <Heading as="h2" size="md">
              Personal Information
            </Heading>
            <Divider borderColor="#052c65" borderWidth="1px" />
            <h6 className="card-text">
              <b>Date of Birth: </b>
              {datePart}
            </h6>
            {/* <h6 className="card-text">
              <b>Gender </b>
              {patientInfo.Gender}
            </h6> */}
            <h6 className="card-text">
              <b>Mobile: </b>
              {patientInfo.Mobile}
            </h6>
            <h6 className="card-text">
              <b>Email: </b>
              {patientInfo.Email}
            </h6>
            <br />
            <div style={{ display: "flex" }}>
              <button
                style={{ marginLeft: "auto", marginRight: "20px" }}
                className="btn btn-danger"
                type="button"
                onClick={() => {
                  navigate("/patient/changePassword");
                }}
              >
                Change Password
              </button>
            </div>
          </VStack>

          <VStack></VStack>

          <VStack w="55%" align="start" spacing={4}>
            <Heading as="h2" size="md">
              Shipped Orders
            </Heading>
            <Divider borderColor="#052c65" borderWidth="1px" />
            {/* <List spacing={2}> */}
            {orders.map((order: any, index: any) => {
              if (order.Status == "Shipped")
                return (
                  <div style={{ display: "flex", verticalAlign: "middle" }}>
                    <p>
                      <b>Order #{order._id}</b> &emsp;{" "}
                      {new Date(order.Date.split("T")[0]).toDateString()} &emsp;
                    </p>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 14, height: 35 }}
                      onClick={() => {
                        navigate(`/patient/viewOrder/${order._id}`);
                      }}
                    >
                      View Order
                    </button>
                  </div>
                );
            })}
          </VStack>
        </Flex>
      </Container>
    </ChakraProvider>
  );
};

export default PatientHome;
