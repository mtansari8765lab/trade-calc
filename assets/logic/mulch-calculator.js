/* TradeCalc — Mulch Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Bed length');
    var W = pos(v.width, 'Bed width');
    var D = pos(v.depth, 'Depth');
    var volFt3 = L * W * (D / 12);
    var yd3 = volFt3 / 27;
    var bags = Math.ceil(volFt3 / 2);
    return '<strong>Bulk mulch:</strong> ' + round(yd3, 2) + ' cubic yards' +
      ' <span style="color:#5b6b82">(' + round(volFt3, 1) + ' cu ft)</span>' +
      '<br><strong>Bags (2 cu ft):</strong> ' + bags + ' bags' +
      '<br><span style="color:#5b6b82">Rule of thumb: 1 cubic yard covers ~100 sq ft at 3 inches deep. ' +
      'Bulk is far cheaper above ~2 yards \u2014 ' + round(yd3, 2) + ' yd\u00b3 \u00f7 2 = ' +
      'about ' + Math.ceil(yd3 / 2) + ' bulk-bag equivalents.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['mulch'] = calc;
  }
})();
