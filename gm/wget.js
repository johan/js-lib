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

function wget$x( url, cb/*( [DOMNodes], url, xhr )*/, xpath ) {
  wget(url, function(xml, url, xhr) {
    cb( $x( xpath, xml ), url, xhr );
  });
}

function wget$X( url, cb/*( [DOMNodes], url, xhr )*/, xpath ) {
  wget(url, function(xml, url, xhr) {
    cb( $X( xpath, xml ), url, xhr );
  });
}

function wget( url, cb/*( xml, url, xhr )*/ ) {
  GM_xmlhttpRequest({ method:'GET', url:url, onload:function( xhr ) {
    if (xhr.responseXML)
      cb( xhr.responseXML, url, xhr );
    else
      html2dom( xhr.responseText, cb, url, xhr );
  }});
}

function html2dom( html, cb/*( xml, url, xhr )*/, url, xhr ) {
  function loaded() {
    var callbacks = cache[url].onload;
    delete cache[url].onload;
    console.log("DOMContentLoaded of %x: cb %x", url, callbacks);
    callbacks.forEach(function(cb) { cb( doc, url, xhr ); });
  };

  var cache = html2dom.cache || {};
  if (cache[url])
    if (cache[url].onload)
      return cache[url].onload.push(cb);
    else
      return cb(cache[url].doc, cache[url].xhr, url);

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
  cache[url] = { doc:doc, onload:[cb], xhr:xhr };
  doc.open("text/html");
  doc.write(html);
  doc.close();

  doc.addEventListener("DOMContentLoaded", loaded, false);

  html2dom.cache = cache;
}

try { // don't run this script recursively on wget() documents on other urls
  if (window.frameElement &&
      window.parent.location.href.replace(/#.*/, "") == location.href)
    return;
} catch(e) {}
