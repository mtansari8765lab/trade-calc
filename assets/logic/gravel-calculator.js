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
  // Ceil guarded against float dust.
  function ceilE(x) { return Math.ceil(x - 1e-9); }


  function calc(v) {
    var L = pos(v.length, 'Length');
    var W = pos(v.width, 'Width');
    var D = pos(v.depth, 'Depth');
    var waste = (v.waste === undefined || v.waste === '') ? 0 : num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    /* Tons per cubic yard by material: sand ~1.3, standard gravel ~1.4, dense crusher run ~1.5. */
    var density = (v.density === undefined || v.density === '') ? 1.4 : pos(v.density, 'Material density');
    var volFt3 = L * W * (D / 12) * (1 + waste);
    var yd3 = volFt3 / 27;
    var tons = yd3 * density;
    var bags = ceilE(volFt3 / 0.5);
    return '<strong>Gravel needed:</strong> ' + round(yd3, 2) + ' cubic yards' +
      ' <span style="color:#5b6b82">(\u2248 ' + round(tons, 1) + ' tons at ~' + density + ' tons/yd\u00b3' +
      (waste > 0 ? ', includes ' + v.waste + '% waste/compaction' : '') + ')</span>' +
      '<br><strong>If buying bagged:</strong> ' + bags + ' bags <span style="color:#5b6b82">(0.5 cu ft bags \u2014 54 bags = 1 cubic yard)</span>' +
      '<br><span style="color:#5b6b82">' +
      (waste > 0
        ? 'A 4-inch layer compacts to roughly 3\u20133.5 inches \u2014 the allowance above covers compaction and uneven subgrade.'
        : 'Order ~10% extra for compaction and uneven subgrade (use the waste field). A 4-inch layer compacts to roughly 3\u20133.5 inches.') +
      '</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['gravel'] = calc;
  }
})();
