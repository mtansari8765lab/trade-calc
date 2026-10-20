/* TradeCalc — Paver Calculator core logic (pure, no DOM). */
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
  // Ceil guarded against float dust (e.g. 220.00000000000003 must give 220, not 221).
  function ceilE(x) { return Math.ceil(x - 1e-9); }


  function calc(v) {
    var L = pos(v.length, 'Project length');
    var W = pos(v.width, 'Project width');
    var PL = pos(v.plength, 'Paver length');
    var PW = pos(v.pwidth, 'Paver width');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var baseDepth = (v.base === undefined || v.base === '') ? 4 : pos(v.base, 'Base depth');
    var area = L * W;
    var areaWaste = area * (1 + waste);
    var paverSqft = (PL * PW) / 144;
    var exact = area / paverSqft;
    var count = ceilE(exact * (1 + waste));
    /* Pallets are sold by coverage, not paver count: ~100 sq ft per pallet is
       the common rule of thumb for standard pavers. */
    var pallets = ceilE(areaWaste / 100);
    var gravelYd3 = (area * (baseDepth / 12)) / 27;
    var sandYd3 = (area * (1 / 12)) / 27;
    var out = '<strong>Pavers needed:</strong> ' + count +
      ' <span style="color:#5b6b82">(' + round(exact, 0) + ' exact + ' + v.waste + '% waste)</span>' +
      '<br><strong>Pallets:</strong> ' + pallets + ' <span style="color:#5b6b82">(~100 sq ft of pavers per pallet \u2014 confirm coverage with your supplier)</span>' +
      '<br><strong>Project area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Base gravel (' + baseDepth + ' in compacted):</strong> ' + round(gravelYd3, 2) +
      ' cubic yards <span style="color:#5b6b82">(\u2248 ' + round(gravelYd3 * 1.4, 1) + ' tons)</span>' +
      '<br><strong>Bedding sand (1 in):</strong> ' + round(sandYd3, 2) +
      ' cubic yards <span style="color:#5b6b82">(\u2248 ' + round(sandYd3 * 1.4, 1) + ' tons)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per paver');
      if (p < 0) { throw new Error('Price per paver cannot be negative.'); }
      out += '<br><strong>Estimated paver cost:</strong> $' + round(count * p, 2);
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['paver'] = calc;
  }
})();
