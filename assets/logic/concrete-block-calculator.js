/* TradeCalc — Concrete Block Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Wall length');
    var H = pos(v.height, 'Wall height');
    var per = num(v.size, 'Block size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * H;
    var exact = area * per;
    var order = ceilE(exact * (1 + waste));
    var mortar = ceilE(order / 35);
    var out = '<strong>Wall area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Blocks needed:</strong> ' + order +
      ' <span style="color:#5b6b82">(' + round(exact, 0) + ' exact + ' + v.waste + '% waste)</span>' +
      '<br><strong>Mortar:</strong> ' + mortar + ' bag' + (mortar === 1 ? '' : 's') +
      ' <span style="color:#5b6b82">(80 lb, ~35 blocks per bag)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per block');
      if (p < 0) { throw new Error('Price per block cannot be negative.'); }
      out += '<br><strong>Estimated block cost:</strong> $' + round(order * p, 2);
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['block'] = calc;
  }
})();
