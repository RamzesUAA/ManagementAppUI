import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { EntityPage, EditEntityPage, EntitiesPage, NewEntityPage } from "./";

const PageRoutes = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Routes>
      <Route path=":entityId/new" element={<NewEntityPage />} />
      <Route path=":entityId/edit/:entityId" element={<EditEntityPage />} />
      <Route path="form/:formId" element={<EntityPage />} />
      <Route path=":entityId/" element={<EntitiesPage />} />
    </Routes>
  );
};

export default PageRoutes;
