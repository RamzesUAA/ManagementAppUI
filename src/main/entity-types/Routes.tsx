import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import {
  FormTypePage,
  EditFormTypePage,
  FormTypesPage,
  NewFormTypePage,
} from "./";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path=":formTypeId" element={<FormTypePage />} />
      <Route path="new" element={<NewFormTypePage />} />
      <Route path="edit/:formTypeId" element={<EditFormTypePage />} />
      <Route path="" element={<FormTypesPage />} />
    </Routes>
  );
};

export default PageRoutes;
