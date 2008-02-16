// ==UserScript==
// @name           $X and $x: XPath shorthand API
// @namespace      http://code.google.com/p/ecmanaut/
// @description    Evaluates an XPath expression, returning the first ($X) / all ($x) nodes matching the query. If the result is a string, number or boolean, return the corresponding javascript basic type. The root parameter is an optional context node relative to which to resolve the expression, type optionally sets a different XPath resolving type than XPathResult.ANY_TYPE, if you want to optimize extensively.
// ==/UserScript==

// list nodes matching this expression, optionally relative to the node `root'
function $x( xpath, root, type ) {
  var doc = root ? root.evaluate ? root : root.ownerDocument : document, next;
  var got = doc.evaluate( xpath, root||doc, null, type||0, null ), result = [];
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

function $X( xpath, root, type ) {
  var got = $x( xpath, root, type );
  return got instanceof Array ? got[0] : got;
}
