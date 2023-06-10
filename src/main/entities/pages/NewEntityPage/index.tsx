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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "src/shared/ui/Button";
import Header from "src/shared/ui/components/Header";
import _ from "lodash";
import { v4 as uuid } from "uuid";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tokens } from "src/shared/global/theme";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "src/shared/agent";
import usePagination from "@mui/material/usePagination/usePagination";
import { DATA_GRID_PROPS_DEFAULT_VALUES } from "@mui/x-data-grid";
import * as Yup from "yup";
import { VariantType, useSnackbar } from "notistack";

const CreateLocationSchema = Yup.object().shape({
  label: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  type: Yup.string(),
  test_url_form: Yup.string()
    .required("Url is required")
    .url("Invalid URL format"),
  positiveInteger: Yup.number()
    .integer()
    .min(0, "Value must be a positive integer"),
  integer: Yup.number().integer("Value must be an integer"),
  date: Yup.date().nullable(),
});

const NewEntityPage = () => {
  let navigate = useNavigate();
  let { entityId } = useParams();

  const { get, post } = useApi();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formType, setFormType] = useState<FormType | null>(null);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    get(`/form_types/${entityId}`).then((res: any) => {
      get("/locations").then((locationsRes) => {
        setLocations(locationsRes.data.data);
      });

      const names = _.map(
        res?.data?.data?.fields?.schema || [],
        (f) => f?.name
      );
      const object = names.reduce((obj: any, key: any) => {
        obj[key] = "";
        return obj;
      }, {});

      setFormType({
        id: "",
        name: "",
        label: "",
        fields: res?.data?.data?.fields,
        ...object,
      });
    });
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape(
      _.reduce(
        formType?.fields?.schema || [],
        (schema: any, field: any) => {
          switch (field.type) {
            case "input":
              schema[field.name] = Yup.string().required(
                `${field.label} is required`
              );
              break;
            case "integer":
              schema[field.name] = Yup.number()
                .integer()
                .required(`${field.label} is required`);
              break;
            case "drop-down":
              schema[field.name] = Yup.string().required(
                `${field.label} is required`
              );
              break;
            case "url":
              schema[field.name] = Yup.string()
                .url("Invalid URL format")
                .required(`${field.label} is required`);
              break;
            case "positive-integer":
              schema[field.name] = Yup.number()
                .integer()
                .min(0, `${field.label} must be a positive integer`)
                .required(`${field.label} is required`);
              break;
            case "date":
              schema[field.name] = Yup.date()
                .nullable()
                .required(`${field.label} is required`);
              break;
            default:
              break;
          }
          return schema;
        },
        { label: Yup.string().required("Name is required") }
      )
    );
  }, [formType]);

  const getFieldsWithIDs = (data: any) => {
    const schema = data.fields.schema;
    return _.map(schema, (field) => {
      const name = field.name;
      const schemaId = field.id;
      const value = data[name];
      return {
        id: uuid(),
        field_id: schemaId,
        value: value,
      };
    });
  };

  const handleFormSubmit = (values: any) => {
    const requestData = {
      id: uuid(),
      name: values?.label,
      form_type_id: entityId,
      locations: _.map(selectedLocations, (l) => l?.location?.id),
      data: { records: getFieldsWithIDs(values) },
    };

    post("/forms", { form: requestData }).then((res: any) => {
      enqueueSnackbar(`${requestData?.name} is successfully created.`, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });

      navigate("/entity/" + entityId);
    });
  };

  if (formType === null) return null;
  return (
    <Box m="20px">
      <Header title="New Entity" subtitle="Create New Entity Page" />
      <Formik
        initialValues={formType}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
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
                  <Button label="Cancel" url={`/entity/${entityId}`} />
                </Box>

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Form Name"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.label}
                  name="label"
                  error={props.touched.label && Boolean(props.errors.label)}
                  helperText={props.touched.label && props.errors.label}
                  sx={{ gridColumn: "span 2" }}
                />

                <Card sx={{ padding: "10px", margin: "20px 0px 20px 0px" }}>
                  {(props?.values?.fields?.schema ?? []).map((field, index) => {
                    return (
                      <FormFieldWithWrapper
                        key={field.id}
                        field={field}
                        {...props}
                      />
                    );
                  })}
                </Card>

                <Card sx={{ padding: "10px", margin: "20px 0px 20px 0px" }}>
                  <Typography variant="h6">
                    Select locations to link:
                  </Typography>
                  {_.map(
                    _.orderBy(selectedLocations, (l) => l?.order),
                    (s, index) => {
                      return (
                        <FormControl
                          fullWidth
                          sx={{ gridColumn: "span 2", marginY: "5px" }}
                        >
                          <Select
                            value={s?.location?.id}
                            onChange={(e) => {
                              const locationId = e?.target.value;
                              if (_(locationId).isEmpty()) {
                                const filteredLocations = _.filter(
                                  selectedLocations,
                                  (l) => l.id !== s?.id
                                );

                                const reorderedLocations = _.map(
                                  _.orderBy(filteredLocations, (l) => l.order),
                                  (f, index) => {
                                    return {
                                      ...f,
                                      order: index,
                                    };
                                  }
                                );

                                setSelectedLocations(reorderedLocations);
                                return;
                              }
                            }}
                          >
                            <MenuItem value=""> </MenuItem>
                            {_.map(
                              filterSelectedLocations(
                                locations,
                                selectedLocations,
                                s
                              ),
                              (option) => {
                                return (
                                  <MenuItem value={option?.id}>
                                    {option?.name}
                                  </MenuItem>
                                );
                              }
                            )}
                          </Select>
                        </FormControl>
                      );
                    }
                  )}
                  {locations.length !== selectedLocations.length && (
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2", marginY: "5px" }}
                    >
                      <Select
                        onChange={(e) => {
                          const location = _.find(
                            locations,
                            (l) => l.id == e.target.value
                          );
                          setSelectedLocations([
                            {
                              id: uuid(),
                              order: selectedLocations.length + 1,
                              location: location,
                            },
                            ...selectedLocations,
                          ]);
                        }}
                      >
                        <MenuItem value=""> </MenuItem>
                        {_.map(
                          filterLocations(locations, selectedLocations),
                          (option) => {
                            return (
                              <MenuItem value={option?.id}>
                                {option?.name}
                              </MenuItem>
                            );
                          }
                        )}
                      </Select>
                    </FormControl>
                  )}
                </Card>
              </Form>
            </Box>
          </>
        )}
      </Formik>
    </Box>
  );
};

