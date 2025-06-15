import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

let querypath = "";
let assignedpath = "";

export function getQueryPath() {
  return querypath;
}

export function getAssignedPath() {
  return assignedpath;
}

export const driverParams = {
  get: (key) => new URLSearchParams(window.location.search).get(key),
  gets: (...keys) =>
    keys.map((k) => new URLSearchParams(window.location.search).get(k)),
  set: (key, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  },
  sets: (entries) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(entries).forEach(([k, v]) => params.set(k, v));
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  },
};

export function RoutingManagement(props) {
  function loadRoot(componentsContext) {
    const rutas = componentsContext.keys().reduce((map, filePath) => {
      const componentName = filePath.replace("./", "").replace(/\.jsx$/, "");
      map[componentName] = componentsContext(filePath).default;
      return map;
    }, {});
    return rutas;
  }
  function componentsMap(customRoutes, componentsContext) {
    return {
      ...loadRoot(componentsContext),
      ...global.nullish(customRoutes, {}),
    };
  }

  function RouteComponent({
    componentsContext,
    customRoutes = {},
    startIgnore = [],
    routeCheck = () => ({}), // Función verificadora de errores en ruta
    routeError = () => {}, // tratamiento de error
    componentError = () => <React.Fragment></React.Fragment>, // Componente a mostrar si hubo error
  }) {
    const view_id = driverParams.get("view-id");
    const routes = componentsMap(customRoutes, componentsContext);
    const params = useParams();

    const nodes = (
      view_id
        ? view_id.split("/")
        : Array.from(
            {
              length: 10,
            },
            (_, n) => params[`node${n + 1}`]
          )
    ).filter(Boolean);

    querypath = nodes.join("/");

    const check = routeCheck({
      querypath,
    });

    if (check.error) {
      routeError(check);
      return componentError(check);
    }

    const cleanedNodes = limpiarIgnorados(nodes, startIgnore);
    const index = evaluateIndex(cleanedNodes);
    if (index) {
      querypath = index;
    }
    assignedpath = inferirIntension(querypath, cleanedNodes, routes);
    assignedpath = evaluate404(assignedpath, routes);

    return global.nullish(
      evaluateFn(assignedpath, routes),
      routes[assignedpath]
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteComponent {...props} />} />
        {Array.from({ length: 10 }).map((_, i) => {
          const segments = Array.from(
            { length: i + 1 },
            (_, idx) => `:node${idx + 1}`
          );
          return (
            <Route
              key={i}
              path={`/${segments.join("/")}`}
              element={<RouteComponent {...props} />}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

// Helpers extracted for clarity/tests
function evaluateIndex(nodes) {
  return nodes.length === 0 ? "index" : null;
}

function limpiarIgnorados(nodes, startIgnore) {
  const ignore = Array.isArray(startIgnore) ? startIgnore : [startIgnore];
  if (
    nodes[0] &&
    ignore.map((i) => i.toLowerCase()).includes(nodes[0].toLowerCase())
  ) {
    return nodes.slice(1);
  }
  return nodes;
}

function generarNiveles(base, node) {
  const compact = (arr) => arr.filter(Boolean).join("/");
  return [compact([base, node]), compact([base, node, node])];
}

function inferirIntension(querypath, nodes, routes) {
  if (routes[querypath]) return querypath;
  const prior = [
    ...generarNiveles(querypath, "index"),
    ...generarNiveles(querypath, nodes.at(-1)),
  ];
  return prior.find((key) => routes[key]) || querypath;
}

function evaluate404(path, routes) {
  if (routes[path]) return path;
  if (routes["404/404"]) return "404/404";
  if (routes["404"]) return "404";
  return path;
}

function evaluateFn(path, routes) {
  return typeof routes[path] === "function" ? routes[path]() : null;
}
