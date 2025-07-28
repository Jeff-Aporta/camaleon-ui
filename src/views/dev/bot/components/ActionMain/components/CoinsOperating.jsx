import React, { Component } from "react";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";

import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import {
  PaperP,
  HTTP_IS_ERROR,
  showPromise,
  sleep,
} from "@jeff-aporta/camaleon";

import { showSuccess, showWarning, showError } from "@jeff-aporta/camaleon";
import { driverCoinsOperating } from "./CoinsOperating.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";

export default (props) => <CoinsOperating {...props} />;

class CoinsOperating extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    driverCoinsOperating.addLinkActionInProcess(this);
    driverPanelRobot.addLinkCoinsOperating(this);
    driverPanelRobot.addLinkCoinsToDelete(this);
  }

  componentWillUnmount() {
    driverCoinsOperating.removeLinkActionInProcess(this);
    driverPanelRobot.removeLinkCoinsOperating(this);
    driverPanelRobot.removeLinkCoinsToDelete(this);
  }

  render() {
    return (
      <PaperP
        elevation={3}
        sx={{
          width: "100%",
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          p: 2,
        }}
      >
        {driverPanelRobot.getCoinsOperating().length === 0 ? (
          <span style={{ color: "#888", fontSize: 14 }}>
            No hay monedas en operación.
          </span>
        ) : (
          driverPanelRobot.getCoinsOperating().map((optionCurrency, index) => {
            const symbol = driverPanelRobot.getCoinKey(optionCurrency);
            const isPendingDelete = driverPanelRobot.isPendingInCoinsToDelete(
              symbol
            );
            return (
              <Tooltip
                key={`tooltip-${symbol}-${index}`}
                title={isPendingDelete ? "Pronto dejará de ser operada" : ""}
              >
                <Chip
                  label={symbol}
                  onDelete={(e) => {
                    e.preventDefault();
                    driverCoinsOperating.deleteCoinFromAPI(optionCurrency);
                  }}
                  disabled={
                    isPendingDelete || driverCoinsOperating.getActionInProcess()
                  }
                  color={isPendingDelete ? "cancel" : "primary"}
                  style={{ color: !isPendingDelete ? "white" : undefined }}
                  deleteIcon={
                    isPendingDelete ? (
                      <CircularProgress size="20px" color="white" />
                    ) : (
                      <DoDisturbOnIcon style={{ color: "white" }} />
                    )
                  }
                  sx={{ m: 0.5 }}
                />
              </Tooltip>
            );
          })
        )}
      </PaperP>
    );
  }
}
