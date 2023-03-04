import { Box } from "@mui/material";
import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Header from "src/shared/ui/components/Header";

const LocationPage = () => {
  const { locationId } = useParams();

  return (
    <Box m="20px">
      <Header title="LOCATION" subtitle="View Location Page" />
      <div>{locationId}</div>
      <div>MAP</div>
    </Box>
  );
};

export default LocationPage;
