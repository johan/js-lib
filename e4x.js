/**
 * Makes a DOM node (for the provided document), from an E4X XML tree literal
 */
function e2d(e4x, doc, xmlSettings) {
  e2d.parser = e2d.parser || new DOMParser;
  var xml = <testing xmlns="http://www.w3.org/1999/xhtml"/>;
  xml.tree = e4x;

  if (xmlSettings === undefined) {
    var old = XML.settings();
    XML.setSettings(xmlSettings || {
      ignoreProcessingInstructions:false,
      ignoreWhitespace:false,
      ignoreComments:false,
      prettyPrinting:false, prettyIndent:2
    });
  }
  var dom = e2d.parser.parseFromString(xml.toXMLString(), "text/xml");
  old && XML.setSettings(old);

  var tree = dom.documentElement.firstChild;
  while (tree && tree.nodeType != 1)
    tree = tree.nextSibling;
  return tree ? (doc || document).importNode( tree, true ) : null;
}

/**
 * Ditto, but given whichever XML serialization settings are in effect
 */
function e2d_random( e4x, doc ) {
  var xml = <testing xmlns="http://www.w3.org/1999/xhtml"/>;
  xml.tree = e4x;
  e4xToDom.parser = e4xToDom.parser || new DOMParser;
  var dom = e4xToDom.parser.parseFromString(xml.toXMLString(), "text/xml");
  var tree = dom.documentElement.firstChild;
  while (tree && tree.nodeType != 1)
    tree = tree.nextSibling;
  return tree ? (doc || document).importNode( tree, true ) : null;
}

/**
 * Makes an E4X node from a given DOM node
 */
function d2e(dom) {
  d2e.serializer = d2e.serializer || new XMLSerializer;
  return new XML(d2e.serializer.serializeToString(dom));
}
