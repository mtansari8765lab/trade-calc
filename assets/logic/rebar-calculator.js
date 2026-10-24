/* TradeCalc — Rebar Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Slab length');
    var W = pos(v.width, 'Slab width');
    var spacing = pos(v.spacing, 'Bar spacing');
    var lbPerFt = pos(v.bar, 'Bar size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var barsAlong = ceilE((W * 12) / spacing) + 1;
    var barsAcross = ceilE((L * 12) / spacing) + 1;
    var bars = barsAlong + barsAcross;
    var feet = barsAlong * L + barsAcross * W;
    var weight = feet * lbPerFt;
    var sticks = ceilE(feet / 20);
    var wasteFeet = feet * (1 + waste);
    var wasteSticks = ceilE(wasteFeet / 20);
    var out = '<strong>Bars needed:</strong> ' + bars +
      ' <span style="color:#5b6b82">(' + barsAlong + ' one way + ' + barsAcross + ' the other)</span>' +
      '<br><strong>Total rebar length:</strong> ' + round(feet, 0) + ' linear feet' +
      '<br><strong>Total weight:</strong> ' + round(weight, 0) + ' lb' +
      '<br><strong>Sticks (20 ft):</strong> ' + sticks +
      '<br><strong>Order quantity (with ' + v.waste + '% waste):</strong> ' + round(wasteFeet, 0) +
      ' ft \u2014 ' + wasteSticks + ' sticks';
    if (v.price !== '') {
      var p = num(v.price, 'Price per stick');
      if (p < 0) { throw new Error('Price per stick cannot be negative.'); }
      out += '<br><strong>Estimated steel cost:</strong> $' + round(wasteSticks * p, 2);
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['rebar'] = calc;
  }
})();
