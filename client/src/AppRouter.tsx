import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddAdminForm from "./pages/Admin/AddAdminForm";
import Pharmacists from "./pages/Admin/Pharmacists";
import Admins from "./pages/Admin/Admins";
import RegistrationRequestDetails from "./pages/Admin/PharmaRegReqDetails";
import Patients from "./pages/Admin/Patients";
import AllPharmaRequests from "./pages/Admin/ViewAllPharmaRegReqs";
import RegLog from "./pages/RegLog";
import Register from "./pages/Pharmacist/Register";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/add" element={<AddAdminForm />} />
      <Route path="/admin/allPharmacists" element={<Pharmacists />} />
      <Route path="/admin/Admins" element={<Admins />} />
      <Route path="/admin/registrationRequestDetails/:id" element={<RegistrationRequestDetails />} />
      <Route path="/admin/allPatients" element={<Patients />} />
      <Route path="/admin/registrationRequests" element={<AllPharmaRequests />} />
      <Route path="/patient/register" element={<RegLog />} />
      <Route path="/pharmacist/register" element={<Register />} />
    </Routes>
  );
};

export default AppRouter;
