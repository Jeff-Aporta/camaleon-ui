import React, { useState, useEffect } from "react";

import { createRoot } from "react-dom/client";
import package_json from "@root/package.json";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import HomeIcon from "@mui/icons-material/Home";
import {
  assignMapManagement,
  defaultUseViewId,
  RoutingManagement,
} from "@framework";
import { initStartApp } from "./app/_start/start";
import { init as initPolyfill } from "./app/_start/polyfill";
import { routeCheck } from "./app/_start/routeCheck";

assignMapManagement({
  "@wallet": {
    view: "/users/wallet",
    params: {
      "action-id": "investment",
    },
  },
  "@home": "/",
});
defaultUseViewId(true);
initStartApp();
initPolyfill();

const componentsContext = require.context("./views", true, /\.jsx$/);

// Cargar usuario automáticamente desde localStorage en window.currentUser
window["currentUser"] = JSON.parse(localStorage.getItem("user") || "{}");

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    {...{
      componentsContext,
      routeCheck, // Función verificadora de errores en ruta
      customRoutes: { custom: <h1>Hola desde custom</h1> },
      startIgnore: [
        package_json.repository.url
          .replace("http://", "")
          .split("/")
          .filter(Boolean)[3],
      ],
    }}
  />
);
