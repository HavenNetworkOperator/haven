// Haven cookie consent — gates PostHog analytics + session recordings
// PostHog is initialised with opt_out_capturing_by_default: true so nothing
// is sent until the visitor explicitly accepts. Decision persists in localStorage.
(function () {
  'use strict';

  var STORAGE_KEY = 'haven_consent_v1';

  var style = document.createElement('style');
  style.textContent = [
    '.haven-consent{position:fixed;bottom:0;left:0;right:0;background:#0f1b2d;color:#f4efe6;padding:16px 24px;z-index:9999;border-top:2px solid #c14a1f;font-family:"Inter Tight",-apple-system,sans-serif;transform:translateY(100%);transition:transform .3s ease-out;box-shadow:0 -8px 24px rgba(0,0,0,.18)}',
    '.haven-consent.visible{transform:translateY(0)}',
    '.haven-consent-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:24px}',
    '.haven-consent-text{flex:1;font-size:14px;line-height:1.55;margin:0;color:#f4efe6}',
    '.haven-consent-text a{color:#f4efe6;text-decoration:underline}',
    '.haven-consent-text a:hover{color:#e88a5e}',
    '.haven-consent-actions{display:flex;gap:8px;flex-shrink:0}',
    '.haven-consent-btn{font-family:inherit;font-size:14px;padding:10px 18px;border:1px solid #f4efe6;cursor:pointer;background:transparent;color:#f4efe6;transition:background .15s,color .15s,border-color .15s;border-radius:0}',
    '.haven-consent-btn:hover{background:rgba(244,239,230,.12)}',
    '.haven-consent-btn--accept{background:#c14a1f;border-color:#c14a1f}',
    '.haven-consent-btn--accept:hover{background:#a53e16;border-color:#a53e16}',
    '@media (max-width:720px){.haven-consent{padding:14px 16px}.haven-consent-inner{flex-direction:column;align-items:stretch;gap:12px}.haven-consent-actions{justify-content:flex-end}}'
  ].join('');
  document.head.appendChild(style);

  function applyDecision(decision) {
    if (!window.posthog) return;
    if (decision === 'accepted') {
      window.posthog.opt_in_capturing();
    } else if (decision === 'declined') {
      window.posthog.opt_out_capturing();
    }
  }

  function showBanner() {
    var banner = document.createElement('aside');
    banner.className = 'haven-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Privacy choice');
    banner.innerHTML =
      '<div class="haven-consent-inner">' +
        '<p class="haven-consent-text">' +
          'We use light analytics to see which pages help families decide to join — page views, clicks, scroll. Nothing private; nothing about who you are. ' +
          '<a href="/privacy/">Read what we collect</a>.' +
        '</p>' +
        '<div class="haven-consent-actions">' +
          '<button class="haven-consent-btn" type="button" data-decision="declined">Decline</button>' +
          '<button class="haven-consent-btn haven-consent-btn--accept" type="button" data-decision="accepted">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('visible'); });

    banner.addEventListener('click', function (e) {
      var decision = e.target && e.target.dataset && e.target.dataset.decision;
      if (!decision) return;
      try { localStorage.setItem(STORAGE_KEY, decision); } catch (_) {}
      applyDecision(decision);
      banner.classList.remove('visible');
      setTimeout(function () { banner.remove(); }, 300);
    });
  }

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) {}

  if (stored === 'accepted' || stored === 'declined') {
    applyDecision(stored);
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
