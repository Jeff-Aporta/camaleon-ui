import { Main } from "@theme/main";
import { Box, Typography } from "@mui/material";
import EventsDoc from "./sections/events";
import FluidCSSDoc from "./sections/fluidCSS";
import ThemesDoc from "./sections/themes";
import ToolsDoc from "./sections/tools";

export default function () {
  return (
    <Main >
      <Box py={2} px={3}>
        <Box>
          <Typography variant="h2">Camaleón UI</Typography>
          <Typography variant="h6" gutterBottom>
            Documentación
          </Typography>
        </Box>
        <br />
        <EventsDoc />
        <br />
        <FluidCSSDoc />
        <br />
        <ThemesDoc />
        <br />
        <ToolsDoc />
      </Box>
    </Main>
  );
}
