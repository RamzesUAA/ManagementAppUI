import React from "react";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../shared/ui/components/Header";
import { tokens } from "src/shared/global/theme";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import _ from "lodash";

const permission = [
  {
    resource: "location",
    permissions: [
      { name: "view_location", label: "View Location" },
      { name: "create_location", label: "Create Location" },
      { name: "delete_location", label: "Delete Location" },
    ],
  },
  {
    resource: "calendar",
    permissions: [
      { name: "view_calendar", label: "View Calendar" },
      { name: "create_calendar", label: "Create Calendar Event" },
    ],
  },
  {
    resource: "contacts",
    permissions: [
      { name: "view_contacts", label: "View Contacts" },
      { name: "create_contacts", label: "Create Contacts" },
    ],
  },
  {
    resource: "form",
    permissions: [
      { name: "view_form", label: "View Forms" },
      { name: "create_form", label: "Create Form" },
      { name: "delete_form", label: "Delete Form" },
    ],
  },
  {
    resource: "entities",
    permissions: [
      { name: "view_entity", label: "View Entity" },
      { name: "create_entity", label: "Create Entity" },
      { name: "delete_entity", label: "Delete Entity" },
    ],
  },
];

const permissionCreator = ({ action, resource }) => {
  return `can_${action}_${resource}`;
};

const RolePage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log("############");
    console.log(values);
    console.log("############");
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="CREATE ROLE" subtitle="Create a New Role" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.roleName}
                name="roleName"
                error={!!touched.roleName && !!errors.roleName}
                helperText={touched.roleName && errors.roleName}
                sx={{ gridColumn: "span 4" }}
              />
              {_.map(values.permissions, (p) => (
                <PermissionSection
                  key={p.resource}
                  setFieldValue={setFieldValue}
                  selectedPermissions={values.selectedPermissions}
                  {...p}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Role
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const PermissionSection = ({
  resource,
  permissions,
  setFieldValue,
  selectedPermissions,
}) => {
  const capitalizedResource =
    resource.charAt(0).toUpperCase() + resource.slice(1);

  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{capitalizedResource}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {_.map(permissions, (p) => (
            <div key={p.name}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={p.name}
                    value={p.name}
                    color="success"
                    onChange={(e) => {
                      const currentValue = e.target.value;
                      console.log(e.target.value);
                      console.log(e);
                      if (_.includes(selectedPermissions, currentValue)) {
                        return setFieldValue("selectedPermissions", [
                          ..._.filter(
                            selectedPermissions,
                            (p) => p != currentValue
                          ),
                        ]);
                      }

                      return setFieldValue("selectedPermissions", [
                        ...selectedPermissions,
                        currentValue,
                      ]);
                    }}
                  />
                }
                label={p.label}
              />
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const checkoutSchema = yup.object().shape({
  roleName: yup.string().required("required"),
});
const initialValues = {
  roleName: "",
  permissions: permission,
  selectedPermissions: [],
};
export default RolePage;
