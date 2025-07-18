import { driverParams, subscribeParam } from "../themes/router/params.js";

import { firstUppercase } from "./tools.js";

export function DriverComponent(modelProps) {
  const RETURN = new (class {
    constructor() {
      const listSetups = [];
      const extra_context_global = {};
      const listBurnParams = [];
      this.burnParams = () => {
        listBurnParams.forEach((burnParam) => {
          burnParam();
        });
      };
      Object.entries(modelProps).forEach(([key, props]) => {
        if (typeof props == "function") {
          this[key] = props.bind(this);
          extra_context_global[key] = this[key];
          return;
        }
        if (typeof props != "object") {
          this[key] = props;
          extra_context_global[key] = props;
          return;
        }
        const saneoKey = firstUppercase(key);
        let {
          value,
          isNumber,
          digits,
          isArray,
          isInteger,
          isBoolean,
          freeze,
          min,
          max,
          nameParam,
          nameStorage,
          _setValidate_,
          _willSet_,
          _setup_,
          _getValidate_,
          update,
          links = [],
          mapCase,
          ...rest
        } = props;

        initValue();

        const [
          INIT_KEY,
          GET_KEY,
          _SET_KEY,
          SET_KEY,
          SET_NULLISH_KEY,
          UPDATE_KEY,
          EXISTS_KEY,
          ADD_LINK_KEY,
          REMOVE_LINK_KEY,
          BURN_PARAM_KEY,
          ARRAY_ADD_KEY,
          ARRAY_DELETE_KEY,
          ARRAY_PUSH_KEY,
          ARRAY_POP_KEY,
          ARRAY_REMOVEALL_KEY,
          MAPCASE_KEY,
          IS_EMPTY_KEY,
          IS_BOOLEAN_KEY,
        ] = [
          "init",
          "get",
          "_set",
          "set",
          "setNullish",
          "update",
          "exists",
          "addLink",
          "removeLink",
          "burnParam",
          "add",
          "delete",
          "push",
          "pop",
          "removeAll",
          "mapCase",
          "isEmpty",
          "is",
        ].map((x) => `${x}${saneoKey}`);

        const extra_context = {};

        const CONTEXT_GENERAL = (softSet = false) => ({
          init: this[INIT_KEY],
          getValue: this[GET_KEY],
          setValue: [this[SET_KEY], this[_SET_KEY]][+softSet],
          _setValue: this[_SET_KEY],
          setNullish: this[SET_NULLISH_KEY],
          exists: this[EXISTS_KEY],
          burnParam: this[BURN_PARAM_KEY],
          mapCase: this[MAPCASE_KEY],
          //--- Array methods
          add: this[ARRAY_ADD_KEY],
          delete: this[ARRAY_DELETE_KEY],
          push: this[ARRAY_PUSH_KEY],
          pop: this[ARRAY_POP_KEY],
          removeAll: this[ARRAY_REMOVEALL_KEY],
          ...(() => {
            if (!isArray) {
              return {};
            }
            return {
              some: (cb) => this[GET_KEY]().some(cb),
              every: (cb) => this[GET_KEY]().every(cb),
              find: (cb) => this[GET_KEY]().find(cb),
              filter: (cb) => this[GET_KEY]().filter(cb),
              map: (cb) => this[GET_KEY]().map(cb),
            };
          })(),
          //--- Component methods
          notifyLinks,
          update: this[UPDATE_KEY],
          addLink: this[ADD_LINK_KEY],
          removeLink: this[REMOVE_LINK_KEY],
          //--- Component props
          nameParam,
          getParam,
          nameStorage,
          getStorage,
          isNumber,
          isInteger,
          digits,
          min,
          max,
          ...extra_context_global,
          ...extra_context,
        });

        // burning keys
        this[GET_KEY] = GET.bind(this)();
        if(isBoolean){
          this[IS_BOOLEAN_KEY] = this[GET_KEY];
        }
        this[INIT_KEY] = INIT.bind(this)();
        this[EXISTS_KEY] = EXISTS.bind(this)();
        this[UPDATE_KEY] = UPDATE.bind(this)();
        this[BURN_PARAM_KEY] = BURN_PARAM.bind(this)();
        this[SET_KEY] = SET.bind(this)();
        this[_SET_KEY] = (newValue, config = {}) => {
          this[SET_KEY](newValue, { burnParam: false, ...config });
        };
        this[SET_NULLISH_KEY] = SET_NULLISH.bind(this)();
        this[ADD_LINK_KEY] = ADDLINK.bind(this)();
        this[REMOVE_LINK_KEY] = REMOVELINK.bind(this)();
        this[MAPCASE_KEY] = MAPCASE.bind(this)();
        if (isArray) {
          if (!value || !Array.isArray(value)) {
            value = [];
          }
          this[ARRAY_ADD_KEY] = ADDARRAY.bind(this)();
          this[ARRAY_DELETE_KEY] = DELETEARRAY.bind(this)();
          this[ARRAY_PUSH_KEY] = PUSHARRAY.bind(this)();
          this[ARRAY_POP_KEY] = POPARRAY.bind(this)();
          this[ARRAY_REMOVEALL_KEY] = REMOVEALLARRAY.bind(this)();
          this[IS_EMPTY_KEY] = IS_EMPTY.bind(this)();
        }
        EXTRA_CONTEXT.bind(this)();
        // end burning keys

        prepareSetup.bind(this)();

        if (nameParam) {
          listBurnParams.push(this[BURN_PARAM_KEY]);
          const { addParamListener } = subscribeParam({
            [nameParam]: ({ new_value }) => {
              this[SET_KEY](new_value);
            },
          });
          addParamListener();
        }

        function prepareSetup() {
          if (_setup_) {
            listSetups.push({
              fn: _setup_.bind(this),
              context: CONTEXT_GENERAL.bind(this),
            });
          }
        }

        function initValue() {
          if (nameStorage) {
            if (!value) {
              value = localStorage.getItem(nameStorage);
            }
          }
          if (nameParam) {
            if (!value) {
              value = driverParams.getOne(nameParam);
              if (nameStorage && value) {
                localStorage.setItem(nameStorage, value);
              }
            }
          }
        }

        function conserveName(key) {
          return (
            key == key.toUpperCase() ||
            ["$", "_"].some((s) => key.startsWith(s))
          );
        }

        function IS_EMPTY() {
          return () => {
            return this[GET_KEY]().length === 0;
          };
        }

        function MAPCASE() {
          return (key, value) => {
            if (!mapCase) {
              return "Define el mapCase";
            }
            if (!key) {
              return "Define el key";
            }
            if (typeof key != "string") {
              return `El key debe ser un string: ${key}`;
            }
            if (!mapCase[key]) {
              return `El key no existe: ${key}`;
            }
            if (!value) {
              value = this[GET_KEY]();
            }
            if (typeof value != "string") {
              value = String(value);
            }
            let RETURN = mapCase[key][value];
            if (RETURN == null || RETURN == undefined) {
              RETURN = mapCase[key].default;
            }
            if (typeof RETURN == "function") {
              RETURN = RETURN();
            }
            return RETURN;
          };
        }

        function REMOVEALLARRAY() {
          return () => {
            this[SET_KEY]([]);
          };
        }

        function POPARRAY() {
          return () => {
            const arr = [...this[GET_KEY]()];
            arr.pop();
            this[SET_KEY](arr);
          };
        }

        function PUSHARRAY() {
          return (item) => {
            const arr = [...this[GET_KEY]()];
            arr.push(item);
            this[SET_KEY](arr);
          };
        }

        function ADDARRAY() {
          return (key, item) => {
            const arr = [...this[GET_KEY]()];
            if (!arr) {
              return;
            }
            arr[key] = item;
            this[SET_KEY](arr);
          };
        }

        function DELETEARRAY() {
          return (key) => {
            const arr = [...this[GET_KEY]()];
            if (!arr) {
              return;
            }
            delete arr[key];
            this[SET_KEY](arr);
          };
        }

        function EXTRA_CONTEXT() {
          const originalKeys = Object.keys(rest);
          originalKeys
            .map((x) => (x.endsWith(saneoKey) ? x : `${x}${saneoKey}`))
            .forEach((maskKey, i) => {
              const originalKey = originalKeys[i];
              const prop = rest[originalKey];
              const conserve_name = conserveName(originalKey);
              let name;
              let value;
              name = [maskKey, originalKey][+conserve_name];
              if (typeof prop == "function") {
                case_function.bind(this)();
              } else {
                case_variable.bind(this)();
              }

              function case_variable() {
                value = prop;
                if (conserve_name) {
                  this[name] = value;
                  extra_context[name] = value;
                  extra_context_global[name] = value;
                } else {
                  const saneoOriginalKey = firstUppercase(originalKey);
                  const saneoName = firstUppercase(name);
                  const getName = `get${saneoName}`;
                  const setName = `set${saneoName}`;
                  this[getName] = () => value;
                  this[setName] = (newValue) => {
                    value = newValue;
                  };
                  extra_context[`get${saneoOriginalKey}`] = this[getName];
                  extra_context[`set${saneoOriginalKey}`] = this[setName];
                }
              }

              function case_function() {
                value = (props) => {
                  if (["get", "is"].some((x) => name.startsWith(x))) {
                    if (props == null || props == undefined) {
                      return prop.bind(this)(CONTEXT_GENERAL());
                    }
                  }
                  return prop.bind(this)(props, CONTEXT_GENERAL());
                };
                this[name] = value;
                extra_context[originalKey] = value;
              }
            });
        }

        function ADDLINK() {
          return (component) => {
            links.push(component);
          };
        }

        function REMOVELINK() {
          return (component) => {
            links = links.filter((c) => c !== component);
          };
        }

        function INIT() {
          return (...inits) => {
            if (this[EXISTS_KEY]()) {
              return;
            }
            this[SET_KEY](
              inits.find((x) => x != null && x != undefined),
              {
                burnParam: false,
                notifyLinks: false,
                force: true,
              }
            );
          };
        }

        function GET() {
          return (param) => {
            let RETURN = global.nullish(value, getStorage(), getParam());
            RETURN = filterNumber(RETURN);
            RETURN = filterBoolean(RETURN);
            RETURN = filterArray(RETURN);
            if (param && isArray) {
              RETURN = RETURN[param];
            }
            if (_getValidate_ && typeof _getValidate_ == "function") {
              RETURN = _getValidate_.bind(this)(RETURN, CONTEXT_GENERAL());
            }
            return RETURN;
          };
        }

        function getStorage() {
          if (!nameStorage) {
            return;
          }
          return localStorage.getItem(nameStorage);
        }

        function getParam() {
          if (!nameParam) {
            return;
          }
          return driverParams.getOne(nameParam);
        }

        function SET_NULLISH() {
          return (newValue) => {
            if (newValue == null || newValue == undefined) {
              return;
            }
            this[SET_KEY](newValue);
          };
        }

        function SET() {
          return (
            newValue,
            { burnParam = true, notifyLinks: notify = true, force = false } = {}
          ) => {
            if (freeze && !force) {
              return;
            }
            let getValue = this[GET_KEY]();
            if (typeof newValue == "function") {
              newValue = newValue(getValue);
            }
            const wasChange = () => newValue !== getValue;
            if (!wasChange()) {
              return;
            }
            if (_setValidate_ && typeof _setValidate_ == "function") {
              newValue = _setValidate_.bind(this)(newValue, {
                ...CONTEXT_GENERAL(),
                oldValue: getValue,
              });
            }
            newValue = filterNumber(newValue);
            newValue = filterBoolean(newValue);
            newValue = filterArray(newValue);
            if (wasChange()) {
              BURN_STORAGE.bind(this)(newValue);
              burnParam && this[BURN_PARAM_KEY](newValue);
              notify && notifyLinks({ oldValue: getValue, newValue });
              if (_willSet_ && typeof _willSet_ == "function") {
                _willSet_.bind(this)(newValue, {
                  ...CONTEXT_GENERAL(),
                  oldValue: getValue,
                });
              }
              value = newValue;
            }
          };
        }

        function filterBoolean(newValue) {
          if (isBoolean) {
            newValue = Boolean(newValue);
          }
          return newValue;
        }

        function filterArray(newValue) {
          if (isArray) {
            if (typeof newValue == "string") {
              try {
                newValue = JSON.parse(newValue);
              } catch (error) {
                console.error("Error al parsear el array", error);
              }
            }
            if (!Array.isArray(newValue)) {
              newValue = [newValue];
            }
            if (!newValue) {
              newValue = [];
            }
          }
          return newValue;
        }

        function filterNumber(newValue) {
          if (isNumber || isInteger) {
            if (isInteger) {
              newValue = parseInt(newValue);
            } else {
              newValue = +newValue;
              if (typeof digits == "number") {
                newValue = +newValue.toFixed(digits);
              }
            }
            if (typeof min == "number") {
              newValue = Math.max(newValue, min);
            }
            if (typeof max == "number") {
              newValue = Math.min(newValue, max);
            }
            if (!newValue) {
              newValue = 0;
            }
          }
          return newValue;
        }

        function BURN_STORAGE() {
          return (newValue) => {
            if (!nameStorage) {
              return;
            }
            if (newValue == null || newValue == undefined) {
              newValue = this[GET_KEY]();
            }
            if (isArray) {
              newValue = JSON.stringify(newValue);
            }
            localStorage.setItem(nameStorage, newValue);
          };
        }

        function BURN_PARAM() {
          return (newValue) => {
            if (!nameParam) {
              return;
            }
            if (newValue == null || newValue == undefined) {
              newValue = this[GET_KEY]();
            }
            if (isArray) {
              newValue = JSON.stringify(newValue);
            }
            driverParams.set({ [nameParam]: newValue });
          };
        }

        function UPDATE() {
          const RETURN = [
            async () => {
              const component = this[GET_KEY]();
              if (component && component.forceUpdate) {
                component.forceUpdate();
              }
            },
            () => {
              update.bind(this)(CONTEXT_GENERAL());
            },
          ][+!!update];
          return RETURN;
        }

        function EXISTS() {
          return () => {
            let value = this[GET_KEY]();
            if (value == null || value == undefined) {
              return false;
            }
            return true;
          };
        }

        async function notifyLinks({ oldValue, newValue }) {
          links.forEach((c) => {
            if (c.forceUpdate) {
              c.forceUpdate();
            } else if (typeof c == "function") {
              c({ ...CONTEXT_GENERAL(), oldValue, newValue });
            } else {
              console.error("El enlace no es valido " + saneoKey, c);
            }
          });
        }
      });

      listSetups.forEach((setup) => {
        setup.fn(setup.context(true));
      });
    }
  })();
  return RETURN;
}
