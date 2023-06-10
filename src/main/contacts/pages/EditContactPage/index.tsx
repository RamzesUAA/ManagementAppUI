// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  Paper,
  useTheme,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Header from "src/shared/ui/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Button from "src/shared/ui/Button";
import useApi from "src/shared/agent";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "src/shared/global/theme";
import _ from "lodash";

const EditWorkerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  position: Yup.string().required("Position is required"),
  responsibility: Yup.string().required("Responsibility is required"),
  description: Yup.string().required("Description is required"),
});

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const EditWorkerPage = () => {
  const { contactId } = useParams();
  let navigate = useNavigate();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<
    LocationType[] | []
  >([]);
  const [worker, setWorker] = useState<any | null>(null);

  const { post, get, put } = useApi();

  useEffect(() => {
    get(`/contacts/${contactId}`).then((res) => {
      setWorker(res.data?.data);
      setSelectedLocations(res.data?.data?.locations || []);
    });

    get("/locations").then((res) => {
      setLocation(res.data?.data);
    });
  }, []);

  const onSubmit = async (values: any, { resetForm }: any) => {
    const requestData = {
      worker: { ...values },
      locations: [...selectedLocations.map((location) => location.id)],
    };

    try {
      const response = await put(`/workers/${contactId}`, requestData);
      if (response.status === 200) {
        navigate(`/contacts/${contactId}`);
      }
    } catch (error) {}
  };

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const loading = open && options.length === 0;
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleAddSelectedLocation = () => {
    if (!!autocompleteValue) {
      setOpen(false);
      setOptions([]);
      setAutocompleteValue(null);
      setSelectedLocations([...selectedLocations, autocompleteValue]);
    }
  };

  const onDelete = (value) => {
    setSelectedLocations([
      ...selectedLocations.filter((item) => item.id !== value.id),
    ]);
  };

  if (!worker) return null;
  return (
    <Box m="20px">
      <Header title="EDIT WORKER" subtitle="Edit Worker Page" />
      <Formik
        initialValues={
          worker || {
            name: "",
            email: "",
            position: " ",
            responsibility: " ",
            description: " ",
            age: 0,
          }
        }
        validationSchema={EditWorkerSchema}
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
              <Button type="submit" label="Save" />
              <Button label="Cancel" url="/contacts" />
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
                // helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                // helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Position"
                name="position"
                type="text"
                value={values.position}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.position && Boolean(errors.position)}
                // helperText={touched.position && errors.position}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Responsibility"
                name="responsibility"
                type="text"
                value={values.responsibility}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.responsibility && Boolean(errors.responsibility)}
                // helperText={touched.responsibility && errors.responsibility}
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
                // helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Card sx={{ margin: "20px 0px 20px 0px", padding: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px",
                }}
              >
                <Button
                  styles={{ marginTop: "10px", marginRight: "20px" }}
                  onClick={handleAddSelectedLocation}
                >
                  Add location to worker
                </Button>

                <Autocomplete
                  key={selectedLocations.length}
                  id="asynchronous-demo"
                  sx={{ width: 300 }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onChange={(event: any, newValue: string | null) => {
                    setAutocompleteValue(newValue);
                  }}
                  styles={{ marginTop: "10px" }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  getOptionLabel={(option) => option.name}
                  options={options}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Locations"
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
              </Box>

              {!!selectedLocations.length && (
                <Box display="grid" gap="30px">
                  {_.map(selectedLocations, (f, index) => {
                    return (
                      <Paper elevation={6}>
                        <Typography
                          variant="h6"
                          color={colors.grey[300]}
                          sx={{ p: "10px" }}
                        >
                          <span
                            style={{
                              color: "white",
                              display: "inline-block",
                              padding: "10px",
                              minWidth: "140px",
                            }}
                          >
                            {f?.name}
                          </span>

                          <Button
                            styles={{
                              float: "right",
                              backgroundColor: colors.redAccent[500],
                            }}
                            onClick={() => onDelete(f)}
                          >
                            Delete
                          </Button>
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Card>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditWorkerPage;
