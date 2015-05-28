/**
 * @fileoverview Externs for jstree
 *
 * Note that some functions use different return types depending on the number
 * of parameters passed in. In these cases, you may need to annotate the type
 * of the result in your code, so the JSCompiler understands which type you're
 * expecting. For example:
 *    <code>var elt = /** @type {Element} * / (foo.get(0));</code>
 *
 * @externs
 */
/**
 * @param {Object=} arg1
 * @return {!jQuery}
 */
jQuery.jstree = function(arg1) {};
/**
 * @param {Object=} arg1
 * @return {!jQuery}
 */
$.jstree = function(arg1) {};
jQuery.jstree.destroy = function () {};