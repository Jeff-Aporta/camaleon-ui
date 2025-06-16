import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

let querypath = "";
let assignedpath = "";

let routerListener = [];
const namesMainJSX = ["index", "view"];
const mainFolder = "_main";

export function addRouterListener(listener) {
  routerListener.push(listener);
}

export function removeRouterListener(listener) {
  routerListener = routerListener.filter((l) => l !== listener);
}

export function notifyRouterListeners() {
  routerListener.forEach((listener) => listener());
}

export function getQueryPath() {
  return querypath;
}

export function getAssignedPath() {
  return assignedpath;
}

function urlParamToString(params) {
  const url = `${window.location.pathname}?${params.toString()}`;
  return url;
}

export const driverParams = {
  get: (key) => gets([key])[0],
  set: (key, value, config) => sets({ [key]: value }, config),
  gets,
  sets,
};

function gets(...keys) {
  return keys.map((k) => new URLSearchParams(window.location.search).get(k));
}

function sets(entries, { reaload, save } = {}) {
  const params = new URLSearchParams(window.location.search);
  const initParams = params.toString();
  Object.entries(entries).forEach(([k, v]) => params.set(k, v));
  if (initParams !== params.toString()) {
    const url = urlParamToString(params);
    setURLParams("replaceState", url);
    if (save) {
      setURLParams("pushState", url);
    }
    reload(reaload);
    notifyRouterListeners();
  }
}

function reload(ms_reaload) {
  if (ms_reaload == true) {
    ms_reaload = 0;
  }
  if (typeof ms_reaload == "number") {
    setTimeout(() => {
      window.location.reload();
    }, ms_reaload);
  }
}

function setURLParams(method, url) {
  window.history[method](null, "", url);
}

let routes = [];

export function getRoutesAvailable() {
  return routes;
}

let _componentsContext;

function setComponentsContext(componentsContext) {
  _componentsContext = componentsContext;
}

function getRouterComponents() {
  return _componentsContext;
}

export function getFilePath(filePath) {
  return getRouterComponents()(filePath);
}

export function getAllPaths() {
  return getRouterComponents().keys();
}

const keysMain2View = ["default", "View"];

function getRouterComponentsPath(filePath) {
  const name = filePath.replace("./", "").replace(/\.jsx$/, "");
  const component = getFilePath(filePath);
  const keys = Object.keys(component);
  const kmain = keys.find((k) => keysMain2View.includes(k));
  const main = component[kmain];
  const settings = component.settings;

  return {
    name,
    component,
    kmain,
    main,
  };
}

let allRoutesNComponents = {};

function loadRoutesComponents() {
  allRoutesNComponents = getAllPaths().reduce((map, filePath) => {
    const props = getRouterComponentsPath(filePath);
    map[props.name] = props;
    return map;
  }, {});
  return allRoutesNComponents;
}

let _customRoutes;

function setCustomRoutes(customRoutes) {
  _customRoutes = customRoutes;
}

export function getCustomRoutes() {
  return _customRoutes || {};
}

function mapGenerateComponents() {
  return {
    ...loadRoutesComponents(),
    ...getCustomRoutes(),
  };
}

export function RoutingManagement(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteComponent {...props} />} />
        {Array.from({ length: 20 }).map((_, i) => {
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

export function getComponentsQuery(query, sufix) {
  if (!query) {
    query = getQueryPath();
  }
  const RETURN = getFirstLevelFolder(
    [query, sufix, "components"].filter(Boolean).join("/")
  );
  return RETURN;
}

export function getFirstLevelFolder(folder) {
  folder = folder.replace("./", "");
  const RETORNO = getAllPaths()
    .map((path) => {
      path = path.replace("./", "");
      if (!path.startsWith(folder)) {
        return;
      }
      const lvlsF = folder.split("/").length;
      const lvlsP = path.split("/").length;
      const diffLvls = lvlsP - lvlsF;
      const nodes = path.split("/");
      const sheet = nodes.at(-1);
      if (diffLvls == 1) {
        return {
          name: sheet.replace(/\.jsx$/, ""),
          path,
        };
      }
      if (diffLvls == 2) {
        const branch = nodes.at(-2);
        console.log({
          branch,
          sheet,
          diffLvls,
          nodes,
          infer: namesMainJSX.includes(sheet.replace(/\.jsx$/, "")),
        });
        if (namesMainJSX.includes(sheet.replace(/\.jsx$/, ""))) {
          return {
            name: branch,
            path,
          };
        }
        if (sheet == branch + ".jsx") {
          return {
            name: branch,
            path,
          };
        }
      }
    })
    .filter(Boolean)
    .map((p) => {
      const k = p.name;
      let { path } = p;
      if (!p.path.endsWith("./")) {
        path = "./" + path;
      }
      return {
        [k]: getFilePath(path),
      };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  return RETORNO;
}

function RouteComponent({
  componentsContext,
  customRoutes = {},
  startIgnore = [],
  routeCheck = () => 0, // Función verificadora de errores en ruta
  componentError = () => 0, // Componente a mostrar si hubo error
}) {
  const view_id = driverParams.get("view-id");
  setComponentsContext(componentsContext);
  setCustomRoutes(customRoutes);
  routes = mapGenerateComponents();

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

  if (check) {
    return componentError(check) || inferMainFolder("routeCheckError");
  }

  const cleanedNodes = limpiarIgnorados(nodes, startIgnore);
  const index = evaluateIndex(cleanedNodes);
  if (index) {
    querypath = index;
  }
  let path = inferirIntension(querypath, cleanedNodes);
  path = evaluate404(path);

  const RETURN = evaluateFn(path) || routes[path].main;
  if (routes[path]) {
    const { settings = {} } = routes[path].component;
    console.log(settings);
    window.settingsView = settings;
  }

  return global.nullish(RETURN, "Imposible de resolver");
}

// Helpers extracted for clarity/tests
function evaluateIndex(nodes) {
  return nodes.length === 0
    ? (() => {
        return trySearch([mainFolder, "index"]) || "index";
      })()
    : null;
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

function inferirIntension(querypath, nodes) {
  if (routes[querypath]) {
    return querypath;
  }
  const prior = [
    ...namesMainJSX.map((n) => inferMainJSX(querypath, n)),
    inferMainJSX(querypath, nodes.at(-1)),
  ];
  return prior.find((key) => routes[key]) || querypath;

  function inferMainJSX(base, node) {
    const compact = (arr) => arr.filter(Boolean).join("/");
    return compact([base, node]);
  }
}

function evaluate404(path) {
  if (routes[path]) {
    return path;
  }
  return inferMainFolder("404");
}

function inferMainFolder(name) {
  return inferWrapperMainFolder(mainFolder) || inferWrapperMainFolder();

  function inferWrapperMainFolder(prefix = "") {
    return trySearch([prefix, name, name]) || trySearch([prefix, name]); // trySearch([prefix, 404, 404]) || trySearch([prefix, 404]);
  }
}

function trySearch(path) {
  path = path.filter(Boolean).join("/");
  if (routes[path]) {
    return path;
  }
}

function evaluateFn(path) {
  const RETURN = typeof routes[path] === "function" ? routes[path]() : null;
  return RETURN;
}
