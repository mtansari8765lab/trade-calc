/* TradeCalc — Drywall Calculator core logic (pure, no DOM). */
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
    var sqft = pos(v.sqft, 'Wall area');
    var sheet = num(v.sheet, 'Sheet size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var sheets = Math.ceil((sqft * (1 + waste)) / sheet);
    return '<strong>Drywall sheets needed:</strong> ' + sheets +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><span style="color:#5b6b82">Tip: 12 ft sheets mean fewer seams on long walls \u2014 but check they fit through your doors and stairwells first.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['drywall'] = calc;
  }
})();
