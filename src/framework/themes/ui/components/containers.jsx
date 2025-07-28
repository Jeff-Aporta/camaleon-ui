import React from "react";
import { Paper } from "@mui/material";
import { fluidCSS } from "../../../fluidCSS/index.js";

export function Hm({
  h_min = 15,
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
        .end("Hm", className)}
    />
  );
}

export function Design({
  className = "",
  fullw,
  fullh,
  hinherit,
  hiddenflow,
  ghost,
  ...rest
} = {}) {
  ({ fullw, fullh, hinherit, hiddenflow, ghost } = inferSuggar({
    fullw,
    fullh,
    hinherit,
    hiddenflow,
    ghost,
  }));
  return (
    <div
      {...rest}
      className={[
        "design",
        className,
        fullw,
        fullh,
        hiddenflow,
        hinherit,
        ghost,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export function Layer({
  className = "",
  fill,
  fullw,
  center,
  centralized,
  hiddenflow,
  hinherit,
  centercentralized,
  ghost,
  ...rest
} = {}) {
  ({
    hiddenflow,
    fill,
    fullw,
    center,
    centralized,
    centercentralized,
    ghost,
    hinherit,
  } = inferSuggar({
    hiddenflow,
    fill,
    fullw,
    center,
    centralized,
    hinherit,
    centercentralized,
    ghost,
  }));

  return (
    <div
      {...rest}
      className={[
        "layer",
        className,
        fill,
        fullw,
        hiddenflow,
        hinherit,
        ghost,
        ...[[center, centralized], [centercentralized]][+!!centercentralized],
      ]
        .filter(Boolean)
        .join(" ")}
    />
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
  ({ hiddenflow } = inferSuggar({ hiddenflow }));
  return (
    <PaperP
      hm={false}
      p_min={p_min}
      p_max={p_max}
      {...props}
      balance={false}
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
  pad = true,
  m_min = 5,
  m_max = 20,
  className = "",
  balance = false,
  ...props
} = {}) {
  ({ balance } = inferSuggar({ balance }));
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          [pad ? "padding" : "margin"]: [m_min, m_max],
        })
        .end("DivM", balance, className)}
    />
  );
}

function inferSuggar({
  hm,
  zOverall,
  nobr,
  balance,
  hiddenflow,
  fill,
  fullw,
  center,
  centralized,
  centercentralized,
  hinherit,
  rhm,
  ghost,
}) {
  nobr = ["", "br-0"][+!!nobr];
  zOverall = ["", "z-ontopall"][+!!zOverall];
  hm = ["", <Hm r={rhm} />][+!!hm];
  balance = ["", "tw-balance"][+!!balance];
  hiddenflow = ["", "overflow-hidden"][+!!hiddenflow];
  fill = ["", "fill"][+!!fill];
  fullw = ["", "full-w"][+!!fullw];
  center = ["", "center"][+!!center];
  centralized = ["", "centralized"][+!!centralized];
  centercentralized = ["", "center-centralized"][
    +!!((center && centralized) || centercentralized)
  ];
  hinherit = ["", "h-inherit"][+!!hinherit];
  ghost = ["", "ghost"][+!!ghost];
  return {
    nobr,
    zOverall,
    hm,
    balance,
    hiddenflow,
    fill,
    fullw,
    center,
    centralized,
    centercentralized,
    hinherit,
    ghost,
  };
}

export function PaperF({
  children,
  className = "",
  zOverall,
  rhm,
  hm = false,
  nobr = true,
  balance = true,
  ...props
}) {
  ({ nobr, zOverall, hm, balance } = inferSuggar({
    hm,
    zOverall,
    rhm,
    nobr,
    balance,
  }));
  return (
    <Paper {...props} className={`PaperF ${balance} ${zOverall} ${nobr}`}>
      {hm}
      <div className={className}>{children}</div>
      {hm}
    </Paper>
  );
}

export function PaperP({
  p_min = 5,
  p_max = 10,
  className = "",
  pad,
  zOverall,
  children,
  nobr,
  rhm,
  hm = false,
  balance = true,
  ...props
} = {}) {
  ({ nobr, zOverall, hm, balance } = inferSuggar({
    hm,
    zOverall,
    rhm,
    nobr,
    balance,
  }));
  switch (pad) {
    case "small":
      p_min = 2;
      p_max = 5;
      break;
    case "medium":
      p_min = 5;
      p_max = 10;
      break;
    case "large":
      p_min = 10;
      p_max = 20;
      break;
    default:
      break;
  }
  return (
    <Paper
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          Padding: [p_min, p_max],
        })
        .end("PaperP", nobr, balance, zOverall, className)}
    >
      {hm}
      {children}
      {hm}
    </Paper>
  );
}

export function ReserveLayer({ children, ...props }) {
  return (
    <>
      <Reserveme>{children}</Reserveme>
      <Layer {...props}>{children}</Layer>
    </>
  );
}

export function Reserveme({ children }) {
  return <div className="ghost hidden">{children}</div>;
}
