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
import { Link } from "react-router-dom";
import { useDropdownHandler } from "../hooks/useDropdownHandler";
import Menu from "./Menu";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const menuRef = useRef(null);
  const { isMenuVisible, setIsMenuVisible } = useDropdownHandler({ menuRef });

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        borderRadius="3px"
        sx={{ backgroundColor: colors?.primary[400] }}
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton onClick={() => setIsMenuVisible(!isMenuVisible)}>
          <PersonOutlinedIcon />
        </IconButton>

        <Menu menuRef={menuRef} show={isMenuVisible} />
      </Box>
    </Box>
  );
};

export default Topbar;
