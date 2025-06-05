const _startMillis = Date.now();

export function millis() {
  return Date.now() - _startMillis;
}

export function day() {
  return new Date().getDate();
}

export function hour() {
  return new Date().getHours();
}

export function minute() {
  return new Date().getMinutes();
}

export function second() {
  return new Date().getSeconds();
}

export function month() {
  return new Date().getMonth() + 1;
}

export function year() {
  return new Date().getFullYear();
}
