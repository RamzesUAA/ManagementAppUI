import React, { useRef, useState } from "react";
import {
  Box,
  List,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../../global/theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation } from "react-router-dom";
import { useDropdownHandler } from "../hooks/useDropdownHandler";
import _ from "lodash";

type MenuType = {
  show: boolean | null;
  menuRef: any;
};

const userDropdownItems = [{ title: "Superadmin", url: "/superadmin" }];

const superAdminDropdownItems = [
  {
    title: "Back To App",
    url: "/",
  },
];

const Menu = ({ show, menuRef }: MenuType) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { pathname } = useLocation();
  const isSuperAdmin = pathname?.includes("superadmin");
  return (
    <Box
      ref={menuRef}
      sx={{
        width: "125px",
        backgroundColor: colors?.primary[400],
      }}
      width="100px"
      className="dropdown-menu"
      visibility={!!show ? "visible" : "hidden"}
    >
      <List>
        {_.map(
          isSuperAdmin ? superAdminDropdownItems : userDropdownItems,
          (menuItem, idx) => (
            <ListItem disablePadding key={idx}>
              <ListItem button component={Link} to={menuItem?.url}>
                <ListItemText primary={menuItem?.title} />
              </ListItem>
            </ListItem>
          )
        )}

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Menu;
