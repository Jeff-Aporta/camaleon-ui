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
export const responseErrors = {};

const SECONDS_TO_CACHE = 15;

function SINGLETON_EFFECT({
  url,
  successful,
  failure = failureDefault,
  newfetch = () => 0,
  fetchcached = () => 0,
  mock_default,
  ...rest
}) {
  successful = reEnvolve(successful, (json) => {
    responseResults[url] = json;
  });
  failure = reEnvolve(failure, (err) => {
    responseErrors[url] = err;
  });
  if (!responsePromises[url]) {
    newfetch({ url });
    responsePromises[url] = new Promise(async (resolve, reject) => {
      try {
        const respuesta = await HTTP_REQUEST({
          method: "get",
          isTable: true,
          buildEndpoint: () => url,
          successful,
          failure,
          ...rest,
        });
        resolve(respuesta);
      } catch (err) {
        reject(err);
      }
    });
    setTimeout(() => {
      delete responsePromises[url];
      delete responseResults[url];
      delete responseErrors[url];
    }, SECONDS_TO_CACHE * 1000);
  } else {
    fetchcached({ url });
    if (responseResults[url]) {
      successful(responseResults[url], {
        status: "success",
        message: "",
        url,
      });
    } else if (responseErrors[url]) {
      const err = responseErrors[url];
      failure(err.message || `Hubo un error en ${url}`, {
        url,
        err,
      });
    }
  }
  return responsePromises[url];
}

export const HTTP_REQUEST = async ({
  method, // post | put | path
  buildEndpoint, // Función que construye la URL de la API.
  payload = {}, // Payload para la petición.
  willStart = () => 0, // Callback antes de la petición.
  willEnd = () => 0, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  successful = () => 0, // Callback para recibir el body de la respuesta (success o error)
  failure = failureDefault,
  isTable = false, // Si es true, transforma la respuesta con table2obj
  mock_default,
}) => {
  if (!method) {
    const msg = "Method is required";
    throw new Error(msg);
  }
  const { CONTEXT } = window;
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
    successful(data, { data, requestUrl: url, response: fetchRes });
    return data;
  } catch (err) {
    const { content } = mock_default ?? {};
    failure(err.response?.data, err, content);
  } finally {
    willEnd();
  }
};

export const HTTP_GET = ({
  buildEndpoint,
  setLoading,
  setApiData,
  service = "robot_backend",
  checkErrors = () => 0,
  willStart,
  willEnd,
  successful,
  failure,
  ...rest
}) => {
  successful = reEnvolve(successful, setApiData);
  failure = reEnvolve(failure, (...args) => {
    {
      // PROCEDIMIENTO DE MOCKS
      const { CONTEXT } = window;
      const [data, info, mock_default] = args;
      const use_mockup = (() => {
        const esArray = Array.isArray(mock_default);
        return esArray && CONTEXT === "dev";
      })();
      if (use_mockup) {
        showWarning("Mockup en uso", url);
        const fallback = unpackTable(mock_default);
        successful(fallback, {
          status: "simulated",
          message: "Mockup en uso",
          url,
          fallback,
        });
      }
    }
  });
  if (setLoading) {
    willStart = reEnvolve(willStart, () => setLoading(true));
    willEnd = reEnvolve(willEnd, () => setLoading(false));
  }
  const error = checkErrors();
  if (error) {
    failure(error, {
      status: "error",
      message: "Se chequearon errores y se encontró inconsistencia",
      error,
    });
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
