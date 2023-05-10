import { Box, Typography, Button as MuiButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Header from "src/shared/ui/components/Header";
import useApi from "src/shared/agent";
import { utilities } from "src/shared";
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
import { Link } from "react-router-dom";
import _ from "lodash";

const ZoomToFeature = ({ coordinates }: any) => {
  const map = useMap();
  useEffect(() => {
    const featureJson = L.geoJson(coordinates);
    map.fitBounds(featureJson.getBounds());
  }, [coordinates, map]);
  return null;
};

const LocationPage = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const { locationId } = useParams();
  const { get } = useApi();

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

  return (
    <Box m="20px">
      <Header title="LOCATION" subtitle="View Location Page" />
      <Typography variant="h3" component="h2" marginBottom="15px">
        {location?.name} - {utilities.generateIdSlug(location?.id)}
      </Typography>
      <Typography variant="h6" component="h2" marginBottom="15px">
        Type: {location?.type}
      </Typography>
      <Typography variant="h6" component="h2" marginBottom="15px">
        Address: {location?.address}
      </Typography>

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
};

export default LocationPage;
