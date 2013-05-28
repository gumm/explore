/**
 * @fileoverview Bootstrap for the trin Library .
 */

goog.provide('bad');

/**
 * Base namespace for the bad library.  Checks to see bad is
 * already defined in the current scope before assigning to prevent
 * clobbering if base.js is loaded more than once.
 *
 * @const
 */
var bad = bad || {}; // Identifies this file as the Bad Library base.
