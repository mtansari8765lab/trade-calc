/* TradeCalc — Retaining Wall Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Wall length');
    var H = pos(v.height, 'Wall height');
    var bL = pos(v.blockL, 'Block face length');
    var bH = pos(v.blockH, 'Block face height');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var courses = ceilE((H * 12) / bH);
    var perCourse = ceilE((L * 12) / bL);
    var total = courses * perCourse;
    var order = ceilE(total * (1 + waste));
    var caps = perCourse;
    var out = '<strong>Courses:</strong> ' + courses +
      '<br><strong>Blocks per course:</strong> ' + perCourse +
      '<br><strong>Wall blocks:</strong> ' + total +
      '<br><strong>Cap blocks (top course):</strong> ' + caps +
      '<br><strong>Order quantity (with ' + v.waste + '% waste):</strong> ' + order + ' blocks';
    if (v.price !== '') {
      var p = num(v.price, 'Price per block');
      if (p < 0) { throw new Error('Price per block cannot be negative.'); }
      out += '<br><strong>Estimated block cost:</strong> $' + round(order * p, 2) +
        ' <span style="color:#5b6b82">(caps usually priced separately \u2014 confirm with your supplier)</span>';
    }
    out += '<br><span style="color:#5b6b82">Wall height includes the buried base course: bury at least one full course (or 10% of wall height, whichever is more).</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['retaining'] = calc;
  }
})();
