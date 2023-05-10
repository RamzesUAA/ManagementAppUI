import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { EditContactPage, ContactsPage, ContactPage, NewContactPage } from "./";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path=":contactId" element={<ContactPage />} />
      <Route path="new" element={<NewContactPage />} />
      <Route path="edit/:contactId" element={<EditContactPage />} />
      <Route path="" element={<ContactsPage />} />
    </Routes>
  );
};

export default PageRoutes;
