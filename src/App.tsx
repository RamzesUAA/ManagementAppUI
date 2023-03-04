// @ts-nocheck

import React from "react";
import { Routes, Route } from "react-router-dom";

import SuperAdminApp from "./superadmin/SuperAdminApp";
import MainApp from "./main/MainApp";

const App = () => {
  return (
    <Routes>
      <Route path="superadmin/*" element={<SuperAdminApp />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
};

export default App;
