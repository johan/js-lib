// if we have Google Gears, set up google to the google.gears.factory structure
var google = unsafeWindow.google && unsafeWindow.google.gears &&
  unsafeWindow.google.gears.factory && unsafeWindow.google ||
  unsafeWindow.GearsFactory && {gears:{factory:new unsafeWindow.GearsFactory}};

try {
  var db = google && google.gears.factory.create("beta.database", "1.0");
  if (google && !db) return console.error("GM: Failed to get Google Gears db.");
} catch(e) {
  console.warn("%x: exiting -- %x", location.href, e.message);
}

// like db.query, but only ever returns a single row
db.one = function() {
  var got = db.query.apply(db, arguments);
  return got && got[0];
};

// First argument is the sql query string (splicing in data by way of "?"), rest
// arguments are each positional ? map's value. (To batch insert, pass an Array
// each successive remainder args set, and the sql will be iterated in turn.)
// All operations will be performed against the database named db.db, or "data".
db.query = function query(sql, args) {
  var data = [], rs;
  var read = sql.match(/^SELECT/i);
  var write = sql.match/(/^INSERT/i) && "object" == typeof array;
  if (!write)
    args = [[].slice.call(arguments, 1)];
  try {
    //console.info( "Query: %x %x", sql, args );
    db.open(db.db || "data");
    if (!read) db.execute("BEGIN").close();

    while (args.length) // execute one or more queries
      rs = db.execute(sql, args.shift());

    while (rs.isValidRow()) { // collect one or more results
      data.push(rs.fieldCount() == 1 ? rs.field(0) : row2js( rs ));
      rs.close();
      rs.next();
    }

    rs.close(); // free all resources
    if (!read) db.execute("COMMIT").close();
    db && db.close();
    return data;
  } catch( e ) {
    console.warn( e.message );
    rs && rs.close && rs.close();
    db && db.close();
  }
};

db.row2js = function row2js( rs ) {
  var obj = {};
  if (rs.isValidRow()) {
    var max = rs.fieldCount();
    for (var i = 0; i < max; i++)
      obj[rs.fieldName(i)] = rs.field(i);
    rs.next();
  }
  return obj;
};
