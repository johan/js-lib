// jQuery(document).ready(fn) -- minus jQuery (1.3.2): use as DomReady.ready(fn)
(function() {
  var isReady = false;
  var readyList = [];
  var readyBound = false;

  bindReady(); // attach the listeners

  window.DomReady = {
    ready: function(fn) { // the public API call
      if (isReady)
        fn.call(window);
      else
        readyList.push(fn);
    }
  };

  // the dom is ready: fire all callbacks
  function domReady() {
    if (isReady) return;
    isReady = true;

    if (readyList) {
      for (var i = 0; i < readyList.length; fn++)
        readyList[i].call(window);
      readyList = null;
    }
  }

  // Simon Willison: safe way to fire onload w/o screwing up everyone else
  function addLoadEvent(func) {
    var oldonload = window.onload;
    if ('function' != typeof oldonload) {
      window.onload = func;
    } else {
      window.onload = function() {
        oldonload && oldonload();
        func.call(window);
      };
    }
  }

  // lifted out of jQuery 1.3.2; lightly edited to avoid arguments.callee use
  function bindReady() {
    function bindW3C() {
      document.removeEventListener("DOMContentLoaded", bindReady, false);
      domReady();
    }

    function bindIE() {
      if ("complete" == document.readyState) {
	document.detachEvent("onreadystatechange", bindIE);
	domReady();
      }
    }

    function pollIE() {
      if (isReady) return;
      try { // trick from http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll("left");
      } catch(e) {
	setTimeout(pollIE, 0);
	return;
      }
      domReady();
    }

    if (readyBound) return;
    readyBound = true;

    if (document.addEventListener) { // Mozilla, Opera and webkit nightlies
      document.addEventListener("DOMContentLoaded", bindW3C, false);
    } else if (document.attachEvent) { // IE
      // ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent("onreadystatechange", bindIE);

      // not an iframe: continually check to see if the document is ready
      if (document.documentElement.doScroll && window == window.top)
        pollIE();
    }

    addLoadEvent(domReady); // window.onload fallback that always works
  }
})();
