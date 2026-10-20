/* TradeCalc — Concrete Calculator core logic (pure, no DOM). */
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
  function whole(value) {
    return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var KG_PER_LB = 0.45359237;
  var M3_PER_FT3 = 0.0283168466;
  var DRY_FACTOR = 1.54;          // dry volume = wet volume x 1.54 (standard site-mix allowance)
  var CEMENT_DENSITY = 1440;      // kg per m3
  var SAND_DENSITY = 1600;        // kg per m3
  var AGG_DENSITY = 1450;         // kg per m3
  var PREMIX_YIELD_PER_LB = 0.0075; // cu ft of concrete per lb of pre-mix (80 lb bag -> 0.6 cu ft)

  function calc(v) {
    var L = pos(v.length, 'Length');
    var W = pos(v.width, 'Width');
    var T = pos(v.thickness, 'Thickness');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }

    /* Material mode + bag weight. Legacy field "bag" ('80' | '60' | 'ready')
       is still accepted so saved links/tests keep working. */
    var mode = v.mode;
    var bagWeight = v.bagWeight;
    var bagUnit = v.bagUnit || 'lb';
    if (mode === undefined || mode === '') {
      if (v.bag === 'ready') { mode = 'ready'; }
      else { mode = 'bags'; if (bagWeight === undefined || bagWeight === '') { bagWeight = (v.bag === '60') ? '60' : '80'; } }
    }
    var bagLb = null, bagKg = null, bagLabel = '';
    if (mode !== 'ready') {
      var bw = pos(bagWeight, 'Bag weight');
      if (bw > 500) { throw new Error('Bag weight looks too large — check the value and unit.'); }
      if (bagUnit === 'kg') { bagKg = bw; bagLb = bw / KG_PER_LB; }
      else { bagLb = bw; bagKg = bw * KG_PER_LB; }
      bagLabel = bw + ' ' + (bagUnit === 'kg' ? 'kg' : 'lb');
    }

    /* Mix ratio parts (cement : sand : aggregate). */
    var cP, sP, aP, ratioLabel;
    if (v.ratio === 'custom') {
      cP = pos(v.cPart, 'Cement parts'); sP = pos(v.sPart, 'Sand parts'); aP = pos(v.aPart, 'Aggregate parts');
      ratioLabel = cP + ' : ' + sP + ' : ' + aP;
    } else {
      var parts = String(v.ratio || '1:2:4').split(':');
      if (parts.length !== 3) { throw new Error('Mix ratio must look like 1:2:4.'); }
      cP = pos(parts[0], 'Cement parts'); sP = pos(parts[1], 'Sand parts'); aP = pos(parts[2], 'Aggregate parts');
      ratioLabel = cP + ' : ' + sP + ' : ' + aP;
    }
    var totalParts = cP + sP + aP;

    var volFt3 = L * W * (T / 12);
    var volYd3 = volFt3 / 27;
    var adjFt3 = volFt3 * (1 + waste);

    var out = '<strong>Concrete needed:</strong><br>' +
      round(volYd3, 2) + ' cubic yards (' + round(volFt3, 2) + ' cubic feet)';
    if (mode !== 'ready') {
      var bags = Math.ceil(adjFt3 / (bagLb * PREMIX_YIELD_PER_LB));
      out += '<br><strong>Pre-mix bags (' + bagLabel + '):</strong> ' + bags +
        ' bags <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>';
    } else {
      out += '<br><span style="color:#5b6b82">Order ' + round(volYd3 * (1 + waste), 2) +
        ' cubic yards ready-mix (includes ' + v.waste + '% waste). Most suppliers have a 1-yard minimum.</span>';
    }

    /* Site-mix material breakdown — dry volume method. */
    var dryFt3 = adjFt3 * DRY_FACTOR;
    var cemFt3 = dryFt3 * cP / totalParts;
    var sandFt3 = dryFt3 * sP / totalParts;
    var aggFt3 = dryFt3 * aP / totalParts;
    var cemKg = cemFt3 * M3_PER_FT3 * CEMENT_DENSITY;
    var sandKg = sandFt3 * M3_PER_FT3 * SAND_DENSITY;
    var aggKg = aggFt3 * M3_PER_FT3 * AGG_DENSITY;
    var waterL = cemKg * 0.5;

    out += '<br><br><strong>Mixing your own? Material quantities for a ' + ratioLabel +
      ' mix</strong> <span style="color:#5b6b82">(cement : sand : aggregate, includes ' + v.waste + '% waste)</span>';
    if (mode !== 'ready') {
      var cemBags = Math.ceil(cemKg / bagKg);
      out += '<br>&bull; <strong>Cement:</strong> ' + cemBags + ' bags of ' + bagLabel +
        ' &mdash; ' + whole(cemKg) + ' kg total (' + whole(cemKg / KG_PER_LB) + ' lb)';
    } else {
      out += '<br>&bull; <strong>Cement:</strong> ' + whole(cemKg) + ' kg (' + whole(cemKg / KG_PER_LB) + ' lb)';
    }
    out += '<br>&bull; <strong>Sand:</strong> ' + round(sandFt3, 2) + ' cu ft (' + round(sandFt3 / 27, 2) +
      ' cu yd &middot; ' + round(sandFt3 * M3_PER_FT3, 2) + ' m&sup3;) &asymp; ' + whole(sandKg) + ' kg';
    out += '<br>&bull; <strong>Aggregate (gravel):</strong> ' + round(aggFt3, 2) + ' cu ft (' + round(aggFt3 / 27, 2) +
      ' cu yd &middot; ' + round(aggFt3 * M3_PER_FT3, 2) + ' m&sup3;) &asymp; ' + whole(aggKg) + ' kg';
    out += '<br>&bull; <strong>Water:</strong> &asymp; ' + whole(waterL) + ' liters (at a 0.5 water&ndash;cement ratio)';
    out += '<br><span style="color:#5b6b82">Breakdown uses the standard dry-volume method (wet volume &times; 1.54) and typical densities — cement 1,440, sand 1,600, aggregate 1,450 kg/m&sup3; — so weights are close estimates, not exact.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['concrete'] = calc;
  }
})();
