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

function ellapsed(delay) {
  return Date.now() - delay;
}

export function Delayer(timedelay) {
  let delay = -1;
  let id = 0;

  return new (class {
    setDelay(newTimedelay) {
      timedelay = newTimedelay;
    }

    incrementId() {
      id++;
    }

    getId() {
      return id;
    }

    isTheId(id_, reset = false) {
      const isTheId = id == id_;
      if (reset) {
        this.resetId();
      }
      return isTheId;
    }

    resetId() {
      id = 0;
    }

    getDelay() {
      return timedelay;
    }

    isReady(cbIncrement = false, id) {
      const ready = ellapsed(delay) >= timedelay;
      if (ready) {
        if (id) {
          if (!this.isTheId(id)) {
            return false;
          }
        }
        this.resetId();
        delay = Date.now();
      } else {
        if (cbIncrement) {
          this.incrementId();
          if (typeof cbIncrement == "function") {
            setTimeout(() => cbIncrement(id), timedelay);
          }
        }
      }
      return ready;
    }
  })();
}
