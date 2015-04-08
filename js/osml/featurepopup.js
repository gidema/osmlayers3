goog.provide('osml.FeaturePopup');

goog.require('osml.Popup');
goog.require('osml.widgets.Widget');
goog.require('osml.widgets.nl');
goog.require('osml.preprocessors.Preprocessor');

/**
 * FeaturePopup
 * The FeaturePopup class creates the Popup window for the info about the selected OSM feature
 * 
 * TODO Create 1 instance for the Popup and update it when the feature changes
 */
osml.FeaturePopup = function(popupOptions) {
    this.popupCfg = popupOptions.definition;
    goog.base(this, {
        popupId: popupOptions.id,
        cssClass : popupOptions.cssClass
    });
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
goog.inherits(osml.FeaturePopup, osml.Popup);


  /*
   * Create the div element for a single feature
   */
osml.FeaturePopup.prototype.processFeature = function(feature) {
    var position = osml.getCenter(feature.getGeometry());
    this.setPosition(position);
    this.lonlat = ol.proj.transform(position, this.getMap().getView().getProjection(), 'EPSG:4326');
    var type = '';
    switch (feature.getGeometry().getType()) {
    case 'Point':
        type = 'node';
        break;
    case 'Line':
        type = 'way';
        break;
    }
    this.processElement({
        type : type,
        id : feature.getId(),
        tags : feature.getProperties(),
        usedTags : {},
        lonlat : this.lonlat,
        lon : this.lonlat[0],
        lat : this.lonlat[1],
        zoom : this.zoom
    });
};

/*
 * Create the popup content
 */
osml.FeaturePopup.prototype.processElement = function(data) {
    goog.array.forEach(this.preprocessors, function(preprocessor) {
        preprocessor.process(data);
    });
    
    var widget = osml.widgets.createWidget(this.popupCfg);
    widget.prepare(data);
    this.content.innerHTML = '';
    if (widget.check()) {
        widget.render(this.content);
    };
    this.show();
};
