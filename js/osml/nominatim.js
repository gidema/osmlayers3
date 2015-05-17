goog.require('ol.layer.Vector');
goog.require('osml');
goog.require('osml.Query');
goog.require('osml.SearchBox');
goog.require('osml.format.OSMXML');
goog.provide('osml.NominatimSearchBox');
goog.provide('osml.NominatimLayer');
goog.provide('osml.NominatimSource');

/**
 * @author Gertjan Idema <mail@gertjanidema.nl>
 *
 */
osml.NominatimData = function() {
    this.extent_;
    this.places_ = {};
    this.nodes_ = {};
    this.ways_ = {};
    this.relations_ = {};
};
osml.NominatimData.prototype.parse = function(data) {
    this.extent_ = osml.NominatimData.getExtent(data[0]);
    goog.array.forEach(data, function(obj, index) {
        var extent = osml.NominatimData.getExtent(obj);
        this.extent_ = ol.extent.extend(this.extent_, extent);
        this.places_[obj.place_id] = obj;
        switch (obj.osm_type) {
        case 'node':
            this.nodes_[obj.osm_id] = obj;
            break;
        case 'way':
            this.ways_[obj.osm_id] = obj;
            break;
        case 'relation':
            this.relations_[obj.osm_id] = obj;
            break;
        };
        
    }, this);
};
osml.NominatimData.prototype.getExtent = function() {
    return this.extent_;
};
osml.NominatimData.prototype.getNodes = function() {
    return this.nodes_;
};
osml.NominatimData.prototype.getWays = function() {
    return this.ways_;
};
osml.NominatimData.prototype.getRelations = function() {
    return this.relations_;
};

// create an ol.Extent object from a nominatim object
osml.NominatimData.getExtent = function(obj) {
    var bbox = obj.boundingbox;
    return [parseFloat(bbox[2]), parseFloat(bbox[0]), 
            parseFloat(bbox[3]), parseFloat(bbox[1])];
};

osml.NominatimSearchBox = function(options) {
    // @private
    this.layer_ = new osml.NominatimLayer();
    if (goog.isString(options.div)) {
        options.element = document.createElement('div');
        var target = document.getElementById(options.div);
        options.target = target;
    };
    goog.base(this, options);
    this.resultMinZoom = 12;
    this.lang = 'nl';
    this.textLabel = 'Search for:';
    this.textNoHits = 'Not found.';

    //----------------------------------------------------------------------
    //  vars
    //----------------------------------------------------------------------
    this.labelDiv =  null;
    this.switcher =  null;
    this.labelDiv =  null;
    this.form = null;
    this.input = null;
    this.resultDiv = null;

    //----------------------------------------------------------------------
    //  init
    //----------------------------------------------------------------------
    this.allowSelection = true;
    this.draw();
};
goog.inherits(osml.NominatimSearchBox, ol.control.Control);

osml.NominatimSearchBox.prototype.setMap = function(map) {
    goog.base(this, 'setMap', map);
    map.addLayer(this.getLayer());
};
osml.NominatimSearchBox.prototype.getLayer = function() {
    return this.layer_;
};
//----------------------------------------------------------------------
    //  destroy
    //----------------------------------------------------------------------

osml.NominatimSearchBox.prototype.destroy = function() {
    if (this.div) { 
        this.stopObservingElement(this.div);
    }
    this.form  = null;
    this.input = null;
    this.labelDiv = null;
    this.switcher = null;
    this.labelSpan = null;
    this.labelSpan2 = null;
    this.resultDiv = null;
    ol.control.Control.prototype.destroy.apply(this, arguments);
};

//----------------------------------------------------------------------
//  create html and make control visible
//----------------------------------------------------------------------

osml.NominatimSearchBox.prototype.draw = function() {
    this.labelDiv = document.createElement('div');
    this.labelDiv.className = 'label';

    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('name', 'q');
    this.input.control=this;

    this.form = document.createElement('form');
    this.form.style.display = 'inline';
    this.form.appendChild(this.input);
    this.form.onsubmit = goog.bind(this.formOnSubmit, this);

    this.element.appendChild(this.labelDiv);
    this.element.appendChild(this.form);
};

//----------------------------------------------------------------------
//  event handling
//----------------------------------------------------------------------

