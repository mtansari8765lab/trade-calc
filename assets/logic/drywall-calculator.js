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


  // Ceil guarded against float dust.
  function ceilE(x) { return Math.ceil(x - 1e-9); }

  function calc(v) {
    var sqft = pos(v.sqft, 'Wall area');
    var sheet = num(v.sheet, 'Sheet size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var sheets = ceilE((sqft * (1 + waste)) / sheet);
    /* Finishing materials: a 4.5-gal bucket of premixed joint compound covers
       ~450 sq ft of finished drywall; screws run ~32 per sheet (12 in spacing
       in the field), and 1 lb of 1-1/4 in screws is roughly 200 screws. */
    var buckets = ceilE(sqft / 450);
    var screws = sheets * 32;
    var screwLb = Math.round((screws / 200) * 10) / 10;
    return '<strong>Drywall sheets needed:</strong> ' + sheets +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Joint compound:</strong> ~' + buckets + ' bucket' + (buckets === 1 ? '' : 's') +
      ' <span style="color:#5b6b82">(pre-mixed bucket, ~1 per 450 sq ft)</span>' +
      '<br><strong>Screws:</strong> ~' + screws + ' <span style="color:#5b6b82">(32 per sheet \u2014 \u2248 ' + screwLb + ' lb of 1-1/4 in screws)</span>' +
      '<br><span style="color:#5b6b82">Tip: 12 ft sheets mean fewer seams on long walls \u2014 but check they fit through your doors and stairwells first.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['drywall'] = calc;
  }
})();
