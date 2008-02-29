var JSONP = {
  n:0,
  cb:{},
  err:{},

  load:function(url, cb, staticCallbackName) {
    function cleanup( failedURL ) {
      try {
	delete JSONP.cb[name];
	delete JSONP.err[name];
	if( script && script.parentNode )
	  script.parentNode.removeChild(script);
      } finally {
	failedURL && cb && cb(undefined, failedURL);
      }
    }

    var n = ++JSONP.n;
    var sURL = url;
    if( !staticCallbackName ) {
      if( -1 == sURL.indexOf("?") )
	sURL += "?";
      var last = /.$/.exec( sURL )[0];
      if( last != "=") {
        if( last != '&' && last != "?")
	  sURL += "&";
        sURL += 'callback=';
      }
    }

    var name = "cb" + n.toString(36);
    JSONP.err[name] = cleanup;
    JSONP.cb[name] = function(json) {
      cleanup(null);
      cb && cb(json, url);
    };

    var full = "JSONP.cb." + name;
    if( staticCallbackName )
      eval( staticCallbackName +"="+ full );
    sURL += full;

    var fail = "JSONP.err."+ name +"('"+ sURL +"');";
    var script = JSONP.script(document, sURL, fail);
    return JSONP.cb[name];
  },

  script:function( doc, url, err ) {
    err = err || "";
    if(!doc.body)
      try {
	var q = "'"+ err +"'";
        doc.write("<script src='"+ url +"' err="+ q +
		  " type='text/javascript'>"+ err + "</script>");
        return;
      }catch(e){}

    var script = doc.createElement("script");
    if( err ) {
      script.innerHTML = err;
      script.setAttribute("onerror", err);
    }
    script.type = "text/javascript";
    script.src = url;
    return doc.getElementsByTagName("head")[0].appendChild( script );
  }
};
