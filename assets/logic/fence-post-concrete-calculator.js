/* TradeCalc — Fence Post Concrete Calculator core logic (pure, no DOM). */
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
    var dia = pos(v.diameter, 'Hole diameter');
    var depth = pos(v.depth, 'Hole depth');
    var n = num(v.posts, 'Number of posts');
    if (n < 1 || Math.floor(n) !== n) { throw new Error('Number of posts must be a whole number of 1 or more.'); }
    var postVol = 0;
    var postLabel = '';
    if (v.post === '4x4') { postVol = 3.5 * 3.5 * depth / 1728; postLabel = '4\u00d74 post (3\u00bd \u00d7 3\u00bd in actual)'; }
    else if (v.post === '6x6') { postVol = 5.5 * 5.5 * depth / 1728; postLabel = '6\u00d76 post (5\u00bd \u00d7 5\u00bd in actual)'; }
    else if (v.post === 'round4') { postVol = Math.PI * 2 * 2 * depth / 1728; postLabel = 'round 4-in post'; }
    else if (v.post === 'round6') { postVol = Math.PI * 3 * 3 * depth / 1728; postLabel = 'round 6-in post'; }
    else if (v.post === 'none') { postVol = 0; postLabel = 'no post (open hole)'; }
    else { throw new Error('Unknown post size.'); }
    var holeVol = Math.PI * (dia / 2) * (dia / 2) * depth / 1728;
    var perPost = holeVol - postVol;
    if (perPost <= 0) { throw new Error('The post is wider than the hole \u2014 increase the hole diameter.'); }
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var total = perPost * n * (1 + waste);
    var out = '<strong>Concrete per post:</strong> ' + round(perPost, 2) + ' cu ft' +
      ' <span style="color:#5b6b82">(hole ' + round(holeVol, 2) + ' cu ft minus ' + postLabel + ' ' + round(postVol, 2) + ' cu ft)</span>' +
      '<br><strong>Total concrete:</strong> ' + round(total, 2) + ' cu ft (' + round(total / 27, 2) + ' cu yd)' +
      ' <span style="color:#5b6b82">(' + n + ' post' + (n === 1 ? '' : 's') + (waste > 0 ? ', including ' + v.waste + '% waste' : '') + ')</span>';
    if (v.bag === 'ready') {
      out += '<br><span style="color:#5b6b82">Order ' + round(total / 27, 2) + ' cubic yards of ready-mix \u2014 most suppliers have a 1 cu yd minimum, so a small fence usually buys bags instead.</span>';
    } else {
      var bagVol = v.bag === '80' ? 0.6 : v.bag === '60' ? 0.45 : 0.3;
      var bags = Math.ceil(total / bagVol);
      var perPostBags = Math.ceil(perPost * (1 + waste) / bagVol);
      out += '<br><strong>Bags of ' + v.bag + ' lb mix:</strong> ' + bags +
        ' <span style="color:#5b6b82">(' + perPostBags + ' per post \u2014 buy the total, not the per-post figure rounded up for every post)</span>' +
        '<br><span style="color:#5b6b82">One ' + v.bag + ' lb bag yields about ' + bagVol + ' cu ft. Set the post plumb and brace it until the mix sets.</span>';
    }
    out += '<br><span style="color:#5b6b82">Rule of thumb: hole depth at least one-third of the post above ground, minimum 2 ft, and below the frost line in cold climates.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['fencepost'] = calc;
  }
})();
