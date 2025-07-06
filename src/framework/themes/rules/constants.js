import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";

import { initStart } from "../../start.js";

initStart();

export const {
  zIndex = (() => {
    return {
      mouseFxBackall: "-1",
      ...(() => {
        let mouseFxOverall = 8;
        let MinOverMouseFx = mouseFxOverall + 1;
        mouseFxOverall = mouseFxOverall.toString();
        MinOverMouseFx = MinOverMouseFx.toString();
        return {
          mouseFxOverall,
          MinOverMouseFx,
        };
      })(),
      MinOverscroll: "7",
    };
  })(),
} = window;

JS2CSS.insertStyle({
  id: "theme-constants",
  ":root": {
    "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
    "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
    "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
    "--z-index-minover-scroll": zIndex.MinOverscroll,
  },
  ".z-ontop-but-under-fx, .rz-ontopfx": {
    zIndex: zIndex.mouseFxOverall,
  },
  ".z-ontopfx, .rz-ontopfx": {
    zIndex: zIndex.mouseFxOverall,
  },
  ".rz-ontopfx": {
    position: "relative",
  },
});
