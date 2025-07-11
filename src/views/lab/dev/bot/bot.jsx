import React, { useRef, useState, useEffect } from "react";

import { Main } from "@theme/main";
import { DivM, driverParams, getComponentsQuery } from "@framework";

import { HTTPGET_COINS_BY_USER } from "@api";

import { Typography } from "@mui/material";
import dayjs from "dayjs";

export default function () {
  return <PanelRobot />;
}

//Iniciar parametros
function initParams() {
  if (!driverParams.get("period")) {
    driverParams.set("period", "most_recent");
  }
  if (!driverParams.get("id_coin")) {
    driverParams.set("id_coin", 1);
  }
}

function PanelRobot() {
  const { user_id } = window["currentUser"] ?? {};

  console.log(getComponentsQuery());

  const { ActionMain, Settings } = getComponentsQuery();

  const [viewTable, setViewTable] = useState(
    driverParams.get("view-table") || "operations"
  );
  const [view, setView] = useState(driverParams.get("action-id") || "main");

  const [operationTrigger, setOperationTrigger] = useState(null);
  const currency = useRef(driverParams.get("coin") || "");

  const [update_available, setUpdateAvailable] = useState(true);

  // Hook para forzar renderizado
  const [, forceUpdate] = useState({}); // Fuerza el renderizado

  const coinsToOperate = useRef([]); // Lista de monedas disponibles para operar
  const coinsOperatingList = useRef([]); // Lista de monedas en operación
  const coinsToDelete = useRef([]); // Lista de monedas en proceso de eliminación

  // Efecto de carga de monedas disponibles
  const [loadingCoinToOperate, setLoadingCoinToOperate] = useState(true);
  // Error al cargar monedas disponibles
  const [errorCoinOperate, setErrorCoinOperate] = useState(null);

  // Sync view and viewTable to URL params
  useEffect(() => {
    driverParams.set("action-id", view);
    driverParams.set("view-table", viewTable);
  }, [view, viewTable]);

  useEffect(() => {
    (async () => {
      if (coinsToOperate.current.length === 0) {
        await HTTPGET_COINS_BY_USER({
          setError: setErrorCoinOperate,
          setApiData: (data) => {
            coinsToOperate.current = data;
            const paramCoin = driverParams.get("coin");
            if (!paramCoin && coinsToOperate.current.length > 0) {
              const first = coinsToOperate.current[0];
              const key = window.getCoinKey(first);
              currency.current = key;
              driverParams.set("coin", key);
              driverParams.set("id_coin", first.id);
            } else {
              currency.current = paramCoin;
            }
            coinsOperatingList.current = data.filter(
              (coin) => coin.status === "A"
            );
          },
        });
        setLoadingCoinToOperate(false);
      }
    })();
  }, []);

  return (
    <Main h_init="20px" h_fin="300px">
      <DivM>
        <Typography variant="h2" className="color-bg-opposite">
          Panel Robot
        </Typography>
        <br />
        {(() => {
          switch (view) {
            case "main":
            default:
              return (
                <ActionMain
                  {...{
                    currency,
                    update_available,
                    setUpdateAvailable,
                    setViewTable,
                    setView,
                    viewTable,
                    setOperationTrigger,
                    operationTrigger,
                    forceUpdate,
                    coinsOperatingList,
                    coinsToDelete,
                    coinsToOperate,
                    loadingCoinToOperate,
                    setLoadingCoinToOperate,
                    errorCoinOperate,
                    setErrorCoinOperate,
                    user_id,
                  }}
                />
              );
            case "settings":
              return <Settings setView={setView} />;
          }
        })()}
      </DivM>
    </Main>
  );
}
