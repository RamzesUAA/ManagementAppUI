import {
  Box,
  FormControl,
  InputLabel,
  TextField,
  Modal,
  MenuItem,
  Typography,
  Card,
  Button as MuiButton,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Formik, Form, Field, useFormikContext } from "formik";
import React, { useCallback, useState } from "react";
import Button from "src/shared/ui/Button";
import Header from "src/shared/ui/components/Header";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { entityType } from "../../../../data/entities";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tokens } from "src/shared/global/theme";

type FieldType = {
  id: string;
  type: string;
  label: string;
  name: string;
  options?: string;
};

const NewEntityPage = () => {
  const handleFormSubmit = (values: any) => {
    console.log("SUBMITTT");
    console.log(values);
    console.log("SUBMITTT");
  };

  return (
    <Box m="20px">
      <Header title="New Entity" subtitle="Create New Location Page" />

      <Formik onSubmit={handleFormSubmit} initialValues={entityType}>
        {(props) => (
          <>
            <Box display="grid" gap="30px">
              <Form
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  return props.handleSubmit(e);
                }}
              >
                <Box
                  marginBottom="10px"
                  display="flex"
                  justifyContent="space-between"
                  width="300px"
                >
                  <Button type="submit" label="Create" />
                  <Button label="Cancel" url="/entity" />
                </Box>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Form Name"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.entityTypeLabel}
                  name="entityTypeLabel"
                  // error={!!touched.firstName && !!errors.firstName}
                  helperText={
                    props.touched.entityTypeLabel &&
                    props.errors.entityTypeLabel
                  }
                  sx={{ gridColumn: "span 2" }}
                />
                <Card sx={{ padding: "10px", margin: "20px 0px 20px 0px" }}>
                  {(props.values?.fields ?? []).map((field, index) => (
                    <FormFieldWithWrapper
                      key={field.id}
                      field={field}
                      {...props}
                    />
                  ))}
                </Card>
              </Form>
            </Box>
          </>
        )}
      </Formik>
    </Box>
  );
};

const FormField = ({
  type,
  field,
  value,
  errors,
  touched,
  handleBlur,
  handleChange,
  setFieldValue,
}: any) => {
  switch (field.type) {
    case "input":
    case "integer":
    case "url":
    case "positive-integer":
      return (
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label={field.label}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          name={field.name}
          sx={{ gridColumn: "span 2" }}
        />
      );
    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(value: any) => setFieldValue("date", value, true)}
            value={field.value} // Pass field.value instead of value
            renderInput={(params: any) => (
              <TextField
                label="Date"
                margin="normal"
                name="date"
                variant="standard"
                fullWidth
                value={field.value} // Pass field.value instead of value
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      );
    case "drop-down":
      return (
        <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={field.age}
            label="Age"
            name="age"
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      );
  }

  return null;
};

const withWrapperFormField = (Component: React.FC) => (props: any) => {
  return (
    <Box marginY="15px">
      <Component {...props} />
    </Box>
  );
};

const FormFieldWithWrapper = withWrapperFormField(FormField);
export default NewEntityPage;
