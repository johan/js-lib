// writes the pagination microformat: http://userscripts.org/scripts/show/23175
function unpaginate(items, next, pane) {
  function count(xpath) {
    return $X("count("+ xpath +")");
  }

  if (typeof items == "string")
    items = [items];
  items = items.filter(count).shift();

  var a = $X(next);
  if (a || items) {
    //console.info("producing %x", location.href);
    addMeta("items-xpath", items);
    if (typeof $X(pane) == "object")
      addMeta("pagination-container", pane);
    if (a.href)
      addLink("next", a.href);
  }
}
