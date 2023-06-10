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
import { tokens } from "src/shared/global/theme";
import { useAppState } from "src/shared/global/appState";
import { VariantType, useSnackbar } from "notistack";
import moment from "moment";

const EntityPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { formId } = useParams();
  const { get, del } = useApi();
  const navigate = useNavigate();

  const [form, setForm] = useState<EntityWithType | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    get(`/forms/${formId}`)
      .then((res) => {
        const entityId = res?.data?.data?.form_type_id; // Assuming the entityId is available in the response data
        if (entityId) {
          get(`/form_types/${entityId}`)
            .then((formTypesResponse: any) => {
              const combinedRecords = combineSchemaWithRecords(
                formTypesResponse?.data?.data,
                res?.data?.data
              );

              setForm(combinedRecords);
              // Handle the response of the second API call
            })
            .catch((e: any) => {
              console.error(e);
            });
        }
      })
      .catch((e: any) => {
        console.error(e);
      });
  }, [formId]);

  const handleDelete = useCallback(() => {
    del(`/forms/${formId}`).then((res: any) => {
      console.log(res);

      enqueueSnackbar(`${form?.name} is deleted.`, {
        variant: "info",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });

      navigate(`/entity/${form?.form_type_id}`);
    });
  }, [formId, form]);

  if (form === null) return null;

  const maxLength = Math.max(
    ...(form?.data?.records || []).map((record) => record.label.length)
  );
  const labelWidth = maxLength * 7; // Adjust the multiplier as needed

  return (
    <Box m="20px">
      <Header title="ENTITY" subtitle="Entity Page" />
      <Box>
        <Typography variant="h3" component="h2" marginBottom="15px">
          {form?.name}
        </Typography>
        <Box
          marginBottom="10px"
          display="flex"
          justifyContent="space-between"
          width="300px"
        >
          <Button label="Back" url={`/entity/${form?.form_type_id}`} />
          <Button
            styles={{ float: "right", backgroundColor: colors.redAccent[500] }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
        <Card sx={{ padding: "10px", margin: "20px 0px 20px 0px" }}>
          <Box display="grid" gap="30px">
            {_.map(form?.data?.records || [], (f, index) => {
              return (
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{
                    borderBottom: "1px solid rgb(210 202 202 / 50%)",
                    color: "white",
                    display: "inline-block",
                    minWidth: `${labelWidth}px`,
                  }}
                  key={index}
                >
                  <span
                    style={{
                      width: `${labelWidth}px`,
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {f?.label}:{" "}
                  </span>{" "}
                  <span
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {getValue(f)}
                  </span>
                </Typography>
              );
            })}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

const getValue = ({ value, type }: any) => {
  if (type === "date") return moment(value).format("MMM D YYYY");

  return value;
};

function combineSchemaWithRecords(jsonA: any, jsonB: any) {
  const schemaFields = _.get(jsonA, "fields.schema", []);
  const records = _.get(jsonB, "data.records", []);

  const fieldLabelMap = _.keyBy(schemaFields, "id");

  const updatedRecords = _.map(records, (record: any) => {
    const fieldId = _.get(record, "field_id");
    const schemaField = _.get(fieldLabelMap, fieldId);
    const updatedRecord = _.assign({}, record, schemaField);
    delete updatedRecord["id"]; // Remove the redundant "id" field
    return updatedRecord;
  });

  const output = {
    data: {
      records: updatedRecords,
    },
    form_type_id: _.get(jsonB, "form_type_id"),
    id: _.get(jsonB, "id"),
    name: _.get(jsonB, "name"),
  };

  return output;
}
export default EntityPage;
