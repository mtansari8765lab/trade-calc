/* TradeCalc — Deck Cost Estimator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Deck length');
    var W = pos(v.width, 'Deck width');
    var rate = num(v.rate, 'Cost per square foot');
    var area = L * W;
    var mid = area * rate;
    return '<strong>Deck area:</strong> ' + round(area, 0) + ' sq ft' +
      '<br><strong>Estimated cost:</strong> $' + round(mid * 0.8, 0) + ' \u2013 $' + round(mid * 1.25, 0) +
      ' <span style="color:#5b6b82">(at $' + rate + '/sq ft)</span>' +
      '<br><span style="color:#5b6b82">Planning estimate based on typical 2026 US pricing. ' +
      'Railings, stairs, permits, and footings move real quotes \u2014 get 3 local quotes.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['deckcost'] = calc;
  }
})();