const filterLocations = (locations: any, selectedLocations: any) => {
  return _.filter(locations, (l) => {
    return !_.find(selectedLocations, (sl) => _.isEqual(l, sl.location));
  });
};

const filterSelectedLocations = (
  locations: any,
  selectedLocations: any,
  currectLocation: any
) => {
  return _.filter(locations, (l) => {
    return !_.find(
      selectedLocations,
      (sl) => _.isEqual(l, sl.location) && sl.id !== currectLocation.id
    );
  });
};
const FormField = ({
  type,
  field,
  value,
  error,
  values,
  errors,
  touched,
  getFieldProps,
  handleBlur,
  handleChange,
  setFieldValue,
}: any) => {
  const fieldError = errors[field.name];
  const fieldTouched = touched[field.name];

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
          value={values[field.value]}
          name={field.name}
          error={fieldTouched && Boolean(fieldError)}
          helperText={fieldTouched && fieldError}
          sx={{ gridColumn: "span 2" }}
        />
      );
    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(value) => {
              setFieldValue(field.name, value);
            }}
            value={getFieldProps(field.name)?.value}
            renderInput={(params: any) => (
              <>
                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <TextField
                    {...params}
                    name={field.name}
                    fullWidth
                    variant="filled"
                    type="text"
                    sx={{ gridColumn: "span 2" }}
                    margin="normal"
                    error={fieldTouched && Boolean(fieldError)}
                    helperText={fieldTouched && fieldError}
                    label={field.label}
                  />
                </FormControl>
              </>
            )}
          />
        </LocalizationProvider>
      );
    case "drop-down":
      return (
        <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
          <InputLabel id="demo-simple-select-label">{field.label}</InputLabel>
          <Select
            value={values[field.name] || ""}
            label={field.label}
            name={field.name}
            onBlur={handleBlur}
            onChange={(value) => {
              setFieldValue(field.name, value?.target?.value);
            }}
            error={fieldTouched && Boolean(fieldError)}
            // helperText={fieldTouched && fieldError}
          >
            <MenuItem value=""> </MenuItem>
            {_.map(parseOptionsString(field?.options) || [], (option) => {
              return <MenuItem value={option}>{option}</MenuItem>;
            })}
          </Select>
        </FormControl>
      );
  }

  return null;
};

const parseOptionsString = (optionsString: string, separator: string = ";") => {
  optionsString = optionsString.replace(/;+$/, "");

  return _.map(optionsString.split(separator), (option) => {
    return option;
  });
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
