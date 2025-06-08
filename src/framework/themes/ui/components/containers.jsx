import React from "react";
import { Paper } from "@mui/material";
import { fluidCSS } from "../../../fluidCSS/index.js";

export function Hm({
  h_min = 20,
  h_max = 30,
  r = 1,
  className = "",
  ...props
} = {}) {
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          height: [h_min * r, h_max * r],
        })
        .end("Hm", "tw-balance", className)}
    />
  );
}

export function Design({
  className = "",
  fullw,
  fullh,
  hinherit,
  ...rest
} = {}) {
  fullw = fullw ? "full-w" : "";
  fullh = fullh ? "full-h" : "";
  hinherit = hinherit ? "h-inherit" : "";
  return (
    <div
      {...rest}
      className={`design ${fullw} ${fullh} ${hinherit} ${className}`}
    />
  );
}

export function Layer({
  className = "",
  fill,
  fullw,
  center,
  centralized,
  ...rest
} = {}) {
  fill = fill ? "fill" : "";
  fullw = fullw ? "full-w" : "";
  center = center ? "center" : "";
  centralized = centralized ? "centralized" : "";
  const centercentralized = center && centralized ? "center-centralized" : "";
  let buildClasses = [];
  buildClasses.push(fill);
  buildClasses.push(fullw);
  if (centercentralized) {
    buildClasses.push(centercentralized);
  } else {
    if (center) {
      buildClasses.push(center);
    }
    if (centralized) {
      buildClasses.push(centralized);
    }
  }

  return (
    <div {...rest} className={`layer ${buildClasses.join(" ")} ${className}`} />
  );
}

export function PaperLayer(props) {
  return PaperDesign({ ...props, type: "layer" });
}

export function PaperDesign({
  children,
  className = "",
  layerProps = {},
  designProps = {},
  p_min = 0,
  p_max = 0,
  hiddenflow,
  type = "design",
  ...props
}) {
  if (hiddenflow) {
    hiddenflow = "overflow-hidden";
  }
  return (
    <PaperP
      hm={false}
      p_min={p_min}
      p_max={p_max}
      {...props}
      className={`${type} ${hiddenflow} ${className}`}
    >
      <Design fullw fullh hinherit {...designProps}>
        {<div className="v-hidden">{children}</div>}
        <Layer fill {...layerProps}>
          {children}
        </Layer>
      </Design>
    </PaperP>
  );
}

export function DivM({
  pad,
  m_min = 5,
  m_max = 20,
  className = "",
  ...props
} = {}) {
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          [pad ? "padding" : "margin"]: [m_min, m_max],
        })
        .end("DivM", "tw-balance", className)}
    />
  );
}

export function PaperF({
  children,
  className = "",
  zOverall,
  hm = true,
  nobr = true,
  ...props
}) {
  if (nobr) {
    nobr = "br-0";
  }
  return (
    <Paper
      {...props}
      className={`PaperF tw-balance ${zOverall ? "z-overall" : ""}`}
    >
      {hm && <Hm />}
      <div className={className}>{children}</div>
      {hm && <Hm />}
    </Paper>
  );
}

export function PaperP({
  p_min = 3,
  p_max = 20,
  className = "",
  zOverall,
  children,
  nobr,
  hm = true,
  ...props
} = {}) {
  let nobrClass = "";
  if (nobr) {
    nobrClass = "br-0";
  }
  let zOverallClass = "";
  if (zOverall) {
    zOverallClass = "z-overall";
  }
  return (
    <Paper
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          Padding: [p_min, p_max],
        })
        .end("PaperP", nobrClass, "tw-balance", zOverallClass, className)}
    >
      {hm && <Hm />}
      {children}
      {hm && <Hm />}
    </Paper>
  );
}
