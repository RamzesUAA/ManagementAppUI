import { useParams, useNavigate } from "react-router-dom";
import { ColorModeContext, tokens, useMode } from "../global/theme";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import useApi from "../agent";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  hash_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  let navigate = useNavigate();

  const { locationId } = useParams();
  const [theme, colorMode] = useMode();
  const [loginError, setLoginError] = useState("");

  const { post, setToken } = useApi();

  const formik = useFormik({
    initialValues: {
      email: "",
      hash_password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await post("/accounts/sign_in", values);
        if (response.status === 200) {
          localStorage.setItem("management_token", response.data.token);

          setToken(response.data.token);
          return navigate("/");
        }
      } catch (error) {
        setLoginError(error.message);
      }
    },
  });

  const colors = tokens(theme.palette.mode);

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container
            component="main"
            maxWidth="md"
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: colors.primary[400],
                padding: "20px",
                borderRadius: "2px",
              }}
            >
              <Box>
                <Typography component="h1" variant="h5">
                  Log in
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="hash_password"
                    label="Password"
                    type="hash_password"
                    id="hash_password"
                    autoComplete="current-hash_password"
                    value={formik.values.hash_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.hash_password &&
                      Boolean(formik.errors.hash_password)
                    }
                    helperText={
                      formik.touched.hash_password &&
                      formik.errors.hash_password
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="rememberMe"
                        color="success"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    }
                    label="Remember me"
                    color="success"
                  />
                  <Typography variant="body2" color="error">
                    {loginError}
                  </Typography>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Log In
                  </Button>
                  <Grid
                    container
                    sx={{ color: "white", marginTop: theme.spacing(2) }}
                  >
                    <Grid item xs>
                      <Link href="#" variant="body2" sx={{ color: "white" }}>
                        Forgot hash_password?
                      </Link>
                    </Grid>
                    {/* <Grid item>
                      <Typography variant="body2">
                        {"Don't have an account? "}
                        <Link href="#" color="textPrimary">
                          Sign Up
                        </Link>
                      </Typography>
                    </Grid> */}
                  </Grid>
                </form>
              </Box>
            </Box>

            <Box mt={8}>
              <Typography variant="body2" color="textSecondary" align="center">
                {"Powered by "}
                <Link color="inherit" href="https://reactjs.org/">
                  React
                </Link>
                {" and "}
                <Link color="inherit" href="https://material-ui.com/">
                  Material UI
                </Link>
              </Typography>
            </Box>
          </Container>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default LoginPage;
