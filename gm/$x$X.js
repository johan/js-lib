// ==UserScript==
// @name           $X and $x: XPath shorthand API
// @namespace      http://code.google.com/p/ecmanaut/
// @description    Evaluates an XPath expression, returning the first ($X) / all ($x) nodes matching the query. If the result is a string, number or boolean, return the corresponding javascript basic type. The root parameter is an optional context node relative to which to resolve the expression.
// ==/UserScript==

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
