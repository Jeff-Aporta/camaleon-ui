import React from "react";
import { Grid, Box, Typography, Button, Link } from "@mui/material";
import { PaperP, Hm } from "@framework";
import { ImageLocal } from "@recurrent";
import {
  JS2CSS,
  linearGradient,
  Color,
  getSelectedPalette,
  fdhue,
  map,
  clamp,
  lerp,
  solid,
  isDark,
  fluidCSS,
  PaintBG,
} from "@framework";

export default function Hero() {
  const p = getSelectedPalette();
  let bg = Color(p.palette.background.paper);
  let bgop = `rgba(${[...bg.rgb().array(), 0.75].join(", ")})`;
  const colors_shadow = [
    bg[["toWhite", "toBlack"][+isDark()]](0.5).hex(),
    "transparent",
  ];
  return (
    <PaperP
      elevation={0}
      sx={{ py: 8 }}
      className={[
        "br-0",
        "design",
        "min-h-80vh",
        "d-center-col",
        "overflow-hidden",
      ].join(" ")}
    >
      <Box
        component="img"
        className="layer fill fit-cover oleft otop toleft totop scale-1-5"
        src="img/ilustrations/bgbanner.svg"
        style={{
          opacity: 0.25,
          filter: fdhue(bg, window.themeColors.cyan),
        }}
      />
      <div
        className="layer fill bg-paperP"
        style={{
          background: PaintBG()
            .linearGradient({
              angle: "to right top",
              colors: colors_shadow,
            })
            .end(),
        }}
      />
      <Hm />
      <Grid container spacing={4} alignItems="center">
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: { xs: "flex", md: "block" },
            flexDirection: { xs: "column", md: "row" },
            textAlign: { xs: "center", md: "left" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography variant="h2" gutterBottom>
            Todo tu negocio en una sola plataforma
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Simplifica, automatiza y acelera tus procesos con Avatar
          </Typography>
          <div>
            <Button variant="contained" size="large">
              Empieza ahora
            </Button>
          </div>
          <br />
          <Box mt={2}>
            <Link href="#" underline="hover">
              Obtener información para empezar a generar ingresos &rarr;
            </Link>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{ textAlign: { xs: "center", md: "right" } }}
        >
          <ImageLocal
            src="img/ilustrations/ilustration.svg"
            alt="Illustration"
            className={fluidCSS()
              .ltX("small", {
                display: "none",
              })
              .ltX("medium", {
                width: ["70%", "100%"],
              })
              .end("mouse-3d-effect-tr h-positive all-3s")}
            sx={{
              objectFit: "contain",
            }}
          />
        </Grid>
      </Grid>
    </PaperP>
  );
}
