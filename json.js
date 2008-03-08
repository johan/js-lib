// @require http://ecmanaut.googlecode.com/svn/trunk/lib/isodate.js

var JSON = (function() {
  function decode(json) { // based on http://www.json.org/json2.js of 2008-02-14
    if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').replace(
      /"[^\x22\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
      ']').replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
      return eval("("+ text +")");
    throw new SyntaxError('JSON.parse');
  }

  function encode(v) {
    switch (typeof v) {
      case "undefined":		return "null";
      case "string":		return string(v);
      case "boolean":
      case "number":		return isFinite(v) ? ""+v : "null";
      case "object":

      if (v === null)		return "null";
      if (v instanceof Array)	return array(v);
      if (v instanceof Date)	return isodate(v);

      var o = ["{"], m, V;
      for (i in v) {
        if (v.hasOwnProperty(i)) {
          V = v[i];
          switch (typeof V) {
            case "undefined":
            case "function":
            case "unknown": break;
            default:
              if (m) o.push(",");
              m = 1;
              o.push(encode(i), ":", encode(V));
          }
        }
        o.push("}");
        return o.join("");
      }
    }
  }

  function array(a) {
    var o = ["["], i, l = a.length, v, m;
    for (i = 0; i < l; i++) {
      v = a[i];
      switch (typeof v) {
        case "undefined":
        case "function":
        case "unknown": break;
        default:
          if (m) o.push(",");
          m = 1;
          o.push(v === null ? "null" : encode(v));
      }
    }
    o.push("]");
    return o.join("");
  }

  function string(s) {
    if (r.test(s)) {
      return '"'+ s.replace(r, function(a, b) {
        var c = m[b];
        if (c) return c;
        c = b.charCodeAt().toString(16);
        return "\\u00"+ (c.length < 2 ? "0" : "") + c;
      }) +'"';
    }
    return '"'+ s +'"';
  }

  var r = /([\x00-\x1F\\\x22])/g;
  var m = { "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f",
            '"' : '\\"', "\\": "\\\\" };

  return { encode: encode, decode:decode };
})();
