import { isDark } from "./manager.js";
import { Color } from "./colors.js";
import { clamp, map } from "../../tools/index.js";

export const registerThemes_PaletteGeneral = {};

/**
 * Clase base para definir paletas generales de componentes.
 * @class PaletteGeneral
 * @param {object} packLoadPalette - Objeto con propiedades de paleta a asignar.
 */
export class PaletteGeneral {
  constructor(packLoadPalette) {
    Object.assign(this, packLoadPalette);
    if (!this.name) {
      this.name = [Math.random().toString(36).slice(2)];
    }
    this.name.forEach((name) => {
      registerThemes_PaletteGeneral[name] = this;
    });
  }

  getbgstate(darkmode, state) {
    try {
      return this[["light", "dark"][+darkmode]]["palette"][state]["color"];
    } catch (e) {
      try {
        return this.colors(darkmode)[state].color;
      } catch (e) {}
    }
  }

  getbg(darkmode) {
    if (global.nullish(darkmode, isDark())) {
      return global.nullish(this.bg_dark, "black");
    }
    return global.nullish(this.bg_light, "white");
  }

  /**
   * Devuelve las propiedades de tipografía para la paleta.
   * @returns {object} Objeto con propiedades de tipografía.
   */
  typography() {
    return {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    };
  }

  /**
   * Devuelve las propiedades de componentes para la paleta.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con propiedades de componentes.
   */
  control_components(darkmode) {
    return {
      href: function (props, prepareProps) {
        const stayinGit = window["location"]["href"].includes("github.io");
        if (prepareProps) {
          props = prepareProps(props);
        }

        return global.nullish(
          () => simple(props),
          () => complex(props)
        );

        function complex({ view = "/", params = {} }) {
          const root = simple(view);
          params = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

          return [root, params]
            .filter(Boolean)
            .join(root.startsWith("?") ? "&" : "?");
        }

        function simple(url) {
          if (typeof url == "string") {
            return stayinGit ? `?view-id=${encodeURIComponent(url)}` : url;
          }
        }
      },
    };
  }

  /**
   * Devuelve las propiedades de componentes para la paleta.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @param {object} colors - Objeto con colores para la paleta.
   * @returns {object} Objeto con propiedades de componentes.
   */
  components({ darkmode, colors }) {
    const primary = colors.primary.color;
    let bgtooltip = primary[["darken", "lighten"][+darkmode]](0.3).saturate(-0.8);
    return {
      AccordionDetails: {
        root: {
          padding: 0,
        },
      },
      Paper: {
        root: {
          ...this.childs("AccordionDetails", {
            root: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }),
        },
      },
      Tooltip: {
        tooltip: {
          fontWeight: "bold",
          backgroundColor: bgtooltip.hex(),
          color: (() => {
            if (bgtooltip.isLight()) {
              return "#000000";
            } else {
              return "#FFFFFF";
            }
          })(),
        },
      },
    };
  }

  /**
   * Devuelve los colores para la paleta.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con colores para la paleta.
   */
  colors(darkmode) {
    const blanco = Color("white");
    const negro = Color("black");
    const color_contrast = [blanco, negro][+darkmode];
    return {
      cancel: {
        color: Color(["tomato", "crimson"][+darkmode]),
        text: blanco,
      },
      warning: {
        color: Color(["darkorange", "orange"][+darkmode]),
        text: color_contrast,
      },
      ok: {
        color: Color("#29A529"),
        text: blanco,
      },
      ...Object.entries(global.nullish(window.themeColors, {})).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            color: value,
            text: color_contrast,
          };
          return acc;
        },
        {}
      ),
    };
  }
}

/**
 * Clase que extiende PaletteGeneral para paletas monocromáticas.
 * @extends PaletteGeneral
 * @param {object} props - Propiedades para configurar la paleta.
 */
export class PaletteMonochrome extends PaletteGeneral {
  constructor({
    whiten = {
      default: () => 0.9,
      paper: () => 0.95,
    },
    blacken = {
      default: () => 0.85,
      paper: () => 0.7,
    },
    ...rest
  } = {}) {
    super(rest);
    if (!this.panda) {
      this.panda = false;
    }
    if (!this.bg_light) {
      this.bg_light = this.main_bright_color.toWhite(whiten.default());
    }
    if (!this.bg_dark) {
      this.bg_dark = this.main_color.toBlack(blacken.default());
    }

    this.light = this.createThemePalette({
      darkmode: false,
      palette: this,
      background: {
        default: this.getbg(false),
        paper: this.main_bright_color.toWhite(whiten.paper()).hex(),
      },
    });

    this.dark = this.createThemePalette({
      darkmode: true,
      palette: this,
      background: {
        default: this.getbg(true),
        paper: this.main_color.toBlack(blacken.paper()).hex(),
      },
    });
  }

