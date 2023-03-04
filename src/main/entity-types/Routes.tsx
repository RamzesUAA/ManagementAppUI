import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import {
  EntityTypePage,
  EditEntityTypePage,
  EntityTypesPage,
  NewEntityTypePage,
} from "./";

const PageRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path=":locationId" element={<EntityTypePage />} />
      <Route path="new" element={<NewEntityTypePage />} />
      <Route path="edit/:entityId" element={<EditEntityTypePage />} />
      <Route path="" element={<EntityTypesPage />} />
    </Routes>
  );
};

export default PageRoutes;
