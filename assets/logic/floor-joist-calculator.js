/* TradeCalc — Floor Joist Calculator core logic (pure, no DOM). */
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
    var W = pos(v.width, 'Floor width');
    var S = pos(v.spacing, 'Joist spacing');
    var span = pos(v.span, 'Joist span');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var joists = ceilE((W * 12) / S) + 1;
    var order = ceilE(joists * (1 + waste));
    var rim = 2;
    var rimFt = rim * span;
    var totalFt = joists * span + rimFt;
    var out = '<strong>Floor joists:</strong> ' + joists +
      '<br><strong>Joists to order (with ' + v.waste + '% waste):</strong> ' + order +
      '<br><strong>Rim joists (end boards):</strong> ' + rim + ' boards, ' + rimFt + ' linear ft total' +
      '<br><strong>Total joist lumber:</strong> ' + totalFt + ' linear ft' +
      '<br><span style="color:#5b6b82">Count only: this does not size the joist. Check the joist size and spacing against your local span tables and building code for the span and load — a count is not a structural design.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['joist'] = calc;
  }
})();
