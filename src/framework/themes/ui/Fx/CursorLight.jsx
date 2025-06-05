import React, { Component } from "react";

import { isDark, getThemeName } from "../../rules/manager.js";

import { fluidCSS } from "../../../fluidCSS/index.js";
import { JS2CSS } from "../../../fluidCSS/JS2CSS/index.js";

import { colorFilterDiscriminator } from "../../../tools/utils.jsx";

import {
  addListenerIn,
  isKeyPressed,
  touchDetected,
  mouseLeftPressed,
} from "../../../events/events.base.js";

import { zIndex } from "../../rules/constants.js";

export class CursorLight extends Component {
  static ready = false;

  constructor(props) {
    super(props);
    const fn = CursorLight.interactivity;
    addListenerIn(
      ["keyup", "keydown", "mousemove", "mousedown", "mouseup", "resize"],
      {
        fn,
      }
    );
  }

  componentDidMount() {
    CursorLight.ready = true;
  }

  render() {
    const themeName = getThemeName();
    if (!isDark()) {
      return <></>;
    }

    return (
      <>
        <CursorEffectLight
          colors={["white", "transparent 70%"]}
          mixBlendMode={"overlay"}
          opacity="0.3"
          zIndex={zIndex.mouseFxBackall}
          {...colorFilterDiscriminator()}
        />
        <CursorEffectLight
          colors={["white", "transparent 50%"]}
          mixBlendMode="overlay"
          opacity="0.1"
          zIndex={zIndex.mouseFxOverall}
          {...colorFilterDiscriminator()}
        />
      </>
    );

    /**
     * Componente para renderizar efecto ligero de cursor.
     * @param {{children: React.ReactNode, colors: string[], opacity?: number, mixBlendMode?: string}} props
     */
    function CursorEffectLight({ children, colors, ...styleProps }) {
      return (
        <div
          className={fluidCSS()
            .withTouchscreen({
              display: "none",
            })
            .end([
              "cursor-effect",
              "p-fixed",
              "mouse-in-xy",
              "centraliced",
              "turnoff-when-mouse-left-pressed",
              "minside-win",
              "ghost",
            ])}
          data-opacity={styleProps.opacity ?? 1}
          style={{
            transition: "opacity 0.2s",
            background: `radial-gradient(
                  circle at center, 
                  ${colors.join(", ")}
                )`,
            ...styleProps,
          }}
        />
      );
    }
  }

  static interactivity() {
    if (!CursorLight.ready) {
      return;
    }
    const { Control } = isKeyPressed();
    CursorLight.allCursorEffects.forEach((cursorEffect) => {
      cursorEffect.style.opacity = (() => {
        if (touchDetected() || mouseLeftPressed() || Control) {
          return "0";
        } else {
          return cursorEffect.dataset.opacity;
        }
      })();
    });
  }

  static get allCursorEffects() {
    return document.querySelectorAll(".cursor-effect") ?? [];
  }
}
