import {
  unpackTable,
  buildUrlFromService,
  failureDefault,
  reEnvolve,
  getMessageError,
} from "./utils";

import { showSuccess, showWarning, showError } from "../themes/ui/Notifier.jsx";

export const responsePromises = {};
export const responseResults = {};

function SINGLETON_EFFECT({
  url,
  successful,
  failure = failureDefault,
  newfetch = () => 0,
  fetchcached = () => 0,
  useCache = true,
  timeCache = 15 * 1000,
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
          successful: (data) => {
            const data0 = data[0];
            if (!HTTP_IS_ERROR(data0)) {
              successful(data);
              responseResults[url] = data;
              resolve(data0);
            } else {
              forgot();
              failure(data0);
              resolve();
            }
          },
          failure: (...args) => {
            forgot();
            failure(...args);
            resolve();
          },
          ...rest,
        });
      } catch (err) {
        forgot();
        failure(err.message || err, {
          status: "error",
          message: "Ocurrió un error try-catch en singleton effect",
          url,
          value: responseResults[url],
          promise: responsePromises[url],
        });
        resolve();
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
      forgot();
      failure("No hubo respuesta", {
        status: "error",
        message: "Hay promesa pero no hubo respuesta",
        url,
        value: responseResults[url],
        promise: responsePromises[url],
      });
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
  willStart = () => 0, // Callback antes de la petición.
  willEnd = () => 0, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  successful = () => 0, // Callback para recibir el body de la respuesta (success o error)
  failure = failureDefault,
  isTable = false, // Si es true, transforma la respuesta con table2obj
}) => {
  if (!method) {
    throw new Error("Method is required, post | put | get | patch");
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
  try {
    const IS_GET = method === "get";
    const fetchOptions = {
      method: METHOD,
      headers: requestConfig.headers,
      credentials: "omit",
      body: IS_GET ? undefined : JSON.stringify(payload),
    };
    const fetchRes = await fetch(url, fetchOptions);
    if (!fetchRes.ok) {
      const errorData = await fetchRes.json().catch(() => fetchRes.statusText);
      throw new Error(JSON.stringify(errorData));
    }
    let data = await fetchRes.json();
    if (isTable && data) {
      data = unpackTable(data);
    }
    if (HTTP_IS_ERROR(data[0])) {
      failure(
        data,
        { data, requestUrl: url, response: fetchRes },
        rejectPromise
      );
    } else {
      successful(data, { data, requestUrl: url, response: fetchRes });
    }
    return data;
  } catch (err) {
    failure(
      `Error ${METHOD} en ${url}`,
      { err, url, method, service },
      rejectPromise
    );
  } finally {
    willEnd();
  }
};

function rejectPromise(txt, reject, bugTracking) {
  console.error(txt.message ? txt.message : txt, bugTracking);
  reject(txt);
}

export const HTTP_GET = ({
  buildEndpoint,
  setLoading,
  setApiData,
  service = "robot_backend",
  checkErrors = () => 0,
  willStart,
  willEnd,
  successful,
  failure = () => {},
  mock_default,
  ...rest
}) => {
  successful = reEnvolve(successful, setApiData);
  failure = reEnvolve(failure, (...args) => {
    // PROCEDIMIENTO DE MOCKS
    const use_mockup = Array.isArray(mock_default) && window.isDev();
    if (use_mockup) {
      showWarning(`Mockup en uso ${url}`);
      const fallback = unpackTable(mock_default);
      successful(fallback, {
        status: "simulated",
        message: "Mockup en uso",
        url,
        fallback,
      });
    }
  });
  if (setLoading) {
    willStart = reEnvolve(willStart, () => setLoading(true));
    willEnd = reEnvolve(willEnd, () => setLoading(false));
  }
  const error = checkErrors();
  if (error) {
    failure(
      error,
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

export function HTTP_IS_ERROR(data) {
  if (!data) {
    return;
  }
  const { status, $status, status_code } = data;

  return [
    processFlag(status),
    processFlag($status),
    processFlag(status_code),
  ].some(Boolean);

  function processFlag(flag) {
    if (!flag) {
      return false;
    }
    if (typeof flag == "number") {
      return flag >= 400;
    }
    return flag == "error";
  }
}
