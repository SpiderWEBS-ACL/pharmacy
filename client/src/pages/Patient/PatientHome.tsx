import { useState, useEffect } from "react";
import {
  Layout,
  Breadcrumb,
  Card,
  Typography,
  List,
  Row,
  Col,
  Spin,
  Modal,
  Avatar,
  message,
  Table,
} from "antd";
import { InfoCircleTwoTone, SettingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { differenceInYears } from "date-fns";
const { Content, Footer } = Layout;
import { config } from "../../middleware/tokenMiddleware";

const { Title } = Typography;
import Wallet from "../../components/Wallet";

const PatientHome = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [loadingCard, setLoadingCard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  const [patientInfo, setPatientInfo] = useState<any>({});
  const [orders, setOrders] = useState<any>([]);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const fetchBalance = async () => {
    try {
      api
        .get("patient/wallet", config)
        .then((response) => {
          setBalance(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

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
    fetchBalance();
    setLoading(false)
    setLoadingCard(false)
  }, [id]);

  var title = "";
  if (patientInfo.Gender == "Male") title = "Mr.";
  else if (patientInfo.Gender == "Male") title = "Ms.";

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const openModal = () => {
    setShowPopup(true);
  };
  const closeModal = () => {
    setShowPopup(false);
  };

  let dob = patientInfo.Dob + "";
  let date = dob.split("T")[0];

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const dob = new Date(birthDate);
    return differenceInYears(today, dob);
  };

  const appointmentsRedirect = () => {
    navigate("/patient/allAppointments", { replace: true });
  };
  const prescriptionsRedirect = () => {
    navigate("/patient/viewPrescriptions", { replace: true });
  };
  const subscriptionsRedirect = () => {
    navigate("/patient/packages", { replace: true });
  };

  return (
    <Layout style={{ height: "70vh" }}>
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          <Modal
            style={{ top: 25 }}
            open={showPopup}
            footer={null}
            onCancel={closeModal}
          >
            <Card title="My Details" style={{ marginBottom: 0 }}>
              <List>
                <List.Item>
                  <Title level={5}>Name: &nbsp;{patientInfo.Name}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Username: &nbsp;{patientInfo.Username}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Password:&nbsp; **********</Title>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => {
                      navigate("/patient/changePassword");
                    }}
                  >
                    Change Password
                  </button>
                </List.Item>
                <List.Item>
                  <Title level={5}>Date of birth: &nbsp;{date}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Gender: &nbsp;{patientInfo.Gender}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Mobile: &nbsp;{patientInfo.Mobile}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Email: &nbsp;{patientInfo.Email}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    Emergency Contact Name: &nbsp;{patientInfo.EmergencyContactName}
                  </Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    Emergency Contact Mobile: &nbsp;
                    {patientInfo.EmergencyContactMobile}
                  </Title>
                </List.Item>
              </List>
            </Card>
          </Modal>

          <Row>
            <Col md={24}>
              <Card
                hoverable
                title="My Details"
                loading={loadingCard}
                extra={
                  <SettingOutlined
                    style={{ width: 50, height: 50, justifyContent: "right" }}
                    onClick={openModal}
                  />
                }
                style={{ marginBottom: 16, height: "37vh" }}
              >
                <Row>
                  <Avatar
                    src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                    style={{ width: 150, height: 150 }}
                  />&nbsp;&nbsp;
                  <Col>
                    <Title level={4}>
                      {title} {patientInfo.Name}
                    </Title>
                    <Title level={4}>
                      {calculateAge(patientInfo.Dob)} years old
                    </Title>
                    <Title level={4}>{patientInfo.Gender}</Title>
                  </Col>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginLeft: "auto",
                      marginTop: "25px",
                    }}
                  >
                    <Wallet walletBalance={balance}></Wallet>
                  </div>
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientHome;
