import React, { Component } from "react";
import { Box, Grid, TextField, Button, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import { HTTPGET_USEROPERATION_STRATEGY, HTTPPATCH_USEROPERATION_STRATEGY } from "@api";
import { showSuccess, showError, driverParams } from "@jeff-aporta/camaleon";

export class PIPView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        pips: 0,
        accum: 0,
        umbral: 0,
        percent_wick: 0,
        commission_symbol: "",
        percent_stop_loss: 0,
      },
      saving: false,
    };
  }

  componentDidMount() {
    const { user_id } = window.currentUser;
    const id_coin = driverParams.getOne("id_coin");
    if (!user_id || !id_coin) return;
    HTTPGET_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "pips",
      failure: () => showError("Error al cargar configuración Pips"),
      successful: ([data]) => {
        this.setState({
          config: {
            pips: data.pips,
            accum: data.accum,
            umbral: data.umbral,
            percent_wick: data.percent_wick,
            commission_symbol: data.commission_symbol,
            percent_stop_loss: data.percent_stop_loss,
          },
        });
      },
    });
  }

  handleChange = (field) => (e) => {
    const raw = e.target.value;
    const value = isNaN(Number(raw)) ? raw : Number(raw);
    this.setState((prev) => ({
      config: { ...prev.config, [field]: value },
    }));
  };

  handleSave = async () => {
    const { user_id } = window.currentUser;
    const id_coin = driverParams.getOne("id_coin");
    if (!user_id || !id_coin) return;
    this.setState({ saving: true });
    await HTTPPATCH_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "pips",
      new_config: JSON.stringify(this.state.config),
      successful: () => {
        showSuccess("Configuración Pips guardada");
        this.setState({ saving: false });
      },
      failure: () => {
        showError("Error al guardar configuración Pips");
        this.setState({ saving: false });
      },
    });
  };

  render() {
    const { config, saving } = this.state;
    return (
      <Box sx={{ p: 2 }}>
        <TitleTab variant="h5" title="Configuración Pips" />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pips"
              type="number"
              value={config.pips}
              onChange={this.handleChange("pips")}
              InputProps={{ inputProps: { min: 0, step: 1 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Acumulación"
              type="number"
              value={config.accum}
              onChange={this.handleChange("accum")}
              InputProps={{ inputProps: { min: 0, step: 1 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Umbral"
              type="number"
              value={config.umbral}
              onChange={this.handleChange("umbral")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Porcentaje de mecha (%)"
              type="number"
              value={config.percent_wick}
              onChange={this.handleChange("percent_wick")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Comisión"
              value={config.commission_symbol}
              onChange={this.handleChange("commission_symbol")}
              fullWidth
            >
              <MenuItem value="USDT">USDT</MenuItem>
              <MenuItem value="USDC">USDC</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stop Loss (%)"
              type="number"
              value={config.percent_stop_loss}
              onChange={this.handleChange("percent_stop_loss")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={this.handleSave}
              disabled={saving}
              fullWidth
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default PIPView;
