import { getAllThemesRegistered } from "../rules/manager.js";
import { Color } from "../rules/colors.js";
import { JS2CSS } from "../../fluidCSS/index.js";

export const baseColor = window.cyan;

export const zIndex = (() => {
  const mouseFxBackall = "-1";
  const mouseFxOverall = "8";
  const MinOverscroll = "7";
  return {
    mouseFxBackall,
    mouseFxOverall,
    MinOverMouseFx: (Number(mouseFxOverall) + 1).toString(),
    MinOverscroll,
  };
})();

export const mapFilterTheme = {};

export function init() {
  Object.assign(window, { mapFilterTheme, zIndex, baseColor });

  Object.assign(mapFilterTheme, {
    ...getAllThemesRegistered().reduce((acc, themeRegister) => {
      acc[themeRegister.name[0]] = (rotation) => {
        const name_color = window.themeColors[themeRegister.name_color];
        return rotation(name_color, Color("red"));
      };
      return acc;
    }, {}),
    blackNwhite: () => "grayscale(1)",
  });

  JS2CSS.insertStyle({
    id: "theme-constants",
    ":root": {
      "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
      "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
      "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
      "--z-index-minover-scroll": zIndex.MinOverscroll,
    },
  });
}