  getbg_pair() {
    if (this.panda) {
      return { bg_light: this.bg_dark, bg_dark: this.bg_light };
    }
    return { bg_light: this.bg_light, bg_dark: this.bg_dark };
  }

  getbg(darkmode) {
    const { bg_light, bg_dark } = this.getbg_pair();
    const bgs = [
      global.nullish(bg_light.hex(), "#FFFFFF"),
      global.nullish(bg_dark.hex(), "#000000"),
    ];
    let state = global.nullish(darkmode, isDark());
    if (this.panda) {
      state = !state;
    }
    return bgs[+state];
  }

  getbg_complement(darkmode) {
    darkmode = global.nullish(darkmode, isDark());
    return this.getbg(!darkmode);
  }

  /**
   * Devuelve las propiedades de componentes para la paleta.
   * @param {object} constants_color - Objeto con colores constantes.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con propiedades de componentes.
   */
  componentsMUI({ constants_color, darkmode }) {
    const colors = {
      ...constants_color,
      ...this.colors(darkmode),
    };
    return {
      ...this.components({ colors, darkmode }),
      primary: {
        color: Color("white").hex(),
        "&:hover": {
          backgroundColor: colors.primary.color.hex(),
        },
      },
      root: {
        margin: "0",
      },
    };
  }
}

/**
 * Clase que extiende PaletteMonochrome para paletas monocromáticas con colores personalizados.
 * @extends PaletteMonochrome
 * @param {object} props - Propiedades para configurar la paleta.
 */
export class PaletteBaseMonochrome extends PaletteMonochrome {
  constructor(props) {
    super(props);
  }

  /**
   * Devuelve las propiedades de componentes para la paleta.
   * @param {object} constants_color - Objeto con colores constantes.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con propiedades de componentes.
   */
  componentsMUI({ constants_color, darkmode }) {
    const colors = {
      ...constants_color,
      ...this.colors(darkmode),
      ...global.nullish(window.themeColors, {}),
    };

    /**
     * Genera un objeto con propiedades de color para un componente.
     * @param {object} c - Objeto con propiedades de color.
     * @returns {object} Objeto con propiedades de color.
     */
    function colorized(c) {
      const { color, text } = c;
      if (!color || !text) {
        return;
      }
      return {
        backgroundColor: [color.hex(), color.darken(0.2).hex()][
          Number(darkmode)
        ],
        color: text.hex(),
        "&:hover": {
          backgroundColor: color[["darken", "lighten"][+darkmode]](0.2).hex(),
        },
      };
    }

    return {
      ...super.componentsMUI({ colors, darkmode }),
      Button: {
        ...Object.entries(colors)
          .map(([k, v]) => {
            return {
              [k]: colorized(v),
            };
          })
          .filter(Boolean)
          .reduce((a, b) => ({ ...a, ...b }), {}),
      },
    };
  }

  adjacentFactor() {
    let tono = this.main_color.hue();
    let factor = tono < 180 ? 1 : -1;
    if (tono > 240) {
      factor = 1;
    }
    const complement = tono > 180 ? map(tono, 180, 360, -180, 0) : tono;
    const hueGreen = 120;
    const hueOrange = 30;
    const hueYellow = 60;
    const hueCyan = 180;
    const hueMagenta = 300;
    const tolerance = 29;
    const diffYellow = Math.abs(hueYellow - tono);
    const diffCyan = Math.abs(hueCyan - tono);
    const diffMagenta = Math.abs(hueMagenta - tono);
    const diffOrange = Math.abs(hueOrange - tono);
    const diffRed = Math.abs(complement);
    const diffGreen = Math.abs(hueGreen - tono);
    if (diffRed <= tolerance) {
      factor *= map(diffRed / tolerance, 0, 1, 0.05, 1);
    }
    if (diffGreen <= tolerance) {
      factor *= map(diffGreen / tolerance, 0, 1, 0.05, 1);
    }
    if (diffOrange <= tolerance) {
      factor *= diffOrange / tolerance;
    }
    if (diffYellow <= tolerance) {
      factor *= diffYellow / tolerance;
    }
    if (diffCyan <= tolerance) {
      factor *= diffCyan / tolerance;
    }
    if (diffMagenta <= tolerance) {
      factor *= map(diffMagenta / tolerance, 0, 1, 0.3, 1);
    }
    return factor;
  }

