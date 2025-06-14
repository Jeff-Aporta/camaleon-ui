import { Color } from "../../rules/colors.js";

import {
  colorFilterDiscriminator,
  getLightFilter,
} from "../../../tools/utils.jsx";

import {
  linearGradient,
  ringGradient,
  circleGradient,
  radialGradient,
  toViewportPercent,
  holeCircleGradient,
} from "./paint.css.js";

import {
  getAdjacentPrimaryColor,
  getContrast,
  getTriadeColors,
} from "../../rules/manager.selected.js";

import { JS2CSS } from "../../../fluidCSS/JS2CSS/index.js";

export function newBackground({
  back_texture_css,
  startBg = [],
  endBg = [],
  style = ({ defaultbg }) => ({
    ...defaultbg,
  }),
}) {
  JS2CSS.insertStyle({
    id: "back-texture",
    ".back-texture": backtexture_styles(),
  });

  function backtexture_styles() {
    const { background, ...rest } = back_texture_css({
      colorFilterDiscriminator,
      getLightFilter,
      linearGradient,
      ringGradient,
      circleGradient,
      radialGradient,
      toViewportPercent,
      holeCircleGradient,
    });
    return {
      ...style({
        // defaultbg: colorFilterDiscriminator(getLightFilter()),
        colorFilterDiscriminator,
        getLightFilter,
      }),
      ...rest,
      background: [...startBg, background, ...endBg].join(","),
    };
  }
}

/**
 * Aplica el fondo por defecto con texturas, degradados y formas.
 */
export function applyDefaultBackground({
  color_anillo = "rgba(128, 128, 128, 0.05)",
  radio_anillo = 35,
  ...rest
} = {}) {
  const adjl = getAdjacentPrimaryColor({
    a: 20,
    n: 3,
  }).map((c) => c.rgb().array().join(","));

  const adjd = getAdjacentPrimaryColor({
    a: 40,
    n: 3,
    light: false,
  }).map((c) => `rgba(${c.rgb().array().join(",")},0.2)`);

  const color_circulo = `rgba(128, 128, 128, 0.1)`;
  let radio_agujero = (() => {
    const grosor = 7;
    return radio_anillo - grosor;
  })();
  radio_anillo = `max(${radio_anillo}dvw, 250px)`;
  radio_agujero = `max(${radio_agujero}dvw, 200px)`;

  return newBackground({
    ...rest,
    back_texture_css: ({
      linearGradient,
      ringGradient,
      circleGradient,
      radialGradient,
    }) => ({
      background: [
        linearGradient({
          angle: "to bottom",
          colors: [
            "transparent 70%",
            `rgba(${adjl[0]}, 0.2)`,
            `rgba(${adjl[1]}, 0.2) 98%`,
            `rgba(${adjl[2]}, 0.3) calc(100% - 20px)`,
          ],
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "30%",
          y: "30px",
        }),
        circleGradient({
          color: color_circulo,
          radius: `max(${20}dvw, 80px)`,
          x: "95%",
          y: "25%",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "5dvw",
          y: "5dvw",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "calc(20dvw + 50px)",
          y: "calc(40dvh + 50px)",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "10%",
          y: "60%",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "100%",
          y: "100%",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "70%",
          y: "80%",
        }),
        radialGradient({
          colors: [...adjd, "transparent"],
          radius: "max(70dvw, 600px)",
          x: "70%",
          y: "600px",
        }),
      ],
    }),
  });
}

/**
 * Aplica un fondo estilo portal con anillos rotativos y superposiciones.
 */
export function applyPortalBackground(options = {}) {
  return newBackground({
    ...options,
    back_texture_css: ({
      linearGradient,
      ringGradient,
      toViewportPercent,
      holeCircleGradient,
    }) => ({
      background: [
        ...[
          { a: 30, r: 30, ri: 4 },
          { a: 35, r: 30, ri: 6 },
          { a: 40, r: 30, ri: 8 },
          { a: 210, r: 30, ri: 4 },
          { a: 215, r: 30, ri: 6 },
          { a: 220, r: 30, ri: 8 },
        ].map(({ a, r, ri }) =>
          ringGradient({
            color: "hsla(180, 100.00%, 53.90%, 0.25)",
            holeRadius: ri + "px",
            radius: ri + 4 + `px`,
            x: `calc(${toViewportPercent(r)} * cos(${a}deg) + 50%)`,
            y: `calc(${toViewportPercent(r)} * sin(${a}deg) + 50%)`,
          })
        ),
        linearGradient({
          angle: "45deg",
          colors: [
            "hsla(120, 100.00%, 50.00%, 0.5)",
            "hsla(130, 100.00%, 90.00%, 0.30)",
            `transparent ${toViewportPercent(40)}`,
            `transparent ${toViewportPercent(60)}`,
            "hsla(0, 0.00%, 0.00%, 0.30)",
            "hsla(0, 0.00%, 0.00%, 0.50)",
            "hsla(0, 0.00%, 0.00%, 0.70)",
            "hsla(0, 0.00%, 0.00%, 0.30)",
            "hsla(220, 100.00%, 70%, 0.10)",
            "hsla(230, 100.00%, 80%, 0.40)",
            "hsla(240, 100.00%, 90%, 0.20)",
          ],
        }),
        holeCircleGradient({
          color: "rgba(255, 255, 255, 0.08)",
          radius: toViewportPercent(38),
          x: "center",
          y: "center",
        }),
        ringGradient({
          color: "hsla(170, 100.00%, 50.00%, 0.05)",
          holeRadius: toViewportPercent(33),
          radius: `calc(${toViewportPercent(33)} + 20px)`,
          x: "center",
          y: "center",
        }),
        ringGradient({
          color: "hsla(0, 0.00%, 100.00%, 0.08)",
          holeRadius: toViewportPercent(50),
          radius: toViewportPercent(51),
          x: "center",
          y: "center",
        }),
      ],
    }),
  });
}
