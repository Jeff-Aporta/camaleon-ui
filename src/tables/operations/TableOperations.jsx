import {
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Alert,
  Button,
  Badge,
} from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DynTable, driverParams, Delayer } from "@jeff-aporta/camaleon";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { HTTPGET_USEROPERATION_PERIOD } from "@api";

import { WaitSkeleton, DateRangeControls } from "@components/controls";
import React, { Component } from "react";
import dayjs from "dayjs";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { showError, IS_GITHUB, subscribeParam } from "@jeff-aporta/camaleon";
import { driverTables } from "../tables.js";

let rows = [];
let filterApply = false;

let SINGLETON;
let SINGLETON_BUTTON_APPLY_FILTER;

let loadingTableOperation = false;

let mock_default = IS_GITHUB ? mock_operation : [];

export const driverTableOperations = {
  getTableData() {
    return rows || mock_default;
  },

  setTableData(newRows) {
    rows = newRows;
    driverTableOperations.forceUpdate();
  },

  getFilterApply() {
    return filterApply;
  },

  setFilterApply(newFilterApply) {
    filterApply = newFilterApply;
    driverTableOperations.forceUpdateButtonApplyFilter();
  },

  getLoadingTableOperation() {
    return loadingTableOperation;
  },

  setLoadingTableOperation(newLoadingTableOperation) {
    loadingTableOperation = newLoadingTableOperation;
    driverTableOperations.forceUpdate();
  },

  forceUpdateButtonApplyFilter() {
    if (!SINGLETON_BUTTON_APPLY_FILTER) {
      setTimeout(
        () => driverTableOperations.forceUpdateButtonApplyFilter(),
        100
      );
      return;
    }
    SINGLETON_BUTTON_APPLY_FILTER.forceUpdate();
  },

  forceUpdate() {
    if (!SINGLETON) {
      setTimeout(() => driverTableOperations.forceUpdate(), 100);
      return;
    }
    SINGLETON.forceUpdate();
  },
};

export default driverTables.newTable({
  name_table: driverTables.TABLE_OPERATIONS,
  user_id_required: true,
  paramsKeys: ["start_date", "end_date"],
  allParamsRequiredToFetch: true,
  init() {},
  componentDidMount() {
    SINGLETON = this;
  },
  start_fetch() {
    driverTableOperations.setLoadingTableOperation(true);
    driverTableOperations.setFilterApply(false);
  },
  end_fetch({ error }) {
    driverTableOperations.setLoadingTableOperation(false);
  },
  fetchError() {
    driverTableOperations.setTableData([]);
  },
  async fetchData({ user_id, start_date, end_date }) {
    await HTTPGET_USEROPERATION_PERIOD({
      start_date,
      end_date,
      // ---------------------
      successful: (data) => {
        driverTableOperations.setTableData(data);
      },
      mock_default,
      checkErrors: () => {
        if (!user_id) {
          return "No hay usuario seleccionado";
        }
        if (!start_date || !end_date) {
          return "No se ha seleccionado un rango de fechas";
        }
      },
    });
  },
  render() {
    const { useForUser, data, columns_config, ...rest } = this.props;
    const { user_id } = window["currentUser"];

    let [start_date, end_date] = driverParams.get("start_date", "end_date");

    const base = user_id
      ? driverTableOperations.getTableData()
      : data?.content ?? [];

    const processedContent = Array.isArray(base)
      ? base.map((item) => ({ ...item, name_coin: item.name_coin ?? "FYX" }))
      : [];

    let finalColumns = [...columns_operation];

    if (useForUser) {
      finalColumns = [
        {
          field: "actions",
          headerName: "Transacciones",
          sortable: false,
          renderCell: ({ row }) => (
            <Tooltip
              title={`Transacciones (${row.number_of_transactions})`}
              placement="left"
            >
              <Paper
                className="circle d-center"
                style={{ width: 30, height: 30, margin: "auto", marginTop: 10 }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    driverTables.setOperationRow(row);
                    driverParams.set({
                      id_operation: row.id_operation,
                    });
                    driverTables.setViewTable(driverTables.TABLE_TRANSACTIONS);
                  }}
                >
                  <Badge
                    badgeContent={row.number_of_transactions}
                    color="primary"
                    sx={{ "& .MuiBadge-badge": { color: "#fff" } }}
                  >
                    <TransactionsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Paper>
            </Tooltip>
          ),
        },
        ...columns_operation,
      ];
    }

    return (
      <>
        {!user_id ? (
          <Typography variant="body1">
            Seleccione un usuario para ver operaciones.
          </Typography>
        ) : (
          <>
            <Typography variant="h5">Operaciones</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Usuario: {user_id}
            </Typography>
            <div
              className={`flex align-center justify-space-between flex-wrap gap-10px ${
                ["mh-10px", ""][
                  +driverTableOperations.getLoadingTableOperation()
                ]
              }`}
            >
              <DateRangeControls
                loading={driverTableOperations.getLoadingTableOperation()}
                willPeriodChange={(period) =>
                  driverTableOperations.setFilterApply(true)
                }
              />
              {(() => {
                const ButtonFilter = class extends React.Component {
                  constructor(props) {
                    super(props);
                    subscribeParam(
                      {
                        "start_date, end_date": () => {
                          driverTableOperations.setFilterApply(true);
                        },
                      },
                      this
                    );
                  }

                  componentDidMount() {
                    SINGLETON_BUTTON_APPLY_FILTER = this;
                    this.addParamListener();
                  }

                  componentWillUnmount() {
                    this.removeParamListener();
                  }

                  render() {
                    return (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          driverTables.refetch();
                        }}
                        disabled={
                          driverTableOperations.getLoadingTableOperation() ||
                          !driverTableOperations.getFilterApply()
                        }
                        sx={{ mt: 1, mb: 1 }}
                        startIcon={<FilterAltIcon />}
                      >
                        Aplicar filtros
                      </Button>
                    );
                  }
                };
                return <ButtonFilter />;
              })()}
            </div>
            <WaitSkeleton
              loading={driverTableOperations.getLoadingTableOperation()}
              h="auto"
            >
              <div style={{ width: "100%", overflowX: "auto" }}>
                <DynTable
                  {...rest}
                  columns={finalColumns}
                  rows={processedContent}
                  getRowId={(row) =>
                    row.id_operation || row.id || Math.random().toString()
                  }
                />
              </div>
            </WaitSkeleton>
          </>
        )}
      </>
    );
  },
});
