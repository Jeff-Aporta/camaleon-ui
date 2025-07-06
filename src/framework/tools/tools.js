import { driverParams } from "../themes/router/params.js";

export const isMobile = (() => {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
})();

export const IS_GITHUB = (() => {
  return window.location.hostname.includes(".github");
})();

export const IS_LOCAL = (() => {
  return ["localhost", "127.0.0.1"].some((h) =>
    window.location.hostname.includes(h)
  );
})();

export function firstUppercase(str) {
  const retorno = str.charAt(0).toUpperCase() + str.slice(1);
  return retorno;
}

export function DriverComponent(props) {
  return new (class {
    constructor() {
      Object.entries(props).forEach(([key, props]) => {
        if (typeof props == "function") {
          this[key] = props.bind(this);
          return;
        }
        const saneoKey = firstUppercase(key);
        let {
          value,
          nameParam,
          nameStorage,
          initParam,
          get = true,
          set = true,
          update,
          links = [],
          ...rest
        } = props;
        const GET_KEY = `get${saneoKey}`;
        const SET_KEY = `set${saneoKey}`;
        const UPDATE_KEY = `update${saneoKey}`;
        const EXISTS_KEY = `exists${saneoKey}`;
        const ADD_LINK_KEY = `addLink${saneoKey}`;
        const REMOVE_LINK_KEY = `removeLink${saneoKey}`;

        if (nameStorage && !value) {
          value = localStorage.getItem(nameStorage);
          if (nameParam) {
            driverParams.set({ [nameParam]: value });
          }
        }

        const contextGeneral = () => ({
          getValue: this[GET_KEY],
          setValue: this[SET_KEY],
          notifyLinks,
        });
        {
          const originalKeys = Object.keys(rest);
          originalKeys
            .map((x) => `${x}${saneoKey}`)
            .forEach((maskKey, i) => {
              const prop = rest[originalKeys[i]];
              if (typeof prop == "function") {
                this[maskKey] = (props) =>
                  prop.bind(this)(props, contextGeneral());
              } else {
                this[maskKey] = prop;
              }
            });
        }
        this[GET_KEY] = function () {
          let param;
          let storage;
          if (nameParam) {
            if (initParam) {
              param = driverParams.init(nameParam, initParam);
            } else {
              param = driverParams.get(nameParam)[0];
            }
          }
          if (nameStorage) {
            storage = localStorage.getItem(nameStorage);
          }
          if (typeof get == "function") {
            return get.bind(this)({ param, storage, value });
          }
          return storage || param || value;
        }.bind(this);
        this[EXISTS_KEY] = function () {
          let value = this[GET_KEY]();
          if (value == null || value == undefined) {
            return false;
          }
          if (value.toString) {
            value = value.toString().trim();
          }
          return !!value;
        }.bind(this);
        if (!update) {
          this[UPDATE_KEY] =
            function () {
              const component = this[GET_KEY]();
              if (component && component.forceUpdate) {
                component.forceUpdate();
            } else {
              console.error(
                "El componente no es valido " + saneoKey,
                component
              );
            }
          }.bind(this);
        }
        this[SET_KEY] = function (newValue) {
          let param;
          if (typeof newValue == "function") {
            newValue = newValue(this[GET_KEY]());
          }
          const wasChange = newValue !== value;
          if (!wasChange) {
            return;
          }
          if (nameParam) {
            driverParams.set({ [nameParam]: newValue });
          }
          if (nameStorage) {
            localStorage.setItem(nameStorage, newValue);
          }
          if (typeof set == "function") {
            set.bind(this)(value, contextGeneral());
          }
          notifyLinks(value, newValue);
          value = newValue;
        }.bind(this);
        this[ADD_LINK_KEY] = function (component) {
          links.push(component);
        }.bind(this);
        this[REMOVE_LINK_KEY] = function (component) {
          links = links.filter((c) => c !== component);
        }.bind(this);

        function notifyLinks(oldValue, newValue) {
          links.forEach((c) => {
            if (c.forceUpdate) {
              c.forceUpdate();
            } else if (typeof c == "function") {
              c({ ...contextGeneral(), oldValue, newValue });
            } else {
              console.error("El enlace no es valido " + saneoKey, c);
            }
          });
        }
      });
    }
  })();
}
