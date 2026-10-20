/* TradeCalc — Paint Calculator core logic (pure, no DOM). */
(function () {
  'use strict';

  function num(value, name) {
    var n = Number(value);
    if (value === null || value === undefined || value === '' || !isFinite(n)) {
      throw new Error(name + ' must be a number.');
    }
    return n;
  }
  function pos(value, name) {
    var n = num(value, name);
    if (n <= 0) { throw new Error(name + ' must be greater than zero.'); }
    return n;
  }
  function round(value, places) {
    var p = places === undefined ? 2 : places;
    var f = Math.pow(10, p);
    return Math.round(value * f) / f;
  }


  function calc(v) {
    var sqft = pos(v.sqft, 'Wall area');
    var coats = num(v.coats, 'Coats');
    var coverage = v.coverage === '' ? 350 : pos(v.coverage, 'Coverage per gallon');
    var gallons = Math.ceil((sqft * coats) / coverage - 1e-9);
    var quarts = gallons * 4;
    return '<strong>Paint needed:</strong> ' + gallons + ' gallon' + (gallons === 1 ? '' : 's') +
      ' <span style="color:#5b6b82">(' + quarts + ' quarts)</span>' +
      '<br><span style="color:#5b6b82">Based on ' + coats + ' coat(s) at ' + coverage +
      ' sq ft per gallon. Textured or porous walls can need 20\u201330% more \u2014 buy one extra gallon for touch-ups.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['paint'] = calc;
  }
})();
