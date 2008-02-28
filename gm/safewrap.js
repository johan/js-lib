// Returns a wrapped function whose call chain is to be given call access to the
// GM privileged APIs (GM_setValue, GM_getValue, GM_xmlhttpRequest), regardless
// of whether executed by content or not. The wrapped function will not return
// a value, even if the original one did.
//
// Typical usage: unsafeWindow.foo = safeWrap(foo);
function safeWrap(f) {
  return function() {
    setTimeout.apply(window, [f, 0].concat([].slice.call(arguments, 1)));
  };
}
