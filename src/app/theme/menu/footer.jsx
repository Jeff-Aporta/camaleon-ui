import {
  PaperP,
  href,
  getAllThemesRegistered,
  isRegistered,
  configUseViewId,
  getUseViewId,
  ImageLocal,
  ToolsCustomizeInFooter,
} from "@framework";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export function Footer({ updateThemeName }) {
  return (
    <>
      <FooterNavSection />
      <ToolsCustomizeInFooter updateThemeName={updateThemeName} />
    </>
  );
}

function FooterNavSection() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <PaperP nobr hm rhm={2}>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ textAlign: "right" }}>
                <ImageLocal
                  src="img/metadata/logo-hd.svg"
                  alt="Logo"
                  style={{
                    width: "150px",
                    marginBottom: "20px",
                    marginLeft: "auto",
                  }}
                />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Camaleón UI: biblioteca de componentes React con theming dinámico y altamente personalizable.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Adapta automáticamente colores, estilos y funcionalidades a tus necesidades.
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {`© ${year} Camaleón UI. Todos los derechos reservados.`}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <img
                    src="https://logo.clearbit.com/play.google.com"
                    alt="Google Play"
                    style={{ height: "30px", borderRadius: "4px" }}
                  />
                  <img
                    src="https://logo.clearbit.com/apple.com"
                    alt="App Store"
                    style={{ height: "30px", borderRadius: "4px" }}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Link href="#" color="inherit">
                    <Box
                      sx={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FacebookIcon fontSize="small" />
                    </Box>
                  </Link>
                  <Link href="#" color="inherit">
                    <Box
                      sx={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TwitterIcon fontSize="small" />
                    </Box>
                  </Link>
                  <Link href="#" color="inherit">
                    <Box
                      sx={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <InstagramIcon fontSize="small" />
                    </Box>
                  </Link>
                  <Link href="#" color="inherit">
                    <Box
                      sx={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <YouTubeIcon fontSize="small" />
                    </Box>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="caption"
            align="center"
            sx={{
              display: "block",
              mt: 4,
              opacity: 0.5,
            }}
          >
            {`© ${year} Avatar. Todos los derechos reservados.`}
          </Typography>

      </PaperP>
    </footer>
  );
}
