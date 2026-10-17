/* TradeCalc — shared site JS (no frameworks, no external requests). */
(function () {
  'use strict';

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initToolFilter() {
    var input = document.getElementById('tool-filter');
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-tool-name]'));
    var empty = document.getElementById('filter-empty');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var hay = (card.getAttribute('data-tool-name') + ' ' + card.textContent).toLowerCase();
        var show = q === '' || hay.indexOf(q) !== -1;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? '' : 'none';
    });
  }

  function showError(box, message) {
    box.style.display = '';
    box.textContent = message;
  }

  function hideError(box) {
    box.style.display = 'none';
    box.textContent = '';
  }

  window.TradeCalc = window.TradeCalc || {};
  window.TradeCalc.showError = showError;
  window.TradeCalc.hideError = hideError;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initNav(); initYear(); initToolFilter(); });
  } else { initNav(); initYear(); initToolFilter(); }
})();
