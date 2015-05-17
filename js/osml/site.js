goog.provide('osml.Site');

goog.require('osml.OverpassLayer');
goog.require('osml.LayerTreeControl');
goog.require('osml.LayerDef');
goog.require('osml.FeaturePopup');
goog.require('osml.ProgressControl');
goog.require('osml.SearchBox');

osml.Site = function(options) {
    this.zoom_data_limit = 12;
    this.layers = {};
    this.progressControl = options.progressControl;
    this.searchBox = options.searchBox;
    var mapOptions = options.map;
    this.createMap(mapOptions);
    this.createPopups(options.popups);
    var ltcOptions = options.layerTreeControl;
    if (ltcOptions) {
        this.createLayerTreeControl(ltcOptions);
    };
    
};

osml.Site.prototype.createMap = function(options) {
    var view = new ol.View({
        center : ol.proj.transform([ options.lon, options.lat ], 'EPSG:4326',
                'EPSG:3857'),
        zoom : options.zoom
    });
    this.map = new ol.Map({
        target : options.div || 'map',
        view : view,
        layers : options.baseLayers
    });
    this.createBaseLayers();
    
    // The controls
    var map = this.map;
    if (goog.isDef(this.progressControl)) {
        map.addControl(this.progressControl);
    };
    if (goog.isDef(this.searchBox)) {
        map.addControl(this.searchBox);
    };
    map.addInteraction(new ol.interaction.DragZoom());
    map.on('click', this.onClick, this);
};
osml.Site.prototype.createPopups = function(popupsCfg) {
    this.popups = {};
    for (popupId in popupsCfg) {
        var popupCfg = popupsCfg[popupId];
        var popup = new osml.FeaturePopup(popupCfg);
        this.map.addOverlay(popup);
        this.popups[popupId] = popup;
    }
};
osml.Site.prototype.onClick = function(evt) {
    var collector = new osml.FeatureCollector();
    this.map.forEachFeatureAtPixel(evt.pixel, collector.callback, collector);
    var features = collector.features;
    if (features.length > 0) {
        var feature = features[0];
        var popup = this.popups['default'];
        popup.processFeature(feature);
//        this.map.addOverlay(popup);
    }
};
osml.Site.prototype.createOsmLayers = function(layerData) {
    var map = this.map;
    $.each(this.layerData, function(id, l) {
        var layerDef = new LayerDef(id, l.name, l.query, l.icon);
        var layer = this.makeLayer(layerDef);
        this.layers[id] = layer;
        map.addLayer(layer);
    });
};

// Create a layer tree control
osml.Site.prototype.createLayerTreeControl = function(options) {
    var target = document.getElementById(options.div);
    var element = document.createElement('div');
    this.layerTree = new osml.LayerTree(options);
    this.ltc = new osml.LayerTreeControl(this.layerTree, {
        element: element,
        target: target
    });
    goog.object.forEach(this.layerTree.layers, function(layer, id) {
        this.layers[id] = layer;
//        this.map.addLayer(layer);
    }, this);
    this.map.addControl(this.ltc);
};

/*
 * Create the base layers
 */
osml.Site.prototype.createBaseLayers = function() {
    //In verband met de leesbaarheid heb ik MapQuest bovenaan gezet. De kleuren van die kaart zijn wat rustiger 
    //waardoor de contrasten met de kleuren van de gebruikte tekens wat groter is.

    //Mapquest  - De kaart die bovenstaat in deze lijst is de kaart die default wordt geopend.  
    var mqSource = new ol.source.MapQuest({layer: 'osm'});
    var mapquest = new ol.layer.Tile({source: mqSource});
//    ''MapQuest','http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png',
//      {'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a>' +
//         'Contributors<br>Cartography © MapQuest<br>Overlay data licensed under ODbL '}); 
//    layers.push(mapquest);
//
//    //Mapnik
    var mapnik = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
//        new OpenLayers.Layer.OSM.Mapnik("Mapnik",{'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" ' +
//      'target="_blank">OpenStreetMap</a> Contributors<br>Cartography licensed as CC-BY-SA<br>Overlay data licensed under ODbL '});
//    layers.push(layerMapnik);
//    
//    //Topo
    var arcgis = new ol.layer.Tile({
        source: new ol.source.XYZ({
            logo : 'ArcGIS World Topo',
            url : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}',
            attribution: 'Cartography © <a href="http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer" target="_blank">ArcGIS</a><br>Overlay data OpenStreetMap Contributors, licensed under ODbL '
        })
    });
//    layers.push(arcgis);
// 
//    //Google    
//    var googlesat = new OpenLayers.Layer.Google("Google Sat",{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 19});
//    layers.push(googlesat);
//
//    return layers;
    this.map.addLayer(mapquest);
};

osml.Site.prototype.zoomValid = function() {
    return this.map.getZoom() > this.zoom_data_limit;
};

/*
 * Set the status
 */
osml.Site.prototype.setStatusText = function(text) {
    var element = document.getElementById(this.statusDiv);
    if (element != null) {
        element.innerHTML = text;
        if (text != "") {
            element.style.visibility = "visible";
        }
        else {
            element.style.visibility = "hidden";
        }
    }
};
