/* TradeCalc — Wallpaper Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Total wall length');
    var H = pos(v.height, 'Wall height');
    var RW = v.width === '' ? 20.5 : pos(v.width, 'Roll width');
    var RL = v.roll === '' ? 33 : pos(v.roll, 'Roll length');
    var rep = v.repeat === '' ? 0 : num(v.repeat, 'Pattern repeat');
    if (rep < 0) { throw new Error('Pattern repeat cannot be negative.'); }
    var strips = ceilE((L * 12) / RW);
    var stripLen = H + rep / 12;
    if (stripLen > RL) { throw new Error('One strip (wall height + pattern repeat) is longer than the roll \u2014 use a longer roll.'); }
    var perRoll = Math.floor(RL / stripLen);
    if (perRoll < 1) { throw new Error('No full strip fits in one roll \u2014 use a longer roll.'); }
    var rolls = ceilE(strips / perRoll);
    var out = '<strong>Wall area:</strong> ' + round(L * H, 0) + ' sq ft' +
      '<br><strong>Strips needed:</strong> ' + strips +
      '<br><strong>Strips per roll:</strong> ' + perRoll +
      ' <span style="color:#5b6b82">(each strip ' + round(stripLen, 2) + ' ft incl. repeat)</span>' +
      '<br><strong>Rolls to buy:</strong> ' + rolls;
    if (v.price !== '') {
      var p = num(v.price, 'Price per roll');
      if (p < 0) { throw new Error('Price per roll cannot be negative.'); }
      out += '<br><strong>Estimated paper cost:</strong> $' + round(rolls * p, 2);
    }
    out += '<br><span style="color:#5b6b82">Buy all rolls from the same dye lot \u2014 colors shift slightly between batches.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['wallpaper'] = calc;
  }
})();
