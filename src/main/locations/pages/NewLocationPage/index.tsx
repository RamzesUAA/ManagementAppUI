// @ts-nocheck

import React, { useEffect, useRef } from "react";
import { Box, TextField, Button as MuiButton } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import Button from "src/shared/ui/Button";
import { useLeafletContext } from "@react-leaflet/core";
import useApi from "src/shared/agent";
import { v4 as uuidv4 } from "uuid";

const CreateLocationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  type: Yup.string(),
});

const NewLocationPage = () => {
  const geoJSONRef = useRef(null);
  const featureGroupRef = useRef(null);
  let navigate = useNavigate();

  const { post } = useApi();

  const onSubmit = async (values: any, { resetForm }: any) => {
    const id = uuidv4();
    const requstData = {
      ...values,
      id,
      location: formatGeoJson(
        { name: values?.name, type: values?.type, id: id },
        featureGroupRef.current.toGeoJSON()
      ),
    };

    try {
      const response = await post("/locations", { location: requstData });
      if (response.status === 201) {
        resetForm();
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

  return (
    <Box m="20px">
      <Header title="NEW LOCATION" subtitle="Create New Location Page" />
      <Formik
        initialValues={{ name: "", address: "", type: " " }}
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
              <Button type="submit" label="Create" />
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

              <Box height="80%">
                <MapContainer
                  center={[45.2595092, -104.5204334]}
                  zoom={3}
                  style={{ height: "60vh" }}
                >
                  <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                      position="topright"
                      draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                      }}
                    />

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </FeatureGroup>
                </MapContainer>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewLocationPage;
