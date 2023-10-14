import AdminLayout from "./layouts/adminLayout";
import PharmacistLayout from "./layouts/pharmaLayout";
import PatientLayout from "./layouts/patientLayout";
import RegLog from "./pages/RegLog";

const Handler: React.FC = () => {
  const userType = localStorage.getItem("type");
  if (userType === "Patient") return <PatientLayout />;
  else if (userType === "Admin") return <AdminLayout />;
  else if (userType === "Pharmacist") return <PharmacistLayout />;
  else return <RegLog />;
};  
export default Handler;
