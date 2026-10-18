/* TradeCalc — Stair Calculator core logic (pure, no DOM). */
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
    var rise = pos(v.rise, 'Total rise');
    var target = v.target === '' ? 7.5 : pos(v.target, 'Target riser height');
    var tread = v.tread === '' ? 10 : pos(v.tread, 'Tread depth');
    var risers = Math.ceil(rise / target);
    if (risers < 1) { risers = 1; }
    var actual = rise / risers;
    var treads = risers - 1;
    var run = treads * tread;
    var stringer = Math.sqrt(rise * rise + run * run);
    var angle = Math.atan(rise / (run === 0 ? 1 : run)) * 180 / Math.PI;
    var out = '<strong>Risers:</strong> ' + risers +
      ' <span style="color:#5b6b82">at ' + round(actual, 2) + ' in each</span>' +
      '<br><strong>Treads:</strong> ' + treads +
      '<br><strong>Total run:</strong> ' + round(run, 1) + ' in (' + round(run / 12, 2) + ' ft)' +
      '<br><strong>Stringer length:</strong> ' + round(stringer, 1) + ' in (' + round(stringer / 12, 2) + ' ft)' +
      '<br><strong>Stair angle:</strong> ' + round(angle, 1) + '\u00b0';
    var notes = [];
    if (actual > 7.75) { notes.push('Actual riser height exceeds the 7 3/4 in residential code maximum \u2014 add another riser.'); }
    if (tread < 10) { notes.push('Tread depth is below the 10 in residential code minimum \u2014 deepen the treads.'); }
    if (risers >= 4) { notes.push('4+ risers need a handrail at 34\u201338 in above the nosing line in most codes.'); }
    if (angle < 30 || angle > 40) { notes.push('Stair angles of 30\u201340\u00b0 feel most comfortable; adjust riser/run to land in that zone.'); }
    if (notes.length) {
      out += '<br><br><strong>Code & comfort notes:</strong><br><span style="color:#a3541e">' +
        notes.join('<br>') + '</span>';
    } else {
      out += '<br><span style="color:#3d7a44">Layout meets common residential code limits \u2014 confirm with your local building department.</span>';
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['stair'] = calc;
  }
})();