osml.NominatimSearchBox.prototype.formOnSubmit = function() {
    var source = this.getLayer().getSource();
    source.setQuery(this.form.elements.q.value);
    source.loadNominatim(false);
    return false;
};

osml.NominatimSource = function(layer, opt_options) {
    this.layer_ = layer;
    this.defaultLimit = 50;
    this.lastQuery_ = {};
    this.name = osml.NominatimSource.getNextId_();
    var geometryFactory = new osml.NominatimGeometryFactory(this);
    goog.base(this, {
        format : new osml.format.OSMXML({geometryFactory: geometryFactory}),
        loader : goog.bind(this.loader, this),
        strategy : function(extent, resolution) {
            return [ extent ];
        },
        projection: 'EPSG:3857'
    });
};
goog.inherits(osml.NominatimSource, ol.source.ServerVector);

osml.NominatimSource.id = 1;
osml.NominatimSource.getNextId_ = function() {
    return 'nominatimSource' + osml.NominatimSource.id++;
};
osml.NominatimSource.url = 'http://nominatim.openstreetmap.org/search';

osml.NominatimSource.prototype.getLayer = function() {
    return this.layer_;
};

osml.NominatimSource.prototype.cancel = function() {
    this.onReady();
};
osml.NominatimSource.prototype.loadNominatim = function(bounded) {
    this.onStart();
    if (!bounded) {
        this.clear();
    };
    if (this.query_ == '') {
        return;
    }
    //------------------------------------------------------------
    //  uri
    //------------------------------------------------------------
//    var uri = new goog.Uri(osml.NominatimSource.url);
//    uri.setParameterValue('q', this.query_);
//    uri.setParameterValue('format', 'json');
//    uri.setParameterValue('addressdetails', 0);
//    uri.setParameterValue('limit', this.defaultLimit);
//
//    if (bounded) {
//        var map = osml.site.map;
//        var extent = map.getView().calculateExtent(map.getSize());
//        var projection = map.getView().getProjection();
//        var extent4326 = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
//        uri.setParameterValue('viewbox', extent4326.join(','));
//        uri.setParameterValue('bounded', true);
//    };
    var data = {
        q: this.query_,
        format: 'json',
        addressdetails:  0,
        limit: this.defaultLimit
    };
    if (bounded) {
        var map = osml.site.map;
        var extent = map.getView().calculateExtent(map.getSize());
        var projection = map.getView().getProjection();
        var extent4326 = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
        data.viewbox = extent4326.join(',');
        data.bounded = true;
    };
    $.ajax({
        dataType: "json",
        url: osml.NominatimSource.url,
        data: data,
        success: goog.bind(this.processNominatimResults, this),
        error: goog.bind(this.errorHandler, this),
        statusCode: {
            404: function() {
              alert( "page not found" );
            },
            503: function() {
              alert("Service not available");
            }
          }
      });
};

osml.NominatimSource.prototype.load = function(query) {
    this.onStart();
    this.lastQuery_ = query;
    if (!goog.isDef(query.extent)) {
        this.clear();
    };
    var q = [query.what, query.where, query.name].join(',');
    //------------------------------------------------------------
    //  uri
    //------------------------------------------------------------
//    var uri = new goog.Uri(osml.NominatimSource.url);
//    uri.setParameterValue('q', this.query_);
//    uri.setParameterValue('format', 'json');
//    uri.setParameterValue('addressdetails', 0);
//    uri.setParameterValue('limit', this.defaultLimit);
//
//    if (bounded) {
//        var map = osml.site.map;
//        var extent = map.getView().calculateExtent(map.getSize());
//        var projection = map.getView().getProjection();
//        var extent4326 = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
//        uri.setParameterValue('viewbox', extent4326.join(','));
//        uri.setParameterValue('bounded', true);
//    };
    var data = {
        q: q,
        format: 'json',
        addressdetails:  0,
        limit: this.defaultLimit
    };
    if (goog.isDef(query.extent)) {
        var map = osml.site.map;
        var projection = map.getView().getProjection();
        var extent4326 = ol.proj.transformExtent(query.extent, projection, 'EPSG:4326');
        data.viewbox = extent4326.join(',');
        data.bounded = true;
    };
    $.ajax({
        dataType: "json",
        url: osml.NominatimSource.url,
        data: data,
        success: goog.bind(this.processNominatimResults, this),
        error: goog.bind(this.errorHandler, this),
        statusCode: {
            404: function() {
              alert( "page not found" );
            },
            503: function() {
              alert("Service not available");
            }
          }
      });
};

