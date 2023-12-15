import React, { useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  IdcardOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";
import ImportedFooter from "../layouts/footer";
import ImportedHeader from "../layouts/header";

const { Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const items = [
    {
      label: "Account info",
      key: "/admin/Home",
      icon: <IdcardOutlined />,
    },
    {
      label: "Admin",
      icon: <TeamOutlined />,
      key: "parent1",
      children: [
        { label: "Admins", key: "/admin/Admins" },
        { label: "Add Admin", key: "/admin/add" },
      ],
    },
    {
      label: "Patients",
      key: "/admin/Patients",
      icon: <UserOutlined />,
    },
    {
      label: "Pharmacists",
      icon: <UserOutlined />,
      key: "parent",
      children: [
        {
          label: "Pharmacists",
          key: "/admin/allPharmacists",
        },
        {
          label: "Registration Reqs",
          key: "/admin/registrationRequests",
        },
      ],
    },
    {
      label: "Medicines",
      icon: <AppstoreOutlined />,
      key: "parentMeds",
      children: [
        {
          label: "Browse All",
          key: "/admin/viewMedicines",
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
        <Content style={{}}>
          <div
            style={{
              overflowY: "auto",
              minHeight: "86.5vh",
              maxHeight: "100vh",
            }}
          >
            <AppRouter />
          </div>
        </Content>
        <br />
        <ImportedFooter/>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
