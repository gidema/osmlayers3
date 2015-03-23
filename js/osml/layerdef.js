goog.provide('osml.LayerDef');

goog.require('osml');

osml.LayerDef = function(id, name, query, marker) {
  this.id = id;
  this.name = name;
  this.query = query;
  this.filter = this.createFilter(query);
  this.marker = marker;
};

osml.LayerDef.prototype.createFilter = function(query) {
    var f = "(";
    var parts = query.split(",");
    if (parts.length > 1) {
      $.each(parts, function(index, value) {
        f += "node" + value + "(bbox);way" + value + "(bbox);rel" + value + "(bbox);";
      });
      return f + ");(._;>;);out center;";
    }
    return "(node[" + query + "](bbox);way[" + query + "](bbox);rel[" + query + "](bbox););(._;>;);out center;";
};
