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


  function calc(v) {
    var L = pos(v.length, 'Roof length');
    var W = pos(v.width, 'Roof width');
    var pitch = num(v.pitch, 'Roof pitch');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var area = L * W * pitch * (1 + waste);
    var squares = area / 100;
    var bundles = Math.ceil(squares * 3);
    return '<strong>Roof area (with pitch):</strong> ' + round(L * W * pitch, 0) + ' sq ft' +
      '<br><strong>Roofing squares needed:</strong> ' + round(squares, 1) +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Shingle bundles:</strong> ' + bundles +
      ' <span style="color:#5b6b82">(3 bundles per square, rounded up)</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['roofing'] = calc;
  }
})();
