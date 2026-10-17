/* TradeCalc — Gravel Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Length');
    var W = pos(v.width, 'Width');
    var D = pos(v.depth, 'Depth');
    var volFt3 = L * W * (D / 12);
    var yd3 = volFt3 / 27;
    var tons = yd3 * 1.4;
    return '<strong>Gravel needed:</strong> ' + round(yd3, 2) + ' cubic yards' +
      ' <span style="color:#5b6b82">(\u2248 ' + round(tons, 1) + ' tons at ~1.4 tons/yd\u00b3)</span>' +
      '<br><span style="color:#5b6b82">Order ~10% extra for compaction and uneven subgrade. ' +
      'A 4-inch driveway layer compacts to roughly 3\u20133.5 inches.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['gravel'] = calc;
  }
})();
