import {
  unpackTable,
  buildUrlFromService,
  failureDefault,
  getMessageError,
} from "./utils";

import { showWarning } from "../themes/ui/Notifier.jsx";

export const responsePromises = {};
export const responseResults = {};

function SINGLETON_EFFECT({
  url,
  successful,
  failure = failureDefault,
  newfetch = () => {},
  fetchcached = () => {},
  useCache = true,
  timeCache = 15 * 1000,
  mock_default,
  mockIsTable = true,
  ...rest
}) {
  if (!responsePromises[url]) {
    newfetch({ url });
    responsePromises[url] = new Promise(async (resolve, reject) => {
      try {
        const respuesta = await HTTP_REQUEST({
          method: "get",
          isTable: true,
          buildEndpoint: () => url,
          successful: (data, info) => {
            if (HTTP_DATA_ERROR(data)) {
              if (useMock()) {
                return;
              }
              rejectPromise("Se recibió un error del server", reject, {
                status: "error",
                message: "Error en la respuesta, desde el server",
                data,
                url,
                response: responseResults[url],
              });
            } else {
              responseResults[url] = data;
              successful(data, {
                info,
                status: "success",
                message: "Se realizo la peticion exitosamente",
                url,
                data,
              });
              resolve(data);
            }
          },
          failure: (info) => {
            if (useMock()) {
              return;
            }
            rejectPromise(`Error en GET ${url}`, reject, {
              status: "error",
              message: `Error en GET-SINGLETON ${url}`,
              info,
              url,
              response: responseResults[url],
            });
          },
          ...rest,
        });
      } catch (err) {
        if (useMock()) {
          return;
        }
        rejectPromise(err.message || err, reject, {
          status: "error",
          message: "Ocurrió un error try-catch en singleton effect",
          url,
          err,
          value: responseResults[url],
          promise: responsePromises[url],
        });
      }

      function useMock() {
        forgot();
        if (mock_default && window.isDev()) {
          const useMockup = mockIsTable
            ? unpackTable(mock_default)
            : mock_default;
          if (useMockup.length > 0) {
            showWarning(`Mockup en uso ${url}`);
            successful(useMockup, {
              status: "simulated",
              message: "Mockup en uso",
              url,
              mockup: useMockup,
            });
            resolve();
            return true;
          }
        }
        return false;
      }
    });
    timeoutCached();
  } else {
    fetchcached({
      url,
      value: responseResults[url],
      promise: responsePromises[url],
    });
    if (responseResults[url]) {
      successful(responseResults[url], {
        status: "success",
        message: "",
        url,
      });
    } else {
      if (useMock()) {
        return;
      }
      failure(
        {
          status: "error",
          message: "Hay promesa pero no hubo respuesta",
          url,
          value: responseResults[url],
          promise: responsePromises[url],
        },
        rejectPromise
      );
    }
  }

  return responsePromises[url];

  function forgot() {
    timeCache = 0;
    useCache = false;
    timeoutCached();
  }

  function timeoutCached() {
    setTimeout(() => {
      delete responsePromises[url];
      delete responseResults[url];
    }, +!!useCache * timeCache);
  }
}

export const HTTP_REQUEST = async ({
  method, // post | put | get | patch
  buildEndpoint, // Función que construye la URL de la API.
  payload = {}, // Payload para la petición.
  willStart = () => {}, // Callback antes de la petición.
  willEnd = () => {}, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  successful = () => {}, // Callback para recibir el body de la respuesta (success o error)
  failure = failureDefault,
  isTable = false, // Si es true, transforma la respuesta con table2obj
}) => {
  if (!method) {
    throw new Error("Method is required, post | put | get | patch");
  }
  if (!buildEndpoint) {
    throw new Error("buildEndpoint is required");
  }
  method = method.toLowerCase();
  const METHOD = method.toUpperCase();
  const IS_GET = method == "get";

  const url = buildUrlFromService(buildEndpoint, service);

  const requestConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    withCredentials: false,
  };
  willStart({
    service,
    payload,
    method,
    url,
  });
  let data;
  try {
    const fetchRes = await fetch(url, {
      method: METHOD,
      headers: requestConfig.headers,
      credentials: "omit",
      body: IS_GET ? undefined : JSON.stringify(payload),
    });
    if (fetchRes.ok) {
      data = await fetchRes.json();
      good_case();
    } else {
      bad_case();
    }

    function good_case() {
      const info = {
        data,
        url,
        method,
        response: fetchRes,
      };
      if (!data) {
        return _successful_(
          [],
          "no hubo data"
        );
      }
      if (isTable) {
        data = unpackTable(data);
        info.data = data;
      }
      if (HTTP_IS_ERROR([data, data[0]][+Array.isArray(data)])) {
        _successful_([], "el fetch es un error");
      } else {
        _successful_(data);
      }

      function _successful_(data, message) {
        if (message) {
          message = `Caso base, Hubo respuesta (good case) pero ${message}`;
          info.message = message;
          console.log(message);
        }
        successful(data, info);
      }
    }

    function bad_case() {
      failure(
        {
          status: "error",
          message: "Error en la respuesta, no se obtuvo",
          errorData: data || fetchRes.statusText,
          url,
          method,
          service,
        },
        rejectPromise
      );
    }
  } catch (err) {
    console.error(err);
    failure(
      {
        msg: `Error fatal try-catch, ${METHOD} en ${url}`,
        err,
        url,
        method,
        service,
      },
      rejectPromise
    );
  } finally {
    willEnd({ data, service, payload, method, url });
  }
  return data;
};

export function rejectPromise(txt, reject, bugTracking = {}) {
  console.error(txt.message ? txt.message : txt, bugTracking);
  const { err } = bugTracking;
  if (err) {
    console.error(err);
  }
  reject(txt);
}

export const HTTP_GET = ({
  buildEndpoint,
  service = "robot_backend",
  checkErrors = () => 0, // Por defecto no hay errores
  successful,
  failure = (info) => {
    // Por defecto los GET sólo deben imprimir el error
    console.error(info);
  },
  ...rest
}) => {
  const error = checkErrors();
  if (error) {
    failure(
      {
        status: "error",
        message: "Se chequearon errores y se encontró inconsistencia",
        error,
      },
      rejectPromise
    );
    return Promise.reject(error);
  }
  const url = buildUrlFromService(buildEndpoint, service);
  return SINGLETON_EFFECT({
    url,
    failure,
    successful,
    ...rest,
  });
};

export const HTTP_POST = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "post" });
};

export const HTTP_PUT = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "put" });
};

export const HTTP_PATH = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "path" });
};

export const HTTP_PATCH = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "patch" });
};

export function HTTP_DATA_ERROR(data) {
  return HTTP_IS_ERROR([data, data[0]][+Array.isArray(data)]);
}

export function HTTP_IS_ERROR(data) {
  if (!data) {
    return;
  }
  const { status, $status, status_code } = data;

  return [
    processFlag(status),
    processFlag($status),
    processFlag(status_code),
  ].some((x) => x === true);

  function processFlag(flag) {
    if (!flag) {
      return false;
    }
    return flag == "error" || (typeof flag === "number" && flag >= 400);
  }
}
