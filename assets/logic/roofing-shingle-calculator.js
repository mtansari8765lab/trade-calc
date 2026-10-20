/* TradeCalc — Roofing Shingle Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Roof length');
    var W = pos(v.width, 'Roof width');
    var pitch = num(v.pitch, 'Roof pitch');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var perSquare = (v.persq === undefined || v.persq === '') ? 3 : pos(v.persq, 'Bundles per square');
    var area = L * W * pitch * (1 + waste);
    var squares = area / 100;
    var bundles = ceilE(squares * perSquare);
    /* One roll of 15-lb felt underlayment covers ~4 squares. */
    var felt = ceilE(squares / 4);
    return '<strong>Roof area (with pitch):</strong> ' + round(L * W * pitch, 0) + ' sq ft' +
      '<br><strong>Roofing squares needed:</strong> ' + round(squares, 1) +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Shingle bundles:</strong> ' + bundles +
      ' <span style="color:#5b6b82">(' + perSquare + ' bundles per square, rounded up)</span>' +
      '<br><strong>Underlayment:</strong> ~' + felt + ' roll' + (felt === 1 ? '' : 's') +
      ' <span style="color:#5b6b82">(15-lb felt, ~4 squares per roll \u2014 synthetic rolls cover more, check the label)</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['roofing'] = calc;
  }
})();
