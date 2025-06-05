export const isMobile = (() => {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
})();
