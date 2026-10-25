/* TradeCalc — Grout Calculator core logic (pure, no DOM). */
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
    var A = pos(v.area, 'Tile area');
    var L = pos(v.tileL, 'Tile length');
    var W = pos(v.tileW, 'Tile width');
    var J = pos(v.joint, 'Joint width');
    var D = pos(v.depth, 'Joint depth');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var bag = pos(v.bag, 'Bag size');
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var density = (v.type === 'unsanded') ? 105 : 120;
    var share = 1 - (L / (L + J)) * (W / (W + J));
    var lb = A * share * (D / 12) * density;
    var withWaste = lb * (1 + waste);
    var bags = Math.ceil(withWaste / bag - 1e-9);
    var out = '<strong>Grout needed (net):</strong> ' + round(lb, 2) + ' lb' +
      '<br><strong>With ' + v.waste + '% waste:</strong> ' + round(withWaste, 2) + ' lb' +
      '<br><strong>Bags to buy (' + v.bag + ' lb bags):</strong> ' + bags +
      '<br><span style="color:#5b6b82">Check the coverage printed on your grout bag first — brands vary, and the bag governs. Sanded grout is for joints 1/8 in and wider; unsanded for narrower joints and scratch-prone tile.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['grout'] = calc;
  }
})();
