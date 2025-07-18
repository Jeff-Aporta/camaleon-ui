import React, { useState, Component } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Cached";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import StopIcon from "@mui/icons-material/Stop";
import {
  fluidCSS,
  TooltipGhost,
  IconButtonWithTooltip,
  showSuccess,
  showWarning,
  showError,
  Design,
  Layer,
  AnimateComponent,
  showPromise,
  WaitSkeleton,
  DriverComponent,
} from "@jeff-aporta/camaleon";
import { HTTPPUT_COINS_START, HTTPPUT_COINS_STOP } from "@api";
import { driverPanelRobot } from "../../../bot.jsx";

import { driverActionMain } from "../ActionMain.jsx";
import { driverTables } from "@tables/tables.js";

let SINGLETON_UPDATE_BUTTON;

export const driverActionButtons = DriverComponent({
  autoOpEnabled: {
    isBoolean: true,
  },
  paused: {
    isBoolean: true,
    mapCase: {
      textButtonPause: {
        false: () => "Pausar",
        true: () => "Reanudar",
      },
      colorButtonPause: {
        false: () => "warning",
        true: () => "success",
      },
      iconButtonPause: {
        false: () => <PauseIcon fontSize="small" />,
        true: () => <PlayArrowIcon fontSize="small" />,
      },
    },
  },
});

export default (props) => <ActionButtons {...props} />;

class ActionButtons extends Component {
  render() {
    const { settingIcon, onSellCoin, actionInProcess, setActionInProcess } =
      this.props;

    const {
      findCurrencyInCoinsToOperate,
      getCurrency,
      getCoinsToDelete,
      getLoadingCoinsToOperate,
      existsCurrency,
      pushCoinsOperating,
      isCurrencyInCoinsOperating,
      isCurrencyInCoinsToDelete,
      isEmptyCoinsOperating,
    } = driverPanelRobot;

    const {
      setPaused, //
      isPaused,
      mapCasePaused,
      setAutoOpEnabled,
    } = driverActionButtons;

    console.log(driverActionButtons);

    const { user_id } = window.currentUser;

    return (
      <div className="inline-flex align-end col-direction gap-10px">
        <div className="flex">
          <UpdateButton frameRate={5} />
          {settingIcon()}
        </div>
        <div className="flex wrap gap-10px d-end" style={{ minWidth: "180px" }}>
          <ButtonGroup variant="contained" size="small">
            <ButtonOperate />
            <ButtonStop />
            <ButtonPauseResume />
          </ButtonGroup>
        </div>
        <hr />
        <div className="flex wrap gap-10px">
          <ButtonAutoOp />
        </div>
      </div>
    );

    function ButtonPauseResume() {
      const pauseDisabled =
        !getCurrency() ||
        !isCurrencyInCoinsOperating() ||
        isCurrencyInCoinsToDelete() ||
        actionInProcess;
      return (
        <TooltipGhost title={mapCasePaused("textButtonPause")}>
          <div>
            <Button
              className="text-hide-unhover-container"
              variant="contained"
              color={mapCasePaused("colorButtonPause")}
              disabled={pauseDisabled}
              size="small"
              onClick={async () => {
                const coinObj = findCurrencyInCoinsToOperate();
                const { symbol: symbol_coin, id: id_coin } = coinObj;
                if (!coinObj) {
                  return;
                }
                setActionInProcess(true);
                if (!isPaused()) {
                  await HTTPPUT_COINS_STOP({
                    user_id,
                    id_coin,
                    successful: () => {
                      showSuccess(`Se detuvo (${symbol_coin})`);
                    },
                    failure: () => {
                      showWarning(
                        `Algo salió mal al detener en (${symbol_coin})`
                      );
                    },
                  });
                } else {
                  await HTTPPUT_COINS_START({
                    user_id,
                    id_coin,
                    successful: () => {
                      showSuccess(`Se reanudo (${symbol_coin})`);
                    },
                    failure: () => {
                      showWarning(
                        `Algo salió mal al reanudar en (${symbol_coin})`
                      );
                    },
                  });
                }
                setPaused((x) => !x);
                setActionInProcess(false);
              }}
            >
              {mapCasePaused("iconButtonPause")}
              <div className="text-hide-unhover">
                <small>{mapCasePaused("textButtonPause")}</small>
              </div>
            </Button>
          </div>
        </TooltipGhost>
      );
    }

    function ButtonAutoOp() {
      return (
        <TooltipGhost title="Auto-op">
          <div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setAutoOpEnabled((x) => !x)}
            >
              <small>Auto-op</small>
            </Button>
          </div>
        </TooltipGhost>
      );
    }

