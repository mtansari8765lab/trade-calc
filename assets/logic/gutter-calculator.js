/* TradeCalc — Gutter Calculator core logic (pure, no DOM). */
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
    var edge = pos(v.edge, 'Roof-edge length');
    var section = pos(v.section, 'Section length');
    var spacing = pos(v.spacing, 'Downspout spacing');
    var sections = ceilE(edge / section);
    var downspouts = Math.max(2, ceilE(edge / spacing));
    var hangers = ceilE(edge / 2);
    var out = '<strong>Gutter length:</strong> ' + round(edge, 0) + ' linear feet' +
      '<br><strong>Gutter sections:</strong> ' + sections +
      ' <span style="color:#5b6b82">(' + section + ' ft each \u2014 sections trim shorter, never longer, so always round up)</span>' +
      '<br><strong>Downspouts:</strong> ' + downspouts +
      ' <span style="color:#5b6b82">(one every ' + spacing + ' ft, minimum 2)</span>' +
      '<br><strong>Hangers:</strong> ' + hangers +
      ' <span style="color:#5b6b82">(one every 2 ft)</span>';
    if (v.price !== '') {
      var p = num(v.price, 'Price per linear foot');
      if (p < 0) { throw new Error('Price per linear foot cannot be negative.'); }
      out += '<br><strong>Estimated gutter material cost:</strong> $' + round(edge * p, 2) +
        ' <span style="color:#5b6b82">(gutter only \u2014 corners, end caps, elbows, and downspout material are extra)</span>';
    }
    out += '<br><span style="color:#5b6b82">Add roughly 10% extra material for corners, seams, and waste \u2014 and put one downspout near each outside corner.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['gutter'] = calc;
  }
})();
