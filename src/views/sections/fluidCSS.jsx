import { Main } from "@theme/main";
import React from "react";
import { BuildSectionDoc } from "../$repetitive";

const cards = [
  {
    title: "context.base.js",
    description: "Funciones base de contexto de estilos.",
    href: "/doc/fluidCSS/context.base",
  },
  {
    title: "context.css.html.js",
    description: "Manejo de salida CSS y templates HTML.",
    href: "/doc/fluidCSS/context.css.html",
  },
  {
    title: "context.js",
    description: "Lógica principal de contextos de estilo.",
    href: "/doc/fluidCSS/context",
  },
  {
    title: "context.operators.js",
    description: "Operadores para manipulación de propiedades de estilo.",
    href: "/doc/fluidCSS/context.operators",
  },
  {
    title: "index.js",
    description: "Punto de entrada para el paquete FluidCSS.",
    href: "/doc/fluidCSS/index",
  },
  {
    title: "style.js",
    description: "Funciones para generar reglas CSS.",
    href: "/doc/fluidCSS/style",
  },
  {
    title: "vars.js",
    description: "Definición de variables CSS reutilizables.",
    href: "/doc/fluidCSS/vars",
  },
  {
    title: "JS2CSS/index.js",
    description: "Punto de entrada del módulo JS2CSS.",
    href: "/doc/fluidCSS/JS2CSS/index.js",
  },
  {
    title: "JS2CSS/insertStyle.js",
    description: "Inserta estilos dinámicamente.",
    href: "/doc/fluidCSS/JS2CSS/insertStyle.js",
  },
  {
    title: "JS2CSS/parceCSS.js",
    description: "Parsea cadenas CSS.",
    href: "/doc/fluidCSS/JS2CSS/parceCSS.js",
  },
  {
    title: "JS2CSS/vars.js",
    description: "Variables globales de JS2CSS.",
    href: "/doc/fluidCSS/JS2CSS/vars.js",
  },
];

export default function FluidCSSDoc() {
  return (
    <BuildSectionDoc
      namekey="fluidCSS"
      title="FluidCSS"
      description="FluidCSS proporciona utilidades para generar estilos CSS dinámicos a partir de JS."
      cards={cards}
      href="/doc/fluidCSS"
    />
  );
}
