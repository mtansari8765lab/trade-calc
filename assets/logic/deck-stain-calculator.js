/* TradeCalc — Deck Stain Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Deck length');
    var W = pos(v.width, 'Deck width');
    var coats = num(v.coats, 'Coats');
    var cov = num(v.coverage, 'Coverage per gallon');
    var rail = num(v.railing, 'Railing allowance') / 100;
    if (rail < 0 || rail > 0.5) { throw new Error('Railing allowance must be between 0 and 50%.'); }
    var area = L * W;
    var adj = area * (1 + rail);
    var gallons = ceilE(adj * coats / cov);
    var out = '<strong>Deck area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Area with railing allowance:</strong> ' + round(adj, 0) + ' sq ft' +
      '<br><strong>Stain needed:</strong> ' + gallons + ' gallon' + (gallons === 1 ? '' : 's') +
      ' <span style="color:#5b6b82">(' + coats + ' coats at ' + cov + ' sq ft per gallon)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per gallon');
      if (p < 0) { throw new Error('Price per gallon cannot be negative.'); }
      out += '<br><strong>Estimated stain cost:</strong> $' + round(gallons * p, 2);
    }
    out += '<br><span style="color:#5b6b82">Stain only when the deck is dry and above 50\u00b0F, and buy stain in one batch \u2014 color varies between batches.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['deckstain'] = calc;
  }
})();
