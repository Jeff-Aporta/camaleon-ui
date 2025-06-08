import { getPaletteConfig, getThemeName, isDark } from "./manager.js";
import { responsiveFontSizes } from "@mui/material";

export function getAdjacentPrimaryColor({ a, n, light } = {}) {
  return getPaletteConfig().getAdjacentPrimaryColor({ a, n, light });
}

export function getColorBackground(theme) {
  if (!theme) {
    theme = getSelectedPalette();
  }
  const { palette } = theme;
  let cursor = palette;
  console.log("palette", cursor);
  if (cursor) {
    if (cursor.background) {
      cursor = cursor.background;
      console.log("background", cursor);
      if (cursor.default) {
        cursor = cursor.default;
        console.log("default", cursor);
        return cursor;
      }
    }
  }
}

export function getPrimaryColor() {
  return getPaletteConfig().getPrimaryColor();
}

export function getTriadeColors(primary) {
  return getPaletteConfig().getTriadeColors(primary);
}

export function getContrast(primary) {
  return getPaletteConfig().getContrast(primary);
}

export function isPanda() {
  return !!getPaletteConfig().panda;
}

export function getSelectedPalette({
  name = getThemeName(),
  darkmode = isDark(),
} = {}) {
  return getPaletteConfig(name)[["light", "dark"][+darkmode]];
}

export function getThemePandaComplement() {
  if (!isPanda()) {
    return getTheme();
  }
  return getThemeInvert();
}

export function getThemeInvert() {
  return getTheme({ darkmode: !isDark() });
}

export function getTheme(props) {
  return responsiveFontSizes(getSelectedPalette(props));
}

export function typographyTheme() {
  const typo = getSelectedPalette().typography;
  return {
    ...typo,
    widthAproxString,
  };

  function widthAproxString(string, { fontSize } = {}) {
    return string.length * (global.nullish(fontSize, typo.fontSize) * 0.55);
  }
}

/**
 * Indica si los componentes están tematizados.
 * @returns {boolean}
 */
export function isThemed() {
  return controlComponents().themized;
}

export function controlComponents() {
  const retorno = getPaletteConfig().control_components(isDark());
  return retorno;
}

export function href(href) {
  const control = controlComponents();
  if (control.href) {
    return control.href(href);
  }
  return href;
}
