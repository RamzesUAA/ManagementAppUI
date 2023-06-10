// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button as MuiButton,
  useTheme,
  Chip,
  Checkbox,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Header from "src/shared/ui/components/Header";
import { tokens } from "src/shared/global/theme";
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
import { useNavigate } from "react-router-dom";
import Button from "src/shared/ui/Button";
import { useLeafletContext } from "@react-leaflet/core";
import Autocomplete from "@mui/material/Autocomplete";
import useApi from "src/shared/agent";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import { VariantType, useSnackbar } from "notistack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const CreateWorkerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  ammount: Yup.number().test("is-decimal", "invalid decimal", (value) =>
    (value + "").match(/^\d*\.{1}\d*$/)
  ),
  assigned_user_id: Yup.string().required("Email of assigned user is required"),
  description: Yup.string().required("Description is required"),
});

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const NewPaymentPage = () => {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const { post, get } = useApi();

  useEffect(() => {
    get("/users").then((res) => {
      setUsers(res.data?.data);
    });
  }, []);

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      const response = await post("/payments", {
        payment: values,
      });
      if (response.status === 201) {
        resetForm();
        navigate(`/payments`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const loading = open && options.length === 0;
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="NEW Payment" subtitle="Create New Payment Page" />

      <Formik
        initialValues={{
          name: "",
          description: " ",
          priority: 1,
          assigned_user_id: "",
          ammount: 0,
        }}
        validationSchema={CreateWorkerSchema}
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
              <Button label="Cancel" url="/payments" />
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
                label="Amount in USD (*gross)"
                name="ammount"
                type="text"
                value={values.ammount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ammount && Boolean(errors.ammount)}
                helperText={touched.ammount && errors.ammount}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                type="text"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth>
                <InputLabel id="assigned-user-label">Assigned User</InputLabel>
                <Select
                  id="assigned-user"
                  name="assigned_user_id"
                  labelId="assigned-user-label"
                  value={values.assigned_user_id}
                  label="Assigned User"
                  onChange={handleChange}
                >
                  <MenuItem value=""></MenuItem>
                  {_.map(users ?? [], (u) => {
                    return <MenuItem value={u?.id}>{u?.full_name}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                <Select
                  id="demo-simple-select"
                  name="priority"
                  labelId="demo-simple-select-label"
                  value={values.priority}
                  label="Priority"
                  onChange={handleChange}
                >
                  <MenuItem value={1}>
                    <Chip
                      label="Low"
                      color="success"
                      style={{ minWidth: "70px" }}
                    />
                  </MenuItem>
                  <MenuItem value={2}>
                    <Chip
                      label="Medium"
                      color="warning"
                      style={{ minWidth: "70px" }}
                    />
                  </MenuItem>
                  <MenuItem value={3}>
                    <Chip
                      label="High"
                      color="error"
                      style={{ minWidth: "70px" }}
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewPaymentPage;
