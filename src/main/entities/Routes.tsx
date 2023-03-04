import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { EntityPage, EditEntityPage, EntitiesPage, NewEntityPage } from "./";

const PageRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path=":entityTypeName/:entityId  " element={<EntityPage />} />
      <Route path=":entityName/new" element={<NewEntityPage />} />
      <Route path=":entityName/edit/:entityId" element={<EditEntityPage />} />
      <Route path=":entityName/" element={<EntitiesPage />} />
    </Routes>
  );
};

export default PageRoutes;
