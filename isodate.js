function isodate(d) {
  function pad(n) { return (n < 10 ? "0" : "")+n; };
  return d.getFullYear() +"-"+ pad(1+d.getMonth()) +"-"+ pad(d.getDate()) +" "+
    pad(d.getHours()) +":"+ pad(d.getMinutes()) +":"+ pad(d.getSeconds());
}
