import { Box } from "@mui/material";
import React from "react";
import Header from "../../../../shared/ui/components/Header";

const DashboardPage = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Dash"></Header>
      </Box>
    </Box>
  );
};

export default DashboardPage;
