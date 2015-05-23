goog.provide('osml.Query');
goog.provide('osml.SearchBox');
goog.require('ol.control.Control');

/**
 * @typedef {{what: string, where: string, name: string, extent: ol.Extent}}
 */
osml.Query;

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ol.layer.Layer} layer
 * @param {Object} options
 * @returns {osml.SearchBox}
 */
osml.SearchBox = function(layer, options) {
    // @private
    this.layer_ = layer;
    this.inputWhat;
    this.inputWhere;
    this.inputName;
    if (goog.isString(options.div)) {
        options.element = document.createElement('div');
        var target = document.getElementById(options.div);
        options.target = target;
    };
    goog.base(this, options);
    this.resultMinZoom = 12;
    this.lang = 'nl';
    this.textLabel = 'Search for:';

    //----------------------------------------------------------------------
    //  vars
    //----------------------------------------------------------------------
//    this.labelDiv =  null;
//    this.switcher =  null;
//    this.labelDiv =  null;
    this.form = null;
    this.input = null;
//    this.resultDiv = null;

    //----------------------------------------------------------------------
    //  init
    //----------------------------------------------------------------------
    this.draw();
};
goog.inherits(osml.SearchBox, ol.control.Control);

osml.SearchBox.prototype.setMap = function(map) {
    goog.base(this, 'setMap', map);
    map.addLayer(this.getLayer());
};
osml.SearchBox.prototype.getLayer = function() {
    return this.layer_;
};
//----------------------------------------------------------------------
    //  destroy
    //----------------------------------------------------------------------

osml.SearchBox.prototype.destroy = function() {
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

osml.SearchBox.prototype.draw = function() {
    var labelWhat = document.createElement('div');
    labelWhat.className = 'label';
    this.inputWhat = document.createElement('input');
    this.inputWhat.setAttribute('type', 'text');
    this.inputWhat.setAttribute('name', 'what');
    this.inputWhat.control=this;

    var labelWhere = document.createElement('div');
    labelWhere.className = 'label';
    this.inputWhere = document.createElement('input');
    this.inputWhere.setAttribute('type', 'text');
    this.inputWhere.setAttribute('name', 'where');
    this.inputWhere.control=this;

    var labelName = document.createElement('div');
    labelName.className = 'label';
    this.inputName = document.createElement('input');
    this.inputName.setAttribute('type', 'text');
    this.inputName.setAttribute('name', 'what');
    this.inputName.control=this;

    this.form = document.createElement('form');
    this.form.style.display = 'inline';
    this.form.appendChild(this.inputWhat);
    this.form.appendChild(this.inputWhere);
    this.form.appendChild(this.inputName);
    this.form.onsubmit = goog.bind(this.formOnSubmit, this);

    this.element.appendChild(this.form);
};

//----------------------------------------------------------------------
//  event handling
//----------------------------------------------------------------------

osml.SearchBox.prototype.formOnSubmit = function() {
    var source = this.getLayer().getSource();
    var query = {};
    query.what = goog.string.trim(this.form.elements['inputWhat'].value);
    query.where = goog.string.trim(this.form.elements['inputWhere'].value);
    query.name = goog.string.trim(this.form.elements['inputName'].value);
    query.extent = null;
    source.load(query);
    return false;
};