  getAdjacentPrimaryColor({ a = 15, n = 1, light = true } = {}) {
    const factor = this.adjacentFactor() * (light ? 1 : -1);
    const colorPrimary = this.getPrimaryColor();
    return Array.from({ length: n }, (_, n) => {
      const colorRotate = colorPrimary.rotate((n + 1) * a * factor); // adjacent
      return colorRotate;
    });
  }

  getPrimaryColor() {
    return this.main_color.saturate(0.3);
  }

  getTriadeColors(primary) {
    if (!primary) {
      primary = this.getPrimaryColor();
    }
    const primary2 = primary.rotate(120); // right triade
    const primary3 = primary.rotate(240); // left triade
    return [primary, primary2, primary3];
  }

  getContrast(primary) {
    if (!primary) {
      primary = this.getPrimaryColor();
    }
    return primary.rotate(180);
  }

  /**
   * Devuelve los colores para la paleta.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con colores para la paleta.
   */
  colors(darkmode) {
    const [blanco, negro] = [Color("white"), Color("black")];
    const colors_contrast = [blanco, negro];
    const color_contrast = colors_contrast[+darkmode];
    const color_uncontrast = colors_contrast[1 - darkmode];

    const primary = this.getPrimaryColor();

    const [, primary2, primary3] = this.getTriadeColors(primary);

    const contrast = this.getContrast(primary); // complementary

    const [
      [primaryl1, primaryl2, primaryl3, primaryl4],
      [primaryd1, primaryd2, primaryd3, primaryd4],
    ] = [
      this.getAdjacentPrimaryColor({ n: 4 }), // adjacents lights
      this.getAdjacentPrimaryColor({ n: 4, light: false }), // adjacents darks
    ];
    const secondary = primary.toGray(0.5);

    function genObjMui(props) {
      const retorno = {};
      Object.entries(props).forEach(([k, v]) => {
        retorno[k] = {
          color: v,
          text: color_contrast,
        };
      });
      return retorno;
    }

    return {
      ...super.colors(darkmode),
      ...genObjMui({
        primary,
        contrast,
        primary2,
        primary3,
        primaryl1,
        primaryl2,
        primaryl3,
        primaryl4,
        primaryd1,
        primaryd2,
        primaryd3,
        primaryd4,
        secondary,
      }),
    };
  }

  /**
   * Carga y aplica la paleta seleccionada.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   */
  willLoad(darkmode) {
    const k = this.scrollname || this.name_color;
    const kl = k.toLowerCase();
    const ls = this.MUIDefaultValues.loadScrollsbar;
    const l = ls[k] || ls[kl];
    if (!l) {
      console.error(
        "WillLoad: No se encontró la paleta seleccionada",
        this.name_color,
        this.scrollname,
        this.scrollname || this.name_color,
        Object.keys(this.MUIDefaultValues.loadScrollsbar)
      );
      return;
    }
    l(darkmode);
  }

  /**
   * Devuelve las propiedades de componentes para la paleta.
   * @param {object} colors - Objeto con colores para la paleta.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con propiedades de componentes.
   */
  componentsMUI({ colors, darkmode }) {
    const {
      Button = {},
      Typography = {},
      ...s
    } = super.componentsMUI({ colors, darkmode });

    const retorno = {
      ...s,
      Typography: {
        ...Typography,
        primary: (() => {
          const { primary = {} } = Typography;
          const bg = this.getbg(darkmode);
          if (darkmode) {
            if (this.main_color.isDark() && Color(bg).isDark()) {
              this.main_color = this.main_color.invertnohue();
            }
          } else {
            if (this.main_color.isLight() && Color(bg).isLight()) {
              this.main_color = this.main_color.invertnohue();
            }
          }

          return {
            ...primary,
            color: this.main_color.hex(),
          };
        })(),
      },
      Button: {
        ...Button,
        ...[
          "primary",
          "primaryi",
          "primary2",
          "primary3",
          "primaryl1",
          "primaryl2",
          "primaryl3",
          "primaryd1",
          "primaryd2",
          "primaryd3",
          "secondary",
          "secondaryi",
          "secondary2",
          "secondary3",
          "secondaryc1",
          "secondaryc2",
          "secondaryc3",
          "secondarync1",
          "secondarync2",
          "secondarync3",
          "error",
          "warning",
          "info",
          "success",
        ]
          .map((state) => {
            if (!Button[state]) {
              Button[state] = {};
            }
            let color = Color("white");
            const bg = this.getbgstate(darkmode, state);
            if (bg && Color(bg).isLight()) {
              color = Color("black");
            }
            return {
              [state]: {
                ...Button[state],
                color: color.hex(),
              },
            };
          })
          .reduce((acc, r) => ({ ...acc, ...r }), {}),
      },
    };

    return retorno;
  }
}
