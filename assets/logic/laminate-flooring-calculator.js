/* TradeCalc — Laminate Flooring Calculator core logic (pure, no DOM). */
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


  function ceilE(x) { return Math.ceil(x - 1e-9); }
  function calc(v) {
    var L = pos(v.length, 'Room length');
    var W = pos(v.width, 'Room width');
    var pack = pos(v.pack, 'Box coverage');
    var waste = num(v.waste, 'Layout waste') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * W;
    var orderArea = area * (1 + waste);
    var boxes = ceilE(orderArea / pack);
    var underlay = round(area * 1.05, 0);
    var out = '<strong>Room area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Flooring to order:</strong> ' + round(orderArea, 1) + ' sq ft' +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Boxes to buy:</strong> ' + boxes +
      ' <span style="color:#5b6b82">(' + pack + ' sq ft per box)</span>' +
      '<br><strong>Underlayment:</strong> ' + underlay + ' sq ft' +
      ' <span style="color:#5b6b82">(room area + 5% for seam overlap; skip if your planks have underlayment pre-attached)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per box');
      if (p < 0) { throw new Error('Price per box cannot be negative.'); }
      out += '<br><strong>Estimated flooring cost:</strong> $' + round(boxes * p, 2);
    }
    out += '<br><span style="color:#5b6b82">Buy all boxes from one batch \u2014 shade varies between production runs. Keep one spare box for future repairs.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['laminate'] = calc;
  }
})();
