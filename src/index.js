import React, { useState, useEffect } from "react";

import package_json from "../package.json";

import { init } from "./app/start/start";
import { routeCheck } from "./app/start/routeCheck";
import { Unauthorize } from "./views/unauthorize";

import { createRoot } from "react-dom/client";
import toast from "react-hot-toast";
import { RoutingManagement } from "@framework";

init();

const componentsContext = require.context("./views", true, /\.jsx$/);

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    {...{
      componentsContext,
      // routeCheck, // Función verificadora de errores en ruta
      routeError: (check) => {
        toast.error(check.message); // Tratamiento de error
      },
      componentError: (check) => <Unauthorize message={check.message} />,
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
