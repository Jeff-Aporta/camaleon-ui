import { Main } from "@theme/main";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { showPromptDialog, driverParams, getComponentsQuery } from "@framework";

const { Events, FluidCSS, Themes, Tools } = getComponentsQuery();

export default function () {
  return <Index />;
}

function Index() {
  return (
    <Main>
      <Box py={2} px={3}>
        <Box>
          <Typography variant="h2" color="contrast">
            Camaleón UI
          </Typography>
          <Typography variant="h6" gutterBottom color="contrast">
            Documentación
          </Typography>
        </Box>
        <br />
        <Events />
        <br />
        <FluidCSS />
        <br />
        <Themes />
        <br />
        <Tools />
      </Box>
      <Button
        onClick={async () => {
          const confirmRes = await showPromptDialog({
            title: "Prueba Formulario",
            description: "Completa el formulario",
            input: "confirm",
          });
          console.log("Confirmación:", confirmRes);
          // Texto
          const textoRes = await showPromptDialog({
            title: "Prueba Texto",
            description: "Ingresa un texto",
            input: "text",
            label: "Texto",
            onValidate: (value) =>
              ["El texto no puede estar vacío", true][
                +(value && value.length > 0)
              ],
          });
          console.log("Texto:", textoRes);
          // Número
          const numRes = await showPromptDialog({
            title: "Prueba Número",
            description: "Ingresa un número",
            input: "number",
            label: "Número",
            onValidate: (value) =>
              ["Ingrese un número válido", true][+Number.isFinite(value)],
          });
          console.log("Número:", numRes);
          // Booleano
          const boolRes = await showPromptDialog({
            title: "Prueba Booleano",
            description: "Elige verdadero/falso",
            input: "boolean",
            label: "Booleano",
            onValidate: (value) =>
              ["Debes aceptar para continuar", true][+value],
          });
          console.log("Booleano:", boolRes);
          // Formulario
          const formInput = (
            <>
              <TextField name="campo" label="Campo" margin="dense" fullWidth />
              <FormControlLabel
                control={<Checkbox name="check" />}
                label="Marcar opción"
              />
            </>
          );
          const formRes = await showPromptDialog({
            title: "Prueba Formulario",
            description: "Completa el formulario",
            input: formInput,
            onValidate: (value) => {
              console.log(value);
              if (!value.campo) {
                return "El campo es obligatorio";
              }
              if (!value.check) {
                return "Debes marcar la opción";
              }
              return true;
            },
          });
          console.log("Formulario:", formRes);
        }}
      >
        Open Dialog
      </Button>
      <Button
        onClick={() => {
          driverParams.set("test", Math.random());
        }}
      >
        Set Test
      </Button>
    </Main>
  );
}
