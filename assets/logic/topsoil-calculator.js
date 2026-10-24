/* TradeCalc — Topsoil Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Area length');
    var W = pos(v.width, 'Area width');
    var D = pos(v.depth, 'Depth');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var bag = num(v.bag, 'Bag size');
    var cuft = L * W * (D / 12);
    var yd3 = cuft / 27;
    var orderCuft = cuft * (1 + waste);
    var orderYd3 = orderCuft / 27;
    var tons = orderYd3 * 1.35;
    var bags = ceilE(orderCuft / bag);
    var out = '<strong>Topsoil needed:</strong> ' + round(cuft, 2) + ' cubic feet (' + round(yd3, 2) + ' cubic yards)' +
      '<br><strong>Order quantity (with ' + v.waste + '% allowance):</strong> ' + round(orderYd3, 2) + ' cubic yards' +
      '<br><strong>Approximate weight:</strong> ' + round(tons, 2) + ' tons' +
      ' <span style="color:#5b6b82">(at ~1.35 tons per yard, moist topsoil)</span>' +
      '<br><strong>Bags:</strong> ' + bags + ' bag' + (bags === 1 ? '' : 's') +
      ' <span style="color:#5b6b82">(' + v.bag + ' cu ft each)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per cubic yard');
      if (p < 0) { throw new Error('Price per cubic yard cannot be negative.'); }
      out += '<br><strong>Estimated bulk cost:</strong> $' + round(orderYd3 * p, 2) +
        ' <span style="color:#5b6b82">(delivery usually extra)</span>';
    }
    out += '<br><span style="color:#5b6b82">Bulk delivery beats bags once you pass about 1 cubic yard \u2014 roughly 27 one-cubic-foot bags.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['topsoil'] = calc;
  }
})();
