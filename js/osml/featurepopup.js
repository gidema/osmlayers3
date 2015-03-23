goog.provide('osml.FeaturePopup');

goog.require('osml.Popup');
goog.require('osml.widgets.Widget');
goog.require('osml.widgets.nl');

/**
 * FeaturePopup
 * The FeaturePopup class creates the Popup window for the info about the selected OSM feature
 */
osml.FeaturePopup = function(popupId, feature, map) {
    var position = osml.getCenter(feature.getGeometry());
    goog.base(this, map, {
        popupId: popupId,
        position: position,
        popupClass : 'featurePopup'
    });
    this.lonlat = ol.proj.transform(position, map.getView().getProjection(), 'EPSG:4326');
    this.processFeature(feature);
};
goog.inherits(osml.FeaturePopup, osml.Popup);

//osml.FeaturePopup.prototype.init = function(map) {
//    // Remove the existing overlay if it exists
//    map.getOverlays().forEach(function(overlay) {
//        if (overlay.getElement().id == this.popupId) {
//            map.removeOverlay(overlay);
//        };
//    }, this);
//    container = document.createElement('div');
//    container.id = this.popupId;
//    container.setAttribute('class', 'olPopup');
//    content = document.createElement('div');
//    content.id = 'popup-content';
//    content.setAttribute('class', 'olPopupContent');
//    container.appendChild(content);
//    closer = document.createElement('a');
//    closer.id = 'popup-closer';
//    closer.setAttribute('class', 'ol-popup-closer');
//    closer.setAttribute('href', '#');
//    container.appendChild(closer);
//    this.zoom = map.getView().getZoom();
//    this.container = container;
//    this.setElement(container);
//    this.content = content;
//    this.closer = closer;
//    /**
//    * Add a click handler to hide the popup.
//    * @return {boolean} Don't follow the href.
//    */
//    closer.onclick = function() {
//        container.style.display = 'none';
//        closer.blur();
//        return false;
//    };
//};

  /*
   * Create the div element for a single feature
   */
