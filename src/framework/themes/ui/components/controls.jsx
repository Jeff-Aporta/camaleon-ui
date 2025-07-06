import React from "react";
import { Tooltip } from "@mui/material";

export function WaitSkeleton({ loading = false, ...rest }) {
  loading = +!!loading;
  return (
    <div className={["", "titiling pointer-waiting"][loading]}>
      <div className={["", "ghost filtering halfgray brightness-1-5"][loading]}>
        <div {...rest} />
      </div>
    </div>
  );
}

export function TooltipGhost(props) {
  return <Tooltip {...props} PopperProps={{ sx: { pointerEvents: "none" } }} />;
}
