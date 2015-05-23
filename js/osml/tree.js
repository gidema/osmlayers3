goog.provide('osml.Tree');
goog.provide('osml.Node');

goog.require('osml');

/**
 * @constructor
 * @param parent
 * @returns {osml.Node}
 */
osml.Node = function(parent) {
    this.parent = parent;
    this.children = [];
};

osml.Node.prototype.getParent = function() {
    return this.parent;
};

osml.Node.prototype.getChildren = function() {
    return this.children;
};

osml.Node.prototype.addChild = function(child) {
    this.children.push(child);
};

osml.Node.prototype.isLeaf = function() {
  return this.children.length == 0;
};

osml.Node.prototype.isRoot = function() {
  return this.parent == null;
};
osml.Node.prototype.getRoot = function() {
    var node = this;
    while (!node.isRoot()) {
        node = node.getParent();
    };
    return node;
};

/**
 * @constructor
 * @extends {osml.Node}
 * @returns {osml.Tree}
 */
osml.Tree = function() {
    goog.base(this, null);
    this.index_ = [];
};
goog.inherits(osml.Tree, osml.Node);

osml.Tree.prototype.getNode = function(index) {
    return this.index_[index];
};

/**
 * Re-index the tree using a pre-order indexing algorithm
 * 
 * @param {null | osml.Node} node
 */
osml.Tree.prototype.reIndex = function(node) {
    if (!node) {
        node = this;
    };
    this.index_ = [];
    this.index_.push(node);
    for (var i = 0; i < node.getChildren().length; i++) {
        this.reIndex(node.getChildren()[i]);
    }
};
