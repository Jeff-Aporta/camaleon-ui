export const isMobile = (() => {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
})();

export function assignNullish(dst, src) {
  for (const key in src) {
    dst[key] = global.nullishNoF(dst[key], src[key]);
  }
  return dst;
}

Object.assign(window, { assignNullish });
