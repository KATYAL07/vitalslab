/**
 * VitalsLab - User Interface Controller & Application Logic
 * Developed and maintained by Arnav Katyal
 */

(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return document.querySelectorAll(s); };

  var toast = function (msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(function () { t.style.display = 'none'; }, 2600);
  };

  var setGauge = function (el, v) {
    if (!el) return;
    el.style.strokeDashoffset = 283 - 283 * (v / 100);
  };

  // Initialize gauges on initial page load
  setGauge($('#g-perf'), 94);
  setGauge($('#g-a11y'), 78);
  setGauge($('#g-bp'), 96);
  setGauge($('#g-seo'), 92);

  // Active configuration tracking
  var activePresetKey = 'saas';
  var getActiveConfig = function () {
    return (window.VitalsEngine && window.VitalsEngine.PRESET_PROFILES[activePresetKey]) || {
      scores: { perf: 94, a11y: 78, bp: 96, seo: 92 },
      descs: {
        perf: 'Simulated LCP: 1.2s · INP: 45ms · CLS: 0.01',
        a11y: 'WCAG 2.2 AA · 2 low contrast items detected',
        bp: 'Zero-JS baseline · 1 redundant client:load',
        seo: 'OpenGraph valid · Twitter card configured'
      },
      findings: []
    };
  };

  // Preset buttons
  $$('.preset').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.preset').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      activePresetKey = b.dataset.p;
      var c = window.VitalsEngine ? window.VitalsEngine.PRESET_PROFILES[activePresetKey] : null;
      if (c) {
        var input = $('#url-input');
        if (input) input.value = c.url;
        runAudit(c);
      }
    });
  });

  // Audit simulation runner
  function runAudit(cfg) {
    cfg = cfg || getActiveConfig();
    var prog = $('#prog');
    var fill = $('#prog-fill');
    var st = $('#prog-st');
    var pct = $('#prog-pct');
    var btn = $('#btn-run');

    if (prog) prog.style.display = 'block';
    if (btn) { btn.disabled = true; btn.style.opacity = '.6'; }

    var steps = [
      { p: 15, t: 'Scanning DOM hierarchy and heading structure...' },
      { p: 35, t: 'Simulating Core Web Vitals (LCP, INP, CLS)...' },
      { p: 55, t: 'Evaluating WCAG 2.2 AA contrast ratios and ARIA...' },
      { p: 75, t: 'Auditing Astro island hydration directives...' },
      { p: 90, t: 'Generating deterministic remediation diffs...' },
      { p: 100, t: 'Audit complete. All rules evaluated.' }
    ];

    var i = 0;
    var iv = setInterval(function () {
      if (i < steps.length) {
        if (fill) fill.style.width = steps[i].p + '%';
        if (pct) pct.textContent = steps[i].p + '%';
        if (st) st.textContent = steps[i].t;
        i++;
      } else {
        clearInterval(iv);
        setTimeout(function () {
          if (prog) prog.style.display = 'none';
          if (btn) { btn.disabled = false; btn.style.opacity = '1'; }

          var scores = cfg.scores || cfg.s;
          var descs = cfg.descs;

          if (scores) {
            if ($('#n-perf')) $('#n-perf').textContent = scores.perf;
            if ($('#n-a11y')) $('#n-a11y').textContent = scores.a11y;
            if ($('#n-bp')) $('#n-bp').textContent = scores.bp;
            if ($('#n-seo')) $('#n-seo').textContent = scores.seo;

            setGauge($('#g-perf'), scores.perf);
            setGauge($('#g-a11y'), scores.a11y);
            setGauge($('#g-bp'), scores.bp);
            setGauge($('#g-seo'), scores.seo);
          }

          if (descs) {
            if ($('#d-perf')) $('#d-perf').textContent = descs.perf;
            if ($('#d-a11y')) $('#d-a11y').textContent = descs.a11y;
            if ($('#d-bp')) $('#d-bp').textContent = descs.bp;
            if ($('#d-seo')) $('#d-seo').textContent = descs.seo;
          }

          toast('Audit completed successfully.');
        }, 400);
      }
    }, 180);
  }

  var runBtn = $('#btn-run');
  if (runBtn) {
    runBtn.addEventListener('click', function () { runAudit(); });
  }

  // Navigation tab switcher
  $$('.tab-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tab-btn').forEach(function (x) { x.classList.remove('on'); });
      $$('.tab-panel').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var t = $('#' + b.dataset.t);
      if (t) t.classList.add('on');
    });
  });

  // Severity filter chips
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('.chip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      var f = c.dataset.f;
      $$('.finding').forEach(function (card) {
        card.style.display = (f === 'all' || card.dataset.s === f) ? 'flex' : 'none';
      });
    });
  });

  // Copy code fix button handlers
  $$('.cp').forEach(function (b) {
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(b.dataset.cp);
      toast('Code fix copied to clipboard.');
    });
  });

  // Unified Git patch copy
  var patchBtn = $('#btn-patch');
  if (patchBtn) {
    patchBtn.addEventListener('click', function () {
      var cfg = getActiveConfig();
      var patchText = (window.VitalsEngine && cfg.findings)
        ? window.VitalsEngine.generateUnifiedPatch(cfg.findings)
        : `diff --git a/src/pages/index.astro b/src/pages/index.astro
--- a/src/pages/index.astro
+++ b/src/pages/index.astro
-<img src="/hero.webp" alt="Dashboard" />
+<img src="/hero.webp" alt="Dashboard" width="1200" height="630" fetchpriority="high" />
-<MetricsChart client:load />
+<MetricsChart client:visible />
-.btn-secondary { color: #64748b; }
+.btn-secondary { color: #94a3b8; }`;

      navigator.clipboard.writeText(patchText);
      toast('Unified git patch copied to clipboard.');
    });
  }

  // Action plan copy
  var planBtn = $('#btn-plan');
  if (planBtn) {
    planBtn.addEventListener('click', function () {
      var cfg = getActiveConfig();
      var planText = (window.VitalsEngine && cfg.findings)
        ? window.VitalsEngine.generateActionPlan(cfg.findings)
        : `VitalsLab Remediation Action Plan:
1. [Critical] Replace <MetricsChart client:load /> with client:visible (Saves 42kB initial JS)
2. [Warning] Bump secondary button text color #64748b -> #475569 (Passes WCAG 2.2 AA 5.4:1)
3. [Warning] Add width=1200 height=630 fetchpriority=high to hero image (Eliminates CLS)
4. [Passed] OpenGraph and Canonical meta tags correctly configured.`;

      navigator.clipboard.writeText(planText);
      toast('Action plan copied to clipboard.');
    });
  }

  // JSON audit report exporter
  var exportBtn = $('#btn-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var cfg = getActiveConfig();
      var report = {
        auditEngine: 'VitalsLab Auditor v2.4',
        maintainer: 'Arnav Katyal',
        timestamp: new Date().toISOString(),
        targetUrl: ($('#url-input') && $('#url-input').value) || cfg.url,
        scores: {
          performance: +($('#n-perf') ? $('#n-perf').textContent : 94),
          accessibility: +($('#n-a11y') ? $('#n-a11y').textContent : 78),
          bestPractices: +($('#n-bp') ? $('#n-bp').textContent : 96),
          seo: +($('#n-seo') ? $('#n-seo').textContent : 92)
        },
        metrics: cfg.metrics || { lcp: '1.2s', inp: '45ms', cls: 0.01 },
        summary: 'Audit completed. All metrics evaluated client-side.'
      };

      var blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'vitalslab-audit-report.json';
      link.click();
      URL.revokeObjectURL(url);
      toast('Exported vitalslab-audit-report.json.');
    });
  }

  // WCAG 2.2 Contrast Lab handlers
  var fgPicker = $('#fg-pick');
  var bgPicker = $('#bg-pick');

  function updateContrastLab() {
    if (!fgPicker || !bgPicker) return;
    var fg = fgPicker.value;
    var bg = bgPicker.value;

    if (!window.ContrastLab) return;
    var ratio = window.ContrastLab.calculateContrastRatio(fg, bg);
    var evalResult = window.ContrastLab.evaluateWcagCompliance(ratio);

    if ($('#fg-hex')) $('#fg-hex').textContent = fg.toUpperCase();
    if ($('#bg-hex')) $('#bg-hex').textContent = bg.toUpperCase();

    var surf = $('#clab-surf');
    if (surf) {
      surf.style.backgroundColor = bg;
      surf.style.color = fg;
    }

    if ($('#clab-rat')) $('#clab-rat').textContent = evalResult.ratioFormatted;

    var badge = $('#clab-badge');
    if (badge) {
      badge.textContent = evalResult.classification.label;
      badge.className = 'sev ' + evalResult.classification.level;
    }
  }

  if (fgPicker && bgPicker) {
    fgPicker.addEventListener('input', updateContrastLab);
    bgPicker.addEventListener('input', updateContrastLab);
    updateContrastLab();
  }
})();
