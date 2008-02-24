// writes the pagination microformat: http://userscripts.org/scripts/show/23175
function unpaginate(items, next, pane) {
  var a = $X(next);
  if (!$X("count("+ items +")") && !a)
    return; // neither items nor next link; abort!
  addMeta("items-xpath", items);
  if ($X(pane) instanceof Node)
    addMeta("pagination-container", pane);
  if (a)
    addLink("next", a.href);
}
