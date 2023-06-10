import {
  Box,
  Typography,
  Button as MuiButton,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "src/shared/ui/components/Header";
import useApi from "src/shared/agent";
import { utilities } from "src/shared";
import Button from "src/shared/ui/Button";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { DataGrid, GridColumns, GridToolbar } from "@mui/x-data-grid";
import * as L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Link } from "react-router-dom";
import _ from "lodash";
import { tokens } from "src/shared/global/theme";
import { useSnackbar } from "notistack";

const ZoomToFeature = ({ coordinates }: any) => {
  const map = useMap();
  useEffect(() => {
    const featureJson = L.geoJson(coordinates);
    const bounds = featureJson.getBounds();
    const center = bounds.getCenter();

    map.flyTo([center.lat, center.lng], 14, {
      animate: true,
      duration: 2.5,
    });
  }, [coordinates, map]);
  return null;
};

const LocationPage = () => {
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
          to={`${params?.row?.id}`}
        >
          {params?.row?.name}
        </Typography>
      ),
    },
  ];

  const [location, setLocation] = useState<LocationType | null>(null);
  const { locationId } = useParams();
  const { get, del } = useApi();

  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let navigate = useNavigate();

  useEffect(() => {
    get(`/locations/${locationId}`)
      .then((res) => {
        setLocation(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const featureGroupRef = useRef(null);

  const onEachCountry = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const popup = L.popup();

        const reactElement = (
          <>
            <div className="disabled">
              <a href={`/locations/${feature?.properties?.id}`}>
                {feature?.properties?.name}
              </a>
            </div>
            <div className="d-flex">
              <i>Type: {feature?.properties?.type}</i>
            </div>
          </>
        );

        const output = document.createElement("div");
        const staticElement = renderToStaticMarkup(reactElement);
        output.innerHTML = staticElement;

        popup.setContent(output);

        layer
          .bindPopup(popup, {
            direction: "center",
            permanent: true,
            className: "labelstyle",
          })
          .openPopup();
      },
    });
  };

  const handleDelete = useCallback(() => {
    del(`/locations/${locationId}`).then((res: any) => {
      enqueueSnackbar(`${location?.name} is deleted.`, {
        variant: "info",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      navigate("/locations");
    });
  }, [location?.name, locationId]);

  return (
    <Box m="20px">
      <Header title="LOCATION" subtitle="View Location Page" />
      <Typography variant="h3" component="h2" marginBottom="15px">
        {location?.name} - {utilities.generateIdSlug(location?.id)}
      </Typography>

      <Box
        marginBottom="10px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="300px"
      >
        <div style={{ marginRight: "50px" }}>
          <Button label="Back" url="/locations" />
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
          onClick={() => {
            navigate(`/locations/edit/${locationId}`);
          }}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="h6" component="h2" marginBottom="15px">
        Type: {location?.type}
      </Typography>
      <Typography variant="h6" component="h2" marginBottom="15px">
        Address: {location?.address}
      </Typography>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              "& .Mui-selected": {
                color: "#88a6ff !important",
              },
            }}
          >
            {_.map(
              Object.keys(location?.forms ?? {}) || [],
              (locatioName, index) => {
                return <Tab label={locatioName} {...tabControls(index)} />;
              }
            )}
          </Tabs>
        </Box>
        {_.map(
          Object.keys(location?.forms ?? {}) || [],
          (locatioName, index) => {
            return (
              <TabPanel value={value} index={index}>
                <Box
                  height="50vh"
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
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                      color: `${colors.grey[100]} !important`,
                    },
                  }}
                >
                  <DataGrid
                    rows={location?.forms[locatioName]}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </TabPanel>
            );
          }
        )}
      </Box>

      <Box height="70%">
        <MapContainer
          center={[45.2595092, -104.5204334]}
          zoom={3}
          style={{ height: "65vh" }}
        >
          <FeatureGroup ref={featureGroupRef}>
            <GeoJSON
              key={location?.id}
              onEachFeature={onEachCountry}
              data={location?.location?.features ?? null}
            ></GeoJSON>

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!!location?.location?.features?.[0] && (
              <ZoomToFeature
                coordinates={location?.location?.features[0] ?? null}
              />
            )}
          </FeatureGroup>
        </MapContainer>
      </Box>
    </Box>
  );

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function tabControls(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
};

export default LocationPage;
