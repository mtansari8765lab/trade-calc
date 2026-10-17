/* TradeCalc — Roof Replacement Cost Estimator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Roof length');
    var W = pos(v.width, 'Roof width');
    var pitch = num(v.pitch, 'Roof pitch');
    var rate = v.rate === '' ? 450 : pos(v.rate, 'Cost per square');
    var squares = (L * W * pitch * 1.1) / 100;
    var mid = squares * rate;
    return '<strong>Roofing squares (with 10% waste):</strong> ' + round(squares, 1) +
      '<br><strong>Estimated installed cost:</strong> $' + round(mid * 0.8, 0) + ' \u2013 $' + round(mid * 1.25, 0) +
      ' <span style="color:#5b6b82">(at $' + rate + '/square)</span>' +
      '<br><span style="color:#5b6b82">Planning estimate based on typical 2026 US pricing for asphalt shingles, tear-off included. ' +
      'Steep, complex, or multi-layer tear-offs run higher \u2014 get 3 local quotes.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['roofcost'] = calc;
  }
})();
