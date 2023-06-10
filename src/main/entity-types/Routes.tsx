import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { FormTypePage, FormTypesPage, NewFormTypePage } from "./";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path=":formTypeId" element={<FormTypePage />} />
      <Route path="new" element={<NewFormTypePage />} />
      <Route path="" element={<FormTypesPage />} />
    </Routes>
  );
};

export default PageRoutes;
