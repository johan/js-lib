// A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
// in FIPS PUB 180-1 Version 2.1a Copyright Paul Johnston 2000 - 2002.
// Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet, Johan S
// Distributed under the BSD License. Details: http://pajhome.org.uk/crypt/md5

var SHA1 = (function() {
  // Calculate the SHA-1 of an array of big-endian words, and a bit length
  function core_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w=[];
    var a=1732584193, b=-271733879, c=-1732584194, d=271733878, e=-1009589776;
    for (var i = 0; i < x.length; i += 16) {
      var oa = a, ob = b, oc = c, od = d, oe = e;
      for (var j = 0; j < 80; j++) {
        w[j] = (j < 16) ? x[i + j] : rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
        var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                         safe_add(safe_add(e, w[j]), sha1_kt(j)));
        e = d; d = c; c = rol(b, 30); b = a; a = t;
      }
      a = safe_add(a, oa); b = safe_add(b, ob); c = safe_add(c, oc);
      d = safe_add(d, od); e = safe_add(e, oe);
    }
    return [a, b, c, d, e];
  }

  // Perform the appropriate triplet combination function for current iteration
  function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  // Determine the appropriate additive constant for the current iteration
  function sha1_kt(t) {
    return (t < 20) ?  1518500249 : (t < 40) ? 1859775393 :
           (t < 60) ? -1894007588 : -899497514;
  }

  // Add integers, wrapping at 2^32. This uses 16-bit operations internally
  // to work around bugs in some JS interpreters.
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  // Bitwise rotate a 32-bit number to the left.
  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  // Convert an 8-bit or 16-bit string to an array of big-endian words
  // In 8-bit function, characters >255 have their hi-byte silently ignored.
  function str2binb(str, chrsz) {
    var bin = [];
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
      bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
    return bin;
  }

  // Convert an array of big-endian words to a hex string.
  function binb2hex( data ) {
    for (var hex="", i=0; i<data.length; i++) {
      while (data[i] < 0) data[i] += 0x100000000;
      hex += ("0000000"+(data[i].toString(16))).slice( -8 );
    }
    return hex;
  }

  // Convert an array of big-endian words to a string
  function binb2str(bin, chrsz) {
    var str = "", mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
      str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
    return str;
  }

  // Convert an array of big-endian words to a base-64 string
  function binb2b64(binarray, b64pad) {
    var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str="";
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                  | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8)
                  |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32)
          str += b64pad;
        else
          str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
      }
    }
    return str;
  }

  function hash(s, w) {
    w = w || 8;
    return core_sha1(str2binb(s, w), s.length * w);
  }

  return {
    hex:function(s, w) { return binb2hex(hash(s, w)); },
    hash:function(s, w) { return binb2str(hash(s, w), w||8); },
    base64:function(s, w, p) { return binb2b64(hash(s, w), p==null?"=":p); }
  };
})();
