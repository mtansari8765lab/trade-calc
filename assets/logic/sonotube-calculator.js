/* TradeCalc — Sonotube Calculator core logic (pure, no DOM). */
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
    var D = pos(v.diameter, 'Tube diameter');
    var H = pos(v.depth, 'Depth');
    var n = pos(v.tubes, 'Number of tubes');
    if (Math.floor(n) !== n) { throw new Error('Number of tubes must be a whole number.'); }
    var yieldFt3 = num(v.bag, 'Bag size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var r = (D / 12) / 2;
    var volPer = Math.PI * r * r * H;
    var total = volPer * n;
    var orderVol = total * (1 + waste);
    var yd3 = orderVol / 27;
    var bags = ceilE(orderVol / yieldFt3);
    var out = '<strong>Volume per tube:</strong> ' + round(volPer, 2) + ' cubic feet' +
      '<br><strong>Total volume:</strong> ' + round(total, 2) + ' cubic feet (' + round(total / 27, 2) + ' cubic yards)' +
      '<br><strong>Order volume (with ' + v.waste + '% waste):</strong> ' + round(orderVol, 2) + ' cubic feet (' + round(yd3, 2) + ' cubic yards)' +
      '<br><strong>Bags needed:</strong> ' + bags + ' bags';
    if (v.price !== '') {
      var p = num(v.price, 'Price per bag');
      if (p < 0) { throw new Error('Price per bag cannot be negative.'); }
      out += '<br><strong>Estimated bag cost:</strong> $' + round(bags * p, 2);
    }
    out += '<br><span style="color:#5b6b82">Beyond about 1 cubic yard, ready-mix delivery is usually easier than mixing bags. Footings must reach local frost depth \u2014 check code before you dig.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['sonotube'] = calc;
  }
})();
