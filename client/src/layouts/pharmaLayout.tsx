import React, { useState } from "react";
import ImportedFooter from "../layouts/footer";
import ImportedHeader from "../layouts/header";
import {
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import AppRouter from "../AppRouter";

const { Content, Sider } = Layout;
const PharmacistLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
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
        style={{height: '100vh', position: "fixed"}}
        theme = "light"
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
      <Layout style={{height: '100%', overflow: 'scroll'}}>
        <ImportedHeader />
        <Content style={{ margin: "0 16px" , marginLeft: "18%", minHeight: "100vh"}}>
          <AppRouter />
        </Content>
        <br />
        <ImportedFooter />
      </Layout>
    </Layout>
  );
};

export default PharmacistLayout;
