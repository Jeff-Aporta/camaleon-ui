import React, { Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { getUseViewId } from "./storage.js";
import { setSettingsView, href } from "../rules/manager/index.js";
import { Link } from "@mui/material";
import { subscribeParam, driverParams, _setURLParams } from "./params.js";
import { buildHref, hrefManagement } from "./builder.js";
import {
  setComponentsContext,
  _setRoutesAvailable,
  setCustomRoutes,
  mapGenerateComponents,
  getRoutesAvailable,
} from "./context.js";
import {
  inferMAIN_FOLDER,
  evaluateIndex,
  inferirIntension,
  evaluate404,
  evaluateFn,
  limpiarIgnorados,
} from "./inference.js";
import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";
import { VIEW_ID } from "../constants.js";

let querypath = "";
let assignedpath = "";

export function RoutingManagement(props) {
  return (
    <BrowserRouter>
      <RoutingManagement_ {...props} />
    </BrowserRouter>
  );
}
const fades = {
  time: 0,
  fadeIn: {},
  fadeOut: {},
};

export function setTransition({
  fadein = {},
  fadeout = {},
  fade = {},
  time = 200,
}) {
  Object.assign(fades.fadeIn, fadein);
  Object.assign(fades.fadeOut, fadeout);
  Object.assign(fades.fadeIn, fade);
  Object.assign(fades.fadeOut, fade);
  fades.time = time;
}

export class RoutingManagement_ extends Component {
  constructor(props) {
    super(props);
    subscribeParam(
      {
        [VIEW_ID]: () => {
          setTimeout(() => {
            JS2CSS.insertStyle({
              id: "effect-change-view-id",
              ".CamaleonAppThemeProvider": fades.fadeOut,
            });
          });
          this.forceUpdate();
        },
      },
      this
    );
  }

  componentDidUpdate() {
    setTimeout(() => {
      JS2CSS.insertStyle({
        id: "effect-change-view-id",
        ".CamaleonAppThemeProvider": fades.fadeIn,
      });
    }, fades.time);
  }

  componentDidMount() {
    this.addParamListener();
  }

  componentWillUnmount() {
    this.removeParamListener();
  }

  render() {
    const { ...props } = this.props;
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
}

function RouteComponent({
  componentsContext,
  customRoutes = {},
  startIgnore = [],
  routeCheck = () => 0, // Función verificadora de errores en ruta
  componentError = () => 0, // Componente a mostrar si hubo error
}) {
  const view_id = driverParams.getOne(VIEW_ID);
  setComponentsContext(componentsContext);
  setCustomRoutes(customRoutes);
  _setRoutesAvailable(mapGenerateComponents());

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
  assignedpath = querypath;

  const href = hrefManagement(querypath).view;
  if (href != querypath) {
    window.location.href = buildHref(href);
    return;
  }

  const check = routeCheck({
    querypath,
  });

  if (check) {
    driverParams.set("message", check);
    return (
      componentError(check) || resolvePath(inferMAIN_FOLDER("unauthorize"))
    );
  }

  const cleanedNodes = limpiarIgnorados(nodes, startIgnore);
  const index = evaluateIndex(cleanedNodes);
  if (index) {
    querypath = index;
  }
  let path = inferirIntension(querypath, cleanedNodes);
  path = evaluate404(path);

  return resolvePath(path);

  function resolvePath(path) {
    const handlerReturn = evaluateFn(path);
    const routeEntry = getRoutesAvailable()[path];
    if (routeEntry) {
      const { settings = {} } = routeEntry.component;
      setSettingsView(settings);
    }
    if (handlerReturn) {
      return handlerReturn;
    }
    if (routeEntry?.main) {
      const MainComp = routeEntry.main;
      return <MainComp />;
    }
    return <h1>Imposible de resolver</h1>;
  }
}

export function getQueryPath() {
  return querypath;
}

export function getAssignedPath() {
  return assignedpath;
}

export function NavigationLink({
  to,
  scrolltop = true,
  target = "_self",
  children,
  ...rest
}) {
  const navigate = useNavigate();
  to = hrefManagement(to);
  const url = buildHref(to);
  const view_Id = driverParams.getOne(VIEW_ID);

  const handleClick = (e) => {
    e.preventDefault();
    if (to.view != view_Id) {
      if (view_Id) {
        _setURLParams("replaceState", url);
      } else {
        if (target == "_self") {
          navigate(url, { replace: true });
        } else {
          window.open(url, target);
        }
      }
    }
    scrolltop && window.scrollTo(0, 0);
  };

  return (
    <Link href={url} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
