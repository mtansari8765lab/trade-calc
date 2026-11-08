/* TradeCalc — Mortar Calculator core logic (pure, no DOM). */
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
    var area = pos(v.area, 'Wall area');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var isBlock = (v.mode === 'block');
    var perSqFt = isBlock ? 1.125 : 6.86;
    var perBag = isBlock ? 13 : 37;
    var unitName = isBlock ? 'standard blocks' : 'modular bricks';
    var units = ceilE(area * perSqFt);
    var bags = ceilE(units / perBag * (1 + waste));
    var out = '<strong>Wall area:</strong> ' + round(area, 2) + ' sq ft' +
      '<br><strong>Units needed:</strong> ' + units + ' ' + unitName +
      '<br><strong>Bags to buy (80 lb):</strong> ' + bags +
      '<br><span style="color:#5b6b82">One 80 lb bag of premixed mortar lays up to ' + perBag + ' ' + unitName + ' at 3/8-in joints (Quikrete Mortar Mix No. 1102 data sheet) \u2014 \u201cup to\u201d is a best case, so the waste allowance matters. Check the rate printed on the bag you buy; it governs.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['mortar'] = calc;
  }
})();
