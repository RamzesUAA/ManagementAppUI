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

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tokens } from "src/shared/global/theme";
import useApi from "src/shared/agent";
import { useAppState } from "src/shared/global/appState";
import { useNavigate } from "react-router-dom";

const availableFormType = [
  "input",
  "integer",
  "drop-down",
  "url",
  "positive-integer",
  "date",
];

type FieldType = {
  id: string;
  type: string;
  label: string;
  name: string;
  options?: string;
};

type FormValuesType = {
  formTypeLabel: string;
  fields: FieldType[];
};
const initialValues = {
  formTypeLabel: "",
  fields: [],
};

const parseOptionsString = (optionsString: string, separator: string = ";") => {
  // trim any trailing semicolons
  optionsString = optionsString.replace(/;+$/, "");

  return _.map(optionsString.split(separator), (option) => {
    return option;
  });
};

const NewFormTypePage = () => {
  const { post } = useApi();
  const { setCustomFormTypes } = useAppState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // navigate to form-types page

  let navigate = useNavigate();

  const handleFormSubmit = (values: any) => {
    console.log("SUBMITTT");
    console.log(values);
    console.log("SUBMITTT");

    // const dropdownFields = _.filter(values.fields, { type: "drop-down" });
    // _.forEach(dropdownFields, (field) => {
    //   const options = parseOptionsString(field.options);
    //   field.options = options;
    // });

    // console.log("SUBMITTT");
    // console.log(values);
    // console.log("SUBMITTT");

    const formType = {
      label: values.formTypeLabel,
      fields: { schema: values.fields },
      name: values.formTypeLabel.replace(/\s/g, "_").toLowerCase(),
    };

    post("/form_types", { form_type: formType }).then((res) => {
      setCustomFormTypes((prev: any) => [...prev, res.data.data]);
      navigate("/form-types");
      // navigate to form-types page
    });
  };

  const handleAddNewItem = useCallback(
    (
      value: FieldType,
      prevValues: FieldType[],
      setFieldValue: (field: string, value: any) => void
    ) => {
      setFieldValue("fields", [...prevValues, { ...value, id: uuid() }]);
    },
    []
  );

  const handleDeleteItem = useCallback(
    (
      value: FieldType,
      prevValues: FieldType[],
      setFieldValue: (field: string, value: any) => void
    ) => {
      setFieldValue("fields", [
        ..._.filter(prevValues, (f) => f?.id !== value?.id),
      ]);
    },
    []
  );

  return (
    <Box m="20px">
      <Header title="New Entity Type" subtitle="Create New Location Page" />

      <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
        {({ handleSubmit, setFieldValue, ...props }) => (
          <>
            <Form
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                return handleSubmit(e);
              }}
            >
              <Box
                marginBottom="10px"
                display="flex"
                justifyContent="space-between"
                width="300px"
              >
                <Button type="submit" label="Create" />
                <Button label="Cancel" url="/form-types" />
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Form Name"
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.formTypeLabel}
                name="formTypeLabel"
                // error={!!touched.firstName && !!errors.firstName}
                helperText={
                  props.touched.formTypeLabel && props.errors.formTypeLabel
                }
                sx={{ gridColumn: "span 2" }}
              />
              {!!props.values?.fields?.length && (
                <Card sx={{ padding: "10px", margin: "20px 0px 20px 0px" }}>
                  <Box display="grid" gap="30px">
                    {_.map(props.values?.fields, (f, index) => {
                      return (
                        <FormFieldByType
                          key={index}
                          {...props}
                          values={f}
                          onDelete={(data: FieldType) =>
                            handleDeleteItem(
                              data,
                              props.values.fields,
                              setFieldValue
                            )
                          }
                        ></FormFieldByType>
                      );
                    })}
                  </Box>
                </Card>
              )}
            </Form>

            <BasicModal
              open={open}
              addField={(data: FieldType) =>
                handleAddNewItem(data, props.values.fields, setFieldValue)
              }
              handleClose={handleClose}
            ></BasicModal>
          </>
        )}
      </Formik>

      <Button styles={{ marginTop: "10px" }} onClick={handleOpen}>
        Add form field
      </Button>
    </Box>
  );
};

