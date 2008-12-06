/**
 * Geocoder local storage addition to Google Maps API v2.55+
 * Usage:
 *  function gotAdr(coord, name) { ... }
 *  function notFound(name) { ... }
 *  function done(t) { alert("Done in "+ t +" ms."); }
 *  geocode(["Vancouver, British Columbia, Canada", "Stockholm, Sweden", ...],
 *          gotAdr, notFound, done);
 */
var gm_cache = loadCache(); // country => region [=> ...] => name => "lat,lng"
var geocache = new GFactualGeocodeCache; // google's own API for local lookup
var geocoder = aid(new GClientGeocoder(geocache)); // persistence aided coder

function loadCache() {
  function decode(s) {
    if (typeof JSON == "object")
      return JSON.parse(s);
    return eval("("+ s + ")");
  }
  return decode(globalStorage[document.domain].geocache || "{}");
}

function saveCache(data) {
  function json(o) {
    if (typeof JSON == "object")
      return JSON.stringify(o);
    return o.toSource().slice(1, -1); // get rid of surrounding ()s
  }
  return globalStorage[document.domain].geocache = json(data);
}


// wraps up a geocoder with local storage backing for geographic coordinates
function aid(geocoder) {
  function lookup(adr, cb) {
    function populateGeocache(pt) {
      if (pt) {
        var store, key;
        do {
          if (!Cache.hasOwnProperty(part))
            Cache[part] = {};
          store = Cache;
          Cache = Cache[part];
          key = part;
        } while (part = parts.pop());
        store[key] = pt.toUrlValue();

        saveCache(gm_cache);
      }
      cb(pt);
    }

    function point(coords) {
      var lat, lng;
      [lat, lng] = coords.split(",").map(function(s) parseInt(s, 10));
      return new GPoint(lat, lng);
    }

    var Cache = gm_cache;
    var parts = adr.split(/\s*,\s*/);
    var part;
    while (part = parts.pop())
      if (Cache.hasOwnProperty(part))
        Cache = Cache[part];
      else
        return geocoder.getLatLng(adr, populateGeocache);
    cb(point(Cache)); // leaf being the coordinate pair
  }

  var aidedGeocoder = {};
  aidedGeocoder.__proto__ = geocoder;
  aidedGeocoder.getLatLng = lookup;
  return aidedGeocoder;
}

// geocodes a list of addresses, firing onOk callback for each resolved point,
// onErr for the others. The callback is just fired once per unique address,
// the more common addresses being enqueued first. onDone, if provided, gets
// called with how many ms the lookup batch took.
function geocode(list, onOk/* point, adr */, onErr/* adr */, onDone/* ms */) {
  // uniquifies a list, with the most frequent items sorted on top
  function uniquify(list) {
    var count = {};
    for each (var adr in list)
      count[adr] = (count[adr] || 0) + 1;
    list = [];
    for (adr in count)
      list.push(adr);
    return list.sort(function(a, b) { return count[b] - count[a]; })
  }

  function gotCoord(point) {
    cache[place] = point;
    if (!point) {
      onErr && onErr(place);
    } else {
      onOk && onOk(point, place);
    }
    if (list.length)
      lookupNext();
    else if (onDone)
      onDone((new Date) - start);
  }

  function lookupNext() {
    geocoder.getLatLng(list.shift(), gotCoord);
  }

  var place;
  var start = new Date;
  if (!list.length) return;
  list = uniquify(list);
  lookupNext();
}
