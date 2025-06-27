import React, { Component } from "react";

import { Typography, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { getSecondaryColor } from "../rules/manager/manager.selected.js";

const listNotify = [];
let NOTIFY_SINGLETON;

export function sendNotify({ duration = 10000, ...props }) {
  if (typeof duration !== "number") {
    console.warn("sendNotify: duration must be a number", duration);
    duration = 3000;
  }
  const id = Date.now();
  listNotify.push({
    id,
    ...props,
  });
  NOTIFY_SINGLETON && NOTIFY_SINGLETON.forceUpdate();
  setTimeout(() => {
    removeNotify(id);
  }, duration);
}

function getNotify(id) {
  return listNotify.find((item) => item.id == id);
}

export function removeNotify(notification_id) {
  console.log("removiendo", notification_id);
  const notification = getNotify(notification_id);
  if (notification) {
    if (notification.hover) {
      console.log("esperando por hover");
      return setTimeout(() => removeNotify(notification_id), 2000);
    }
    console.log("removiendo", notification_id);
    listNotify.splice(listNotify.indexOf(notification), 1);
    NOTIFY_SINGLETON.forceUpdate();
  }
}

export class NotifierBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    NOTIFY_SINGLETON = this;
  }
  render() {
    const { position = "bottom-right" } = this.props;
    return (
      <div
        className="flex col-direction-reverse gap-10px z-notifier"
        style={{
          position: "fixed",
          ...(() => {
            const RETURN = {};
            const [x, y] = position.split("-");
            if (x == "bottom") {
              RETURN.bottom = "10px";
            } else if (x == "top") {
              RETURN.top = "10px";
            }
            if (y == "left") {
              RETURN.left = "10px";
            } else if (y == "right") {
              RETURN.right = "10px";
            }
            return RETURN;
          })(),
        }}
      >
        {listNotify.map(
          ({
            id,
            message,
            jsx,
            icon,
            duration,
            showCloseButton = true,
            classes,
            style,
          }) => (
            <Paper
              key={id}
              className={`flex align-center justify-space-between gap-10px pad-10px ${classes}`}
              onMouseEnter={() => (getNotify(id).hover = true)}
              onMouseLeave={() => (getNotify(id).hover = false)}
              elevation={12}
              style={{
                border: `1px solid ${getSecondaryColor()}`,
                ...style,
              }}
            >
              <div className="flex align-center justify-center">{icon}</div>
              <div className="flex align-center justify-start">
                {jsx &&
                  (() => {
                    if (!(jsx instanceof React.Component)) {
                      return jsx;
                    }
                    return jsx({ close: () => removeNotify(id) });
                  })()}
                {jsx && <br />}
                <Typography variant="caption">{message}</Typography>
              </div>
              {showCloseButton && (
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => removeNotify(id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>
          )
        )}
      </div>
    );
  }
}

export function showJSX(jsx, icon, duration) {
  if (!jsx) {
    return;
  }
  if (typeof jsx === "string") {
    jsx = <Typography variant="caption">{jsx}</Typography>;
  }
  console.log("toast", jsx, icon, duration);
  sendNotify({
    jsx,
    icon,
    duration,
  });
  /*
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
  */
}

export function showSuccess(txt, duration) {
  showJSX(txt, <CheckCircleIcon color="success" fontSize="small" />, duration);
}

export function showWarning(txt, details, duration) {
  console.warn(...[txt, details].filter(Boolean));
  showJSX(txt, <WarningAmberIcon color="warning" fontSize="small" />, duration);
}

export function showError(txt, details, duration) {
  console.error(...[txt, details].filter(Boolean));
  showJSX(txt, <ErrorIcon color="error" fontSize="small" />, duration);
}

export function showInfo(txt, duration) {
  showJSX(txt, <InfoIcon color="info" fontSize="small" />, duration);
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
  console.log("toast", promise, loading, success, error);
  /* toast.promise(promise, {
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
  }); */
}
