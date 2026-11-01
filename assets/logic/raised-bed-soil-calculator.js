/* TradeCalc — Raised Bed Soil Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Bed length');
    var W = pos(v.width, 'Bed width');
    var D = pos(v.depth, 'Soil depth');
    var waste = num(v.waste, 'Settling allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Settling allowance must be between 0 and 50%.'); }
    var cuFt = L * W * (D / 12);
    var yards = cuFt / 27;
    var cuFtW = cuFt * (1 + waste);
    var yardsW = yards * (1 + waste);
    var bags = ceilE(cuFtW / 1.5);
    var top = round(cuFtW * 0.6, 2);
    var comp = round(cuFtW * 0.3, 2);
    var perl = round(cuFtW * 0.1, 2);
    var out = '<strong>Soil needed (net):</strong> ' + round(cuFt, 2) + ' cu ft (' + round(yards, 2) + ' cu yd)' +
      '<br><strong>With ' + v.waste + '% settling allowance:</strong> ' + round(cuFtW, 2) + ' cu ft (' + round(yardsW, 2) + ' cu yd)' +
      '<br><strong>Bags to buy (1.5 cu ft bags):</strong> ' + bags +
      '<br><strong>Mix split (with allowance):</strong> topsoil ' + top + ' cu ft, compost ' + comp + ' cu ft, perlite ' + perl + ' cu ft' +
      '<br><span style="color:#5b6b82">Measure the INSIDE of the bed \u2014 boards 2 inches thick steal 4 inches off each dimension. Soil settles 10\u201320% after the first waterings, so fill proud of the rim and top up after a week.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['raisedbed'] = calc;
  }
})();
