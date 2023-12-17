import React, { useEffect, useState } from "react";
import ImportedFooter from "../layouts/footer";
import ImportedHeader from "../layouts/header";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { FloatButton, Layout, Menu } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  AppstoreOutlined,
  WalletOutlined,
  BellOutlined,
  CommentOutlined,
  VideoCameraOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";
import { Chat, ChatBubbleOutline } from "@material-ui/icons";
import { socket } from "./patientLayout";
import axios from "axios";
import { config } from "../middleware/tokenMiddleware";

const { Content, Sider } = Layout;
const PharmacistLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [MessageCount, setMessageCount] = useState(0);
  const [AuthorId, setAuthorId] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    socket.emit("me");
    socket.on("me", (id: string) => {
      localStorage.setItem("socketId", id);
    });

    api.get("/pharmacist/unreadNotifications", config)
    .then((response) => {
      console.log(response.data);
      setNotificationCount(response.data.length);
    })
    .catch((error) => {
      console.log("Error: " + error);
    });

  }, []);
  socket.on("direct-message", (data: any) => {
    console.log(data);
    setAuthorId(data.newMessage.author._id);
    setMessageCount(MessageCount + 1);
  });
  const navigate = useNavigate();
  const items = [
    {
      label: "Account Info",
      key: "/pharmacist/Home",
      icon: <UserOutlined />,
    },
    {
      label: "Medicines",
      icon: <AppstoreOutlined />,
      key: "parentMeds",
      children: [
        {
          label: "Browse All",
          key: "/pharmacist/viewMedicines",
        },
        {
          label: "Add Medicine",
          key: "/pharmacist/addMedicine",
        },
      ],
    },
    {
      label: "Chat",
      icon: <ChatBubbleOutline />,
      key: "parentChat",
      children: [
        {
          label: "Doctors",
          key: "/pharmacist/doctors ",
        },
      ],
    },
    {
      label: "Wallet",
      key: "/pharmacist/wallet",
      icon: <WalletOutlined />,
    },
    {
      label: "Sales Reports",
      key: "/pharmacist/salesReport",
      icon: <LineChartOutlined />,
    },
    {
      label: "Logout",
      key: "/",
      icon: <PoweroffOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          onClick={({ key }) => {
            if (key === "/") {
              //TODO signout feature here
              localStorage.clear();
              navigate(key);
              window.location.reload();
            } else {
              navigate(key);
            }
          }}
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        ></Menu>
      </Sider>
      <Layout>
        <ImportedHeader />
        <Content style={{ margin: "0 16px", overflow: "hidden" }}>
          <div
            style={{
              overflowY: "auto",
              minHeight: "86.5vh",
              maxHeight: "100vh",
            }}
          >
            <AppRouter />
            <div>
            <FloatButton
              onClick={() => {
                navigate("/pharmacist/notifications");
              }}
              style={{
                right: "4vh",
                bottom: "94vh",
                top: "4vh",
              }}
              badge={{ count: notificationCount }}
              icon={<BellOutlined />}
            />
              <FloatButton
                onClick={() => {
                  if (MessageCount > 0) navigate("/pharmacist/chat/" + AuthorId);
                  setMessageCount(0);
                }}
                style={{
                  right: "12vh",
                  bottom: "94vh",
                  top: "4vh",

                }}
                badge={{ count: MessageCount }}
                icon={<CommentOutlined />}
              />
            </div>
          </div>
        </Content>
        <br />
        {/* <ImportedFooter /> */}
      </Layout>
    </Layout>
  );
};

export default PharmacistLayout;