    function ButtonStop() {
      return (
        <TooltipGhost
          title={(() => {
            if (!existsCurrency()) {
              return "Seleccione una moneda";
            }
            if (isEmptyCoinsOperating()) {
              return "No hay monedas operando";
            }
            if (!isCurrencyInCoinsOperating()) {
              return "Moneda no operando";
            }
            if (isCurrencyInCoinsToDelete()) {
              return "Moneda en proceso de borrado";
            }
            if (actionInProcess) {
              return "Espere...";
            }
            return "Detener";
          })()}
        >
          <div>
            <Detener
              disabled={
                !existsCurrency() ||
                isEmptyCoinsOperating() ||
                !isCurrencyInCoinsOperating() ||
                isCurrencyInCoinsToDelete() ||
                actionInProcess ||
                getLoadingCoinsToOperate()
              }
            />
          </div>
        </TooltipGhost>
      );
    }

    function ButtonOperate() {
      return (
        <TooltipGhost
          title={(() => {
            if (!existsCurrency()) {
              return "Seleccione una moneda";
            }
            if (isCurrencyInCoinsOperating()) {
              return "Moneda ya operando";
            }
            if (actionInProcess) {
              return "Espere...";
            }
            return "Operar";
          })()}
        >
          <div>
            <Operar
              disabled={
                !existsCurrency() ||
                isCurrencyInCoinsOperating() ||
                actionInProcess ||
                getLoadingCoinsToOperate()
              }
            />
          </div>
        </TooltipGhost>
      );

      function Operar(props) {
        return (
          <WaitSkeleton loading={getLoadingCoinsToOperate()}>
            <Button
              {...props}
              className="text-hide-unhover-container"
              variant="contained"
              color="ok"
              size="small"
              onClick={async () => {
                if (!getCurrency()) {
                  return;
                }
                const coinObj = findCurrencyInCoinsToOperate();
                const { symbol: symbol_coin, id: id_coin } = coinObj;
                if (!coinObj) {
                  return;
                }
                await showPromise(
                  `Solicitando al backend inicio de operación (${symbol_coin})`,
                  (resolve) => {
                    HTTPPUT_COINS_START({
                      id_coin,
                      willStart() {
                        setActionInProcess(true);
                      },
                      willEnd() {
                        setActionInProcess(false);
                      },
                      successful: (json, info) => {
                        pushCoinsOperating(coinObj);
                        resolve(`Se empieza a operar (${symbol_coin})`);
                      },
                      failure: (info, rejectPromise) => {
                        rejectPromise(
                          `Algo salió mal al operar en ${symbol_coin}`,
                          resolve,
                          info
                        );
                      },
                    });
                  }
                );
              }}
            >
              {<PlayArrowIcon fontSize="small" />}
              <div className="text-hide-unhover">
                <small>Operar</small>
              </div>
            </Button>
          </WaitSkeleton>
        );
      }
    }

    function Detener(props) {
      return (
        <WaitSkeleton loading={getLoadingCoinsToOperate()}>
          <Button
            {...props}
            className="text-hide-unhover-container"
            variant="contained"
            color="cancel"
            size="small"
            onClick={() => {
              setActionInProcess(true);
              onSellCoin(getCurrency());
            }}
          >
            {<StopIcon fontSize="small" />}
            <div className="text-hide-unhover">
              <small>Detener</small>
            </div>
          </Button>
        </WaitSkeleton>
      );
    }
  }
}

class UpdateButton extends AnimateComponent {
  componentDidMount() {
    driverPanelRobot.addLinkUpdateAvailable(this);
  }
  componentWillUnmount() {
    driverPanelRobot.removeLinkUpdateAvailable(this);
  }

  smartFramerate() {
    if (driverPanelRobot.isUpdateAvailable()) {
      this.frameRate = 1;
    } else {
      this.frameRate = this.props.frameRate;
    }
  }

  render() {
    this.smartFramerate();
    const {
      isUpdateAvailable,
      getPercentToUpdateAvailable,
      setUpdateAvailable,
      mapCaseUpdateAvailable,
    } = driverPanelRobot;

    return (
      <Design>
        <IconButtonWithTooltip
          title={mapCaseUpdateAvailable("textButtonUpdate")}
          icon={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <UpdateIcon />
              <Typography variant="caption">
                <small>Actualizar</small>
              </Typography>
            </div>
          }
          disabled={!isUpdateAvailable()}
          onClick={() => {
            setUpdateAvailable(false);
            driverTables.refetch(true);
          }}
        />
        {!isUpdateAvailable() &&
          (() => {
            if (isUpdateAvailable()) {
              return;
            }
            return (
              <>
                <Layer centercentralized ghost>
                  <CircularProgress
                    color="l2"
                    variant="determinate"
                    value={100 * getPercentToUpdateAvailable()}
                  />
                </Layer>
                <Layer centercentralized ghost>
                  <HourglassBottomIcon fontSize="small" color="l2" />
                </Layer>
              </>
            );
          })()}
      </Design>
    );
  }
}
