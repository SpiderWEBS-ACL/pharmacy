import "../layouts/footer.css";
import { Layout } from "antd";
const { Header } = Layout;
const header = () => {
  return (
    <Header
      style={{
        background: "transparent",
        height: 100,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img src="/logo.png" alt="logo" height={100} />
    </Header>
  );
};

export default header;
