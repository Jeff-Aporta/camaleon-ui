import React from "react";
import { PaperP, DialogSimple, TooltipGhost, DivM } from "@framework";
import { Typography, Box, Divider, Chip, Button } from "@mui/material";
import { Main } from "@theme/main";
import { idsChips } from "./idsChipsStatic";
import { baseChips } from "./baseChips";
import { gestureChips } from "./gestureChips";
import { listenerChips } from "./listenerChips";

function ChipInfo({
  title,
  title_text,
  text,
  button_text,
  variant,
  ...rest_props
}) {
  return (
    <DialogSimple
      {...rest_props}
      text={text}
      title_text={title_text ?? "Información"}
      button_text={button_text}
      variant={variant}
    >
      <TooltipGhost title={title}>
        <Button>
          <Chip label={title} size="small" />
        </Button>
      </TooltipGhost>
    </DialogSimple>
  );
}

export default function EventDoc() {
  return (
    <Main>
      <DivM>
        <PaperP>
          <Typography variant="h4" gutterBottom>
            Módulo Events
          </Typography>
          <Typography variant="body1" paragraph>
            Incluye funciones para capturar posiciones táctiles y del mouse,
            detectar gestos, gestionar estados de teclas y manejar eventos DOM,
            simplificando la interacción con el usuario en la UI.
          </Typography>
        </PaperP>
        <Divider sx={{ my: 2 }} />
        <PaperP>
          <Box component="section" mb={3}>
            <Typography variant="h5">events.base.js</Typography>
            <Typography variant="body2" paragraph>
              Define la clase base y mantiene estados de vectores para touch y
              mouse. Exporta funciones:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {baseChips.map((chip) => (
                <ChipInfo key={chip.title} {...chip} />
              ))}
            </Box>
          </Box>
        </PaperP>
        <Divider sx={{ my: 2 }} />
        <PaperP>
          <Box component="section" mb={3}>
            <Typography variant="h5">events.gestures.js</Typography>
            <Typography variant="body2" paragraph>
              Manejo de gestos táctiles como swipe y pinch. Exporta las
              funciones principales para detectar y procesar gestos.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {gestureChips.map((chip) => (
                <ChipInfo key={chip.title} {...chip} />
              ))}
            </Box>
          </Box>
        </PaperP>
        <Divider sx={{ my: 2 }} />
        <PaperP>
          <Box component="section" mb={3}>
            <Typography variant="h5">events.ids.js</Typography>
            <Typography variant="body2" paragraph>
              Define constantes para eventos de teclado y mouse: CONTROL, SHIFT,
              ALT, MOUSE_LEFT, MOUSE_MIDDLE, MOUSE_RIGHT.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {idsChips.map((chip) => (
                <ChipInfo key={chip.title} {...chip} />
              ))}
            </Box>
          </Box>
        </PaperP>
        <Divider sx={{ my: 2 }} />
        <PaperP>
          <Box component="section" mb={3}>
            <Typography variant="h5">events.listeners.js</Typography>
            <Typography variant="body2" paragraph>
              Define listeners para eventos DOM: onMouseUp, onMouseMove,
              onKeyDown, onKeyUp, onTouchStart, onTouchMove, onResize,
              onMouseDown.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {listenerChips.map((chip) => (
                <ChipInfo key={chip.title} {...chip} />
              ))}
            </Box>
          </Box>
        </PaperP>
      </DivM>
    </Main>
  );
}
