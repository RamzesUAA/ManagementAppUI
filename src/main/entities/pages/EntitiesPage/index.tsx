import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColumns, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "src/shared/global/theme";
import Header from "src/shared/ui/components/Header";
import { Link, useParams } from "react-router-dom";
import Button from "src/shared/ui/Button";
import useApi from "src/shared/agent";

const EntitiesPage = () => {
  const columns: GridColumns<FormType> | undefined = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={colors.greenAccent[500]}
          component={Link}
          to={`/entity/form/${params?.row?.id}`}
        >
          {params?.row?.name}
        </Typography>
      ),
    },
  ];

  const { get } = useApi();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let { entityId } = useParams();

  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    get(`/forms?form_type_id=${entityId}`).then((r) => {
      setForms(r?.data?.data || []);
    });
  }, [entityId]);

  return (
    <Box m="20px">
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
          rows={forms}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default EntitiesPage;
