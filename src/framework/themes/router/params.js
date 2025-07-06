const params = {};
const paramListener = [];

export const driverParams = {
  get,
  set,
  init,
};

function init(key, ...rest) {
  if (typeof key == "object") {
    Object.entries(key).forEach(([k, v]) => init(k, v));
    return Object.entries(key).reduce((a, [k, v]) => (a[k] = get(k)[0]), {});
  }
  if (typeof key != "string") {
    console.error("driverParams.init: key must be a string", key);
    return;
  }
  if (!get(key)[0]) {
    set(key, ...rest);
  }
  return get(key)[0];
}

function get(...keys) {
  const RETURN = keys.map((k) =>
    new URLSearchParams(window.location.search).get(k)
  );
  return RETURN;
}

function set(key, value, { save = false, reaload = false } = {}) {
  if (typeof key == "string") {
    key = { [key]: value };
  } else if (typeof key != "object") {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const initParams = params.toString();
  Object.entries(key).forEach(([k, v]) => {
    if (v) {
      params.set(k, v);
    } else {
      params.delete(k);
    }
  });
  if (initParams !== params.toString()) {
    const url = urlParamToString(params);
    _setURLParams(["replaceState", "pushState"][+save], url);
    reload(reaload);
    _updateParams();
  }
}

function urlParamToString(params) {
  const url = `${window.location.pathname}?${params.toString()}`;
  return url;
}

function addParamListener(listener) {
  paramListener.push(listener); // {"view-id": fn}
}

function removeParamListener(listener) {
  if (typeof listener != "number") {
    listener = paramListener.indexOf(listener);
  }
  if (listener > -1) {
    paramListener.splice(listener, 1);
  }
}

export function subscribeParam(modelChange, context) {
  const handleListeners = {
    addParamListener: () => addParamListener(modelChange),
    removeParamListener: () => removeParamListener(modelChange),
  };
  if (context) {
    Object.assign(context, handleListeners);
  }
  return handleListeners;
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
