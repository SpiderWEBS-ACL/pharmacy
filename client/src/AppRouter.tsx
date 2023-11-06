import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const AppRouter: React.FC = () => {
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
      <Route
        path="/admin/AdminHome/"
        element={<AdminHome />}
      />

      <Route path="/pharmacist/register" element={<RegisterPharmacist />} />
      <Route path="/pharmacist/viewMedicines" element={<AllMedicinesPharm />} />
      <Route
        path="/pharmacist/medicineDetails/:id"
        element={<MedicineDetailsPharm />}
      />
      <Route path="/pharmacist/editMedicine/:id" element={<EditMedicine />} />
      <Route path="/pharmacist/addMedicine" element={<AddMedicine />} />
      <Route path="/pharmacist/PharmacistHome/:id" element={<PharmaHome />} />      

      <Route path="/patient/viewMedicines" element={<AllMedicinesPatient />} />
      <Route
        path="/patient/medicineDetails/:id"
        element={<MedicineDetailsPatient />}
      />
    <Route
    path="/patient/PatientHome/:id"
    element={<PatientHome />}
  />
  <Route
    path="/patient/viewCart/:id"
    element={<Cart />}
  />
</Routes>
  );
};

export default AppRouter;
