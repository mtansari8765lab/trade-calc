/* TradeCalc — Tile Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Floor length');
    var W = pos(v.width, 'Floor width');
    var s = num(v.size, 'Tile size');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var area = L * W;
    var tileFt2 = Math.pow(s / 12, 2);
    var tiles = Math.ceil((area * (1 + waste)) / tileFt2);
    return '<strong>Floor area:</strong> ' + round(area, 1) + ' sq ft' +
      '<br><strong>Tiles needed:</strong> ' + tiles +
      ' <span style="color:#5b6b82">(' + s + '\u00d7' + s + ' in tiles, includes ' + v.waste + '% waste)</span>' +
      '<br><span style="color:#5b6b82">Check the box label for tiles-per-box, then divide: e.g. ' + tiles +
      ' tiles \u00f7 10 per box = ' + Math.ceil(tiles / 10) + ' boxes at 10/box.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['tile'] = calc;
  }
})();
