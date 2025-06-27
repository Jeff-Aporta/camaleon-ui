import React from "react";

import { applyPortalBackground, applyDefaultBackground } from "./bg.js";

import {
  getPaletteConfig,
  getThemeName,
  isDark,
} from "../../rules/manager/index.js";

import { colorFilterDiscriminator } from "../../../tools/utils.jsx";

import { fluidCSS, JS2CSS } from "../../../fluidCSS/index.js";

export function burnBGFluid({ bgtype = "1", theme_name, theme_luminance }) {
  const fluid = fluidCSS();
  switch (bgtype) {
    default:
    case "1":
    case "default":
      fluid.ltX("small", {
        opacity: ["0.75", "1"],
      });
      applyDefaultBackground();
      break;
    case "2":
    case "portal":
      fluid.btwX("responsive", {
        opacity: ["0.7", "0.85", "1"],
      });
      applyPortalBackground();
      break;
  }
  return fluid;
}