osml.NominatimSource.prototype.loader = function(extent, resolution, projection) {
    if (this.preventReload_) {
        this.preventReload_ = false;
        return;
    };
    var query = this.lastQuery_;
    query.extent = extent;
    this.load(query);
};

osml.NominatimSource.prototype.processNominatimResults = function(data, status) {
    if (status != 'success') {
        this.cancel();
        alert('The seach was unsuccesfull.');
        return;
    };
    if (data.length == 0) {
        this.cancel();
        alert('No results were found.');
        return;
    };
    var dataSet = new osml.NominatimData();
    this.currentDataSet = dataSet;
    dataSet.parse(data);
    var nodeIds = goog.object.getKeys(dataSet.getNodes());
    if (nodeIds.length > 0) {
        var url = 'http://api.openstreetmap.org/api/0.6/nodes';
        url = osml.formatUrl(url, {nodes: nodeIds.join(',')});
        $.ajax(url).then(goog.bind(function(response) {
            this.addFeatures(this.readFeatures(response));
       }, this));
    };
    var wayIds = goog.object.getKeys(dataSet.getWays());
    if (wayIds.length > 0) {
        var url = 'http://api.openstreetmap.org/api/0.6/ways';
        url = osml.formatUrl(url, {ways: wayIds.join(',')});
        $.ajax(url).then(goog.bind(function(response) {
            this.addFeatures(this.readFeatures(response));
       }, this));
    };
    var relationIds = goog.object.getKeys(dataSet.getRelations());
    if (relationIds.length > 0) {
        var url = 'http://api.openstreetmap.org/api/0.6/relations';
        url = osml.formatUrl(url, {relations: relationIds.join(',')});
        $.ajax(url).then(goog.bind(function(response) {
            this.addFeatures(this.readFeatures(response));
       }, this));
    };
//  progressControl.ready(self.name);
    this.afterDownload();
};

osml.NominatimSource.prototype.errorHandler = function(jqXHR, status, errorThrown) {
    alert(errorThrown);
    this.cancel();
};

// TODO use a standard event for this if available
osml.NominatimSource.prototype.afterDownload = function() {
    var map = osml.site.map;
    var projection = map.getView().getProjection();
    var resultExtent = ol.proj.transformExtent(this.currentDataSet.getExtent(),
            'EPSG:4326', projection);
    this.preventReload_ = true;
    map.getView().fitExtent(resultExtent, map.getSize());
    if (map.getView().getZoom() > 16) {
        map.getView().setZoom(16);
    };
    this.getLayer().setVisible(true);
    this.onReady();
};
// TODO replace onStart and OnReady by real event handlers
osml.NominatimSource.prototype.onStart = function() {
    var progressControl = osml.site.progressControl;
    progressControl.start(this.name);
};
osml.NominatimSource.prototype.onReady = function() {
    var progressControl = osml.site.progressControl;
    progressControl.ready(this.name);
};

osml.NominatimLayer = function(options) {
    var image = new ol.style.Icon( {
        src: 'lib/img/marker.png',
        width: 20,
        height: 24,
        yOffset: -24
    });
    var style = new ol.style.Style( {
        image: image
    });
    var source = new osml.NominatimSource(this);
    goog.base(this, {
        style : style,
        source : source
    });
    this.setVisible(false);
};
goog.inherits(osml.NominatimLayer, ol.layer.Vector);

osml.NominatimGeometryFactory = function(source) {
    this.source = source;
};
osml.NominatimGeometryFactory.prototype.geometryForWay = function(values, objectStack, id) {
    var w = this.source.currentDataSet.getWays()[id];
    return new ol.geom.Point([parseFloat(w.lon), parseFloat(w.lat)]);
};
osml.NominatimGeometryFactory.prototype.geometryForRelation = function(values, objectStack, id) {
    var r = this.source.currentDataSet.getRelations()[id];
    return new ol.geom.Point([parseFloat(r.lon), parseFloat(r.lat)]);
};