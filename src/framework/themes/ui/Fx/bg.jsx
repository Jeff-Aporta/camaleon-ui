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
    ".back-texture": b(),
  });

  function b() {
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
        defaultbg: colorFilterDiscriminator(getLightFilter()),
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
  color_anillo = "rgba(255,255,255, 0.03)",
  color_circulo = "rgba(186, 85, 211, 0.1)",
  colorBase = Color("rgb(86, 0, 199)"),
  radio_anillo = 35,
  ...rest
} = {}) {
  let radio_agujero = (() => {
    const grosor = 7;
    return radio_anillo - grosor;
  })();
  radio_anillo = `max(${radio_anillo}dvw, 250px)`;
  radio_agujero = `max(${radio_agujero}dvw, 200px)`;

  const arrayColorBase = colorBase.rgb().array();

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
            `rgba(${arrayColorBase.join(",")},0.2)`,
            `rgba(${arrayColorBase.join(",")},0.2) 98%`,
            `rgba(${arrayColorBase.join(",")},0.3) calc(100% - 20px)`,
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
          colors: [`rgba(20, 0, 70, 1)`, "transparent"],
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
            color: "rgba(20,255,255,0.25)",
            holeRadius: ri + "px",
            radius: ri + 4 + `px`,
            x: `calc(${toViewportPercent(r)} * cos(${a}deg) + 50%)`,
            y: `calc(${toViewportPercent(r)} * sin(${a}deg) + 50%)`,
          })
        ),
        linearGradient({
          angle: "45deg",
          colors: [
            "rgba(255,0,255,0.3)",
            "rgba(150,0,255,0.3)",
            `transparent ${toViewportPercent(40)}`,
            `transparent ${toViewportPercent(60)}`,
            "rgba(0, 0, 0, 0.3)",
            "rgba(0, 0, 0, 0.5)",
            "rgba(0, 0, 0, 0.7)",
            "rgba(0, 0, 0, 0.3)",
            "rgba(0,100,255,0.1)",
            "rgba(0,20,255,0.4)",
            "rgba(0,0,255,0.2)",
          ],
        }),
        holeCircleGradient({
          color: "rgba(255, 255, 255, 0.08)",
          radius: toViewportPercent(38),
          x: "center",
          y: "center",
        }),
        ringGradient({
          color: "rgba(255, 0, 255, 0.05)",
          holeRadius: toViewportPercent(33),
          radius: `calc(${toViewportPercent(33)} + 20px)`,
          x: "center",
          y: "center",
        }),
        ringGradient({
          color: "rgba(255, 255, 255, 0.08)",
          holeRadius: toViewportPercent(50),
          radius: toViewportPercent(51),
          x: "center",
          y: "center",
        }),
      ],
    }),
  });
}
