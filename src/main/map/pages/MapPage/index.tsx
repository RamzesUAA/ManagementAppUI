// @ts-nocheck

import React from "react";
import { Box } from "@mui/material";
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
import Header from "src/shared/ui/components/Header";
import { geoData } from "../../../../data/geoJson";

const MapPage = () => {
  const onCreate = (e: any) => {
    // Here we will safe data
  };

  const onEachCountry = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const popup = L.popup();

        const reactElement = (
          <>
            <div className="disabled">
              <a href="calendar">{feature?.properties?.name}</a>
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
      <Header title="MAP" subtitle="Interactive Map Page" />

      <Box height="80%">
        <MapContainer
          center={[45.2595092, -104.5204334]}
          zoom={3}
          style={{ height: "75vh" }}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={onCreate}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>

          <GeoJSON
            onEachFeature={onEachCountry}
            data={geoData?.features}
          ></GeoJSON>

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapPage;
