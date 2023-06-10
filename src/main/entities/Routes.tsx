import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { EntityPage, EntitiesPage, NewEntityPage } from "./";

const PageRoutes = () => {
  const location = useLocation();
  return (
    <Routes>
      <Route path=":entityId/new" element={<NewEntityPage />} />
      <Route path="form/:formId" element={<EntityPage />} />
      <Route path=":entityId/" element={<EntitiesPage />} />
    </Routes>
  );
};

export default PageRoutes;
