import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../shared/ui/components/Header";
import Button from "src/shared/ui/Button";
import useApi from "src/shared/agent";
import {
  Box,
  FormControl,
  InputLabel,
  TextField,
  Modal,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Button as MuiButton,
  Paper,
  useTheme,
  Divider,
  Select,
} from "@mui/material";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const NewUserPage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { get, post } = useApi();
  let navigate = useNavigate();

  const [organizations, setOrganizations] = useState();
  const [selectedOrganization, setSelectedOrganization] = useState();

  useEffect(() => {
    get("/organizations_roles").then((r) => {
      setOrganizations(r?.data?.data ?? []);
    });
  }, []);

  const handleFormSubmit = (values) => {
    const requestData = {
      account: {
        hash_password: values.password,
        email: values.email,
        full_name: values.fullName,
        role_id: values.roleId,
        organization_id: values.organizationId,
      },
    };

    post("accounts/create", requestData).then((r) => {
      if (r?.status == 200) {
        navigate("/superadmin/users");
      }
    });
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

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
              <Box
                marginBottom="10px"
                display="flex"
                justifyContent="space-between"
                width="300px"
              >
                <Button type="submit" label="Create" />
                <Button label="Cancel" url="/superadmin/users" />
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Organization
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="organizationId"
                  name="organizationId"
                  value={values?.organizationId ?? undefined}
                  label="Organozation"
                  error={!!touched.organizationId && !!errors.organizationId}
                  helperText={touched.organizationId && errors.organizationId}
                  onChange={handleChange}
                >
                  {_.map(organizations, (o) => {
                    return <MenuItem value={o.id}>{o.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="roleId"
                  name="roleId"
                  value={values?.roleId ?? undefined}
                  label="Role"
                  error={!!touched.roleId && !!errors.roleId}
                  helperText={touched.roleId && errors.roleId}
                  onChange={handleChange}
                >
                  {_.map(
                    organizations?.find((s) => s.id === values.organizationId)
                      ?.roles ?? [],
                    (o) => {
                      return (
                        <MenuItem key={o.id} value={o.id}>
                          {o.name}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  organizationId: yup.string().required("Organization is required"),
  roleId: yup.string().required("Role is required"),
});
const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  organizationId: "",
  roleId: "",
};
export default NewUserPage;
