/* TradeCalc — Attic Insulation Calculator core logic (pure, no DOM). */
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
    var L = pos(v.length, 'Attic length');
    var W = pos(v.width, 'Attic width');
    var current = num(v.current, 'Current R-value');
    var target = num(v.target, 'Target R-value');
    var parts = v.product.split(':');
    var kind = parts[0];
    var rPerIn = num(parts[1], 'Product');
    var area = L * W;
    var added = target - current;
    var out = '<strong>Attic area:</strong> ' + round(area, 0) + ' sq ft';
    if (added <= 0) {
      return out + '<br><span style="color:#3d7a44">Your attic already meets R-' + target +
        ' \u2014 no additional insulation needed for this target.</span>';
    }
    var inches = added / rPerIn;
    out += '<br><strong>R-value to add:</strong> R-' + added +
      '<br><strong>Thickness to add:</strong> ' + round(inches, 1) + ' inches';
    if (kind === 'blown') {
      var volume = area * inches / 12;
      var bags = ceilE(volume / 25);
      out += '<br><strong>Blown material:</strong> ' + round(volume, 0) + ' cubic feet' +
        '<br><strong>Bags to buy:</strong> ' + bags +
        ' <span style="color:#5b6b82">(assumes ~25 cu ft per bag \u2014 check your product\u2019s coverage chart, which varies by target depth)</span>';
    } else {
      var rolls = ceilE(area / 40);
      out += '<br><strong>Batt rolls to buy:</strong> ' + rolls +
        ' <span style="color:#5b6b82">(15-in \u00d7 32-ft rolls, 40 sq ft each; unfaced batts can be layered over existing insulation)</span>';
    }
    out += '<br><span style="color:#5b6b82">Air-seal attic bypasses (wiring, plumbing, chimney chases) before insulating \u2014 insulation does not stop air leaks.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['attic'] = calc;
  }
})();
