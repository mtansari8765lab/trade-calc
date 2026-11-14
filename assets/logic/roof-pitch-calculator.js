/* TradeCalc — Roof Pitch Calculator core logic (pure, no DOM). */
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
    var mode = v.mode || 'rise-run';
    var pitch;
    if (mode === 'rise-run') {
      var rise = num(v.rise, 'Rise');
      if (rise < 0) { throw new Error('Rise cannot be negative.'); }
      var run = pos(v.run, 'Run');
      pitch = rise / run * 12;
    } else if (mode === 'pitch') {
      pitch = num(v.pitchx, 'Pitch');
      if (pitch < 0) { throw new Error('Pitch cannot be negative.'); }
    } else if (mode === 'angle') {
      var ang = num(v.angle, 'Angle');
      if (ang < 0 || ang >= 80) { throw new Error('Angle must be between 0 and 80 degrees.'); }
      pitch = 12 * Math.tan(ang * Math.PI / 180);
    } else {
      throw new Error('Unknown pitch entry mode.');
    }
    if (pitch > 24) { throw new Error('Pitch must be 24:12 or less.'); }
    var ratio = pitch / 12;
    var angle = Math.atan(ratio) * 180 / Math.PI;
    var slope = ratio * 100;
    var mult = Math.sqrt(1 + ratio * ratio);
    var out = '<strong>Roof pitch:</strong> ' + round(pitch, 2) + ':12' +
      '<br><strong>Angle:</strong> ' + round(angle, 2) + ' degrees' +
      '<br><strong>Slope:</strong> ' + round(slope, 1) + '%' +
      '<br><strong>Pitch multiplier:</strong> ' + round(mult, 3) +
      ' <span style="color:#5b6b82">(multiply any horizontal run or footprint area by this for the length or area along the slope)</span>';
    var span = (v.span === '' || v.span === undefined) ? null : pos(v.span, 'Building span');
    var len = (v.length === '' || v.length === undefined) ? null : pos(v.length, 'Building length');
    var over = (v.overhang === '' || v.overhang === undefined) ? 0 : num(v.overhang, 'Overhang');
    if (over < 0) { throw new Error('Overhang cannot be negative.'); }
    if (span !== null) {
      var runFt = span / 2 + over / 12;
      var rafter = runFt * mult;
      var ridge = (span / 2) * ratio;
      out += '<br><strong>Common rafter length:</strong> ' + round(rafter, 2) + ' ft' +
        ' <span style="color:#5b6b82">(ridge to wall plate, including overhang \u2014 a line length; it does not deduct half the ridge board or allow for plumb and seat cuts)</span>' +
        '<br><strong>Ridge height above wall plate:</strong> ' + round(ridge, 2) + ' ft';
      if (len !== null) {
        var area = 2 * rafter * len;
        out += '<br><strong>Gable roof area:</strong> ' + round(area, 0) + ' sq ft' +
          ' <span style="color:#5b6b82">(both slopes, including overhang)</span>';
      }
    } else if (len !== null) {
      out += '<br><span style="color:#5b6b82">Enter the building span as well to get rafter length and roof area.</span>';
    }
    if (pitch < 2) {
      out += '<br><span style="color:#5b6b82">Below 2:12, asphalt shingles are not permitted (IRC R905.2.2) \u2014 use a low-slope covering instead.</span>';
    } else if (pitch < 4) {
      out += '<br><span style="color:#5b6b82">Between 2:12 and 4:12, asphalt shingles need two layers of underlayment (IRC R905.2.2).</span>';
    }
    if (pitch > 12) {
      out += '<br><span style="color:#5b6b82">Above 12:12 is a steep roof \u2014 plan for staging and slower, costlier work.</span>';
    }
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['roofpitch'] = calc;
  }
})();
