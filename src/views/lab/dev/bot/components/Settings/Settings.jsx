import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  AppBar,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ApiIcon from "@mui/icons-material/Api";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import { PaperP, driverParams } from "@framework";
import { APIKeyView, exchanges_withdrawal } from "./tabs/APIKey";
import { RSIView } from "./tabs/RSI";
import { CriptomonedasView } from "./tabs/Cripto";
import { AutoView } from "./tabs/Auto";
import { CandlestickView } from "./tabs/Candle";
import { AutomatizacionView } from "./tabs/Auto";

export default function ({ setView }) {
  const views = [
    { id: "apis", label: "APIs", icon: <ApiIcon /> },
    {
      id: "criptomonedas",
      label: "Criptomonedas",
      icon: <CurrencyBitcoinIcon />,
    },
    { id: "rsi", label: "RSI", icon: <ShowChartIcon /> },
    { id: "candlestick", label: "Candlestick", icon: <CandlestickChartIcon /> },
  ];
  const initialView = driverParams.get("view-setting") || "apis";
  const [selectedViewSetting, setSelectedViewSetting] = useState(initialView);

  useEffect(() => {
    if (!views.find((v) => v.id === initialView)) {
      driverParams.set("view-setting", "apis");
      setSelectedViewSetting("apis");
    } else {
      setSelectedViewSetting(initialView);
    }
  }, []);

  const handleSelect = (id) => {
    driverParams.set("view-setting", id);
    setSelectedViewSetting(id);
  };
  const drawerWidth = 240;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          variant="contained"
          color="error"
          size="small"
          endIcon={<DisabledByDefaultIcon />}
          onClick={() => setView("main")}
        >
          Cerrar configuración
        </Button>
      </Box>

      <Paper>
        <AppBar position="static" color="default">
          <Tabs
            value={selectedViewSetting}
            onChange={(e, v) => handleSelect(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {views.map((view) => (
              <Tab
                key={view.id}
                label={view.label}
                icon={view.icon}
                value={view.id}
              />
            ))}
          </Tabs>
        </AppBar>
        <Box
          sx={{ display: isMobile ? "block" : "flex" }}
          className="fullWidth align-stretch"
        >
          <Box component="main" sx={{ flexGrow: 1 }}>
            <PaperP>
              <br />
              {selectedViewSetting === "apis" && (
                <>
                  <APIKeyView />
                </>
              )}
              {selectedViewSetting === "criptomonedas" && <CriptomonedasView />}
              {selectedViewSetting === "rsi" && <RSIView />}
              {selectedViewSetting === "candlestick" && <CandlestickView />}
            </PaperP>
          </Box>
        </Box>
      </Paper>

      <br />
      <PaperP>
        <AutomatizacionView />
      </PaperP>
    </>
  );
}
