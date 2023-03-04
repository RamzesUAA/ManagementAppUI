import React, { useState } from "react";
import { ColorModeContext, useMode } from "src/shared/global/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import { ContactPage } from "src/superadmin/contacts";

// type AppLayoutProps = {
//   navigation: React.ReactNode;
//   header: any;
// };

type AppLayoutProps = {
  children: JSX.Element;
};

// const AppLayout: React.FC<AppLayoutProps> = ({ navigation, header }) => {
const AppLayout = ({ children }: AppLayoutProps) => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Header></Header>
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppLayout;
