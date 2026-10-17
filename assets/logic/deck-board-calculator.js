/* TradeCalc — Deck Board Calculator core logic (pure, no DOM). */
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
    var DL = pos(v.dlength, 'Deck length');
    var DW = pos(v.dwidth, 'Deck width');
    var BL = num(v.blength, 'Board length');
    var BW = v.bwidth === '' ? 5.5 : pos(v.bwidth, 'Board width');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var rows = Math.ceil((DW * 12) / BW);
    var boards = Math.ceil((rows * DL * (1 + waste)) / BL);
    return '<strong>Board rows across deck:</strong> ' + rows +
      '<br><strong>Decking boards needed:</strong> ' + boards +
      ' <span style="color:#5b6b82">(' + BL + ' ft boards, includes ' + v.waste + '% waste)</span>' +
      '<br><span style="color:#5b6b82">Boards run the ' + DL + ' ft direction. Add a picture-frame border or stairs separately.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['deckboard'] = calc;
  }
})();
