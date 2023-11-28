import AdminLayout from "./layouts/adminLayout";
import PharmacistLayout from "./layouts/pharmaLayout";
import PatientLayout from "./layouts/patientLayout";
import RegLog from "./pages/RegLog";

import RegisterPharmacist from "./pages/Pharmacist/Register";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import UploadDocuments from "./pages/Pharmacist/UploadDocuments";
import Home from "./Home";
const Handler: React.FC = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("type");
  const currentPath = window.location.pathname;
  if (userType === "Patient") return <PatientLayout />;
  else if (userType === "Admin") return <AdminLayout />;
  else if (userType === "Pharmacist") return <PharmacistLayout />;
  else if (currentPath.includes("pharmacist/register"))
    return <RegisterPharmacist />;
  else if (currentPath.includes("/forgotPassword"))
    return <ForgotPassword   />;
  else if (currentPath.includes("/uploadDocuments"))
    return <UploadDocuments   />;
  else if (currentPath.includes("/home"))
    return <Home />;
  else return <RegLog />;
};
export default Handler;

