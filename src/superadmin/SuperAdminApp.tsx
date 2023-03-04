import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "src/shared/ui/AppLayout";
import { CalendarPage } from "./calendar";
import { DashboardPage } from "./dashboard";
import { ProfilePage } from "./profile";
import { TeamPage } from "./team";

// 1. People
// 2. Organizations
// 3. Roles
const SuperAdminApp = () => {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="" element={<TeamPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="contacts" element={<TeamPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* <Route path="" element={<DashboardPage />} /> */}
          {/* <Route path="contacts" element={<ContactPage />} />
          <Route path="invoices" element={<InvoicePage />} />
          <Route path="bar" element={<Bar />} /> */}
        </Routes>
      </AppLayout>
    </>
  );
};
export default SuperAdminApp;

// import React, { useState } from "react";
// import { ColorModeContext, useMode } from "../global/theme";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import Topbar from "./global/Topbar";
// import { Routes, Route } from "react-router-dom";
// import { DashboardPage } from "./dashboard";
// import Sidebar from "./global/Sidebar";
// import { TeamPage } from "./team";
// import { ContactPage } from "./contacts";
// import { InvoicePage } from "./invoices";
// import { ProfilePage } from "./profile";
// // import { LinePage } from "./superadmin/line";
// // import { PiePage } from "./superadmin/pie";
// // import { FaqPage } from "./superadmin/faq";
// // import { GeographyPage } from "./superadmin/geography";
// import { CalendarPage } from "./calendar";

// import Bar from "./barchart";
// import Layout from "./Layout";

// const SuperAdminApp = ({ match }) => {
//   console.log(match);
//   const [theme, colorMode] = useMode();
//   const [isSidebar, setIsSidebar] = useState(true);

//   const menuItems = [
//     {
//       url: "team",
//       label: "Team",
//     },
//     {
//       url: "contacts",
//       label: "Contacts",
//     },
//     {
//       url: "/",
//       label: "Dashboard",
//     },
//   ];
//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <div className="app">
//           <Sidebar isSidebar={isSidebar} />
//           <main className="content">
//             <Topbar setIsSidebar={setIsSidebar} />
//             <Routes>
//               <Route path="" element={<DashboardPage />} />
//               <Route path="team" element={<TeamPage />} />
//               <Route path="contacts" element={<ContactPage />} />
//               <Route path="invoices" element={<InvoicePage />} />
//               <Route path="form" element={<ProfilePage />} />
//               <Route path="calendar" element={<CalendarPage />} />
//               <Route path="bar" element={<Bar />} />
//             </Routes>
//           </main>
//           {/* <Route path="pie" element={<Pie />} /> */}
//           {/* <Route path="line" element={<Line />} /> */}
//           {/* <Route path="faq" element={<FAQ />} /> */}
//           {/* <Route path="geography" element={<Geography />} /> */}
//         </div>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// };

// export default SuperAdminApp;
