var node = (function() {

function $(id) { return document.getElementById(id); }

var expandos = { id: 1, className: 1, title: 1, type: 1, checked: 1 };

return function node(opt) {
  function attr(name) {
    var value = opt[name];
    delete opt[name];
    return value;
  }

  var id = attr("id");
  var tag = $(id);
  if (!tag) {
    tag = attr("tag") || document.createElement("div");
    var xml = tag.toXMLString && tag.toXMLString();
    if (xml) {
      tag = document.createElement("div");
      t.innerHTML = xml;
      var r = document.createRange();
      r.selectNodeContents(t);
      tag = r.extractContents();
      if (tag.childNodes.length == 1)
        tag = tag.firstChild;
    }

    var after = attr("after"), replace = attr("replace");
    var before = opt.prepend ? opt.prepend.firstChild : attr("before");
    var parent = attr("prepend") || attr("append") ||
                   (before || after || replace || {}).parentNode;
    if (parent) {
      if (before)
        parent.insertBefore(tag, before);
      else if (after)
        parent.insertBefore(tag, after.nextSibling);
      else if (replace)
        parent.replaceChild(tag, replace);
      else
        parent.appendChild(tag);
    }
    if (id) tag.id = id;
  }

  var html = attr("html"); if ("string" == typeof html) tag.innerHTML = html;
  var text = attr("text"); if ("string" == typeof text) tag.textContent = text;

  var style = attr("style");
  if (style)
    for (var prop in style)
      tag.style[prop] = style[prop];

  for (prop in opt)
    if (expandos[prop])
      tag[prop] = opt[prop];
    else
      tag.setAttribute(prop, opt[prop]+"");

  return tag;
};

})();
