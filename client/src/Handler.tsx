import AdminLayout from "./layouts/adminLayout";
import PharmaLayout from "./layouts/pharmaLayout";
import PatientLayout from "./layouts/patientLayout";
import Register from "./pages/Pharmacist/Register";
import RegLog from "./pages/RegLog";

const Handler: React.FC = () => {
  const currentPath = window.location.pathname;
  const userType = localStorage.getItem("type");
  if (userType === "Patient") return <PatientLayout />;
  else if (userType === "Admin") return <AdminLayout />;
  else if (userType === "Pharmacist") return <PharmaLayout />;
  else if (currentPath.includes("/doctor/register")) return <Register />;
  else return <RegLog />;
};
  export default Handler;