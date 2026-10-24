/* TradeCalc — Siding Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Total wall length');
    var H = pos(v.height, 'Wall height');
    var gables = v.gables === '' ? 0 : num(v.gables, 'Gable area');
    if (gables < 0) { throw new Error('Gable area cannot be negative.'); }
    var doors = v.doors === '' ? 0 : num(v.doors, 'Doors');
    var windows = v.windows === '' ? 0 : num(v.windows, 'Windows');
    if (Math.floor(doors) !== doors || Math.floor(windows) !== windows || doors < 0 || windows < 0) {
      throw new Error('Doors and windows must be whole numbers, 0 or more.');
    }
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var gross = L * H + gables;
    var openings = doors * 21 + windows * 15;
    var net = gross - openings;
    if (net <= 0) { throw new Error('Openings exceed wall area \u2014 check your measurements.'); }
    var order = net * (1 + waste);
    var squares = order / 100;
    var orderSquares = ceilE(squares);
    var out = '<strong>Gross wall area:</strong> ' + round(gross, 0) + ' sq ft' +
      '<br><strong>Openings deducted:</strong> ' + round(openings, 0) + ' sq ft' +
      ' <span style="color:#5b6b82">(' + doors + ' doors \u00d7 21 sq ft + ' + windows + ' windows \u00d7 15 sq ft)</span>' +
      '<br><strong>Net wall area:</strong> ' + round(net, 0) + ' sq ft' +
      '<br><strong>Siding needed:</strong> ' + round(squares, 2) + ' squares' +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Order quantity:</strong> ' + orderSquares + ' squares';
    if (v.price !== '') {
      var p = num(v.price, 'Price per square');
      if (p < 0) { throw new Error('Price per square cannot be negative.'); }
      out += '<br><strong>Estimated siding cost:</strong> $' + round(orderSquares * p, 2) +
        ' <span style="color:#5b6b82">(siding only \u2014 budget roughly 10\u201315% extra for trim, J-channel, and starter strips)</span>';
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['siding'] = calc;
  }
})();
