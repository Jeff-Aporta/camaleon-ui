import { getThemeLuminance, getThemeName } from "./manager.js";

const themeChangeListener = [];
let last_theme_values;

function recordLastThemeValues() {
  last_theme_values = {
    luminance: getThemeLuminance(),
    name: getThemeName(),
  };
}

function themeValuesWasChanged() {
  if (!last_theme_values) {
    return;
  }
  return (
    last_theme_values.luminance != getThemeLuminance() ||
    last_theme_values.name != getThemeName()
  );
}

export function addThemeChangeListener(listener) {
  themeChangeListener.push(listener);
}

export function removeThemeChangeListener(listener) {
  themeChangeListener.splice(themeChangeListener.indexOf(listener), 1);
}

export function triggerThemeChange() {
  if (last_theme_values) {
    themeChangeListener.forEach((listener, i, array) =>
      listener({
        luminance: getThemeLuminance(),
        name: getThemeName(),
        index_listener: i,
        total_listeners: array.length,
      })
    );
  }
  recordLastThemeValues();
}

let delay_theme_change = 0;

export function isReadyThemeChange() {
  if (Date.now() - delay_theme_change < 500) {
    return false;
  }
  delay_theme_change = Date.now();
  return true;
}