osml.FeaturePopup.prototype.processFeature = function(feature) {
    var type = '';
    switch (feature.getGeometry().getType()) {
    case 'Point':
        type = 'node';
        break;
    case 'Line':
        type = 'way';
        break;
    }
    return this.processElement({
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
    var tabPane = new osml.widgets.TabPane([
        {
            id : 'popup-main',
            name : 'General',
            'class' : 'feature-main',
            widget : this.createMainTab()
        },
        {
            id : 'popup-detail',
            name : 'Detail',
            'class' : 'feature-detail',
            widget : this.createDetailTab()
        },
        {
            id : 'popup-view',
            name : 'View',
            'class' : 'feature-view',
            widget : this.createViewTab()
        },
        {
            id : 'popup-edit',
            name : 'Edit',
            'class' : 'feature-edit',
            widget : this.createEditTab()
        }]);
    tabPane.prepare(data);
    if (tabPane.check()) {
        tabPane.render(this.content);
    };
    // Create the tab layout
    $(this.content).tabs();
};

osml.FeaturePopup.prototype.createMainTab = function() {
    return osml.widgets.createWidget(this.createMainTabConfig());
//    var widgets = [
//            'osml.widgets.Title',
//            'osml.widgets.nl.Departures',
//            'osml.widgets.Address',
//            'osml.widgets.Phone',
//            'osml.widgets.Email',
//            new Array('osml.widgets.Website', 'website'),
//            new Array('osml.widgets.Website', 'url'),
//            'osml.widgets.Twitter',
//            'osml.widgets.Facebook',
//            'osml.widgets.Wikipedia',
//            'osml.widgets.Directions'
//        ];
//    return new osml.widgets.WidgetGroup(widgets, 'plain');
};
osml.FeaturePopup.prototype.createDetailTab = function() {
    return osml.widgets.createWidget(this.createDetailTabConfig());
//    var widgets = [
//        'osml.widgets.BrowseOsm',
//        'osml.widgets.UnusedTags'
//    ];
//    return new osml.widgets.WidgetGroup(widgets, 'plain');
};
osml.FeaturePopup.prototype.createViewTab = function() {
    return osml.widgets.createWidget(this.createViewTabConfig());
//    var widgets = [
//        'osml.widgets.ViewOsm',
//        'osml.widgets.ViewGoogle',
//        'osml.widgets.ViewBing',
//        'osml.widgets.ViewMtM',
//        'osml.widgets.ViewMapillary',
//        'osml.widgets.nl.ViewDeHollandseMolen',
//        'osml.widgets.nl.ViewMolendatabase',
//        'osml.widgets.nl.ViewBagViewer',
//        'osml.widgets.nl.ViewOpenKvk',
//        'osml.widgets.nl.ViewKvk'
//    ];
//    return new osml.widgets.WidgetGroup(widgets, 'ul');
};
osml.FeaturePopup.prototype.createEditTab = function() {
    return osml.widgets.createWidget(this.createEditTabConfig());
//    var editWidgets  = new osml.widgets.WidgetGroup([
//        'osml.widgets.EditJosm',
//        new Array('osml.widgets.EditOnline', 'id'),
//        new Array('osml.widgets.EditOnline', 'potlatch')
//        ], 'ul');
//    return new osml.widgets.WidgetGroup([
//        new Array('osml.widgets.HtmlWidget', '<h2>Edit area with:</h2>'),
//        editWidgets], 'plain');
};

osml.FeaturePopup.prototype.createMainTabConfig = function() {
    var widgets = [
        'osml.widgets.Title',
        'osml.widgets.nl.Departures',
        'osml.widgets.Address',
        'osml.widgets.Phone',
        'osml.widgets.Email',
        { widget: 'osml.widgets.Website', tag: 'website'},
        { widget: 'osml.widgets.Website', tag: 'url'},
        'osml.widgets.Twitter',
        'osml.widgets.Facebook',
        'osml.widgets.Wikipedia',
        'osml.widgets.Directions'
    ];
    return {
        widget: 'osml.widgets.WidgetGroup',
        widgets: widgets,
        format: 'plain'
    };
};
osml.FeaturePopup.prototype.createDetailTabConfig = function() {
    var widgets = [
        'osml.widgets.BrowseOsm',
        'osml.widgets.UnusedTags'
    ];
    return {
        widget: 'osml.widgets.WidgetGroup',
        widgets: widgets,
        format: 'plain'
    };
};
osml.FeaturePopup.prototype.createViewTabConfig = function() {
    return {
        widget: 'osml.widgets.WidgetGroup',
        widgets: [
            'osml.widgets.ViewOsm',
            'osml.widgets.ViewGoogle',
            'osml.widgets.ViewBing',
            'osml.widgets.ViewMtM',
            'osml.widgets.ViewMapillary',
            'osml.widgets.nl.ViewDeHollandseMolen',
            'osml.widgets.nl.ViewMolendatabase',
            'osml.widgets.nl.ViewBagViewer',
            'osml.widgets.nl.ViewOpenKvk',
            'osml.widgets.nl.ViewKvk'
        ],
        format: 'ul'
    };
};
osml.FeaturePopup.prototype.createEditTabConfig = function() {
    var editWidgetGroup  = {
        widget: 'osml.widgets.WidgetGroup',
        widgets: [
        'osml.widgets.EditJosm',
        { widget: 'osml.widgets.EditOnline', editor: 'id'},
        { widget: 'osml.widgets.EditOnline', editor: 'potlatch'}
        ],
        format: 'ul'
    };
    return {
        widget: 'osml.widgets.WidgetGroup',
        widgets: [
            { widget: 'osml.widgets.HtmlWidget',
              html: '<h2>Edit area with:</h2>',
            },
            editWidgetGroup
        ],
        format: 'plain'
    };
};

