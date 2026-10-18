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


  function calc(v) {
    var L = pos(v.length, 'Project length');
    var W = pos(v.width, 'Project width');
    var PL = pos(v.plength, 'Paver length');
    var PW = pos(v.pwidth, 'Paver width');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * W;
    var paverSqft = (PL * PW) / 144;
    var exact = area / paverSqft;
    var count = Math.ceil(exact * (1 + waste));
    var pallets = Math.ceil(count / 500);
    var gravelYd3 = (area * (4 / 12)) / 27;
    var sandYd3 = (area * (1 / 12)) / 27;
    var out = '<strong>Pavers needed:</strong> ' + count +
      ' <span style="color:#5b6b82">(' + round(exact, 0) + ' exact + ' + v.waste + '% waste)</span>' +
      '<br><strong>Pallets:</strong> ' + pallets + ' <span style="color:#5b6b82">(~500 pavers per pallet)</span>' +
      '<br><strong>Project area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Base gravel (4 in compacted):</strong> ' + round(gravelYd3, 2) + ' cubic yards' +
      '<br><strong>Bedding sand (1 in):</strong> ' + round(sandYd3, 2) + ' cubic yards';
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
