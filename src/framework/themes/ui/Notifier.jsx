import React, { Component } from "react";

import { Typography, IconButton, Paper, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

import { getSecondaryColor } from "../rules/manager/manager.selected.js";
import { DriverComponent } from "../../tools/tools.js";

const SUCCESS_ICON = <CheckCircleIcon color="success" fontSize="small" />;
const WARNING_ICON = <WarningAmberIcon color="warning" fontSize="small" />;
const ERROR_ICON = <ErrorIcon color="error" fontSize="small" />;
const INFO_ICON = <InfoIcon color="info" fontSize="small" />;
const LOADING_ICON = <CircularProgress size={16} color="complement" />;

const driverNotifier = DriverComponent({
  notifier: {},
  notify: {
    value: [],
    getByID(id) {
      return this.getNotify().find((item) => item.id == id);
    },
    remove(id) {
      const notification = this.getByIDNotify(id);
      if (notification) {
        if (notification.hover) {
          return setTimeout(() => this.removeNotify(id), 2000);
        }
        const listNotify = this.getNotify();
        listNotify.splice(listNotify.indexOf(notification), 1);
        this.updateNotifier();
      }
    },
    send({ duration = 10000, id = Date.now(), ...props }) {
      if (typeof duration !== "number") {
        console.warn("sendNotify: duration must be a number", duration);
        duration = 3000;
      }
      this.getNotify().push({
        id,
        ...props,
      });
      if (this.existsNotifier()) {
        this.updateNotifier();
      } else {
        return setTimeout(() => this.sendNotify({ duration, ...props }), 100);
      }
      setTimeout(() => {
        this.removeNotify(id);
      }, duration);
    },
  },
});

export function getNotify(id) {
  return driverNotifier.getByIDNotify(id);
}

export function sendNotify({ duration = 10000, id = Date.now(), ...props }) {
  driverNotifier.sendNotify({ duration, id, ...props });
}

export function removeNotify(id) {
  driverNotifier.removeNotify(id);
}

export class NotifierBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    driverNotifier.setNotifier(this);
  }
  render() {
    const { position = "bottom-right" } = this.props;
    return (
      <div
        className="flex col-direction-reverse gap-10px z-notifier"
        style={{
          position: "fixed",
          transition: "all 0.5s ease-in-out",
          interpolateSize: "allow-keywords",
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
        {driverNotifier
          .getNotify()
          .map(
            ({
              id,
              jsx,
              icon,
              duration,
              classes,
              style,
              showCloseButton = true,
            }) => {
              return (
                <Paper
                  key={id}
                  className={`Notify-item flex align-center justify-space-between gap-10px pad-5px ${classes}`}
                  onMouseEnter={() => (getNotify(id).hover = true)}
                  onMouseLeave={() => (getNotify(id).hover = false)}
                  elevation={12}
                  style={{
                    border: `1px solid ${getSecondaryColor()}`,
                    ...style,
                  }}
                >
                  <div className="flex align-center gap-10px">
                    {icon}
                    {jsx}
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
              );
            }
          )}
      </div>
    );
  }
}

function TextNotify({ children }) {
  return <Typography variant="caption">{children}</Typography>;
}

export function showJSX(jsx, icon, duration) {
  if (!jsx) {
    return;
  }
  if (typeof jsx === "string") {
    jsx = <TextNotify>{jsx}</TextNotify>;
  }
  sendNotify({
    jsx,
    icon,
    duration,
  });
}

export function showSuccess(txt, duration) {
  showJSX(txt, SUCCESS_ICON, duration);
}

export function showWarning(txt, details, duration) {
  console.warn(...[txt, details].filter(Boolean));
  showJSX(txt, WARNING_ICON, duration);
}

export function showError(txt, details, duration) {
  console.error(...[txt, details].filter(Boolean));
  showJSX(txt, ERROR_ICON, duration);
}

export function showInfo(txt, duration) {
  showJSX(txt, INFO_ICON, duration);
}

function DefaultSchemaJSXPromise({ text, icon }) {
  return (
    <div className="flex align-center gap-10px">
      {icon}
      <TextNotify>{text}</TextNotify>
    </div>
  );
}

function LoadingJSXPromise(text) {
  return DefaultSchemaJSXPromise({ text, icon: LOADING_ICON });
}

function SuccessJSXPromise(text) {
  return DefaultSchemaJSXPromise({ text, icon: SUCCESS_ICON });
}

function ErrorJSXPromise(text) {
  return DefaultSchemaJSXPromise({ text, icon: ERROR_ICON });
}

function WarningJSXPromise(text) {
  return DefaultSchemaJSXPromise({ text, icon: WARNING_ICON });
}

function InfoJSXPromise(text) {
  return DefaultSchemaJSXPromise({ text, icon: INFO_ICON });
}

export function showPromise(
  loading = "Procesando...",
  promise,
  duration = 10000
) {
  if (!promise) {
    console.error("showPromise: 'promise' es requerido");
    return;
  }
  if (typeof promise.then !== "function") {
    if (typeof promise === "function") {
      promise = new Promise(promise);
    } else {
      console.error("showPromise: 'promise' no se puede procesar", promise);
      return;
    }
  }

  const loadingId = Date.now();
  sendNotify({
    id: loadingId,
    duration: 1_000_000_000,
    jsx: typeof loading === "string" ? LoadingJSXPromise(loading) : loading,
    showCloseButton: true,
  });

  // Cuando la promesa finalice, actualizamos la MISMA notificación
  const { updateNotifier } = driverNotifier;

  promise
    .then((msg) => {
      fromMsg(msg, "success");
    })
    .catch((msg) => {
      fromMsg(msg, "error");
    });

  return promise; // permitimos al consumidor encadenar

  function fromMsg(msg, typeDefault) {
    if (!msg) {
      removeNotify(loadingId);
      return;
    }
    const { type = typeDefault, message } = msg;
    if (message) {
      msg = message;
    }
    const notify = getNotify(loadingId);
    if (notify) {
      notify.jsx = fromType(type, msg) || msg;
      updateNotifier();
      setTimeout(() => removeNotify(loadingId), duration);
    } 
  }

  function fromType(type, msg) {
    if (typeof msg !== "string") {
      return;
    }
    switch (type) {
      case "success":
        return SuccessJSXPromise(msg);
      case "warning":
        return WarningJSXPromise(msg);
      case "info":
        return InfoJSXPromise(msg);
      case "error":
        return ErrorJSXPromise(msg);
    }
  }
}
