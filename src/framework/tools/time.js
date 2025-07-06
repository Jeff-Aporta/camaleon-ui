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

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Delayer(timedelay) {
  return new (class {
    constructor() {
      this.delay = -1;
      this.timedelay = timedelay;
    }

    setDelay(timedelay) {
      this.timedelay = timedelay;
    }

    ellapsed() {
      return Date.now() - this.delay;
    }

    isReady() {
      if (this.ellapsed() < this.timedelay) {
        return false;
      }
      this.delay = Date.now();
      return true;
    }
  })();
}
