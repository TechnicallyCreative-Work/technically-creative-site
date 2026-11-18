/*
 * TC analytics layer — pushes GA4-style events to the GTM dataLayer.
 *
 * Declarative hooks (no per-page JS needed):
 *   data-track="cta_click"            click on any element -> event with its params
 *   data-track-label="..."            human label for the click
 *   data-track-location="..."         where on the page the element lives
 *   data-track-item='{"item_id":..}'  GA4 ecommerce item (JSON) -> select_item / begin_checkout
 *   data-track-view-item='{...}'      on page: fire view_item once for this item (JSON)
 *
 * Automatic:
 *   form_start   first focus/input inside any <form>
 *   form_submit  every submit (success is reported separately via tcTrack('generate_lead'))
 *
 * Imperative: window.tcTrack(eventName, params)
 *
 * Safe to load more than once and across Astro view transitions.
 */
(function () {
  if (window.__tcAnalytics) return;
  window.__tcAnalytics = true;
  window.dataLayer = window.dataLayer || [];

  function track(name, params) {
    try {
      var ev = { event: name };
      if (params) for (var k in params) ev[k] = params[k];
      // GA4 ecommerce events expect `ecommerce` to be cleared first.
      if (ev.ecommerce) window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push(ev);
    } catch (e) {}
  }
  window.tcTrack = track;

  function parse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function formId(form) {
    return form.id || form.getAttribute('name') || form.getAttribute('data-form-id') || 'unnamed_form';
  }

  // ---- Clicks -----------------------------------------------------------
  document.addEventListener(
    'click',
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
      if (!el) return;
      var name = el.getAttribute('data-track');
      var params = {
        link_text: (el.getAttribute('data-track-label') || el.textContent || '').trim().slice(0, 80),
        link_url: el.getAttribute('href') || undefined,
        location: el.getAttribute('data-track-location') || undefined,
        page_path: location.pathname,
      };
      var item = parse(el.getAttribute('data-track-item'));
      if (item) {
        params.ecommerce = {
          currency: item.currency || 'USD',
          value: item.price || 0,
          items: [item],
        };
      }
      track(name, params);
    },
    true
  );

  // ---- Forms ------------------------------------------------------------
  var started = new WeakSet();
  function onFormStart(e) {
    var form = e.target && e.target.closest ? e.target.closest('form') : null;
    if (!form || started.has(form)) return;
    started.add(form);
    track('form_start', { form_id: formId(form), page_path: location.pathname });
  }
  document.addEventListener('focusin', onFormStart, true);
  document.addEventListener('input', onFormStart, true);

  document.addEventListener(
    'submit',
    function (e) {
      var form = e.target;
      if (!form || form.tagName !== 'FORM') return;
      track('form_submit', { form_id: formId(form), page_path: location.pathname });
    },
    true
  );

  // ---- view_item (declarative, once per page view) -----------------------
  var lastViewPath = null;
  function fireViewItems() {
    var nodes = document.querySelectorAll('[data-track-view-item]');
    if (!nodes.length || lastViewPath === location.pathname) return;
    lastViewPath = location.pathname;
    var items = [];
    var value = 0;
    var list = '';
    nodes.forEach(function (n) {
      var item = parse(n.getAttribute('data-track-view-item'));
      if (item) {
        items.push(item);
        value += item.price || 0;
        list = list || n.getAttribute('data-track-list') || '';
      }
    });
    if (!items.length) return;
    // One item -> view_item (detail page); several -> view_item_list (catalog).
    if (items.length === 1) {
      track('view_item', { ecommerce: { currency: items[0].currency || 'USD', value: value, items: items } });
    } else {
      track('view_item_list', { item_list_name: list || location.pathname, ecommerce: { items: items } });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fireViewItems);
  else fireViewItems();
  // Astro view transitions swap pages without a reload; re-run per navigation.
  document.addEventListener('astro:page-load', fireViewItems);
  document.addEventListener('astro:before-swap', function () {
    lastViewPath = null;
  });
})();
