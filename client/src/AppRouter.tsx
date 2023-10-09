import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddAdminForm from "./pages/Admin/AddAdminForm";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/addAdmin" element={<AddAdminForm />} />
    </Routes>
  );
};

export default AppRouter;
