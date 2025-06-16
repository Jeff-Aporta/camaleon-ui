import { getComponentsQuery } from "@framework";

export const settings = {
  title: "Prueba",
};

export function View() {
  const {ex, exf} = getComponentsQuery();
  console.log({ex, exf});
  return (
    <>
      <h1>Hola mundo</h1>
      <ex.default />
      <exf.default />
    </>
  );
}
