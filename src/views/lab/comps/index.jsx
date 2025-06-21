import {
  IconButtonWithTooltip,
  CaptionWrapper,
  genInputsGender,
  SelectFast,
} from "@framework";
import { TextField, Button, FormControlLabel,  Checkbox } from "@mui/material";

import { Color, DynTable, showPromptDialog } from "@framework";

export default function () {
  return (
    <>
      <IconButtonWithTooltip
        title="Prueba de tooltip"
        icon={"Hola"}
        onClick={() => alert("Click")}
      />
      <CaptionWrapper label="Prueba de caption">
        <TextField />
      </CaptionWrapper>
      {genInputsGender([
        {
          label: "Cantidad",
          fem: true,
          type: "number",
          color: Color("red"),
        },
        {
          label: "Apellido",
          fem: false,
        },
      ])}
      <SelectFast
        label="Prueba de select"
        onChange={(e) => alert(e.target.value)}
        opns={["Opción 1", "Opción 2", "Opción 3"]}
      />
      <SelectFast
        label="Prueba de select"
        onChange={(e) => alert(e.target.value)}
        opns={{
          opn1: "Opción 1",
          opn2: "Opción 2",
          opn3: "Opción 3",
        }}
      />
      <DynTable
        columns={[
          { field: "name", headerName: "Name" },
          { field: "age", headerName: "Age" },
        ]}
        rows={[
          { name: "Alice", age: 30 },
          { name: "Bob", age: 25 },
        ]}
      />
    </>
  );
}
