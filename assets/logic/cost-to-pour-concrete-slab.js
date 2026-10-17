/* TradeCalc — Concrete Slab Cost Estimator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Slab length');
    var W = pos(v.width, 'Slab width');
    var T = pos(v.thickness, 'Thickness');
    var price = v.price === '' ? 150 : pos(v.price, 'Price per cubic yard');
    var yd3 = (L * W * (T / 12)) / 27;
    var materials = yd3 * price;
    var low = materials * 1.4, high = materials * 2.2;
    return '<strong>Concrete needed:</strong> ' + round(yd3, 2) + ' cubic yards' +
      '<br><strong>Materials estimate:</strong> $' + round(materials, 0) +
      ' <span style="color:#5b6b82">(' + round(yd3, 2) + ' yd\u00b3 \u00d7 $' + price + '/yd\u00b3)</span>' +
      '<br><strong>Typical all-in range (materials + labor):</strong> $' + round(low, 0) + ' \u2013 $' + round(high, 0) +
      '<br><span style="color:#5b6b82">Planning estimate based on typical 2026 US pricing. Labor, forming, rebar, and finishing vary widely \u2014 get 3 local quotes before budgeting.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['slabcost'] = calc;
  }
})();
