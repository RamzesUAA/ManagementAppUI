import react, { useState, useEffect, useCallback } from "react";
import _ from "lodash";

import React from "react";
import Button from "src/shared/ui/Button";
import Header from "src/shared/ui/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "src/shared/agent";
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
import FormFieldByType from "../../components/FormFieldByType";
import { tokens } from "src/shared/global/theme";
import { useAppState } from "src/shared/global/appState";
import { VariantType, useSnackbar } from "notistack";

const FormTypePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let navigate = useNavigate();

  const { get, del } = useApi();
  const { formTypeId } = useParams();
  const { setCustomFormTypes } = useAppState();

  const [formType, setFormType] = useState<FormType | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    get(`/form_types/${formTypeId}`)
      .then((res) => {
        setFormType(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = useCallback(() => {
    del(`/form_types/${formTypeId}`).then((res: any) => {
      setCustomFormTypes((prev) => {
        return _.filter(prev, (f) => f.id !== formTypeId);
      });

      enqueueSnackbar(`${formType?.label} is deleted.`, {
        variant: "info",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });

      navigate("/form-types");
    });
  }, [formTypeId, formType]);

  return (
    <Box m="20px">
      <Header title="FORM TYPE" subtitle="Form Type Page" />
      <Box>
        <Typography variant="h3" component="h2" marginBottom="15px">
          {formType?.label}
        </Typography>
        <Box
          marginBottom="10px"
          display="flex"
          justifyContent="space-between"
          width="300px"
        >
          <Button label="Back" url="/form-types" />
          <Button
            styles={{ float: "right", backgroundColor: colors.redAccent[500] }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
        <Card sx={{ padding: "10px", margin: "20px 0px 20px 0px" }}>
          <Box display="grid" gap="30px">
            {_.map(formType?.fields?.schema, (f, index) => {
              return (
                <FormFieldByType
                  key={index}
                  {...formType}
                  values={f}
                ></FormFieldByType>
              );
            })}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default FormTypePage;
