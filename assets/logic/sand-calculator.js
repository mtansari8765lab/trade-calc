/* TradeCalc — Sand Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Length');
    var W = pos(v.width, 'Width');
    var D = pos(v.depth, 'Depth');
    var waste = num(v.waste, 'Waste allowance') / 100;
    var bag = pos(v.bag, 'Bag size');
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var cuFt = L * W * (D / 12);
    var yards = cuFt / 27;
    var tons = yards * 1.35;
    var cuFtW = cuFt * (1 + waste);
    var yardsW = yards * (1 + waste);
    var tonsW = tons * (1 + waste);
    var bagCuFt = bag / 100;
    var bags = Math.ceil(cuFtW / bagCuFt - 1e-9);
    var out = '<strong>Sand needed (net):</strong> ' + round(cuFt, 2) + ' cu ft (' + round(yards, 2) + ' cu yd, ' + round(tons, 2) + ' tons)' +
      '<br><strong>With ' + v.waste + '% waste/compaction:</strong> ' + round(cuFtW, 2) + ' cu ft (' + round(yardsW, 2) + ' cu yd, ' + round(tonsW, 2) + ' tons)' +
      '<br><strong>Bags to buy (' + v.bag + ' lb bags):</strong> ' + bags +
      '<br><span style="color:#5b6b82">Use the right sand for the job: concrete/sharp sand for paver bases, washed play sand for sandboxes, masonry sand for mortar — the weight per yard is similar, but the wrong type fails the job.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['sand'] = calc;
  }
})();
