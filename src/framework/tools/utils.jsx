import { toast } from "react-hot-toast";

import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { getThemeName, Color, isDark } from "../index.js";
/**
 * Devuelve el filtro CSS en modo claro (sin cambios si el tema es oscuro).
 * @returns {{"*": string} | {}} Filtro CSS.
 */
export function getLightFilter() {
  if (isDark()) {
    return {};
  }
  return {
    "*": "invert() hue-rotate(180deg)",
  };
}

/**
 * Discrimina y aplica filtros de color según tema y reglas adicionales.
 * @param {Object} extraRules - Reglas de filtro extra por tema o wildcard.
 * @param {Object.<string, Function>} themeFilterMap - Mapa de tema a funciones de filtro.
 * @param {Color} baseColor - Color base para cálculo de rotación.
 * @returns {{filter: string}} Objeto con propiedad 'filter' CSS.
 */
export function colorFilterDiscriminator(
  extraRules = {},
  themeFilterMap = window.mapFilterTheme ?? {}
) {
  const themeName = getThemeName();
  const p = themeFilterMap[themeName];
  return {
    filter: (() => {
      const rotationFilter = (() => {
        if (p) {
          if (typeof p == "function") {
            return p(fdhue);
          }
          return p;
        }
        return "";
      })();
      const extras = [];
      Object.entries(extraRules).forEach(([key, value]) => {
        if (key == "*") {
          return extras.push(value);
        }
        const queries = key.split(",").map((k) => k.trim());
        if (queries.includes(themeName)) {
          extras.push(value);
        }
      });
      return [rotationFilter, ...extras].filter(Boolean).join(" ");
    })(),
  };
}

export function fdhue(color, baseColor = window.baseColor ?? Color("white")) {
  if (typeof color == "string") {
    color = Color(color);
  }
  const diff = color.hue() - baseColor.hue();
  console.log(color.hue(), baseColor.hue(), diff);
  return `hue-rotate(${parseInt(diff)}deg)`;
}

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
  showJSX(txt, "✅", 10000);
}

export function showWarning(txt, details) {
  console.warn(txt, details);
  showJSX(txt, "⚠️", 10000);
}

export function showError(txt, details) {
  console.error(txt, details);
  showJSX(txt, "⛔", 10000);
}

export function showInfo(txt, details) {
  console.info(txt, details);
  showJSX(txt, "ℹ️", 10000);
}

export function showPromise(
  promise,
  {
    loading = "⌛ Procesando...",
    success = "✅ Listo",
    error = "⛔ Error",
  } = {}
) {
  toast.promise(promise, {
    loading,
    success,
    error,
  });
}
