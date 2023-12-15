import React, { useEffect, useState } from "react";
import ImportedHeader from "../layouts/header";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  FileOutlined,
  UserOutlined,
  PoweroffOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  WalletOutlined,
  HistoryOutlined,
  CommentOutlined,
  BellOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";
import { FloatButton } from "antd";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";
import { ChatBubbleOutline } from "@material-ui/icons";
export const socket: Socket = io("http://localhost:5000", {
  auth: {
    token: Cookies.get("accessToken"),
  },
});
const { Header, Content, Footer, Sider } = Layout;
const id = localStorage.getItem("id");
const PatientLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [MessageCount, setMessageCount] = useState(0);
  const [AuthorId, setAuthorId] = useState("");

  useEffect(() => {
    socket.emit("me");
    socket.on("me", (id: string) => {
      localStorage.setItem("socketId", id);
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
      key: "/patient/Home",
      icon: <UserOutlined />,
    },
    {
      label: "Medicines",
      icon: <FileOutlined />,
      key: "parentMeds",
      children: [
        {
          label: "Browse All",
          key: "/patient/viewMedicines",
        },
      ],
    },
    {
      label: "Cart",
      key: "/patient/viewCart",
      icon: <ShoppingCartOutlined />,
    },
    {
      label: "Chat",
      icon: <ChatBubbleOutline />,
      key: "parentChat",
      children: [
        {
          label: "Pharmacists",
          key: "/patient/pharmacists",
        },
      ],
    },
    {
      label: "Wallet",
      key: "/patient/wallet",
      icon: <WalletOutlined />,
    },
    {
      label: "Orders",
      key: "/patient/orders",
      icon: <HistoryOutlined />,
    },

    {
      label: "Logout",
      key: "/",
      icon: <PoweroffOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100%" }}>
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
          </div>
          <div>
            <FloatButton
              style={{
                right: "4vh",
                bottom: "94vh",
              }}
              icon={<BellOutlined />}
            />
            <FloatButton
              onClick={() => {
                if (MessageCount > 0) navigate("/pharmacist/chat/" + AuthorId);
                setMessageCount(0);
              }}
              style={{
                right: "10vh",
                bottom: "94vh",
              }}
              badge={{ count: MessageCount }}
              icon={<CommentOutlined />}
            />
          </div>
        </Content>
        <br />
        {/* <ImportedFooter /> */}
      </Layout>
    </Layout>
  );
};

export default PatientLayout;
