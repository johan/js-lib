// Async lookup cache component which regularly self-updates its data from url.
//
// Calls done callback with contents of url, optionally pre-processed through
// opts.parse (if present). Updates from source at most once every opts.period
// milliseconds (a week, by default). Passes old data on load failure or null,
// if it hasn't got a saved copy -- overrideable by supplying an opts.onerror,
// an opts.fallback copy of default data that gets used, when an error occurred.
//
// Saves its cache under the GM_setValue key opts.what (or url, when not given).
function autoupdate(url, done, opts) {
  function ok(xhr) {
    if (200 != xhr.status) {
      fail();
    } else {
      last.t = (new Date).getTime();
      last.saved = xhr.responseText;
      GM_setValue(key, uneval(last));
      finish(last.saved);
    }
  }

  function finish(data) {
    done(parse(data));
  }

  opts = opts || {};
  var key = opts.what || url;
  var fail = opts.onerror || function(x) { finish(old); };
  var parse = opts.parse || function(x) { return x; };
  var period = opts.period || 864e5 * 7;

  var last = eval(GM_getValue(key, "({})"));
  var old = last.saved || opts.fallback || null;
  var dt = (new Date).getTime() - (last.t || 0);
  if (last.saved && dt < period)
    return finish(old);

  return GM_xmlHttpRequest({ url:url, method:"GET", onload:ok, onerror:fail });
}
