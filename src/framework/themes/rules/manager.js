import { fluidCSS } from "../../fluidCSS/index.js";
import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";

import { Color } from "./colors.js";

import { createTheme, responsiveFontSizes } from "@mui/material";

import { customizeScrollbar } from "./scrollbar.js";
import { getSelectedPalette, isPanda } from "./manager.selected.js";
import { triggerThemeChange, isReadyThemeChange } from "./manager.listener.js";

export { Color };

let _name_;
let _luminance_;

export const MUIDefaultValues = {
  loadScrollsbar: {},
};

export function getAllThemesRegistered() {
  const k = Object.keys(MUIDefaultValues).filter(
    (k) => !["loadScrollsbar"].includes(k)
  );
  return k.map((k) => MUIDefaultValues[k]);
}

export const paletteLoader = {
  MUIDefaultValues,
  customizeScrollbar,
  getThemeLuminance,
  getThemeName,
  isDark,
  childs,
  createThemePalette: ({ palette, background, darkmode }) => {
    const customize_components = customizeComponents({
      palette,
      components: palette.componentsMUI({ darkmode }),
      darkmode,
    });
    const colors = muiColors(palette, darkmode);
    return createTheme({
      ...customize_components,
      palette: {
        mode: ["light", "dark"][+darkmode],
        background,
        ...colors,
      },
    });
  },
};

/**
 * Obtiene los colores MUI de una paleta.
 * @param {object} palette Paleta de colores.
 * @param {boolean} darkMode Indica modo oscuro.
 * @returns {object} Colores formateados.
 */
export function muiColors(palette, darkMode) {
  const colors = palette.colors(darkMode);
  const retorno = Object.entries(colors).reduce((acc, [key, value]) => {
    acc[key] = {
      main: value.color.hex(),
      contrastText: value.text.hex(),
    };
    return acc;
  }, {});
  return retorno;
}

/**
 * Indica si el modo actual es oscuro.
 * @returns {boolean}
 */
export function isDark() {
  return getThemeLuminance() === "dark";
}

export function getColorsTheme(darkmode) {
  return global.nullish(
    getSelectedPalette().colors(global.nullish(darkmode, isDark())),
    {}
  );
}

/**
 * Aplica la configuración de tema.
 */
export function applyTheme() {
  const themeSelected = getPaletteConfig();
  themeSelected.willLoad(isDark());
  JS2CSS.insertStyle({
    id: "theme-manager-settings",
    clasesKebab: false,
    infer: false,
    ":root": {
      "--is-panda": +isPanda(),
      "--is-dark": +isDark(),
      "--pandabg-filter": (() => {
        if (isPanda()) {
          return "invert() hue-rotate(180deg)";
        }
        return "";
      })(),
      ".panda-invert": {
        filter: "var(--pandabg-filter)",
      },
    },
  });
  triggerThemeChange();
}

/**
 * Establece la luminancia del tema (light/dark).
 * @param {string} luminance El nivel de luminancia.
 */
export function setThemeLuminance(luminance) {
  if (!isReadyThemeChange()) {
    return;
  }
  _luminance_ = global.nullish(luminance, "dark");
  if (localStorage) {
    localStorage.setItem("theme-luminance", luminance);
  }
  applyTheme();
}

/**
 * Devuelve la luminancia del tema actual.
 * @returns {string}
 */
export function getThemeLuminance() {
  initLuminance();
  return _luminance_;
}

function initLuminance(luminance) {
  _luminance_ = global.nullish(
    _luminance_,
    (() => {
      if (luminance) {
        return luminance;
      }
      const systemLuminance = ["light", "dark"][
        +!!window.matchMedia("(prefers-color-scheme: dark)").matches
      ];
      const stored = localStorage.getItem("theme-luminance");
      return global.nullish(stored, systemLuminance);
    })()
  );
}

/**
 * Devuelve la configuración de paleta actual.
 * @returns {object}
 */
export function getPaletteConfig(name = getThemeName()) {
  let retorno = MUIDefaultValues[name];
  if (!retorno) {
    return MUIDefaultValues["cyan"];
  }
  return retorno;
}

export function isRegistered(name) {
  return getAllThemesRegistered().some((x) => {
    return x.name.includes(name);
  })
    ? name
    : undefined;
}

export function customizeComponents({ palette, darkmode }) {
  return {
    typography: global.nullish(palette.typography(), {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    }),
    components: mapMui(palette),
  };

  function mapMui(palette) {
    const componentes = palette.componentsMUI({ darkmode });
    const retorno = Object.entries(componentes).reduce(
      (retorno, [component, contexts]) => {
        retorno[`Mui${component}`] = {
          styleOverrides:
            typeof contexts === "string"
              ? contexts
              : Object.entries(contexts).reduce((curr, [context, css]) => {
                  const s = Object.keys(palette.colors(isDark()))
                    .concat([
                      "primary",
                      "secondary",
                      "error",
                      "warning",
                      "info",
                      "success",
                    ])
                    .includes(context);
                  if (s) {
                    curr[`contained${firstUppercase(context)}`] = css;
                  } else {
                    curr[context] = css;
                  }
                  return curr;

                  function firstUppercase(str) {
                    const retorno = str.charAt(0).toUpperCase() + str.slice(1);
                    return retorno;
                  }
                }, {}),
        };
        return retorno;
      },
      {}
    );
    return retorno;
  }
}

export function childs(component, css) {
  return Object.entries(css).reduce((acc, [context, value]) => {
    acc[`&.Mui${component}-${context}`] = value;
    return acc;
  }, {});
}

export function registerColors(colors) {
  // Exponer colores globalmente
  if (!window.themeColors) {
    window.themeColors = {};
  }
  Object.assign(window, colors);
  Object.assign(window.themeColors, colors);
  return window.themeColors;
}

export function readyThemeManager() {
  applyTheme();
}

/**
 * Establece el nombre del tema actual.
 * @param {string} name Nombre del tema.
 */
export function setThemeName(name) {
  if (!isReadyThemeChange()) {
    return;
  }
  _name_ = global.nullish(name, "cyan");
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme-name", name);
  }
  applyTheme();
}

export function initThemeName(name) {
  _name_ = global.nullish(
    _name_,
    (() => {
      if (name) {
        return name;
      }
      if (typeof localStorage === "undefined") {
        return "cyan";
      }
      const tema_almacenado = localStorage.getItem("theme-name");
      return global.nullish(tema_almacenado, "cyan");
    })()
  );
}

/**
 * Devuelve el nombre del tema actual.
 * @returns {string}
 */
export function getThemeName() {
  initThemeName();
  return _name_;
}

(() => {
  try {
    Object.assign(window, {
      isDark,
      getThemeName,
      setThemeName,
      getThemeLuminance,
      setThemeLuminance,
      getColorsTheme,
      getPaletteConfig,
      getSelectedPalette,
      JS2CSS,
      fluidCSS,
      Color,
    });
  } catch (error) {
    console.error(error);
  }
})();
