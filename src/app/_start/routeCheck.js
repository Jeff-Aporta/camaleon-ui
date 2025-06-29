function authError(path) {
  const [first, second] = path;
  const strpath = path.join("/");
  if (strpath.includes("not-access-test")) {
    return "Prueba de automatización en unauth";
  }
}

export function routeCheck({
  querypath: path = () => 0, // Por defecto evita errores
}) {
  if (!path) {
    return; // No debe retornar error
  }

  const segments = (() => {
    if (Array.isArray(path)) {
      return path;
    }
    return path.split("/").filter(Boolean);
  })();

  return (
    authError(segments) ?? // Encontró error de autenticación
    false // No encontró error
  );
}
