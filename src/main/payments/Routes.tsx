import React from "react";
import { Routes, Route } from "react-router-dom";

import { EditPaymentPage, PaymentPage, PaymentsPage, NewPaymentPage } from "./";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path=":locationId" element={<PaymentPage />} />
      <Route path="new" element={<NewPaymentPage />} />
      <Route path="edit/:locationId" element={<EditPaymentPage />} />
      <Route path="" element={<PaymentsPage />} />
    </Routes>
  );
};

export default PageRoutes;
