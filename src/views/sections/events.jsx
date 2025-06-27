import React from "react";
import { BuildSectionDoc } from "../$repetitive";
import { href } from "@framework";

const cards = [
  {
    title: "events.base.js",
    description: "Definición de la clase base y estructuras de eventos.",
    href: "/doc/events/base",
  },
  {
    title: "events.gestures.js",
    description: "Reconocimiento y manejo de gestos táctiles.",
    href: "/doc/events/gestures",
  },
  {
    title: "events.ids.js",
    description: "Gestión de identificadores únicos para eventos.",
    href: "/doc/events/ids",
  },
  {
    title: "events.listeners.js",
    description: "Registro y emisión de listeners de eventos.",
    href: "/doc/events/listeners",
  },
  {
    title: "index.js (Eventos)",
    description: "Punto de entrada que agrupa e exporta la API de eventos.",
    href: "/doc/events/index",
  },
];

export default function EventsDoc() {
  return (
    <BuildSectionDoc
      namekey="events"
      title="Eventos"
      description="El módulo de eventos gestiona la lógica y el flujo de eventos de la UI."
      cards={cards}
      href="/doc/events"
    />
  );
}
