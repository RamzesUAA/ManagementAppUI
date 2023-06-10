import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "src/shared/ui/AppLayout";
import { CalendarPage } from "./calendar";
import { DashboardPage } from "./dashboard";
import { RolesPage, NewRolePage } from "./roles";
import { UsersPage, NewUserPage } from "./users";
import { OrganizationsPage, NewOrganizationPage } from "./organizations";
import { InvoicePage } from "./invoices";
import Bar from "./barchart";

const SuperAdminApp = () => {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="" element={<UsersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<NewUserPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/new" element={<NewRolePage />} />
          <Route path="organizations" element={<OrganizationsPage />} />
          <Route path="organizations/new" element={<NewOrganizationPage />} />
          <Route path="statistics" element={<Bar />} />
        </Routes>
      </AppLayout>
    </>
  );
};
export default SuperAdminApp;
