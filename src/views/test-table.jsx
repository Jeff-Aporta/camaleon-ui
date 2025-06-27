import { Main } from "@theme/main";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  showPromptDialog,
  DynTable,
  modelsFormat,
  unpackTable,
  showSuccess,
  showWarning,
  showError,
  showInfo,
  setURLMapAPI,
  AUTO_PARAMS,
  MAKE_GET,
} from "@framework";
import StatusOpenIcon from "@mui/icons-material/HourglassTop";
import StatusCloseIcon from "@mui/icons-material/HourglassBottom";

setURLMapAPI({
  getContext: () => "web",
  local: {
    robot_backend: "http://localhost:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
  web: {
    robot_backend: "http://168.231.97.207:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
});

const cols = {
  config: [
    {
      inTable: false,
      field: "id_operation",
      headerName: "ID Operación",
      description: "Identificador único de la operación.",
    },
    {
      field: "status",
      headerName: "Estado",
      description: "Estado de la operación.",
      fit_content: true,
      renderInfo: {
        iconized(params, renderString) {
          let { value, row } = params;
          const strings_open = {
            texto: "Abierto",
            tooltip: "Abierto",
          };
          const strings_close = {
            texto: "Cerrado",
            tooltip: "Cerrado",
          };
          const openState = {
            ...strings_open,
            icon: <StatusOpenIcon />,
            color: "ok",
          };
          const closeState = {
            ...strings_close,
            icon: <StatusCloseIcon />,
            color: "secondary",
          };
          if (!row["end_date_operation"]) {
            return openState;
          }
          switch (value) {
            case "C":
              return closeState;
            default:
              return openState;
          }
        },
      },
    },
    {
      field: "profit",
      headerName: "Beneficio",
      description: "Ganancia obtenida de la operación.",
      ...modelsFormat.profit_op,
    },
    {
      inTable: false,
      field: "id_coin",
      headerName: "Moneda",
      description: "Moneda utilizada en la operación.",
    },
    {
      inTable: false,
      field: "name_coin",
      headerName: "Código",
      description: "Código de la moneda.",
    },
    {
      field: "price_buy",
      headerName: "Compra",
      description: "Precio de compra de la moneda en USDC.",
      ...modelsFormat.currentCoin,
    },
    {
      field: "price_sell",
      headerName: "Venta",
      description: "Precio de venta de la moneda.",
      ...modelsFormat.currentCoin,
    },
    {
      field: "total_quantity",
      headerName: "Cantidad",
      description: "Cantidad total de la moneda en la operación.",
      ...modelsFormat.currentCoin,
    },
    {
      field: "total_bought",
      headerName: "Comprado",
      description: "Cantidad comprada de la moneda.",
      ...modelsFormat.currentSufix("symbolpar_buy"),
    },
    {
      field: "total_sold",
      headerName: "Vendido",
      description: "Cantidad vendida de la moneda.",
      ...modelsFormat.currentSufix("symbolpar_sell"),
    },
    {
      inTable: false,
      field: "user_id",
      headerName: "Usuario",
      description: "Identificador del usuario que realizó la operación.",
    },
    {
      field: "initial_balance",
      headerName: "Balance inicial",
      description: "Saldo disponible antes de la operación.",
      ...modelsFormat.currentCoin,
    },
    {
      field: "final_balance",
      headerName: "Balance final",
      description: "Saldo disponible después de la operación.",
      ...modelsFormat.currentCoin,
    },
    {
      field: "start_date_operation",
      headerName: "Inicio",
      description: "Fecha y hora en que comenzó la operación.",
      ...modelsFormat.datetime,
    },
    {
      field: "end_date_operation",
      headerName: "Fin",
      description: "Fecha y hora en que finalizó la operación.",
      ...modelsFormat.datetime,
    },
    {
      inTable: false,
      exclude: true,
      field: "create_date",
      headerName: "create_date",
      description: "Fecha de creación interna de la operación.",
      ...modelsFormat.datetime,
    },
    {
      field: "number_of_transactions",
      headerName: "Cantidad de transacciones.",
      description: "Número de transacciones realizadas.",
      inTable: false,
    },
  ],
};

const rows = {
  content: [
    [
      "id_operation",
      "price_buy",
      "price_sell",
      "end_date_operation",
      "total_quantity",
      "profit",
      "user_id",
      "status",
      "create_date",
      "initial_balance",
      "final_balance",
      "id_coin",
      "number_of_transactions",
      "start_date_operation",
      "total_bought",
      "total_sold",
      "simulated",
      "percent_commission_purchase",
      "percent_commission_sale",
      "name_coin",
      "symbolpar_sell",
      "symbolpar_buy",
    ],
    [
      "709ecf73-10a8-45d5-8214-cdb9527be4d1",
      0.0000072,
      0,
      null,
      277777.78,
      0,
      "e6746a75-55dc-446a-974e-15a6b3b18aa3",
      "F",
      "2025-04-03T04:18:46.554797Z",
      0.83,
      0,
      24478,
      1,
      "2025-04-02T23:18:53",
      2.000000016,
      0,
      true,
      0.01,
      0.01,
      "PEPE",
      "USDC",
      "USDT",
    ],
    [
      "dd392ece-e7d1-4a1d-ad6f-32a9ccc6602f",
      0.00000719,
      0.00000721,
      "2025-04-03T02:22:06",
      2775862.2,
      0.014105655959998131,
      "e6746a75-55dc-446a-974e-15a6b3b18aa3",
      "C",
      "2025-04-03T07:12:04.586092Z",
      0.48,
      2773085.62,
      24478,
      2,
      "2025-04-03T02:12:05",
      20.000000466,
      19.9939473202,
      false,
      0.01,
      0.01,
      "PEPE",
      "USDC",
      "USDT",
    ],
    [
      "d005be0e-e637-4444-8d86-1534e2ec9f80",
      0.00000724,
      0.00000725,
      "2025-04-03T03:45:07",
      1381215.5,
      0.01395027655000014,
      "e6746a75-55dc-446a-974e-15a6b3b18aa3",
      "C",
      "2025-04-03T08:42:05.111968Z",
      0.46,
      0,
      24478,
      1,
      "2025-04-03T03:42:05",
      10.00000022,
      10.0037983125,
      false,
      0.01,
      0.01,
      "PEPE",
      "USDC",
      "USDT",
    ],
  ],
};

export async function HTTPGET_COINS_BY_USER({ user_id, ...rest }) {
  ({ user_id } = AUTO_PARAMS({ user_id }));
  return await MAKE_GET({
    ...rest,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) => genpath(["coins", user_id]),
    mock_default: {
      content: [
        ["symbol", "id"],
        ["_BTC_", "1"],
        ["_ETH_", "2"],
      ],
    },
  });
}

export default function () {
  const handleApi = async () => {
    const result = await HTTPGET_COINS_BY_USER({
      user_id: "2d35c015-5097-46ff-b50c-f89678ee59f0",
    });
    console.log(result);
  };
  return (
    <Main>
      <Button onClick={() => showSuccess("Success")}>Success</Button>
      <Button onClick={() => showWarning("Warning asdasdasdasdasd")}>Warning</Button>
      <Button onClick={() => showError("Error")}>Error</Button>
      <Button onClick={() => showInfo("Info")}>Info</Button>
      <DynTable columns={cols.config} rows={unpackTable(rows.content)} />
      <Button onClick={handleApi}>Api</Button>
    </Main>
  );
}
