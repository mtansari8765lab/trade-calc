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


  // Ceil guarded against float dust.
  function ceilE(x) { return Math.ceil(x - 1e-9); }

  function calc(v) {
    var DL = pos(v.dlength, 'Deck length');
    var DW = pos(v.dwidth, 'Deck width');
    var BL = num(v.blength, 'Board length');
    var BW = v.bwidth === '' ? 5.5 : pos(v.bwidth, 'Board width');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var rows = ceilE((DW * 12) / BW);
    var boards = ceilE((rows * DL * (1 + waste)) / BL);
    /* Screws: 2 at every joist crossing. Joists assumed 16 in on center along
       the board-run direction; each purchased board is fastened over its run. */
    var joists = Math.floor((DL * 12) / 16) + 1;
    var screws = boards * joists * 2;
    return '<strong>Board rows across deck:</strong> ' + rows +
      '<br><strong>Decking boards needed:</strong> ' + boards +
      ' <span style="color:#5b6b82">(' + BL + ' ft boards, includes ' + v.waste + '% waste)</span>' +
      '<br><strong>Screws:</strong> ~' + screws +
      ' <span style="color:#5b6b82">(2 per board at each of ' + joists + ' joists, 16 in on center \u2014 buy a box of ' +
      Math.ceil(screws / 100) * 100 + ')</span>' +
      '<br><span style="color:#5b6b82">Boards run the ' + DL + ' ft direction. Add a picture-frame border or stairs separately.</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['deckboard'] = calc;
  }
})();
