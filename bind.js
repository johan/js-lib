function bind( fn, self ) {
  var args = [].slice.call(arguments, 2);
  return function() {
    fn.apply(self, args.concat([].slice.call(arguments)));
  };
}
