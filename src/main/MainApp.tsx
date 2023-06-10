import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "src/shared/ui/AppLayout";
import { CalendarPage } from "./calendar";
// import { ContactPage } from "./contacts";
// import { LocationsPage } from "./locations";
import { PageRoutes as ContactRoutes } from "./contacts";
import { PageRoutes as LocationRoutes } from "./locations";
import { PageRoutes as FormTypeRoutes } from "./entity-types";
import { PageRoutes as EntityRoutes } from "./entities";
import { PageRoutes as PaymentRoutes } from "./payments";
import { MapPage } from "./map";

const MainApp = () => {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="" element={<MapPage />} />
          <Route path="contacts/*" element={<ContactRoutes />} />
          <Route path="maps/*" element={<MapPage />} />
          <Route path="locations/*" element={<LocationRoutes />} />
          <Route path="entity/*" element={<EntityRoutes />} />
          <Route path="form-types/*" element={<FormTypeRoutes />} />
          <Route path="calendar/*" element={<CalendarPage />} />
          <Route path="payments/*" element={<PaymentRoutes />} />

          {/*               
              <Route path="" element={<DashboardPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="invoices" element={<InvoicePage />} />
              <Route path="form" element={<ProfilePage />} />
              <Route path="bar" element={<Bar />} /> */}
        </Routes>
      </AppLayout>
    </>
  );
};
export default MainApp;
