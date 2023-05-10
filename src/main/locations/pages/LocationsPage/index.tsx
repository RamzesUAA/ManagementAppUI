import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColumns, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "src/shared/global/theme";
import Header from "src/shared/ui/components/Header";
import { Link } from "react-router-dom";
import Button from "src/shared/ui/Button";
import useApi from "src/shared/agent";
import { utilities } from "src/shared";

const LocationsPage = () => {
  const columns: GridColumns<LocationType> | undefined = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      renderCell: (params) => (
        <div>{utilities.generateIdSlug(params?.row?.id)}</div>
      ),
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
      field: "type",
      headerName: "Type of location",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
  ];

  const { get } = useApi();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [locations, setLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    get("/locations").then((res) => {
      setLocations(res.data.data);
    });
  }, []);

  return (
    <Box m="20px">
      <Header title="LOCATIONS" subtitle="Locations Page" />
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
          rows={locations}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default LocationsPage;
