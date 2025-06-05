import { applyPortalBackground, applyDefaultBackground } from "./Fx/bg.jsx";

import { getPaletteConfig, getThemeName, isDark } from "../rules/manager.js";

import { colorFilterDiscriminator } from "../../tools/utils.jsx";

import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";

import { fluidCSS } from "../../fluidCSS/index.js";

export function burnBGFluid({ bgtype = "1", theme_name, theme_luminance }) {
  const fluid = fluidCSS();
  switch (bgtype) {
    default:
    case "1":
    case "default":
      fluid.ltX("small", {
        opacity: ["0.5", "1"],
      });
      applyDefaultBackground();
      break;
    case "2":
    case "portal":
      fluid.btwX("responsive", {
        opacity: ["0.5", "0.75", "1"],
      });
      applyPortalBackground();
      break;
  }
  return fluid;
}

function lightEffect() {
  const rl = {
    "*": "invert() hue-rotate(180deg)",
  };
  const rb = {};
  const { panda } = getPaletteConfig();
  const a = [rb, rl];
  if (isDark()) {
    return a[+panda];
  }
  return a[1 - +panda];
}
