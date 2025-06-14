const mapping = { "@wallet": "/users/wallet" };

export function hrefManagement(props) {
  if (typeof props == "string") {
    props = { view: props };
  }
  window.assignNullish(props, { params: {} });
  props = decorators(props);
  props = autoParams(props);

  return props;

  function autoParams(props) {
    switch (props.view) {
      case "/users/wallet":
        if (window.assignNullish) {
          window.assignNullish(props.params, { "action-id": "investment" });
        }
        break;
    }
    return props;
  }

  function decorators(props) {
    if (mapping[props.view]) {
      props.view = mapping[props.view];
    }
    return props;
  }
}