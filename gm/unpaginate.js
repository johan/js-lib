// writes the pagination microformat: http://userscripts.org/scripts/show/23175
function unpaginate(items, next, pane) {
  function count(xpath) {
    return $X("count("+ xpath +")");
  }
  function arrayify(string) {
    if (typeof string == "string")
      return [string];
    return string;
  }

  items = arrayify(items).filter(count).shift();

  var a = $X(next);
  if (a || items) {
    //console.info("producing %x", location.href);
    addMeta("items-xpath", items);

    arrayify(pane).filter(count).forEach(function(xpath) {
      addMeta("pagination-container", xpath);
    });

    if (a.href) {
      addLink("next", a.href);
      addMeta("next-xpath", next);
    }
  }
}
