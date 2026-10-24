/* TradeCalc — Epoxy Garage Floor Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Garage length');
    var W = pos(v.width, 'Garage width');
    var coats = num(v.coats, 'Coats');
    var cov = pos(v.coverage, 'Coverage per gallon');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var flakeRate = num(v.flake, 'Flake');
    var area = L * W;
    var total = area * coats * (1 + waste);
    var gallons = ceilE(total / cov);
    var out = '<strong>Floor area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Total coverage needed:</strong> ' + round(total, 0) + ' sq ft' +
      ' <span style="color:#5b6b82">(' + coats + ' coats \u00d7 ' + area + ' sq ft, plus ' + v.waste + '% waste)</span>' +
      '<br><strong>Epoxy needed:</strong> ' + gallons + ' gallon' + (gallons === 1 ? '' : 's');
    if (flakeRate > 0) {
      var flake = round(area / 100 * flakeRate, 1);
      out += '<br><strong>Decorative flake:</strong> ' + flake + ' lb';
    }
    if (v.price !== '') {
      var p = num(v.price, 'Price per gallon');
      if (p < 0) { throw new Error('Price per gallon cannot be negative.'); }
      out += '<br><strong>Estimated epoxy cost:</strong> $' + round(gallons * p, 2);
    }
    out += '<br><span style="color:#5b6b82">If your product is sold as a kit, enter the kit\u2019s coverage per coat in the coverage field and read the gallon figure as kits.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['epoxy'] = calc;
  }
})();
