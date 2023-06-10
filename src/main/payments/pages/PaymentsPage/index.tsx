import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColumns, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "src/shared/global/theme";
import Header from "src/shared/ui/components/Header";
import { Link } from "react-router-dom";
import Button from "src/shared/ui/Button";
import useApi from "src/shared/agent";
import { utilities } from "src/shared";
import PaymentCard from "./CardControl";
import _ from "lodash";
import { useAppState } from "src/shared/global/appState";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function tabOption(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PaymentsPage = () => {
  const [value, setValue] = React.useState(0);
  const { currentUser } = useAppState();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns: GridColumns<LocationType> | undefined = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      renderCell: (params) => (
        <div>{utilities.generateIdSlug(params?.row?.id)}</div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={colors.greenAccent[500]}
          component={Link}
          to={`${params?.row?.id}`}
        >
          {params?.row?.name}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Type of location",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
  ];

  const { get } = useApi();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    get("/payments").then((res) => {
      setPayments(res.data.data);
    });
  }, []);

  return (
    <Box m="20px">
      <Header title="PAYMENTS" subtitle="Payments Page" />
      <Box>
        <Button label="New" url="new"></Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .Mui-selected": {
              color: "#88a6ff !important",
            },
          }}
        >
          <Tab label="Created Payments" {...tabOption(0)} />
          <Tab label="Assigned Payments" {...tabOption(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        {_.map(payments, (payment) => {
          return <PaymentCard payment={payment}></PaymentCard>;
        })}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {_.map(
          _.filter(
            payments,
            (p: any) => p?.assigned_user_id === currentUser?.user?.id
          ),
          (payment) => {
            return <PaymentCard payment={payment}></PaymentCard>;
          }
        )}
      </TabPanel>
    </Box>
  );
};

export default PaymentsPage;
