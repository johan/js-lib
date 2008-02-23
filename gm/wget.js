// list nodes matching this expression, optionally relative to the node `root'
function $x( xpath, root ) {
  var doc = root ? root.evaluate ? root : root.ownerDocument : document, next;
  var got = doc.evaluate( xpath, root||doc, null, 0, null ), result = [];
  switch (got.resultType) {
    case got.STRING_TYPE:
      return got.stringValue;
    case got.NUMBER_TYPE:
      return got.numberValue;
    case got.BOOLEAN_TYPE:
      return got.booleanValue;
    default:
      while (next = got.iterateNext())
	result.push( next );
      return result;
  }
}

function $X( xpath, root ) {
  var got = $x( xpath, root );
  return got instanceof Array ? got[0] : got;
}


// Fetches url, $x slices it up, and then invokes cb(nodes, url, dom, xhr)
function wget$x( url, cb/*( [DOMNodes], url, dom, xhr )*/, xpath ) {
  wget(url, function(xml, url, xhr) {
    cb( $x( xpath, xml ), url, xml, xhr );
  });
}

// Fetches url, $X slices it up, and then invokes cb(node, url, dom, xhr)
function wget$X( url, cb/*( DOMNode, url, dom, xhr )*/, xpath ) {
  wget(url, function(xml, url, xhr) {
    cb( $X( xpath, xml ), url, xml, xhr );
  });
}

// Fetches url, turns it into an HTML DOM, and then invokes cb(dom, url, xhr)
function wget( url, cb/*( dom, url, xhr )*/ ) {
  if (html2dom[url]) // cache hit?
    return html2dom(null, cb, url);
  GM_xmlhttpRequest({ method:'GET', url:url, onload:function( xhr ) {
    if (xhr.responseXML)
      cb( xhr.responseXML, url, xhr );
    else
      html2dom( xhr.responseText, cb, url, xhr );
  }});
}

// Well-behaved browers (Opera, maybe WebKit) could use this simple function:
// function html2dom( html, cb/*( xml, url, xhr )*/, url, xhr ) {
//   cb( (new DOMParser).parseFromString(html, "text/html"), url, xhr );
// }

// Firefox doesn't implement (new DOMParser).parseFromString(html, "text/html")
// (https://bugzilla.mozilla.org/show_bug.cgi?id=102699), so we need this hack:
function html2dom( html, cb/*( xml, url, xhr )*/, url, xhr ) {
  function loaded() {
    iframe.removeEventListener("load", loaded, false);
    doc.removeEventListener("DOMContentLoaded", loaded, false);
    var callbacks = cached.onload;
    delete cached.onload;
    //console.log("DOMContentLoaded of %x: cb %x", url, callbacks);
    callbacks.forEach(function(cb,i) { cb( doc, url, xhr ); });
  };

  var cached = html2dom[url]; // cache of all already loaded and rendered DOM:s
  if (cached)
    if (cached.onload)
      return cached.onload.push(cb);
    else
      return cb(cached.doc, cached.xhr, url);

  var iframe = document.createElement("iframe");
  iframe.style.height = iframe.style.width = "0";
  iframe.style.visibility = "hidden";
  iframe.style.position = "absolute";
  document.body.appendChild(iframe);

  iframe.contentWindow.location.href = url; // bypass cross domain issues

  html = html.replace(/[\n\r]+/g, " ").
    replace(/<script.*?<\/script>/ig, ""). // no code execution on injection!
    replace(/<body(\s+[^="']*=("[^"]*"|'[^']*'|[^'"\s]\S*))*\s*onload=("[^"]*"|'[^']*'|[^"']\S*)/ig, "<body$1" );

  var doc = iframe.contentDocument;
  html2dom[url] = cached = { doc:doc, onload:[cb], xhr:xhr };
  doc.open("text/html");
  iframe.addEventListener("load", loaded, false);
  doc.addEventListener("DOMContentLoaded", loaded, false);
  doc.write(html); // this may throw weird errors we can't catch or silence :-|
  doc.close();
}

html2dom.destroy = function() {
  for (var url in html2dom)
    if (html2dom.hasOwnProperty(url)) {
      var cache = html2dom[url];
      cache.doc = cache.onload = cache.xhr = null;
      delete html2dom[url];
    }
};

// functionally belongs to html2dom above (see location.href line for details)
try { // don't run this script recursively on wget() documents on other urls
  if (window.frameElement &&
      window.parent.location.href.replace(/#.*/, "") == location.href)
    return; // console.warn("Avoiding double firing on %x", location.href);
} catch(e) {
  //console.error("Double fire check error: %x", e);
}

window.addEventListener("unload", html2dom.destroy, false);
