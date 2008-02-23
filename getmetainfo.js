// Example usage:
// getMetainfo({ link: ["next"],
//               meta: ["items-xpath", "pagination-container"] })
// yields { next: <url>, "items-xpath": <xpath expr> } for a page equipped
// with a microformat with a /html/head/link[@rel="next" and @href] and a
// /html/head/meta[@name="items-xpath" and @content] tag.
function getMetainfo(specs, doc) {
  var info = {};
  var find = { link: "rel", meta: "name" };
  var pick = { link: "href", meta: "content" };
  for (var tag in specs) {
    var xpath = '/html/head/'+ tag +'[@'+ find[tag] +'="';
    var values = specs[tag];
    for (var i = 0; i < values.length; i++) {
      var node = $X(xpath + values[i] +'"]', doc);
      if (node)
        info[values[i]] = node[pick[tag]];
    }
  }
  return info;
}

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
