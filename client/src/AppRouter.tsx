import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddAdminForm from "./pages/Admin/AddAdminForm";
import Pharmacists from "./pages/Admin/Pharmacists";
import Admins from "./pages/Admin/Admins";
import RegistrationRequestDetails from "./pages/Admin/PharmaRegReqDetails";
import Patients from "./pages/Admin/Patients";
import AllPharmaRequests from "./pages/Admin/ViewAllPharmaRegReqs";
import AllMedicines from "./pages/Admin/ViewAllMeds";
import MedicineDetails from "./pages/Admin/ViewMedicineDetails";
import RegLog from "./pages/RegLog";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/add" element={<AddAdminForm />} />
      <Route path="/admin/allPharmacists" element={<Pharmacists />} />
      <Route path="/admin/Admins" element={<Admins />} />
      <Route path="/admin/registrationRequestDetails/:id" element={<RegistrationRequestDetails />} />
      <Route path="/admin/allPatients" element={<Patients />} />
      <Route path="/admin/registrationRequests" element={<AllPharmaRequests />} />
      <Route path="/admin/viewMedicines" element={<AllMedicines />} />
      <Route path="/admin/medicineDetails/:id" element={<MedicineDetails />} />
      <Route path="/patient/register" element={<RegLog />} />
    </Routes>
  );
};

export default AppRouter;
