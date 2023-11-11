import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AddAdminForm from "./pages/Admin/AddAdminForm";
import Pharmacists from "./pages/Admin/Pharmacists";
import Admins from "./pages/Admin/Admins";
import RegistrationRequestDetails from "./pages/Admin/PharmaRegReqDetails";
import Patients from "./pages/Admin/Patients";
import AllPharmaRequests from "./pages/Admin/ViewAllPharmaRegReqs";
import AllMedicinesAdmin from "./pages/Admin/ViewAllMeds";
import MedicineDetailsAdmin from "./pages/Admin/ViewMedicineDetails";
import AllMedicinesPharm from "./pages/Pharmacist/ViewAllMeds";
import MedicineDetailsPharm from "./pages/Pharmacist/ViewMedicineDetails";
import AllMedicinesPatient from "./pages/Patient/ViewAllMeds";
import MedicineDetailsPatient from "./pages/Patient/ViewMedicineDetails";
import RegLog from "./pages/RegLog";
import RegisterPharmacist from "./pages/Pharmacist/Register";
import EditMedicine from "./pages/Pharmacist/EditMedicine";
import AddMedicine from "./pages/Pharmacist/addMedicine";
import PatientHome from "./pages/Patient/PatientHome";
import AdminHome from "./pages/Admin/AdminHome";
import PharmaHome from "./pages/Pharmacist/PharmaHome";
import Cart from "./pages/Patient/Cart";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { JwtPayload } from "./middleware/tokenMiddleware";
import NotFound from "./NotFound";
import ChangePasswordAdmin from "./pages/Admin/ChangePassword";
import ChangePasswordPharm from "./pages/Pharmacist/ChangePassword";
import ChangePasswordPatient from "./pages/Patient/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Wallet from "./pages/Patient/Wallet";
import OrderConfirmation from "./pages/Patient/OrderConfirmation";

const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  let role = "";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    role = decodedToken.role as string;
    if (role === "Admin") {
      return (
        <Routes>
          <Route path="/" element={<RegLog />} />
          <Route path="/admin/add" element={<AddAdminForm />} />
          <Route path="/admin/allPharmacists" element={<Pharmacists />} />
          <Route path="/admin/Admins" element={<Admins />} />
          <Route
            path="/admin/registrationRequestDetails/:id"
            element={<RegistrationRequestDetails />}
          />
          <Route path="/admin/Patients" element={<Patients />} />
          <Route
            path="/admin/registrationRequests"
            element={<AllPharmaRequests />}
          />
          <Route path="/admin/viewMedicines" element={<AllMedicinesAdmin />} />
          <Route
            path="/admin/medicineDetails/:id"
            element={<MedicineDetailsAdmin />}
          />
          <Route path="/admin/Home" element={<AdminHome />} />
          <Route
            path="/admin/changePassword"
            element={<ChangePasswordAdmin />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else if (role === "Pharmacist") {
      return (
        <Routes>
          <Route path="/" element={<RegLog />} />
          <Route path="/pharmacist/register" element={<RegisterPharmacist />} />
          <Route
            path="/pharmacist/viewMedicines"
            element={<AllMedicinesPharm />}
          />
          <Route
            path="/pharmacist/medicineDetails/:id"
            element={<MedicineDetailsPharm />}
          />
          <Route
            path="/pharmacist/editMedicine/:id"
            element={<EditMedicine />}
          />
          <Route path="/pharmacist/addMedicine" element={<AddMedicine />} />
          <Route path="/pharmacist/Home" element={<PharmaHome />} />
          <Route
            path="/pharmacist/changePassword"
            element={<ChangePasswordPharm />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else if (role === "Patient") {
      return (
        <Routes>
          <Route path="/" element={<RegLog />} />
          <Route
            path="/patient/viewMedicines"
            element={<AllMedicinesPatient />}
          />
          <Route
            path="/patient/medicineDetails/:id"
            element={<MedicineDetailsPatient />}
          />
          <Route path="/patient/Home" element={<PatientHome />} />
          <Route path="/patient/viewCart" element={<Cart />} />
          <Route
            path="/patient/changePassword"
            element={<ChangePasswordPatient />}
          />
          <Route path="/patient/wallet" element={<Wallet />} />
          <Route
            path="/patient/orderConfirmation"
            element={<OrderConfirmation />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else {
      navigate(-1);
      return (
        <Routes>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/" element={<RegLog />} />
        </Routes>
      );
    }
  }
};

export default AppRouter;
