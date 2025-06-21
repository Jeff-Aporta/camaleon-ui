import React from "react";
import { toast } from "react-hot-toast";

import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export function showJSX(jsx, icon, duration = 10000) {
  if (!jsx) {
    return;
  }
  if (typeof jsx === "string") {
    jsx = <Typography variant="caption">{jsx}</Typography>;
  }
  toast(
    (t) => (
      <div className="d-flex ai-center jc-between gap-10px">
        {jsx}
        <IconButton
          color="secondary"
          size="small"
          onClick={() => toast.dismiss(t.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    ),
    {
      icon,
      duration,
    }
  );
}

export function showSuccess(txt) {
  showJSX(txt, <CheckCircleIcon color="success" fontSize="small" />, 10000);
}

export function showWarning(txt, details) {
  console.warn(...[txt, details].filter(Boolean));
  showJSX(txt, <WarningAmberIcon color="warning" fontSize="small" />, 10000);
}

export function showError(txt, details) {
  console.error(...[txt, details].filter(Boolean));
  showJSX(txt, <ErrorIcon color="error" fontSize="small" />, 10000);
}

export function showInfo(txt, details) {
  showJSX(txt, <InfoIcon color="info" fontSize="small" />, 10000);
}

export function showPromise(
  promise,
  {
    loading = (
      <>
        <HourglassEmptyIcon fontSize="small" /> Procesando...
      </>
    ),
    success = (
      <>
        <CheckCircleIcon fontSize="small" color="success" /> Listo
      </>
    ),
    error = (
      <>
        <ErrorIcon fontSize="small" color="error" /> Error
      </>
    ),
  } = {}
) {
  toast.promise(promise, {
    loading: {
      render: () => loading,
      icon: <HourglassEmptyIcon fontSize="small" />,
    },
    success: {
      render: () => success,
      icon: <CheckCircleIcon fontSize="small" color="success" />,
    },
    error: {
      render: () => error,
      icon: <ErrorIcon fontSize="small" color="error" />,
    },
  });
}
