import { Box, Typography, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";

import { DataGrid, GridColumns, GridToolbar } from "@mui/x-data-grid";

import { tokens } from "src/shared/global/theme";
import Button from "src/shared/ui/Button";
import Header from "src/shared/ui/components/Header";
import useApi from "src/shared/agent";
import { Link } from "react-router-dom";

const ContactsPage = () => {
  const columns: GridColumns<_WorkerType> | undefined = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      renderCell: (params) => <div>{params?.row?.id}</div>,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={colors.greenAccent[500]}
          component={Link}
          to={`${params?.row?.id}`}
        >
          {params?.row?.name}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
    },
  ];

  const { get } = useApi();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [workers, setWorkers] = useState<_WorkerType[]>([]);

  useEffect(() => {
    get("/workers").then((res) => {
      setWorkers(res?.data?.data ?? []);
    });
  }, []);

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />

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
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={workers}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default ContactsPage;
