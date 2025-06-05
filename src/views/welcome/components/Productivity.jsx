import React from "react";
import { Typography, Grid } from "@mui/material";
import { PaperP } from "@framework";
import {
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { fluidCSS } from "@framework";
import { ItemPromo } from "./$comun";

export default function Productivity() {
  const items = [
    {
      icon: (sz) => <SpeedIcon fontSize={sz} color="primary" />,
      label: "Optimización de procesos",
    },
    {
      icon: (sz) => <VisibilityIcon fontSize={sz} color="primary" />,
      label: "Visión en tiempo real",
    },
    {
      icon: (sz) => <BarChartIcon fontSize={sz} color="primary" />,
      label: "Reportes personalizados",
    },
  ];
  return (
    <PaperP sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Productividad y eficiencia
      </Typography>
      <hr />
      <br />
      <Grid container spacing={4} justifyContent="center">
        {items.map((item, i) => (
          <ItemPromo item={item} xs={12} sm={4} key={i} />
        ))}
      </Grid>
    </PaperP>
  );
}
