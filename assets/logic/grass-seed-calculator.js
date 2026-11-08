/* TradeCalc — Grass Seed Calculator core logic (pure, no DOM). */
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
    var rate = num(v.type, 'Grass type');
    if (rate <= 0) { throw new Error('Grass type must be a valid seeding rate.'); }
    var jobLabel = (v.job === 'overseed') ? 'overseeding' : 'new lawn';
    if (v.job === 'overseed') { rate = rate / 2; }
    var area = L * W;
    var pounds = area / 1000 * rate;
    var out = '<strong>Lawn area:</strong> ' + round(area, 2) + ' sq ft' +
      '<br><strong>Seed needed:</strong> ' + round(pounds, 2) + ' lb' +
      '<br><strong>Rate used:</strong> ' + round(rate, 2) + ' lb per 1,000 sq ft (' + jobLabel + ')' +
      '<br><span style="color:#5b6b82">Rates are typical new-lawn figures for each grass type; the rate printed on your seed bag governs, and it varies by seed blend. Buy the bag size above your pounds, not below \u2014 a thin lawn is the expensive mistake.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['grassseed'] = calc;
  }
})();
