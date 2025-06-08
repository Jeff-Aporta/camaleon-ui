import { initializeThemeColors } from "./palettes.polychroma";
import { readyThemeManager } from "./manager";

export function initThemeCamaleon() {
  initializeThemeColors();
  readyThemeManager();
}
