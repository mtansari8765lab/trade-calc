/* TradeCalc — Wall Insulation Calculator core logic (pure, no DOM). */
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
    var H = pos(v.height, 'Wall height');
    var gross;
    if (v.mode === 'room') {
      var L = pos(v.length, 'Room length');
      var W = pos(v.width, 'Room width');
      gross = 2 * (L + W) * H;
    } else if (v.mode === 'wall') {
      var wl = pos(v.walllength, 'Total wall length');
      gross = wl * H;
    } else {
      throw new Error('Unknown entry mode.');
    }
    var openings = (v.openings === '' || v.openings === undefined) ? 0 : num(v.openings, 'Openings area');
    if (openings < 0) { throw new Error('Openings area cannot be negative.'); }
    if (openings >= gross) { throw new Error('Openings area must be less than the wall area.'); }
    var net = gross - openings;
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var rval = v.stud === '2x6' ? 'R-19 (R-21 high-density)' : 'R-13 (R-15 high-density)';
    var studLabel = v.stud === '2x6' ? '2\u00d76' : '2\u00d74';
    var out = '<strong>Gross wall area:</strong> ' + round(gross, 0) + ' sq ft' +
      '<br><strong>Net wall area (minus openings):</strong> ' + round(net, 0) + ' sq ft' +
      '<br><strong>Stud depth:</strong> ' + studLabel + ' \u2014 batts to ' + rval;
    if (v.type === 'batts') {
      var bw = num(v.battwidth, 'Batt width');
      var battArea = bw * 93 / 144;
      var need = Math.ceil(net / battArea * (1 + waste));
      out += '<br><strong>Batts needed:</strong> ' + need +
        ' <span style="color:#5b6b82">(' + bw + '-in \u00d7 93-in batts cover ' + round(battArea, 2) + ' sq ft each' + (waste > 0 ? ', including ' + v.waste + '% waste' : '') + ')</span>';
    } else if (v.type === 'cellulose') {
      var lbsPer = v.stud === '2x6' ? 1.6 : 1.0;
      var lbs = net * lbsPer * (1 + waste);
      var bags = Math.ceil(lbs / 25);
      out += '<br><strong>Dense-pack cellulose:</strong> ' + round(lbs, 0) + ' lb' +
        ' <span style="color:#5b6b82">(' + lbsPer + ' lb per sq ft at 3.5 lb/cu ft)</span>' +
        '<br><strong>Bags:</strong> ' + bags + ' bags of 25 lb';
    } else {
      throw new Error('Unknown insulation type.');
    }
    out += '<br><span style="color:#5b6b82">The R-value is capped by the stud depth \u2014 a ' + studLabel + ' cavity cannot hold more than ' + rval + ' in batts. Above that, add continuous insulation outside the sheathing.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['wallinsulation'] = calc;
  }
})();
