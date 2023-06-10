import React from "react";
import { Box, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../shared/ui/components/Header";
import Button from "src/shared/ui/Button";
import { useNavigate } from "react-router-dom";
import useApi from "src/shared/agent";

const NewOrganizationPage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  let navigate = useNavigate();
  const { post } = useApi();
  const handleFormSubmit = (values) => {
    post("/organizations/create", { organization: values }).then((r) => {
      if (r?.status == 201) {
        navigate("/superadmin/organizations");
      }
    });
  };

  return (
    <Box m="20px">
      <Header
        title="CREATE ORGANIZATION"
        subtitle="Create a New Organization"
      />

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
                <Button label="Cancel" url="/superadmin/organizations" />
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});
const initialValues = {
  name: "",
};
export default NewOrganizationPage;
