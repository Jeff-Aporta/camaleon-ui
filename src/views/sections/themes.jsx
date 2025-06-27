import React from "react";
import { BuildSectionDoc } from "../$repetitive";

const cards = [
  // Nivel 0 (archivos raíz) orden alfabético
  { title: "colors.js", description: "Funciones y paletas de colores en src/framework/themes/rules/colors.js.", href: "/doc/themes/rules/colors.js" },
  { title: "constants.js", description: "Constantes de tema en src/framework/themes/ui/constants.js.", href: "/doc/themes/ui/constants.js" },
  { title: "loader.jsx", description: "Componente de carga en src/framework/themes/rules/loader.jsx.", href: "/doc/themes/rules/loader.jsx" },
  { title: "manager.js", description: "Gestión y lógica de reglas en src/framework/themes/rules/manager.js.", href: "/doc/themes/rules/manager.js" },
  { title: "manager.selected.js", description: "Lógica de selección en src/framework/themes/rules/manager.selected.js.", href: "/doc/themes/rules/manager.selected.js" },
  { title: "palettes.js", description: "Definición de paletas en src/framework/themes/rules/palettes.js.", href: "/doc/themes/rules/palettes.js" },
  { title: "palettes.polychroma.js", description: "Paletas polychroma en src/framework/themes/rules/palettes.polychroma.js.", href: "/doc/themes/rules/palettes.polychroma.js" },
  { title: "router.jsx", description: "Configuración de enrutamiento en src/framework/themes/router.jsx.", href: "/doc/themes/router" },
  { title: "scrollbar.js", description: "Estilos de scrollbar en src/framework/themes/rules/scrollbar.js.", href: "/doc/themes/rules/scrollbar.js" },
  { title: "scss", description: "Archivos SCSS y mixins en src/framework/themes/rules/scss.", href: "/doc/themes/rules/scss" },
  { title: "templates.jsx", description: "Plantillas JSX de tema en src/framework/themes/ui/templates.jsx.", href: "/doc/themes/ui/templates.jsx" },
  // Nivel 1 (subcarpetas)
  { title: "components/containers.jsx", description: "Contenedor genérico en src/framework/themes/ui/components/containers.jsx.", href: "/doc/themes/ui/components/containers.jsx" },
  { title: "components/dialog.jsx", description: "Diálogo reutilizable en src/framework/themes/ui/components/dialog.jsx.", href: "/doc/themes/ui/components/dialog.jsx" },
  { title: "components/index.js", description: "Punto de entrada de componentes en src/framework/themes/ui/components/index.js.", href: "/doc/themes/ui/components/index.js" },
  { title: "components/recurrent.jsx", description: "Componente recurrente en src/framework/themes/ui/components/recurrent.jsx.", href: "/doc/themes/ui/components/recurrent.jsx" },
  { title: "components/switch.jsx", description: "Switch temático en src/framework/themes/ui/components/switch.jsx.", href: "/doc/themes/ui/components/switch.jsx" },
  { title: "Fx/back-texture.jsx", description: "Generador de texturas de fondo en src/framework/themes/ui/Fx/back-texture.jsx.", href: "/doc/themes/ui/Fx/back-texture.jsx" },
  { title: "Fx/bg.js", description: "Lógica de fondo en src/framework/themes/ui/Fx/bg.js.", href: "/doc/themes/ui/Fx/bg.js" },
  { title: "Fx/CursorLight.jsx", description: "Componente CursorLight en src/framework/themes/ui/Fx/CursorLight.jsx.", href: "/doc/themes/ui/Fx/CursorLight.jsx" },
  { title: "Fx/index.js", description: "Punto de entrada de FX en src/framework/themes/ui/Fx/index.js.", href: "/doc/themes/ui/Fx/index.js" },
  { title: "Fx/paint.css.js", description: "Lógica de pintura CSS en src/framework/themes/ui/Fx/paint.css.js.", href: "/doc/themes/ui/Fx/paint.css.js" },
];

export default function ThemesDoc() {
  return (
    <BuildSectionDoc
      namekey="themes"
      title="Temas"
      description="Gestión de temas, componentes UI y reglas SCSS."
      cards={cards}
      href="/doc/themes"
    />
  );
}
