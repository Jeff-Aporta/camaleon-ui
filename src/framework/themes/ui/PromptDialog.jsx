import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {DriverComponent} from "../../tools/DriverComponent.js"

const driverDialog = DriverComponent({
  dialog: {
    isComponent: true,
    show(props) {
      return this.showPromptDialog({
        ...props,
        showCancelButton: false,
        input: "confirm",
      });
    },
    showPrompt(props) {
      const { input } = props;
      const okcancel = ["okcancel", "ok/cancel", "confirm"];
      return new Promise((resolve) => {
        open({
          ...props,
          onSuccess: (value) => {
            if (okcancel.includes(input)) {
              value = true;
            }
            resolve({ status: "confirmed", success: true, value });
          },
          onCancel: (value) => {
            if (okcancel.includes(input)) {
              value = false;
            }
            resolve({ status: "canceled", success: false, value });
          },
        });
      });
    },
  },
});

function open(props) {
  driverDialog.getDialog().open(props);
}

export function showDialog(props) {
  return driverDialog.showDialog(props);
}

export function showPromptDialog(props) {
  return driverDialog.showPromptDialog(props);
}

export class PromptDialog extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      inputValue: "",
      open: false,
      validationError: null,
      formData: {},
    };
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  open(props) {
    this.setState({
      inputValue: "",
      validationError: null,
      formData: {},
      ...props,
      open: true,
    });
  }

  onClose() {
    this.setState({ open: false });
  }

  handleConfirm() {
    this.setState({ validationError: null });
    const { inputValue, onValidate, input, onSuccess } = this.state;
    let payload;
    if (React.isValidElement(input)) {
      const formEl = this.formRef.current;
      const formData = new FormData(formEl);
      payload = Object.fromEntries(formData.entries());
    } else {
      payload = inputValue;
    }

    const callback = onSuccess;
    if (onValidate) {
      const validationResult = onValidate(payload);
      if (!validationResult) {
        this.setState({ validationError: "error en la validación" });
        return;
      }
      switch (typeof validationResult) {
        case "object":
          this.setState({
            validationError:
              validationResult.message || "error en la validación",
          });
          return;
        case "string":
          this.setState({ validationError: validationResult });
          return;
      }
    }
    if (callback) {
      callback(payload);
    }
    this.setState({ inputValue: "" });
    this.onClose();
  }

  handleCancel() {
    const callback = this.state.onCancel;
    if (callback) {
      callback();
    }
    this.setState({ inputValue: "" });
    this.onClose();
  }

  handleChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    this.setState((prev) => ({
      formData: {
        ...prev.formData,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  }

  componentDidMount() {
    driverDialog.setDialog(this);
  }

  render() {
    const {
      inputValue,
      open,
      title,
      description,
      validationError,
      onValidate,
      input = "text",
      Actions,
      footer,
      showConfirmButton = true,
      showCancelButton = true,
      showCloseButton = true,
      confirmText = "aceptar",
      cancelText = "cancelar",
      label = "Valor",
    } = this.state;

    return (
      <Dialog open={open} onClose={this.handleCancel} disablePortal>
        <DialogTitle sx={{ m: 0, p: 2, pr: 10 }}>
          <Typography variant="h4" component="div">
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              color="secondary"
              size="small"
              onClick={this.handleCancel}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {validationError && (
            <Alert
              severity={
                ["error", validationError.severity][+!!validationError.severity]
              }
            >
              {
                [validationError, validationError.message][
                  +!!validationError.message
                ]
              }
            </Alert>
          )}
          <p>{description}</p>
          {(() => {
            if (React.isValidElement(input)) {
              return (
                <Box
                  component="form"
                  ref={this.formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleConfirm();
                  }}
                >
                  {input}
                </Box>
              );
            }

            switch (input) {
              case "confirm":
              case "okcancel":
              case "ok/cancel":
                return null;
              case "number":
                return (
                  <TextField
                    type="number"
                    autoFocus
                    margin="dense"
                    fullWidth
                    value={inputValue}
                    onChange={(e) =>
                      this.setState({ inputValue: Number(e.target.value) })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        this.handleConfirm();
                      }
                    }}
                    label={label}
                    variant="outlined"
                  />
                );
              case "boolean":
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={inputValue}
                        onChange={(e) =>
                          this.setState({ inputValue: e.target.checked })
                        }
                      />
                    }
                    label={label}
                  />
                );
              case "text":
              case undefined:
                return (
                  <TextField
                    autoFocus
                    margin="dense"
                    fullWidth
                    value={inputValue}
                    onChange={this.handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        this.handleConfirm();
                      }
                    }}
                    label={label}
                    variant="outlined"
                  />
                );
              default:
                return null;
            }
          })()}
          {footer}
        </DialogContent>
        <DialogActions>
          <Actions
            handleClose={this.handleCancel}
            handleConfirm={this.handleConfirm}
          />
          {showCancelButton && (
            <Button onClick={this.handleCancel} color="secondary">
              {cancelText}
            </Button>
          )}
          {showConfirmButton && (
            <Button
              onClick={this.handleConfirm}
              variant="contained"
              color="contrastpaperbow"
            >
              {confirmText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}
