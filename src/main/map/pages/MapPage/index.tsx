// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { Box, Button as MuiButton } from "@mui/material";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import * as L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "src/shared/ui/components/Header";
import _ from "lodash";
import useApi from "src/shared/agent";

const MapPage = () => {
  const [location, setLocation] = useState<LocationType | null>(null);

  const { get } = useApi();

  useEffect(() => {
    get("/locations").then((res) => {
      const features = _.chain(res.data.data)
        .map((location) => {
          return location.location.features ?? [];
        })
        .flatten()
        .value();

      setLocation({ type: "FeatureCollection", features: features });
    });
  }, []);

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
      <Header title="MAP" subtitle="Interactive Map Page" />
      {location && (
        <Box height="80%">
          <MapContainer
            center={[45.2595092, -104.5204334]}
            zoom={3}
            style={{ height: "75vh" }}
          >
            <FeatureGroup>
              <GeoJSON
                key={location?.id}
                onEachFeature={onEachCountry}
                data={location}
              ></GeoJSON>

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </FeatureGroup>
          </MapContainer>
        </Box>
      )}
    </Box>
  );
};

export default MapPage;
