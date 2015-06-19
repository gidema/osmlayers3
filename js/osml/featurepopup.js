goog.provide('osml.FeaturePopupFactory');
goog.provide('osml.FeaturePopup');

goog.require('osml.Popup');
goog.require('osml.widgets.Widget');
goog.require('osml.widgets.nl');
goog.require('osml.preprocessors.Preprocessor');

/**
 * FeaturePopupFactoryOptions
 * 
 * The FeaturePopupFactory class creates the Popup window for the info about the selected OSM feature
 * 
 * @constructor
 */
osml.FeaturePopupFactory = function(map, options) {
    this.map_ = map;
    this.id = options.id;
    this.popupCfg = options.definition;
    this.cssClass = options.cssClass;
    this.popup = null;
    this.preprocessors = [
        new osml.preprocessors.HideTagsPreprocessor(['source', 'ref:bag', 'source:date']),
        new osml.preprocessors.NamePreprocessor(),
        new osml.preprocessors.AmenityPreprocessor(),
        new osml.preprocessors.TourismPreprocessor(),
        new osml.preprocessors.TagPreprocessor('sport'),
        new osml.preprocessors.TagPreprocessor('shop'),
        new osml.preprocessors.TagPreprocessor('leisure'),
        new osml.preprocessors.TagPreprocessor('historic'),
        new osml.preprocessors.TagPreprocessor('highway'),
        new osml.preprocessors.TagPreprocessor('man_made'),
        new osml.preprocessors.TagPreprocessor('emergency')
    ];
};
/**
 * Get the related Map
 * @returns {ol.Map}
 */
osml.FeaturePopupFactory.prototype.getMap_ = function() {
    return this.map_;
};
/**
 * Create a new popup for a single feature
 * @param {ol.Feature} feature
 */
osml.FeaturePopupFactory.prototype.createPopup = function(feature) {
    // Remove the existing popup if any
    if (this.popup) {
        this.getMap_().removeOverlay(this.popup);
    };
    var position = osml.getCenter(feature.getGeometry());
    var element = this.createElement(feature, position);
    this.popup = new osml.Popup({
        element: element,
        position: position,
        popupId: this.id
    });
    this.getMap_().addOverlay(this.popup);
};

/**
 * Create the div element for a single feature
 * @param {ol.Feature} feature
 * @param {ol.Coordinate} position
 */
osml.FeaturePopupFactory.prototype.createElement = function(feature, position) {
    var element = document.createElement('div');
    element.className = this.cssClass;
    this.lonlat = ol.proj.transform(position, this.getMap_().getView().getProjection(), 'EPSG:4326');
    var type = '';
    switch (feature.getGeometry().getType()) {
    case 'Point':
        type = 'node';
        break;
    case 'Line':
        type = 'way';
        break;
    };
    /** @type {osmlx.FeatureData} */
    var data = {
        type : type,
        id : feature.getId(),
        tags : /** @type {Object<string, string>} */ feature.getProperties(),
        lonlat : this.lonlat,
        lon : this.lonlat[0],
        lat : this.lonlat[1],
        /** @type Object<string, boolean> */
        usedTags : {},
        zoom : this.getMap_().getView().getZoom()
    };
    goog.array.forEach(this.preprocessors, function(preprocessor) {
        preprocessor.process(data);
    });
    
    var widget = osml.widgets.createWidget(this.popupCfg);
    widget.prepare(data);
    if (widget.check()) {
        widget.render(element);
    };
    return element;
};
