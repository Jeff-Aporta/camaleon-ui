import { toast } from "react-hot-toast";

import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { getThemeName, Color, isDark, getPaletteConfig } from "../index.js";

export function getLightFilter() {
  const rl = {
    "*": "invert() hue-rotate(180deg)",
  };
  const rb = {};
  const { panda } = getPaletteConfig();
  const a = [rb, rl];
  let retorno;
  if (isDark()) {
    retorno = a[+panda];
  }else{
    retorno = a[1 - +panda];
  }
  return retorno;
}

export function colorFilterDiscriminator(
  extraRules = {},
  mapFilterTheme = global.nullish(window.mapFilterTheme, {})
) {
  const themeName = getThemeName();
  const p = mapFilterTheme[themeName];
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

export function fdhue(color, baseColor) {
  if (typeof color == "string") {
    color = Color(color);
  }
  const diff = color.hue() - baseColor.hue();
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
