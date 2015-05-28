/**
 * @fileoverview Externs for jQueryUI
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
 * @param {string=} arg1
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.tabs = function(arg1) {};