import { Box } from "@mui/material";
import React from "react";
import Button from "src/shared/ui/Button";
import Header from "src/shared/ui/components/Header";

const EntityTypesPage = () => {
  return (
    <Box m="20px">
      <Header title="Edit Entity Type" subtitle="The List Of Entities" />
      <Box>
        <Button label="New" url="new"></Button>
      </Box>
    </Box>
  );
};

export default EntityTypesPage;
