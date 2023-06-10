// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Button as MuiButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Header from "src/shared/ui/components/Header";
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
import { EditControl } from "react-leaflet-draw";
import * as L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import Button from "src/shared/ui/Button";
import { useLeafletContext } from "@react-leaflet/core";
import Autocomplete from "@mui/material/Autocomplete";
import useApi from "src/shared/agent";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

const CreateLocationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  type: Yup.string(),
});

const EditLocationPage = () => {
  const geoJSONRef = useRef(null);
  const featureGroupRef = useRef(null);
  const navigate = useNavigate();
  const { locationId } = useParams();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>();
  const [isLocationSearch, setLocationSearch] = useState(false);
  const loading = open && options.length === 0;

  const [location, setLocation] = useState(null);

  const { put, get } = useApi();

  const handleRenderedGeoJsonDeletion = useCallback(
    (featureToDelete) => {
      setLocation((prevLocation) => {
        const data = prevLocation?.location?.features.filter(
          (item) =>
            JSON.stringify(item) !== JSON.stringify(featureToDelete?.feature)
        );

        const updatedLocation = {
          ...prevLocation,
          location: { ...prevLocation?.location, features: data },
        };

        return updatedLocation;
      });
    },
    [] // If `location` isn't changing outside of this function, this array could be empty
  );

  // Fetching the location data when component mounts
  useEffect(() => {
    (async () => {
      const response = await get(`/locations/${locationId}`);
      setLocation(response.data?.data);
      // assuming that the server responds with data in { data: { name, address, type, ... } } format
    })();
  }, [locationId]);

  const onSubmit = async (values: any) => {
    const requstData = {
      ...values,
      location: formatGeoJson(
        { name: values?.name, type: values?.type, id: locationId },
        featureGroupRef.current.toGeoJSON()
      ),
    };

    try {
      const response = await put(`/locations/${locationId}`, {
        location: requstData,
      });
      if (response.status === 200) {
        navigate(`/locations/${response.data?.data?.id}`);
      }
    } catch (error) {}
  };

  const formatGeoJson = (properties: any, geoJsonArray: any) => {
    const features = _.map(geoJsonArray?.features ?? [], (geoJson) => {
      geoJson.properties = properties;
      return geoJson;
    });
    return { ...geoJsonArray, features: features };
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  const debouncedSetAutocompleteValue = useRef(
    debounce((newValue) => {
      setAutocompleteValue(newValue);
    }, 1000)
  ).current;

  const handleAutocompleteChange = (event: any, newValue: string | null) => {
    debouncedSetAutocompleteValue.cancel();
    debouncedSetAutocompleteValue(newValue);
  };

  useEffect(() => {
    if (!autocompleteValue) return;
    var apiUrl =
      "https://api.opencagedata.com/geocode/v1/json?q=" +
      encodeURIComponent(autocompleteValue) +
      "&key=" +
      process.env.REACT_APP_OPEN_CAGE_API_KEY;

    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setAutocompleteOptions(data);
      });
  }, [autocompleteValue]);

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

  const [editableFG, setEditableFG] = useState(null);

  if (!location) return null;

  return (
    <Box m="20px">
      <Header title="EDIT LOCATION" subtitle="Edit Location Page" />
      <Formik
        key={location?.id}
        initialValues={location}
        validationSchema={CreateLocationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              marginBottom="10px"
              display="flex"
              justifyContent="space-between"
              width="300px"
            >
              <Button type="submit" label="Update" />
              <Button label="Cancel" url="/locations" />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                fullWidth
                variant="filled"
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Address"
                name="address"
                type="text"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Type"
                name="type"
                type="text"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.type && Boolean(errors.type)}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: "span 2" }}
              />

              <FormGroup>
                <Box
                  sx={{
                    // display: "flex",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        color="success"
                        checked={isLocationSearch}
                        onChange={(e) => {
                          return setLocationSearch(e?.target?.checked || false);
                        }}
                      />
                    }
                    label="Use Location Search"
                  />
                  {isLocationSearch && (
                    <Autocomplete
                      key={searchQuery}
                      id="asynchronous-demo"
                      sx={{ width: 300 }}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      onChange={(event: any, newValue: string | null) => {
                        handleAutocompleteChange(event, newValue);
                      }}
                      onClose={() => {
                        setOpen(false);
                      }}
                      isOptionSelected={(option, value) =>
                        option.label === value.label
                      }
                      getOptionLabel={(option) => {
                        return option.formatted;
                      }}
                      options={autocompleteOptions}
                      loading={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Asynchronous"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                </Box>
              </FormGroup>

              <Box height="80%">
                <MapContainer
                  center={[45.2595092, -104.5204334]}
                  zoom={3}
                  doubleClickZoom={false}
                  style={{ height: "60vh" }}
                >
                  <FeatureGroup ref={featureGroupRef}>
                    <EditTab deleteFeature={handleRenderedGeoJsonDeletion} />

                    <GeoJSON
                      key={location?.location?.features?.length}
                      onEachFeature={onEachCountry}
                      data={location?.location?.features ?? null}
                    ></GeoJSON>

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </FeatureGroup>

                  <MapZoomToLocation
                    lon={autocompleteValue?.geometry?.lng}
                    lat={autocompleteValue?.geometry?.lat}
                    zoomLevel={16}
                  />

                  {!!location?.location?.features?.[0] && (
                    <ZoomToFeature
                      coordinates={location?.location?.features[0] ?? null}
                    />
                  )}
                </MapContainer>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

const EditTab = ({ deleteFeature }) => {
  const map = useMap();
  const context = useLeafletContext();

  const onDelete = (e) => {
    const { layers } = e;
    const layer = layers?._layers;

    const a = layer[Object.keys(layer)];

    deleteFeature(a);

    map.removeLayer(a);
  };

  return (
    <EditControl
      position="topright"
      draw={{
        rectangle: false,
        circle: false,
        circlemarker: false,
      }}
      onDeleted={onDelete}
    />
  );
};

const MapZoomToLocation = ({ lon, lat, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (lon && lat) {
      map.setView([lat, lon], zoomLevel);
    }
  }, [map, lon, lat, zoomLevel]);

  return null;
};

const ZoomToFeature = ({ coordinates }: any) => {
  const map = useMap();
  useEffect(() => {
    const featureJson = L.geoJson(coordinates);
    const bounds = featureJson.getBounds();
    const center = bounds.getCenter();

    map.flyTo([center.lat, center.lng], 8, {
      animate: true,
      duration: 2.5,
    });
  }, [coordinates, map]);
  return null;
};

export default EditLocationPage;
