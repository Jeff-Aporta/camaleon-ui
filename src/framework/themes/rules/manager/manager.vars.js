import { isReadyThemeChange } from "./manager.listener.js";
import { applyTheme } from "./manager.js";

let _name_;
let _luminance_;
let _settingsView_ = {};
const _createThemeName_ = []; // Filtro de nombre para creación
const _excludeThemeName_ = []; // Filtro de nombre para excluir creación

const MUIDefaultValues = {
  loadScrollsbar: {},
};

export function getCreateThemeName() {
  return _createThemeName_;
}

export function addCreateThemeName(...names) {
  _createThemeName_.push(...names);
}

export function getExcludeThemeName() {
  return _excludeThemeName_;
}

export function addExcludeThemeName(...names) {
  _excludeThemeName_.push(...names);
}

export function getMUIDefaultValues() {
  return MUIDefaultValues;
}

export function setSettingsView(settingsView) {
  Object.assign(_settingsView_, settingsView);
}

export function getSettingsView() {
  return _settingsView_;
}

export function processSettingsView() {
  const { title, theme = {} } = _settingsView_;
  const { luminance, name } = theme;
  if (title) {
    document.title = title;
  }
  if (luminance) {
    setThemeLuminance(luminance);
  }
  if (name) {
    setThemeName(name);
  }
}

export function isDark() {
  return getThemeLuminance() === "dark";
}

export function getPaletteConfig(name = getThemeName()) {
  let retorno = MUIDefaultValues[name];
  if (!retorno) {
    return MUIDefaultValues["cyan"];
  }
  return retorno;
}

export function getAllThemesRegistered() {
  const k = Object.keys(MUIDefaultValues).filter(
    (k) => !["loadScrollsbar"].includes(k)
  );
  return k.map((k) => MUIDefaultValues[k]);
}

export function defaultThemeName(name) {
  if(localStorage.getItem("theme-name")) {
    return;
  }
  localStorage.setItem("theme-name", name);
}

export function initThemeName(name) {
  if (_name_) {
    return;
  }
  _name_ = (() => {
    if (name) {
      return name;
    }
    if (!localStorage) {
      return "cyan";
    }
    const tema_almacenado = localStorage.getItem("theme-name");
    return global.nullish(tema_almacenado, "cyan");
  })();
}

function initLuminance(luminance) {
  if (_luminance_) {
    return;
  }
  _luminance_ = (() => {
    if (luminance) {
      return luminance;
    }
    const systemLuminance = ["light", "dark"][
      +!!window.matchMedia("(prefers-color-scheme: dark)").matches
    ];
    const stored = localStorage.getItem("theme-luminance");
    return global.nullish(stored, systemLuminance);
  })();
}

export function getThemeName() {
  initThemeName();
  return _name_;
}

export function getThemeLuminance() {
  initLuminance();
  return _luminance_;
}

export function setThemeName(name) {
  if (!isReadyThemeChange()) {
    return;
  }
  _name_ = name;
  if (localStorage) {
    localStorage.setItem("theme-name", name);
  }
  applyTheme();
}

export function setThemeLuminance(luminance) {
  if (!isReadyThemeChange()) {
    return;
  }
  _luminance_ = luminance;
  if (localStorage) {
    localStorage.setItem("theme-luminance", luminance);
  }
  applyTheme();
}
