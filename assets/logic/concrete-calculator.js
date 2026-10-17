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


  function calc(v) {
    var L = pos(v.length, 'Length');
    var W = pos(v.width, 'Width');
    var T = pos(v.thickness, 'Thickness');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var volFt3 = L * W * (T / 12);
    var volYd3 = volFt3 / 27;
    var out = '<strong>Concrete needed:</strong><br>' +
      round(volYd3, 2) + ' cubic yards (' + round(volFt3, 2) + ' cubic feet)';
    if (v.bag !== 'ready') {
      var bagFt3 = (v.bag === '60') ? 0.45 : 0.6;
      var bags = Math.ceil((volFt3 * (1 + waste)) / bagFt3);
      out += '<br><strong>Bags (' + v.bag + ' lb):</strong> ' + bags +
        ' bags <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>';
    } else {
      out += '<br><span style="color:#5b6b82">Order ' + round(volYd3 * (1 + waste), 2) +
        ' cubic yards ready-mix (includes ' + v.waste + '% waste). Most suppliers have a 1-yard minimum.</span>';
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['concrete'] = calc;
  }
})();
