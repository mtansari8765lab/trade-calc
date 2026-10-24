/* TradeCalc — Asphalt Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Driveway length');
    var W = pos(v.width, 'Driveway width');
    var T = pos(v.thickness, 'Asphalt thickness');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * W;
    var cuft = area * (T / 12);
    var yd3 = cuft / 27;
    var tons = cuft * 145 / 2000;
    var order = tons * (1 + waste);
    var coverage = 2000 / (145 * (T / 12));
    var out = '<strong>Driveway area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Asphalt volume:</strong> ' + round(cuft, 1) + ' cubic feet (' + round(yd3, 2) + ' cubic yards)' +
      '<br><strong>Asphalt needed:</strong> ' + round(tons, 2) + ' tons' +
      '<br><strong>Order quantity (with ' + v.waste + '% allowance):</strong> ' + round(order, 2) + ' tons' +
      '<br><strong>Coverage:</strong> ' + round(coverage, 1) + ' sq ft per ton at ' + T + ' in thick';
    if (v.price !== '') {
      var p = num(v.price, 'Price per ton');
      if (p < 0) { throw new Error('Price per ton cannot be negative.'); }
      out += '<br><strong>Estimated material cost:</strong> $' + round(order * p, 2) +
        ' <span style="color:#5b6b82">(material only \u2014 base prep, labor, and delivery are extra; get local plant quotes)</span>';
    }
    out += '<br><span style="color:#5b6b82">Thickness here is compacted depth. Small residential orders usually cost more per ton than bulk plant prices because of minimum charges and delivery.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['asphalt'] = calc;
  }
})();
