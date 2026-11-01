/* TradeCalc — Driveway Sealer Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Driveway length');
    var W = pos(v.width, 'Driveway width');
    var coats = pos(v.coats, 'Number of coats');
    var cov = pos(v.coverage, 'Coverage per gallon');
    var area = L * W;
    var gallons = area * coats / cov;
    var buckets = Math.ceil(gallons / 5 - 1e-9);
    var out = '<strong>Driveway area:</strong> ' + round(area, 2) + ' sq ft' +
      '<br><strong>Sealer needed:</strong> ' + round(gallons, 2) + ' gallons (' + v.coats + ' coat(s) at ' + v.coverage + ' sq ft/gal)' +
      '<br><strong>Buckets to buy (5-gallon):</strong> ' + buckets +
      '<br><span style="color:#5b6b82">Sealing is maintenance for an existing driveway, not a new surface: it protects asphalt from sun and water but does not fix cracks, potholes, or a failed base. Check the coverage printed on your sealer bucket first \u2014 the bucket governs.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['sealer'] = calc;
  }
})();
