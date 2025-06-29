import { Main } from "@theme/main";
import React from "react";
import { getCommonRoot } from "@framework";

const { BuildSectionDoc } = getCommonRoot();

const cards = [
  {
    title: "index.js",
    description: "Exporta las herramientas principales.",
    href: "/doc/tools/index",
  },
  {
    title: "math/index.js",
    description:
      "Punto de entrada de funciones matemáticas en src/framework/tools/math/index.js.",
    href: "/doc/tools/math/index.js",
  },
  {
    title: "math/math.js",
    description: "Funciones básicas en src/framework/tools/math/math.js.",
    href: "/doc/tools/math/math.js",
  },
  {
    title: "math/math.vector.js",
    description:
      "Operaciones vectoriales en src/framework/tools/math/math.vector.js.",
    href: "/doc/tools/math/math.vector.js",
  },
  {
    title: "time.js",
    description: "Funciones de manejo de tiempo.",
    href: "/doc/tools/time",
  },
  {
    title: "tools.js",
    description: "Herramientas genéricas.",
    href: "/doc/tools/tools",
  },
  {
    title: "utils.jsx",
    description: "Utilitarios de React.",
    href: "/doc/tools/utils",
  },
];

export default function ToolsDoc() {
  return (
    <BuildSectionDoc
      namekey="tools"
      title="Herramientas"
      description="Utilidades y herramientas varias del framework."
      cards={cards}
      href="/doc/tools"
    />
  );
}
