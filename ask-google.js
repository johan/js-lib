// uses: http://ecmanaut.googlecode.com/svn/trunk/lib/jsonp.js
var all = [], args = [];

function askGoogle(query, cb) {
  function gotCount(json) {
    all.push(json);
    args.push([].slice.call(arguments));
    var n = json.value.items[0].content; // i e "1,310"
    cb(n && n.replace(/\D+/g, ""));
  }
  var u = "http://www.searchmash.com/results/" + query;
  JSONP.load("http://pipes.yahoo.com/pipes/pipe.run?u="+ encodeURIComponent(u) +
             "&p=estimatedCount&_id=332d9216d8910ba39e6c2577fd321a6a" +
             "&_render=json&_callback=", gotCount);
}

// uses: http://ecmanaut.googlecode.com/svn/trunk/lib/bind.js

// Asking for { plaintext:"Anthony", md5:"20f1aeb7819d7858684c898d1e98c1bb",
// sha1:, "c3f15d27bcb5ab07b71d7fd598f8800939f4d597" } would (presently) call
// cb({ plaintext: 8530000, md5: 1310, sha1: 1})
function askGoogleMulti(queries, cb) {
  function gotCount(key, n) {
    queries[key] = n;
    if (0 == --left)
      cb(queries);
  }
  var left = 0;
  for (var q in queries)
    if (queries.hasOwnProperty(q)) {
      askGoogle(queries[q], bind(gotCount, null, q));
      left++;
    }
}

// also uses:
//   http://ecmanaut.googlecode.com/svn/trunk/lib/md5.js
//   http://ecmanaut.googlecode.com/svn/trunk/lib/sha1.js

function testPasswordGoogleSafety(pwd, cb, testPlaintextToo) {
  var want = { md5: MD5.hex(pwd), sha1: SHA1.hex(pwd) };
  if (testPlaintextToo)
    want.plaintext = '"' + pwd +'"';
  askGoogleMulti(want, cb);
}
