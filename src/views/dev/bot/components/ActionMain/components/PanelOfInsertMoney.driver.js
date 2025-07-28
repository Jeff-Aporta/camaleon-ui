import { DriverComponent, Delayer } from "@jeff-aporta/camaleon";

export const driverPanelOfInsertMoney = DriverComponent({
  idDriver: "bot-panel-of-insert-money",
  investment:{
    delayer: Delayer(250),
    wait: false,
  }
});
