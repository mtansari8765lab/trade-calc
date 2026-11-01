/* TradeCalc — Baseboard Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Room length');
    var W = pos(v.width, 'Room width');
    var doors = num(v.doors, 'Number of doorways');
    if (doors < 0 || doors > 50 || Math.floor(doors) !== doors) { throw new Error('Number of doorways must be a whole number between 0 and 50.'); }
    var stick = pos(v.stick, 'Baseboard stick length');
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var perim = 2 * (L + W);
    var net = perim - doors * 3;
    if (net <= 0) { throw new Error('Door deductions exceed the room perimeter \u2014 check the door count.'); }
    var order = ceilE(net * (1 + waste));
    var sticks = ceilE(order / stick);
    var out = '<strong>Room perimeter:</strong> ' + round(perim, 2) + ' ft' +
      '<br><strong>Baseboard needed (net, doors deducted):</strong> ' + round(net, 2) + ' ft' +
      '<br><strong>Order (with ' + v.waste + '% waste):</strong> ' + order + ' ft' +
      '<br><strong>Sticks to buy (' + v.stick + ' ft sticks):</strong> ' + sticks +
      '<br><span style="color:#5b6b82">Each doorway deducts 3 ft, the standard interior door width. Measure the walls at baseboard height, and count cased openings the same as doors \u2014 baseboard stops at the casing on both sides.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['baseboard'] = calc;
  }
})();
