/* TradeCalc — Sod Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Lawn length');
    var W = pos(v.width, 'Lawn width');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * W;
    var areaWaste = area * (1 + waste);
    var rolls = Math.ceil(areaWaste / 10);
    var pallets = Math.ceil(areaWaste / 450);
    var out = '<strong>Sod rolls needed:</strong> ' + rolls +
      ' <span style="color:#5b6b82">(' + round(areaWaste, 0) + ' sq ft incl. ' + v.waste + '% waste)</span>' +
      '<br><strong>Pallets:</strong> ' + pallets + ' <span style="color:#5b6b82">(~450 sq ft / 45 rolls per pallet)</span>' +
      '<br><strong>Lawn area:</strong> ' + round(area, 0) + ' sq ft';
    if (v.price !== '') {
      var p = num(v.price, 'Price per roll');
      if (p < 0) { throw new Error('Price per roll cannot be negative.'); }
      out += '<br><strong>Estimated sod cost:</strong> $' + round(rolls * p, 2);
    }
    out += '<br><span style="color:#5b6b82">Install the day it arrives \u2014 sod dries out fast on the pallet.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['sod'] = calc;
  }
})();
