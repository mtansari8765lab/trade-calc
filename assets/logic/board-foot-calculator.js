/* TradeCalc — Board Foot Calculator core logic (pure, no DOM). */
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
    var T = pos(v.thickness, 'Thickness');
    var W = pos(v.width, 'Width');
    var L = pos(v.length, 'Length');
    var n = pos(v.boards, 'Number of boards');
    if (Math.floor(n) !== n) { throw new Error('Number of boards must be a whole number.'); }
    var bfEach = (T * W * L) / 12;
    var total = bfEach * n;
    var waste = (v.waste === undefined || v.waste === '') ? 0 : num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var out = '<strong>Board feet:</strong> ' + round(total, 2) +
      ' <span style="color:#5b6b82">(' + round(bfEach, 2) + ' per board)</span>';
    var p = null;
    if (v.price !== '') {
      p = num(v.price, 'Price per board foot');
      if (p < 0) { throw new Error('Price per board foot cannot be negative.'); }
      out += '<br><strong>Estimated cost:</strong> $' + round(total * p, 2);
    }
    if (waste > 0) {
      var buy = total * (1 + waste);
      out += '<br><strong>With ' + v.waste + '% waste/cull allowance:</strong> buy ~' + round(buy, 2) + ' board feet' +
        (p !== null ? ' <span style="color:#5b6b82">(\u2248 $' + round(buy * p, 2) + ')</span>' : '');
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['boardfoot'] = calc;
  }
})();
