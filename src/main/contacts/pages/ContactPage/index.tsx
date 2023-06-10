import { Typography } from "@mui/material";
import Button from "src/shared/ui/Button";
import React, { useState, useEffect, useCallback } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Header from "src/shared/ui/components/Header";
import useApi from "src/shared/agent";
import { utilities } from "src/shared";
import { DataGrid, GridColumns, GridToolbar } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  FeatureGroup,
  Circle,
  GeoJSON,
  useMap,
} from "react-leaflet";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button as MuiButton,
  Checkbox,
  FormControlLabel,
  TextField,
  useTheme,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import { EditControl } from "react-leaflet-draw";
import * as L from "leaflet";
import { tokens } from "src/shared/global/theme";
import { renderToStaticMarkup } from "react-dom/server";
import { Link } from "react-router-dom";
import _ from "lodash";
import { VariantType, useSnackbar } from "notistack";

const ZoomToFeature = ({ coordinates }: any) => {
  const map = useMap();
  useEffect(() => {
    const featureJson = L.geoJson(coordinates);
    map.fitBounds(featureJson.getBounds());
  }, [coordinates, map]);
  return null;
};

const ContactPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          to={`/locations/${params?.row?.id}`}
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

  const [worker, setWorker] = useState<_WorkerType | null>(null);
  const { contactId } = useParams();
  const { get, del } = useApi();
  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    get(`/workers/${contactId}`)
      .then((res) => {
        setWorker(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = useCallback(() => {
    del(`/workers/${contactId}`).then((res: any) => {
      enqueueSnackbar(`${worker?.name} is deleted.`, {
        variant: "info",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });

      navigate("/contacts");
    });
  }, [contactId, worker]);

  const handleEdit = useCallback(() => {
    navigate(`/contacts/edit/${contactId}`);
  }, [contactId]);

  return (
    <Box m="20px">
      <Header title="WORKER" subtitle="View Worker Page" />
      <Typography variant="h3" component="h2" marginBottom="15px">
        {worker?.name} - {utilities.generateIdSlug(worker?.id)}
      </Typography>

      <Box
        marginBottom="10px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="300px"
      >
        <div style={{ marginRight: "50px" }}>
          <Button label="Back" url="/contacts" />
        </div>

        <Button
          styles={{
            backgroundColor: colors.redAccent[500],
            marginRight: "10px",
          }}
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Button
          styles={{ backgroundColor: colors.blueAccent[500] }}
          onClick={handleEdit}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="h6" component="h2" marginBottom="15px">
        Position: {worker?.position}
      </Typography>

      <Typography variant="h6" component="h2" marginBottom="15px">
        Description: {worker?.description}
      </Typography>

      <Typography variant="h6" component="h2" marginBottom="15px">
        Responsibility : {worker?.responsibility}
      </Typography>

      <Box height="70%">
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Locations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              height="45vh"
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
                  backgroundColor: colors.blueAccent[800],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[800],
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
                disableColumnMenu
                rows={worker?.locations || []}
                columns={columns}
                // components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ContactPage;
