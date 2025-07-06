import React from "react";
import { Box } from "@mui/material";
import { DialogSimple } from "./dialog";
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
  description,
  ...rest_props
}) {
  return (
    <TooltipGhost {...rest_props} title={description}>
      <Typography
        color="secondary"
        className="d-inline-block c-pointer"
        onClick={() => showDialog({ title: title, description: description })}
      >
        <InfoOutlinedIcon fontSize="inherit" />
      </Typography>
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
