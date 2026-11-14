/* TradeCalc — House Construction Cost Estimator core logic (pure, no DOM). */
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


  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function rateVal(val, name, example) {
    if (val === '' || val === undefined) { return { rate: example, placeholder: true }; }
    var r = num(val, name);
    if (r < 0) { throw new Error(name + ' cannot be negative.'); }
    return { rate: r, placeholder: false };
  }
  function calc(v) {
    var L = pos(v.length, 'Building length');
    var W = pos(v.width, 'Building width');
    var floors = num(v.floors, 'Floors');
    if (floors < 1 || floors > 3 || Math.floor(floors) !== floors) { throw new Error('Floors must be 1, 2, or 3.'); }
    var structure = rateVal(v.structure, 'Structure rate', 85);
    var finishes = rateVal(v.finishes, 'Finishes rate', 45);
    var roofing = rateVal(v.roofing, 'Roofing rate', 12);
    var services = rateVal(v.services, 'Services rate', 25);
    var site = (v.site === '' || v.site === undefined) ? 0 : num(v.site, 'Site and other costs');
    if (site < 0) { throw new Error('Site and other costs cannot be negative.'); }
    var cont = num(v.contingency, 'Contingency') / 100;
    if (cont < 0 || cont > 0.5) { throw new Error('Contingency must be between 0 and 50%.'); }
    var footprint = L * W;
    var area = footprint * floors;
    var cStructure = area * structure.rate;
    var cFinishes = area * finishes.rate;
    var cRoofing = footprint * roofing.rate;
    var cServices = area * services.rate;
    var subtotal = cStructure + cFinishes + cRoofing + cServices + site;
    var contAmt = subtotal * cont;
    var total = subtotal + contAmt;
    var used = [];
    if (structure.placeholder) { used.push('structure'); }
    if (finishes.placeholder) { used.push('finishes'); }
    if (roofing.placeholder) { used.push('roofing'); }
    if (services.placeholder) { used.push('services'); }
    var out = '<strong>Total floor area:</strong> ' + round(area, 0) + ' sq ft' +
      ' <span style="color:#5b6b82">(' + round(footprint, 0) + ' sq ft footprint \u00d7 ' + floors + ' floor' + (floors === 1 ? '' : 's') + ')</span>' +
      '<br><strong>Structure:</strong> $' + fmt(cStructure) +
      ' <span style="color:#5b6b82">(' + round(area, 0) + ' sq ft \u00d7 $' + structure.rate + '/sq ft)</span>' +
      '<br><strong>Finishes:</strong> $' + fmt(cFinishes) +
      ' <span style="color:#5b6b82">(' + round(area, 0) + ' sq ft \u00d7 $' + finishes.rate + '/sq ft)</span>' +
      '<br><strong>Roofing:</strong> $' + fmt(cRoofing) +
      ' <span style="color:#5b6b82">(' + round(footprint, 0) + ' sq ft footprint \u00d7 $' + roofing.rate + '/sq ft)</span>' +
      '<br><strong>Services (plumbing, electrical, HVAC):</strong> $' + fmt(cServices) +
      ' <span style="color:#5b6b82">(' + round(area, 0) + ' sq ft \u00d7 $' + services.rate + '/sq ft)</span>' +
      '<br><strong>Site and other costs:</strong> $' + fmt(site) +
      '<br><strong>Subtotal:</strong> $' + fmt(subtotal) +
      '<br><strong>Contingency (' + v.contingency + '%):</strong> $' + fmt(contAmt) +
      '<br><strong>Estimated total:</strong> $' + fmt(total) +
      '<br><strong>Cost per sq ft:</strong> $' + round(total / area, 2);
    if (used.length > 0) {
      out += '<br><span style="color:#5b6b82">Example placeholder rates used for: ' + used.join(', ') +
        ' \u2014 these are not market prices. Enter your own local rates for a real estimate.</span>';
    }
    out += '<br><span style="color:#5b6b82">Planning estimate, not a contractor quote. Local rates vary widely \u2014 get itemized quotes from local builders.</span>';
    return out;
  }

  var api = { calc: calc };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof window !== 'undefined') {
    window.TradeCalc = window.TradeCalc || {};
    window.TradeCalc['housecost'] = calc;
  }
})();
