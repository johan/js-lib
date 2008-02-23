function addMeta(name, content) {
  var meta = document.createElement("meta");
  meta.name = name;
  meta.content = content;
  return document.documentElement.firstChild.appendChild(meta);
}

function addLink(rel, href) {
  var link = document.createElement("link");
  meta.rel = rel;
  meta.href = href;
  return document.documentElement.firstChild.appendChild(link);
}