const FormFieldByType = ({ values, onDelete }: any) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Paper elevation={6}>
      <Typography variant="h6" color={colors.grey[300]} sx={{ p: "10px" }}>
        <span
          style={{
            borderRight: "1px solid rgb(210 202 202 / 50%)",
            color: "white",
            display: "inline-block",
            padding: "10px",
            minWidth: "120px",
          }}
        >
          Type: {values?.type}
        </span>
        <span
          style={{
            borderRight: "1px solid rgb(210 202 202 / 50%)",
            color: "white",
            display: "inline-block",
            padding: "10px",
            minWidth: "140px",
          }}
        >
          Label: {values?.label}
        </span>
        <span
          style={{
            borderRight: "1px solid rgb(210 202 202 / 50%)",
            color: "white",
            display: "inline-block",
            padding: "10px",
            minWidth: "140px",
          }}
        >
          Name: {values?.label.replace(/\s/g, "_").toLowerCase()}
        </span>

        {values?.options && (
          <span className="form-item">
            Options:
            {_.map(
              _.filter(_.split(values?.options, ";"), (el) => !_.isEmpty(el)),
              (o, index) => {
                return (
                  <span key={`${index}_${o}`} className="circle">
                    {o}
                  </span>
                );
              }
            )}
          </span>
        )}
        <Button
          styles={{ float: "right", backgroundColor: colors.redAccent[500] }}
          onClick={() => onDelete(values)}
        >
          Delete
        </Button>
      </Typography>
    </Paper>
  );
};

const getFormFieldByType = ({
  type,
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  setFieldValue,
}: any) => {
  switch (type) {
    case "input":
    case "integer":
    case "url":
    case "positive-integer":
      return (
        <TextField
          disabled
          fullWidth
          variant="filled"
          type="text"
          label="First Name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.entityName}
          name="entityName"
          // error={!!touched.firstName && !!errors.firstName}
          helperText={touched.entityName && errors.entityName}
          sx={{ gridColumn: "span 2" }}
        />
      );
    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled
            onChange={(value: any) => setFieldValue("date", value, true)}
            value={values.date}
            renderInput={(params: any) => (
              <TextField
                label="Date"
                margin="normal"
                name="date"
                variant="standard"
                fullWidth
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
            value={values.age}
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
};

export default NewFormTypePage;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BasicModal = ({ handleClose, open, addField }: any) => {
  const initialValue = {
    type: "",
    label: "",
    name: "",
    options: "",
  };

  const handleChange = (event: SelectChangeEvent) => {
    // setSelectedType(event.target.value as string);
  };

  const handleFormSubmit = (values: any) => {
    console.log("#############");
    console.log("#############");
    console.log(values);
    console.log("#############");
    addField({
      ...values,
      // make sure name is lowercase and replace spaces with underscore
      name: values.label.replace(/\s/g, "_").toLowerCase(),
    });
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik onSubmit={handleFormSubmit} initialValues={initialValue}>
          {({
            errors,
            values,
            handleBlur,
            handleChange,
            touched,
            handleSubmit,
          }) => (
            <Form
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                return handleSubmit(e);
              }}
            >
              <Box sx={style}>
                <Box marginBottom="10px">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    marginBottom="15px"
                  >
                    Select type of field to add
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Field type
                    </InputLabel>
                    <Select
                      name="type"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.type}
                      label="Field type"
                      onChange={handleChange}
                    >
                      {_.map(availableFormType, (ft) => (
                        <MenuItem value={ft}>{ft}</MenuItem>
                      ))}
                    </Select>

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Field Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      // value={values.label}
                      name="label"
                      // error={!!touched.firstName && !!errors.firstName}
                      helperText={touched.label && errors?.label}
                      sx={{
                        gridColumn: "span 2",
                        padding: "10px 0px 10px 0px",
                      }}
                    />
                  </FormControl>
                </Box>

                {values?.type === "drop-down" && (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    placeholder="Write options using ';' as delimeter"
                    // onChange={(event) => setOptions(event.target.value)}
                    onChange={handleChange}
                    value={values.options}
                    name="options"
                    sx={{ gridColumn: "span 2", paddingBottom: "15px" }}
                  />
                )}

                <Button type="submit">Add</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};
