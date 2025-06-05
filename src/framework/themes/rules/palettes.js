import { isDark } from "./manager.js";
import { Color } from "./colors.js";

export const registerThemes_PaletteGeneral = {};

/**
 * Clase base para definir paletas generales de componentes.
 * @class PaletteGeneral
 * @param {object} packLoadPalette - Objeto con propiedades de paleta a asignar.
 */
export class PaletteGeneral {
  constructor(packLoadPalette) {
    Object.assign(this, packLoadPalette);
    this.name ??= [Math.random().toString(36).slice(2)];
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
    if (darkmode ?? isDark()) {
      return this.bg_dark ?? "black";
    }
    return this.bg_light ?? "white";
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

        return simple(props) ?? complex(props);

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
          backgroundColor: [primary.darken(0.6), primary][+darkmode].hex(),
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
      ...Object.entries(window.themeColors ?? {}).reduce(
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
      default: () => 0.7,
      paper: () => 0.9,
    },
    blacken = {
      default: () => 0.9,
      paper: () => 0.85,
    },
    ...rest
  } = {}) {
    super(rest);

    this.panda ??= false;
    this.bg_light ??= this.main_bright_color.toWhite(whiten.default());
    this.bg_dark ??= this.main_color.toBlack(blacken.default());

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
    if (darkmode ?? isDark()) {
      return bg_dark.hex() ?? "#000000";
    }
    return bg_light.hex() ?? "#FFFFFF";
  }

  getbg_complement(darkmode) {
    darkmode ??= isDark();
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
      ...(window.themeColors ?? {}),
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

    let primary = this.main_color;
    const secondary = primary.toGray(0.5);

    return {
      ...super.colors(darkmode),
      primary: {
        color: primary,
        text: color_contrast,
      },
      secondary: {
        color: secondary,
        text: color_contrast,
      },
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
        ...["primary", "secondary", "error", "warning", "info", "success"]
          .map((state) => {
            Button[state] ??= {};
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
