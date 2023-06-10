import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../global/theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PaymentOutlined from "@mui/icons-material/PaymentOutlined";
import LocationCityOutlined from "@mui/icons-material/LocationCityOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import HouseOutlined from "@mui/icons-material/HouseOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LabelOutlined from "@mui/icons-material/LabelOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import _ from "lodash";
import { useAppState } from "src/shared/global/appState";
import useApi from "src/shared/agent";

type ItemProps = {
  title: string;
  to: any;
  icon?: React.ReactNode;
  selected: any;
  setSelected: any;
};

type SidebarProps = {
  isSidebar: boolean;
};

const defaultMenuItems = [
  {
    title: "Maps",
    link: "maps",
    permission: "default",
    icon: <MapOutlinedIcon />,
  },
  {
    title: "Calendar",
    link: "calendar",
    permission: "view_calendar",
    icon: <CalendarTodayOutlinedIcon />,
  },
  {
    title: "Location",
    link: "locations",
    permission: "view_location",
    icon: <LocationCityOutlined />,
  },
  {
    title: "Contact",
    link: "contacts",
    permission: "view_contact",
    icon: <PeopleOutlinedIcon />,
  },
  // {
  //   title: "Payments",
  //   link: "payments",
  //   permission: "default",
  //   icon: <PaymentOutlined />,
  // },
];

const superAdminMenuItems = [
  {
    title: "Users",
    link: "users",
    icon: <PeopleOutlinedIcon />,
  },
  {
    title: "Roles",
    link: "roles",
    icon: <LockOutlined />,
  },
  {
    title: "Organizations",
    link: "organizations",
    icon: <HouseOutlined />,
  },
  // {
  //   title: "Statistics",
  //   link: "statistics",
  //   icon: <BarChartOutlinedIcon />,
  // },
];

const Item: React.FC<ItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const MenuItems = ({
  selected,
  setSelected,
  isCollapsed,
  colors,
  isSuperAdmin,
}: any) => {
  const { get } = useApi();

  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const { customFormTypes, setCustomFormTypes, currentUser } = useAppState();

  useEffect(() => {
    get("/form_types").then((res) => {
      setCustomFormTypes(res.data.data);
    });
  }, []);

  return (
    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
      {_.map(
        !!isSuperAdmin
          ? superAdminMenuItems
          : _.filter(
              defaultMenuItems,
              (v) =>
                !!_.find(currentUser?.permissions?.[0]?.permissions, (a) => {
                  return (
                    a?.permission_name == v?.permission ||
                    v?.permission === "default"
                  );
                })
            ) ?? [],
        (menuItem, index) => (
          <Item
            key={index}
            title={menuItem?.title}
            to={menuItem?.link}
            icon={menuItem?.icon}
            selected={selected}
            setSelected={setSelected}
          />
        )
      )}

      {!isSuperAdmin && (
        <>
          {!!_.find(
            currentUser?.permissions?.[0]?.permissions,
            (v) => v?.permission_name === "view_entity"
          ) && (
            <>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Custom Entities
              </Typography>
              {_.map(customFormTypes, (menuItem, index) => (
                <Item
                  key={index}
                  title={menuItem.label}
                  to={`/entity/${menuItem.id}`}
                  icon={<LabelOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </>
          )}

          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Settings
          </Typography>
          <Item
            title="Entity Types"
            to="form-types"
            icon={<SettingsOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
        </>
      )}
    </Box>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { pathname } = useLocation();
  const { currentUser } = useAppState();

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} className="side-bar">
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "4px 0 0 0" }}
                >
                  {currentUser?.user?.full_name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {currentUser?.permissions?.[0]?.role_name}
                </Typography>
              </Box>
            </Box>
          )}

          <MenuItems
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
            colors={colors}
            isSuperAdmin={pathname?.includes("superadmin")}
          ></MenuItems>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
