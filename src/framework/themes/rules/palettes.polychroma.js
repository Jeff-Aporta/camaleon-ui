import {
  PaletteBaseMonochrome,
  registerThemes_PaletteGeneral,
} from "./palettes.js";

import { Checkbox, Input } from "@mui/material";
import { getAllColors } from "./colors.js";
import { paletteLoader, registerColors } from "./manager.js";
import { scrollbarColors } from "./scrollbar.js";

/**
 * Clase que extiende PaletteBaseMonochrome para paletas políchromáticas.
 * @extends PaletteBaseMonochrome
 * @param {object} props - Propiedades para configurar la paleta.
 */
export class Polychroma extends PaletteBaseMonochrome {
  constructor(props) {
    super(props);
  }

  /**
   * Devuelve las propiedades de componentes para la paleta.
   * @param {boolean} darkmode - Indica si se está en modo oscuro.
   * @returns {object} Objeto con propiedades de componentes.
   */
  control_components(darkmode) {
    const enfasis_input = [this.name_color, this.name_contrast][+darkmode];
    const themeComponents = super.control_components(darkmode);
    const themeHref = themeComponents.href;
    return {
      ...themeComponents,
      href: (props) => {
        const hrefManagement = window.hrefManagement ?? ((x) => x);
        return themeHref(hrefManagement(props));
      },
      enfasis_input,
      themized: {
        Checkbox(props) {
          return <Checkbox color={enfasis_input} {...props} />;
        },
        Input(props) {
          return <Input color={enfasis_input} {...props} />;
        },
      },
    };
  }
}

export class Pandachrome extends Polychroma {
  constructor(props) {
    super(props);
  }
}

function inferPropsThemePolychroma({
  name,
  label,
  panda,
  whiten,
  blacken,
  color = {},
  contrast = {},
  scroll = {},
  bright_color = {},
}) {
  const keyColor = Object.keys(color)[0];
  const keyContrast = Object.keys(contrast)[0] ?? keyColor + "Accent";
  const keyScroll = Object.keys(scroll)[0];
  const keyBrightColor = Object.keys(bright_color)[0] ?? keyColor + "Light";
  return {
    name,
    label,
    panda,
    scrollname: keyScroll ?? keyColor,
    main_color: window.themeColors[keyColor],
    name_color: keyColor,
    constrast_color: window.themeColors[keyContrast],
    name_contrast: keyContrast,
    main_bright_color: window.themeColors[keyBrightColor],
    name_bright_color: keyBrightColor,
    whiten,
    blacken,
    ...paletteLoader,
  };
}

function createPolychroma({ color, label, name = [], whiten, blacken }) {
  const { createThemeInclude } = window;
  const keyColor = Object.keys(color)[0];
  normalchrome();
  pandachrome();

  function propsConstructor({ panda = false } = {}) {
    return {
      ...inferPropsThemePolychroma({
        color,
        panda,
        label,
        name,
        whiten,
        blacken,
      }),
    };
  }

  function include() {
    const retorno = (() => {
      const checkInclude = createThemeInclude && createThemeInclude.length > 0;
      if (checkInclude) {
        return createThemeInclude.some((x) => name.includes(x));
      }
      return true;
    })();
    return retorno;
  }

  function pandachrome() {
    name = name.map((x) => x + "Panda");
    label = label + " (Panda)";
    if (include()) {
      new (class extends Pandachrome {
        constructor() {
          super(propsConstructor({ panda: true }));
        }
      })();
    }
  }

  function normalchrome() {
    name.push(keyColor);
    if (include()) {
      new (class extends Polychroma {
        constructor() {
          super(propsConstructor());
        }
      })();
    }
  }
}

export function initializeThemesPolychroma() {
  const especial = {
    tomato: {
      label: "Tomate",
      whiten: { default: () => 0.7, paper: () => 0.9 },
      blacken: {
        default: () => 0.8,
        paper: () => 0.6,
      },
    },
    crimson: {
      label: "Carmín",
    },
    purple: {
      label: "Purpura",
    },
    springGreen: {
      label: "Primavera",
    },
    skyGreen: {
      label: "Cielo",
    },
    lemonGreen: {
      label: "Limón",
    },
    pink: {
      label: "Rosa",
    },
    teal: {
      label: "Turquesa",
    },
    navy: {
      label: "Marino",
    },
    magenta: {
      label: "Magenta",
    },
    cyan: {
      label: "Cian",
    },
    brown: {
      label: "Marrón",
    },
    violet: {
      label: "Violeta",
    },
    olive: {
      label: "Oliva",
    },
    amber: {
      label: "Ámbar",
    },
    green: {
      label: "Verde",
    },
    blue: {
      label: "Azul",
    },
    militaryGreen: {
      label: "Militar",
    },
    aquaBlue: {
      label: "Agua",
    },
    red: {
      label: "Rojo",
    },
    yellow: {
      label: "Amarillo",
    },
    gray: {
      label: "Gris",
    },
    orange: {
      label: "Naranja",
    },
  };
  Object.entries(window.themeColors).forEach(([key, value]) => {
    if (["Light", "Accent"].some((x) => key.endsWith(x))) {
      return;
    }
    if (["black", "white"].some((x) => key.startsWith(x))) {
      return;
    }

    let E = especial[key];
    let Nombre;
    let whiten;
    let blacken;

    if (E) {
      Nombre = E.label;
      whiten = E.whiten;
      blacken = E.blacken;
    } else {
      Nombre = key;
    }

    createPolychroma({
      color: { [key]: value },
      label: Nombre,
      whiten,
      blacken,
    });
  });
}

export function initializeThemeColors(otherColors = {}) {
  registerColors({ ...getAllColors(), ...otherColors });
  initializeThemesPolychroma();
  Object.entries(registerThemes_PaletteGeneral).forEach(([key, value]) => {
    paletteLoader.MUIDefaultValues[key] = value;
  });

  scrollbarColors(paletteLoader);
}
