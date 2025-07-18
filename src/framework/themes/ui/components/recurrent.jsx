import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Tooltip, Chip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { showDialog } from "../PromptDialog.jsx";
import { TooltipGhost } from "./controls.jsx";

export function ImageLocal(props) {
  const { src, ...rest } = props;
  const base = process.env.PUBLIC_URL || "";
  const path = src.startsWith("/") ? src : `/${src}`;
  return <Box component="img" {...rest} alt="" src={`${base}${path}`} />;
}

export function InfoDialog({
  title = "Información",
  description = "Más información",
  dialogDescription,
  isButton = false,
  color = "contrastPaper",
  colorDisabled = "toSecondary75",
  className,
  icon = <InfoOutlinedIcon fontSize="inherit" />,
  disabled = false,
  variant = "contained",
  dialogProps = {},
  ...rest_props
}) {
  if (!dialogDescription) {
    dialogDescription = description;
  }

  function handleClick() {
    showDialog({
      title: title,
      description: dialogDescription,
      ...dialogProps,
    });
  }

  return (
    <TooltipGhost {...rest_props} title={description}>
      <div className="inline-block">
        {isButton ? (
          <div className={className}>
            <Button
              className={`
                  inline-flex justify-center align-center
                  text-hide-unhover-container
              `}
              variant={variant}
              color={[color, colorDisabled][+disabled]}
              onClick={handleClick}
              disabled={disabled}
              size="small"
            >
              {icon}
              <div className="text-hide-unhover">
                <span style={{ marginLeft: "5px" }}>
                  <small>Información</small>
                </span>
              </div>
            </Button>
          </div>
        ) : (
          <Typography
            color={[color, colorDisabled][+disabled]}
            className={`inline-block c-pointer ${className} ${
              ["", "pointer-not-allowed"][+disabled]
            }`}
            onClick={handleClick}
          >
            {icon}
          </Typography>
        )}
      </div>
    </TooltipGhost>
  );
}

export function TitleInfo({ title, information, variant = "h6", ...rest }) {
  return (
    <Typography variant={variant} {...rest}>
      {title}
      <InfoDialog
        placement="right"
        className="ml-20px"
        title={"Información de " + title}
        description={information}
      />
    </Typography>
  );
}
