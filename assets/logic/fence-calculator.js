/* TradeCalc — Fence Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Fence length');
    var PW = v.pwidth === '' ? 5.5 : pos(v.pwidth, 'Picket width');
    var gap = v.gap === '' ? 0 : num(v.gap, 'Gap between pickets');
    if (gap < 0) { throw new Error('Gap between pickets cannot be negative.'); }
    var spacing = v.spacing === '' ? 8 : pos(v.spacing, 'Post spacing');
    var pickets = Math.ceil((L * 12) / (PW + gap));
    var sections = Math.ceil(L / spacing);
    var posts = sections + 1;
    var rails = sections * 2;
    var concreteBags = posts; // ~1 bag per post hole is the common rule of thumb
    return '<strong>Pickets:</strong> ' + pickets +
      ' <span style="color:#5b6b82">(' + PW + ' in wide' + (gap > 0 ? ', ' + gap + ' in gap' : ', no gap') + ')</span>' +
      '<br><strong>Posts:</strong> ' + posts + ' <span style="color:#5b6b82">(' + spacing + ' ft spacing)</span>' +
      '<br><strong>Rails:</strong> ' + rails + ' <span style="color:#5b6b82">(2 per section)</span>' +
      '<br><strong>Concrete (rule of thumb):</strong> ~' + concreteBags +
      ' bags <span style="color:#5b6b82">(about 1 bag per post hole \u2014 verify with the <a href="../concrete-calculator/index.html">concrete calculator</a>)</span>';
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['fence'] = calc;
  }
})();
