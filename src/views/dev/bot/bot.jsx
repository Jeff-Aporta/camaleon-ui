import React, { Component } from "react";

import { Main } from "@theme/main";
import {
  DivM,
  driverParams,
  getComponentsQuery,
  subscribeParam,
  showError,
  showInfo,
  clamp,
  DriverComponent,
} from "@jeff-aporta/camaleon";

import { HTTPGET_COINS_BY_USER } from "@api";
import { driverTables } from "@tables/tables.js";
import { driverCoinsOperating } from "./components/ActionMain/components/CoinsOperating";

import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { HTTPGET_TRANSACTION_MOST_RECENT } from "src/app/api";

let SINGLETON;
let currency;
let coinsOperatingList = [];
let coinsToDelete = [];
let update_available = true;
let loadingCoinsToOperate = true;

export default () => <PanelRobot />;

export const driverPanelRobot = DriverComponent({
  panelRobot: {},
  SECONDS_TO_UPDATE_AGAIN: 15000,
  SEARCH_COIN_KEY(c, currency) {
    console.log(this);
    const coinKey = this.getCoinKey(c);
    const coinCurrency = currency || this.getCurrency();
    return coinKey === coinCurrency;
  },
  updateAvailable: {
    isBoolean: true,
    value: true,
    time: -1,
    mapCase: {
      textButtonUpdate: {
        true: () => "Actualizar",
        false: () => "Espera para volver a actualizar",
      },
    },
    _getValidate_(value) {
      if (this.getPercentToUpdateAvailable() >= 1) {
        return true;
      }
      return value;
    },
    getTimeEllapsed({ getTime }) {
      return Date.now() - getTime();
    },
    getPercentTo({ getTimeEllapsed, SECONDS_TO_UPDATE_AGAIN }) {
      const diff = getTimeEllapsed();
      return clamp(diff / SECONDS_TO_UPDATE_AGAIN, 0, 1);
    },
    _willSet_(newValue, { setValue, SECONDS_TO_UPDATE_AGAIN, setTime }) {
      if (newValue == false) {
        setTime(Date.now());
        setTimeout(() => {
          setValue(true);
          setTime(Date.now());
        }, SECONDS_TO_UPDATE_AGAIN);
      }
    },
  },
  coinsToOperate: {
    isArray: true,
    findCurrencyIn(_, { find, SEARCH_COIN_KEY }) {
      return find((c) => SEARCH_COIN_KEY(c));
    },

    findKeyIn([symbol], { find, SEARCH_COIN_KEY }) {
      return find((c) => SEARCH_COIN_KEY(c, symbol));
    },

    mapToKeys(_, { map }) {
      return map(this.getCoinKey);
    },
  },
  coinsOperating: {
    isArray: true,
    isCurrencyIn({ some, SEARCH_COIN_KEY }) {
      return some((c) => SEARCH_COIN_KEY(c));
    },
    setOnlyActive(value, { setValue }) {
      setValue(value.filter((coin) => coin.status === "A"));
    },
    filterExcludeId(id, { setValue, filter }) {
      setValue(filter((c) => c.id != id));
    },
  },
  coinsToDelete: {
    isArray: true,
    filterExcludeIdOn(id, { setValue, filter }) {
      setValue(filter((c) => c.id != id));
    },
    someKey(symbol, { some, SEARCH_COIN_KEY }) {
      return some((c) => SEARCH_COIN_KEY(c, symbol));
    },
    isCurrencyIn({ some, SEARCH_COIN_KEY }) {
      return some((c) => SEARCH_COIN_KEY(c));
    },
  },
  currency: {
    nameParam: "coin",
  },
  loadingCoinsToOperate: {
    value: true,
  },
  getCoinKey(coin) {
    return coin.symbol || coin.name || coin.id || "-";
  },
  viewBot: {
    nameParam: "view_bot",
    initParam: "main",
    setToMain(props, { setValue }) {
      setValue("main");
      driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
    },
    setToSettings(props, { setValue }) {
      setValue("settings");
    },
  },
  idCoin: {
    nameParam: "id_coin",
    initParam: 1,
  },

  async loadCoins() {
    console.log(this);
    await HTTPGET_COINS_BY_USER({
      successful: (coinsByUser) => {
        coinsByUser = coinsByUser.sort((a, b) => a.id - b.id);
        this.setCoinsToOperate(coinsByUser);
        const coinsToOperate = this.getCoinsToOperate();
        const currency = this.getCurrency();
        if (!currency && !this.isEmptyCoinsToOperate()) {
          console.log(this);
          const first = coinsToOperate[0];
          const key = this.getCoinKey(first);
          this.setCurrency(key);
          this.setIdCoin(first.id);
        }
        this.setOnlyActiveCoinsOperating(coinsByUser);
      },
    });
    this.setLoadingCoinsToOperate(false);
  },
});

class PanelRobot extends Component {
  componentDidMount() {
    driverPanelRobot.loadCoins();
    driverPanelRobot.setPanelRobot(this);
    driverPanelRobot.addLinkViewBot(this);
    driverTables.addLinkViewTable(this);
  }

  componentWillUnmount() {
    driverPanelRobot.removeLinkViewBot(this);
    driverTables.removeLinkViewTable(this);
  }

  render() {
    const {
      ActionMain: { default: ActionMainComponent },
      Settings: { default: SettingsComponent },
    } = getComponentsQuery();

    return (
      <Main h_init="20px" h_fin="300px">
        <DivM>
          <Typography variant="h2" className="color-bg-opposite">
            Panel Robot
          </Typography>
          <br />
          {(() => {
            switch (driverPanelRobot.getViewBot()) {
              case "main":
              default:
                return <ActionMainComponent />;
              case "settings":
                return <SettingsComponent />;
            }
          })()}
        </DivM>
      </Main>
    );
  }
}
