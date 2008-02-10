/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

function diffString( o, n ) {
  o = o.replace(/\s+$/, "");
  n = n.replace(/\s+$/, "");

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
  var str = "";

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  if (out.n.length == 0) {
    for (var i = 0; i < out.o.length; i++) {
      str += "<del>" + qhtml(out.o[i]) + oSpace[i] + "</del>";
    }
  } else {
    if (out.n[0].text == null) {
      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
        str += "<del>" + qhtml(out.o[n]) + oSpace[n] + "</del>";
      }
    }

    for (var i = 0; i < out.n.length; i++) {
      if (out.n[i].text == null) {
        str += "<ins>" + qhtml(out.n[i]) + nSpace[i] + "</ins>";
      } else {
        var pre = "";

        for (n = out.n[i].row + 1;
             n < out.o.length && out.o[n].text == null;
             n++) {
          pre += "<del>" + qhtml(out.o[n]) + oSpace[n] + "</del>";
        }
        str += " " + out.n[i].text + nSpace[i] + pre;
      }
    }
  }

  return str;
}

function randomColor() {
  return "rgb(" + (Math.random() * 100) + "%, " +
                  (Math.random() * 100) + "%, " +
                  (Math.random() * 100) + "%)";
}

function diffString2( o, n ) {
  o = o.replace(/\s+$/, "");
  n = n.replace(/\s+$/, "");

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  var os = "";
  var colors = [];
  for (var i = 0; i < out.o.length; i++) {
    colors[i] = randomColor();

    if (out.o[i].text != null) {
      os += '<span style="background-color:' +colors[i]+ '">' +
        qhtml(out.o[i].text) + oSpace[i] + "</span>";
    } else {
      os += "<del>" + qhtml(out.o[i]) + oSpace[i] + "</del>";
    }
  }

  var ns = "";
  for (var i = 0; i < out.n.length; i++) {
    if (out.n[i].text != null) {
      ns += '<span style="background-color:' +colors[out.n[i].row]+ '">' +
        qhtml(out.n[i].text) + nSpace[i] + "</span>";
    } else {
      ns += "<ins>" + qhtml(out.n[i]) + nSpace[i] + "</ins>";
    }
  }

  return { o:os, n:ns };
}

function diff( o, n ) {
  var ns = {}, os = {};

  for (var i = 0; i < n.length; i++) {
    if (ns[ n[i] ] == null)
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }

  for (var i = 0; i < o.length; i++) {
    if (os[ o[i] ] == null)
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }

  for (var i in ns) {
    if (ns[i].rows.length == 1 &&
        typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }

  for (var i = 0; i < n.length - 1; i++) {
    if (n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length &&
        o[n[i].row + 1].text == null && n[i+1] == o[n[i].row + 1]) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }

  for (var i = n.length - 1; i > 0; i--) {
    if (n[i].text != null && n[i-1].text == null && n[i].row > 0 &&
        o[n[i].row - 1].text == null && n[i-1] == o[n[i].row - 1]) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }

  return { o:o, n:n };
}

function qhtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").
    replace(/\x22/g, "&quot;");
}
