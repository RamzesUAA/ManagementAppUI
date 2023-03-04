import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import {
  EditLocationPage,
  LocationPage,
  LocationsPage,
  NewLocationPage,
} from "./";

const PageRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path=":locationId" element={<LocationPage />} />
      <Route path="new" element={<NewLocationPage />} />
      <Route path="edit/:locationId" element={<EditLocationPage />} />
      <Route path="" element={<LocationsPage />} />
    </Routes>
  );
};

export default PageRoutes;
