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
import Register from "./pages/Pharmacist/Register";
import EditMedicine from "./pages/Pharmacist/EditMedicine";
import AddMedicine from "./pages/Pharmacist/addMedicine";
// import AvailableMedicine from "./pages/Pharmacist/ViewListofAvailableMedecines";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/add" element={<AddAdminForm />} />
      <Route path="/admin/allPharmacists" element={<Pharmacists />} />
      <Route path="/admin/Admins" element={<Admins />} />
      <Route path="/admin/registrationRequestDetails/:id" element={<RegistrationRequestDetails />} />
      <Route path="/admin/allPatients" element={<Patients />} />
      <Route path="/admin/registrationRequests" element={<AllPharmaRequests />} />
      <Route path="/admin/viewMedicines" element={<AllMedicinesAdmin />} />
      <Route path="/admin/medicineDetails/:id" element={<MedicineDetailsAdmin />} />

      <Route path="/pharmacist/register" element={<Register />} />
      <Route path="/pharmacist/viewMedicines" element={<AllMedicinesPharm />} />
      <Route path="/pharmacist/medicineDetails/:id" element={<MedicineDetailsPharm />} />
      <Route path="/pharmacist/editMedicine/:id" element={<EditMedicine />} />
      <Route path="/pharmacist/addMedicine"  element={<AddMedicine/>}/>

      <Route path="/patient/register" element={<RegLog />} />
      <Route path="/patient/viewMedicines" element={<AllMedicinesPatient />} />
      <Route path="/patient/medicineDetails/:id" element={<MedicineDetailsPatient />} />

    </Routes>
  );
};

export default AppRouter;
