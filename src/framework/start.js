export const nullish = (value, ...rest) => {
  if (value === null || value === undefined) {
    return rest.find((r) => {
      if (typeof r === "function") {
        r = r();
      }
      if (r !== null && r !== undefined) {
        return r;
      }
    });
  }
  if (typeof value === "function") {
    value = value();
  }
  if (value !== null && value !== undefined) {
    return value;
  }
  if (rest.length > 0) {
    return nullish(...rest);
  }
};

export const nullishNoF = (value, ...rest) => {
  if (value === null || value === undefined) {
    return rest.find((r) => {
      if (r !== null && r !== undefined) {
        return r;
      }
    });
  }
  return value;
};

export function assignNullish(dst, src) {
  for (const key in src) {
    dst[key] = nullishNoF(dst[key], src[key]);
  }
  return dst;
}

[global, window].forEach((g) => {
  Object.assign(g, {
    nullish,
    nullishNoF,
    assignNullish,
  });
});
