const params = {};
const paramListener = [];

export const driverParams = {
  get: (key) => gets([key])[0],
  set: (key, value, config) => sets({ [key]: value }, config),
  gets,
  sets,
};

function urlParamToString(params) {
  const url = `${window.location.pathname}?${params.toString()}`;
  return url;
}

export function addParamListener(listener) {
  paramListener.push(listener); // {"view-id": fn}
}

export function removeParamListener(listener) {
  if (typeof listener != "number") {
    listener = paramListener.indexOf(listener);
  }
  if (listener > -1) {
    paramListener.splice(listener, 1);
  }
}

export function _updateParams() {
  const newParams = getAllParams();
  paramListener.forEach((listener) => {
    Object.entries(listener).forEach(([names, fn]) => {
      names = names.replace(/\s/g, "").split(",");
      names.forEach((name) => {
        if (params[name] != newParams[name]) {
          fn({ name, old_value: params[name], new_value: newParams[name] });
        }
      });
    });
  });
  Object.assign(params, newParams);
}

function getAllParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function gets(...keys) {
  return keys.map((k) => new URLSearchParams(window.location.search).get(k));
}

function sets(entries, { reaload, save } = {}) {
  const params = new URLSearchParams(window.location.search);
  const initParams = params.toString();
  Object.entries(entries).forEach(([k, v]) => params.set(k, v));
  if (initParams !== params.toString()) {
    const url = urlParamToString(params);
    if (save) {
      _setURLParams("pushState", url);
    } else {
      _setURLParams("replaceState", url);
    }
    reload(reaload);
    _updateParams();
  }
}

function reload(ms_reaload) {
  if (ms_reaload == true) {
    ms_reaload = 0;
  }
  if (typeof ms_reaload == "number") {
    setTimeout(() => {
      window.location.reload();
    }, ms_reaload);
  }
}

export function _setURLParams(method, url, state = {}, title = document.title) {
  if (method !== "pushState" && method !== "replaceState") {
    throw new Error(`Método inválido: ${method}`);
  }
  window.history[method](state, title, url);
  _updateParams();
}
