import { AppThemeProvider, initThemeCamaleon } from "@framework";

import { Footer, HeadMain } from "./menu/index.js";

initThemeCamaleon();

export function Main(props) {
  return (
    <AppThemeProvider
      h_init="50px"
      h_fin="50px"
      Footer={Footer}
      Header={HeadMain}
      {...props}
    />
  );
}
