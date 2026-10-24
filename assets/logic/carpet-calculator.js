/* TradeCalc — Carpet Calculator core logic (pure, no DOM). */
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
    var roll = num(v.roll, 'Roll width');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var sqft = L * W;
    var sqyd = sqft / 9;
    var order = ceilE(sqyd * (1 + waste));
    var strips = ceilE(W / roll);
    var linear = strips * L;
    var out = '<strong>Room area:</strong> ' + round(sqft, 0) + ' sq ft (' + round(sqyd, 2) + ' sq yd)' +
      '<br><strong>Carpet to order:</strong> ' + order + ' sq yd' +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Linear feet off the roll:</strong> ' + round(linear, 0) + ' ft' +
      ' <span style="color:#5b6b82">(' + strips + ' strip' + (strips === 1 ? '' : 's') + ' at ' + roll + ' ft wide)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per square yard');
      if (p < 0) { throw new Error('Price per square yard cannot be negative.'); }
      out += '<br><strong>Estimated carpet cost:</strong> $' + round(order * p, 2);
    }
    out += '<br><span style="color:#5b6b82">Padding is sold separately \u2014 budget it per square yard too.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['carpet'] = calc;
  }
})();
