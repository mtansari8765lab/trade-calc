/* TradeCalc — Wall Stud Calculator core logic (pure, no DOM). */
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
    var spacing = pos(v.spacing, 'Stud spacing');
    var openings = v.openings === '' ? 0 : num(v.openings, 'Openings');
    if (openings < 0 || Math.floor(openings) !== openings) { throw new Error('Openings must be a whole number, 0 or more.'); }
    var waste = num(v.waste, 'Waste allowance') / 100;
    if (waste < 0 || waste > 0.5) { throw new Error('Waste allowance must be between 0 and 50%.'); }
    var studs = ceilE((L * 12) / spacing) + 1;
    var openingStuds = openings * 4;
    var total = studs + openingStuds;
    var plates = L * 3;
    var buy = ceilE(total * (1 + waste));
    var out = '<strong>Field studs:</strong> ' + studs +
      ' <span style="color:#5b6b82">(at ' + spacing + ' in on center, plus one end stud)</span>' +
      '<br><strong>Opening studs:</strong> ' + openingStuds +
      ' <span style="color:#5b6b82">(2 king + 2 jack studs per opening)</span>' +
      '<br><strong>Total studs:</strong> ' + total +
      '<br><strong>Plates:</strong> ' + round(plates, 0) + ' linear feet' +
      ' <span style="color:#5b6b82">(double top plate + sole plate)</span>' +
      '<br><strong>Buy list:</strong> ' + buy + ' studs' +
      ' <span style="color:#5b6b82">(includes ' + v.waste + '% waste)</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['stud'] = calc;
  }
})();
