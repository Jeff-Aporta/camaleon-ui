import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { getUseViewId } from "./router.storage.js";
import { setSettingsView, href } from "./rules/manager/index.js";
import { Link } from "@mui/material";

let querypath = "";
let assignedpath = "";

const namesMainJSX = ["index", "view"];
const mainFolder = "_main";
const params = {};
const paramListener = [];

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

export function addParamListener(listener) {
  paramListener.push(listener); // {"view-id": fn}
}

export function removeParamListener(listener) {
  if (typeof listener != "number") {
    listener = paramListener.indexOf(listener);
  }
  if (listener > -1) {
    paramListener.splice(listener, 1);
  }
}

export function _updateParams() {
  const newParams = getAllParams();
  paramListener.forEach((listener) => {
    Object.entries(listener).forEach(([names, fn]) => {
      names = names.replace(/\s/g, "").split(",");
      names.forEach((name) => {
        if (params[name] != newParams[name]) {
          fn({ name, old_value: params[name], new_value: newParams[name] });
        }
      });
    });
  });
  Object.assign(params, newParams);
}

function getAllParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function gets(...keys) {
  return keys.map((k) => new URLSearchParams(window.location.search).get(k));
}

function sets(entries, { reaload, save } = {}) {
  const params = new URLSearchParams(window.location.search);
  const initParams = params.toString();
  Object.entries(entries).forEach(([k, v]) => params.set(k, v));
  if (initParams !== params.toString()) {
    const url = urlParamToString(params);
    _setURLParams("replaceState", url);
    if (save) {
      _setURLParams("pushState", url);
    }
    reload(reaload);
    _updateParams();
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

export function _setURLParams(method, url, state = {}, title = document.title) {
  if (method !== "pushState" && method !== "replaceState") {
    throw new Error(`Método inválido: ${method}`);
  }
  window.history[method](state, title, url);
  _updateParams();
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
      <RoutingManagement_ {...props} />
    </BrowserRouter>
  );
}

export function RoutingManagement_(props) {
  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    console.log("xxxx");
    addParamListener({
      "view-id, test": ({ name, new_value }) => {
        console.log("Hola", name, new_value);
        setForceUpdate((f) => f + 1);
      },
    });
  }, []);

  return (
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
      let { name, path } = p;
      if (!path.startsWith("./")) {
        path = `./${path}`;
      }
      let file = getFilePath(path, name);
      const keys = Object.keys(file);
      const k = keys[0];
      if (keys.length == 1 && k == "default") {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        file = file.default;
      }
      return {
        [name]: file,
      };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  return RETORNO;
}

export function buildHref(href) {
  const stayinGit = [
    getUseViewId(),
    window.PUBLIC_URL == ".",
    window.location.host.includes(".github"),
  ].some(Boolean);

  return global.nullish(
    () => simple(href),
    () => complex(href)
  );

  function complex({ view = "/", params = {} }) {
    const root = simple(view);
    params = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return [root, params]
      .filter(Boolean)
      .join(root.startsWith("?") ? "&" : "?");
  }

  function simple(url) {
    if (typeof url == "string") {
      return stayinGit ? `?view-id=${encodeURIComponent(url)}` : url;
    }
  }
}

const mapping = {};

export function assignMapManagement(props) {
  Object.assign(mapping, props);
}

export function hrefManagement(props) {
  if (typeof props == "string") {
    const map = mapping[props];
    if (map) {
      props = map;
      return hrefManagement(props);
    } else {
      props = { view: props };
    }
  }

  global.assignNullish(props, { params: {} });

  decorators();

  return props;

  function decorators() {
    if (mapping[props.view]) {
      props = mapping[props.view];
    }
  }
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

  const href = hrefManagement(querypath).view;
  if (href != querypath) {
    window.location.href = buildHref(href);
    return;
  }

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

  let RETURN = evaluateFn(path) || routes[path].main;
  if (routes[path]) {
    const { settings = {} } = routes[path].component;
    setSettingsView(settings);
  }
  RETURN = global.nullish(RETURN, "Imposible de resolver");
  return <Wrap />;

  function Wrap() {
    return <React.Fragment>{RETURN}</React.Fragment>;
  }
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

export function NavigationLink({ to, target = "_self", children, ...rest }) {
  const navigate = useNavigate();
  to = hrefManagement(to);
  const url = buildHref(to);
  const viewId = driverParams.get("view-id");

  const handleClick = (e) => {
    e.preventDefault();
    if (viewId) {
      _setURLParams("replaceState", url);
    } else {
      if (target == "_self") {
        navigate(url, { replace: true });
      } else {
        window.open(url, target);
      }
    }
  };

  return (
    <Link href={url} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
