import { getComponentsQuery } from "@framework";

export const settings = {
  title: "Prueba",
};

export function View() {
  const { Ex, Exf } = getComponentsQuery();
  console.log({ Ex, Exf });
  return (
    <>
      <h1>Hola mundo</h1>
      <Ex />
      <Exf />
    </>
  );
}
