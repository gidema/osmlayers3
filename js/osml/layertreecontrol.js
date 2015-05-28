goog.provide('osml.LayerTreeControl');

goog.require('osml');
goog.require('osml.LayerTree');
goog.require('ol.control.Control');

///**
// * @typedef {{
// *   div:string,
// *   element:string,
// *   treeData:osmlx.TreeOptions
// * }}
// */
//osmlx.LayerTreeControlOptions;
/**
 * Class: LayerTreeControl
 * The LayerTree Control displays a table of contents for the map. This
 * allows the user interface to switch between BaseLayers and to show or hide
 * Overlays.
 *
 * To create the LayerSwitcher outside of the map, pass the Id of a html div
 * as the first argument to the constructor.
 *
 * This class requires the jsTree and jQuery libraries to be installed.
 * 
 * @constructor
 * @extends ol.control.Control
 */
osml.LayerTreeControl = function(layerTree, options) {
    this.layerTree = layerTree;
    this.div = null;
    goog.base(this, options);
    var treeData = this.buildTree(layerTree);
    $(options.element).jstree({
      plugins:['ui', 'checkbox'],
      checkbox: {
        override_ui: true,
        tie_selection: true
      },
      'core':treeData
    })
    .on("select_node.jstree", this, this.select_node)
    .on("deselect_node.jstree", this, this.deselect_node);
    this.jsTree = $(options.div).jstree();
};
goog.inherits(osml.LayerTreeControl, ol.control.Control);


osml.LayerTreeControl.prototype.destroy = function() {
    this.jsTree.destroy();
};

/**
 * Method: redraw
 * Goes through and takes the current state of the Map and rebuilds the
 *     control to display that state. Groups base layers into a
 *     radio-button group and lists each data layer with a checkbox.
 *
 * @return {Element} A reference to the DIV DOMElement containing the control
 */
osml.LayerTreeControl.prototype.redraw = function() {
    this.jsTree.redraw(true);
    return this.div;
};
    
osml.LayerTreeControl.prototype.buildTree = function(treeData) {
    var data = [];
    var self = this;
    $.each(treeData.getChildren(), function(index, nodeData) {
      data.push(self.buildNode(nodeData));
    });
    return {
      'data' : data
    };
};
osml.LayerTreeControl.prototype.buildNode = function(nodeData) {
    var children = [];
    var self = this;
    $.each(nodeData.getChildren(), function(index, childNodeData) {
        children.push(self.buildNode(childNodeData));
    });
    $.each(nodeData.layers, function(id, layer) {
        children.push({
            text: layer.name,
            li_attr: {'class': layer.cssClass}
        });
    });
    return {
        text : nodeData.name,
        children : children,
        li_attr: {'class': nodeData.id}
    };
};
osml.LayerTreeControl.prototype.select_node = function(e, data) {
    var self = e.data;
    var id = data.node.li_attr['class'];
    if (data.node.children.length == 0) {
        var layer = self.layerTree.layers[id];
        layer.setVisible(true);
    }
    else {
        var node = self.layerTree.nodes[id];
        node.showAll();
    }
};

osml.LayerTreeControl.prototype.deselect_node = function(e, data) {
    var self = e.data;
    var id = data.node.li_attr['class'];
    if (data.node.children.length == 0) {
        var layer = self.layerTree.layers[id];
        layer.setVisible(false);
    }
    else {
        var node = self.layerTree.nodes[id];
        node.hideAll();
    }
};
