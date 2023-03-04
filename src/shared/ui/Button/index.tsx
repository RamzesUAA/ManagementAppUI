// @ts-ignore
import React, { FC } from "react";
import { Button as MuiButton } from "@mui/material";
import { tokens } from "src/shared/global/theme";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  block?: boolean;
  buttonStyle?: ButtonStyle;
  disabled?: boolean;
  extraCss?: string;
  inactive?: boolean;
  label?: string;
  styles?: object;
  loading?: boolean;
  size?: "default" | "small" | "big";
  url?: string;
};

export type SimpleButton = Exclude<ButtonProps, "url">;

const LinkButton: FC<ButtonProps> = ({
  label,
  url,
  className,
  disabled,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MuiButton
      variant="contained"
      component={Link}
      to={url!}
      sx={{
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        minWidth: "150px",
        "&:hover": {
          color: colors.primary[700],
          backgroundColor: colors.primary[100],
        },
      }}
      // {...rest}
    >
      {label}
      {/* {children} */}
    </MuiButton>
  );
};

const SimpleButton: FC<ButtonProps> = ({
  label,
  url,
  className,
  onClick,
  type,
  styles,
  disabled,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MuiButton
      type={type}
      onClick={onClick}
      variant="contained"
      style={styles}
      className={className}
      sx={{
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        minWidth: "120px",
        "&:hover": {
          color: colors.primary[700],
          backgroundColor: colors.primary[100],
        },
      }}
    >
      {label}
      {children}
    </MuiButton>
  );
};

const Button: LFC<ButtonProps> = ({
  block,
  buttonStyle,
  disabled,
  extraCss,
  inactive,
  label,
  loading,
  className,
  onClick,
  size,
  url,
  children,
  styles,
  type,
  ...rest
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (url) {
    return (
      <LinkButton
        label={label}
        url={url}
        className={className}
        onClick={onClick}
        disabled={disabled}
        children={children}
        {...rest}
      ></LinkButton>
    );
  }

  return (
    <SimpleButton
      label={label}
      onClick={onClick}
      className={className}
      disabled={disabled}
      children={children}
      type={type}
      styles={styles}
      {...rest}
    ></SimpleButton>
  );
};
export default Button;
