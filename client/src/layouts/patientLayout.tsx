import React, { useState } from "react";
import ImportedFooter from "../layouts/footer";
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
  HistoryOutlined

} from "@ant-design/icons";
import AppRouter from "../AppRouter";

const { Header, Content, Footer, Sider } = Layout;
const id = localStorage.getItem("id");
const PatientLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      key: "/patient/commercial",
      icon: <HomeOutlined/>
    },
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
      label: "Wallet",
      key: "/patient/wallet",
      icon: <WalletOutlined />,
    },
    {
      label: "Orders",
      key: "/patient/orders",
      icon: <HistoryOutlined /> ,
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
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        // style={{background: "#c9c9c9"}}
        // theme = "light"
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
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          // style={{background: "#c9c9c9"}}
        ></Menu>
        
      </Sider>
      <Layout>
        <ImportedHeader />
        <Content style={{ margin: "0 16px" }}>
          <AppRouter />
        </Content>
        <ImportedFooter />
      </Layout>
    </Layout>
  );
};

export default PatientLayout;
