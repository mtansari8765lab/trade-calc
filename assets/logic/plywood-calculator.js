/* TradeCalc — Plywood Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Length');
    var W = pos(v.width, 'Width');
    var sheetArea = pos(v.sheet, 'Sheet size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * W;
    var sheets = ceilE(area * (1 + waste) / sheetArea);
    var out = '<strong>Area:</strong> ' + round(area, 2) + ' sq ft' +
      '<br><strong>Sheets to buy:</strong> ' + sheets +
      '<br><span style="color:#5b6b82">A 4 x 8 ft sheet covers 32 sq ft. Offcuts rarely fit the next row, so a part-sheet still has to be bought whole \u2014 that is what the waste allowance and the round-up are for.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['plywood'] = calc;
  }
})();
