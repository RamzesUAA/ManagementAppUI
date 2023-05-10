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
          Name: {values?.label}
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
        {onDelete && (
          <Button
            styles={{ float: "right", backgroundColor: colors.redAccent[500] }}
            onClick={() => onDelete(values)}
          >
            Delete
          </Button>
        )}
      </Typography>
    </Paper>
  );
};

export default FormFieldByType;
