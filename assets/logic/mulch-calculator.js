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
  // Ceil guarded against float dust.
  function ceilE(x) { return Math.ceil(x - 1e-9); }


  function calc(v) {
    var L = pos(v.length, 'Bed length');
    var W = pos(v.width, 'Bed width');
    var D = pos(v.depth, 'Depth');
    var waste = (v.waste === undefined || v.waste === '') ? 0 : num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var bagSize = (v.bagsize === undefined || v.bagsize === '') ? 2 : pos(v.bagsize, 'Bag size');
    var volFt3 = L * W * (D / 12) * (1 + waste);
    var yd3 = volFt3 / 27;
    var bags = ceilE(volFt3 / bagSize);
    /* A bulk (builder's) bag holds about 1 cubic yard. */
    var bulkBags = Math.max(1, ceilE(yd3));
    return '<strong>Bulk mulch:</strong> ' + round(yd3, 2) + ' cubic yards' +
      ' <span style="color:#5b6b82">(' + round(volFt3, 1) + ' cu ft \u00b7 ' + round(volFt3 * 0.0283168, 2) + ' m\u00b3' +
      (waste > 0 ? ', includes ' + v.waste + '% waste/settling' : '') + ')</span>' +
      '<br><strong>Bags (' + bagSize + ' cu ft):</strong> ' + bags + ' bags' +
      '<br><span style="color:#5b6b82">Rule of thumb: 1 cubic yard covers ~100 sq ft at 3 inches deep. ' +
      'Bulk is far cheaper above ~2 yards \u2014 1 bulk bag holds about 1 cubic yard, so this is roughly ' +
      bulkBags + ' bulk bag' + (bulkBags === 1 ? '' : 's') + '.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['mulch'] = calc;
  }
})();
