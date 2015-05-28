goog.provide('osml.LayerTree');
goog.provide('osml.LayerTreeNode');
goog.require('osml.Tree');
goog.require('osml.Node');
goog.require('osml.LayerDef');

///**
// * @typedef {{
// *   name : string,
// *   layers : Array<string>,
// *   children : Object<string, osmlx.TreeNodeOptions>
// * }}
// */
//osmlx.TreeNodeOptions;
//
///**
// * @typedef Object<string, osmlx.TreeNodeOptions>
// */
//osmlx.TreeOptions;
//
///**
// * @typedef {{
// *   layers: Object,
// *   treeData: {osmlx.TreeOptions}
// * }}
// */
//osmlx.LayerTreeOptions;
/**
 * @constructor
 * @extends osml.Tree
 * @param {osmlx.LayerTreeOptions} options
 * @returns {osml.LayerTree}
 */
osml.LayerTree = function(options) {
    goog.base(this);
    this.layers = options.layers;
    this.nodes = {};
    this.initializeTree(options.treeData);
};
goog.inherits(osml.LayerTree, osml.Tree);

/**
 * 
 * @param {osmlx.TreeOptions} treeData
 */
osml.LayerTree.prototype.initializeTree = function(treeData) {
    var root = this.getRoot();
    $.each(treeData, function(id, n) {
        var node = new osml.LayerTreeNode(root, id, n);
        root.addChild(node);
        root.nodes[id] = node;
    });
    this.reIndex();
};

//GetLayer
osml.LayerTree.prototype.getLayer = function(id) {
  return this.layers[id];
};

/**
 * @constructor
 * @extends {osml.Node}
 * @param parent
 * @param id
 * @param nodeData
 * @returns {osml.LayerTreeNode}
 */
osml.LayerTreeNode = function(parent, id, nodeData) {
    goog.base(this, parent);
    this.id = id;
    this.layers = [];
    this.name = nodeData.name;
    var children = nodeData.children;
    if (children) {
        var self = this;
        var root = this.getRoot();
        $.each(children, function(id, n) {
            var childNode = new osml.LayerTreeNode(self, id, n);
            self.addChild(childNode);
            root.nodes[id] = childNode;
        });
    };
    var layers = nodeData.layers;
    if (layers) {
        var self = this;
        var root = this.getRoot();
        $.each(layers, function(index, l) {
            var layer = root.getLayer(l);
            if (layer) {
                self.layers.push(layer);
            }
            else {
                alert('Layer ' + l + ' doesn\'t exist');
            };
        });
    };
};
goog.inherits(osml.LayerTreeNode, osml.Node);

osml.LayerTreeNode.prototype.showAll = function() {
    $.each(this.getChildren(), function(id, child) {
        child.showAll();
    });
    $.each(this.layers, function(id, layer) {
        layer.setVisible(true);
    });
};

osml.LayerTreeNode.prototype.hideAll = function() {
    $.each(this.getChildren(), function(id, child) {
        child.hideAll();
    });
    $.each(this.layers, function(id, layer) {
        layer.setVisible(false);
    });
};
