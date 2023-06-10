import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../shared/global/theme";
import { mockDataTeam } from "../../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../../../shared/ui/components/Header";
import useApi from "src/shared/agent";
import { useEffect, useState } from "react";
import Button from "src/shared/ui/Button";

const RolesPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Role Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
  ];

  const [roles, setRoles] = useState([]);

  const { get } = useApi();

  useEffect(() => {
    get("/roles").then((r) => setRoles(r?.data?.data ?? []));
  }, []);

  return (
    <Box m="20px">
      <Header title="Roles" subtitle="View Roles Page" />
      <Box>
        <Button label="New" url="new"></Button>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.redAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.redAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={roles} columns={columns} />
      </Box>
    </Box>
  );
};

export default RolesPage;
