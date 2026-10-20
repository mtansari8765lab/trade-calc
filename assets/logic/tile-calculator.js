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
  // Ceil guarded against float dust (e.g. 110.00000000000001 must give 110, not 111).
  function ceilE(x) { return Math.ceil(x - 1e-9); }


  function calc(v) {
    var L = pos(v.length, 'Floor length');
    var W = pos(v.width, 'Floor width');
    /* Tile dimensions: tlength x twidth; legacy single "size" = square tile. */
    var TL, TW;
    if (v.tlength !== undefined && v.tlength !== '') {
      TL = pos(v.tlength, 'Tile length');
      TW = pos(v.twidth, 'Tile width');
    } else {
      TL = TW = pos(v.size, 'Tile size');
    }
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var area = L * W;
    var tileFt2 = (TL / 12) * (TW / 12);
    var tiles = ceilE((area * (1 + waste)) / tileFt2);
    var out = '<strong>Floor area:</strong> ' + round(area, 1) + ' sq ft' +
      '<br><strong>Tiles needed:</strong> ' + tiles +
      ' <span style="color:#5b6b82">(' + TL + '\u00d7' + TW + ' in tiles, includes ' + v.waste + '% waste)</span>';
    if (v.perbox !== undefined && v.perbox !== '') {
      var perBox = pos(v.perbox, 'Tiles per box');
      if (Math.floor(perBox) !== perBox) { throw new Error('Tiles per box must be a whole number.'); }
      out += '<br><strong>Boxes to buy:</strong> ' + ceilE(tiles / perBox) +
        ' <span style="color:#5b6b82">(' + perBox + ' tiles per box)</span>';
    } else {
      out += '<br><span style="color:#5b6b82">Check the box label for tiles-per-box, then divide: e.g. ' + tiles +
        ' tiles \u00f7 10 per box = ' + ceilE(tiles / 10) + ' boxes at 10/box.</span>';
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['tile'] = calc;
  }
})();
