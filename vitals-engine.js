/**
 * VitalsLab - Core Web Vitals & Astro Island Hydration Audit Engine
 * Developed and maintained by Arnav Katyal
 * Evaluates performance metrics, hydration overhead, and code remediations.
 */

(function (global) {
  'use strict';

  var CWV_THRESHOLDS = {
    lcp: { good: 2500, needsImprovement: 4000, unit: 'ms' },
    inp: { good: 200, needsImprovement: 500, unit: 'ms' },
    cls: { good: 0.1, needsImprovement: 0.25, unit: '' },
    fcp: { good: 1800, needsImprovement: 3000, unit: 'ms' },
    ttfb: { good: 800, needsImprovement: 1800, unit: 'ms' }
  };

  var PRESET_PROFILES = {
    saas: {
      id: 'saas',
      name: 'SaaS Dashboard Application',
      url: 'https://app.vitalslab.internal/saas-preview',
      scores: { perf: 94, a11y: 78, bp: 96, seo: 92 },
      descs: {
        perf: 'Simulated LCP: 1.2s · INP: 45ms · CLS: 0.01',
        a11y: 'WCAG 2.2 AA · 2 low contrast items detected',
        bp: 'Zero-JS baseline · 1 redundant client:load',
        seo: 'OpenGraph valid · Twitter card configured'
      },
      metrics: { lcp: 1200, inp: 45, cls: 0.01, fcp: 900, ttfb: 220 },
      findings: [
        {
          id: 'CWV-01',
          category: 'perf',
          severity: 'crit',
          title: 'Immediate Island Hydration on Below-the-Fold Chart',
          file: 'src/pages/index.astro:L42',
          description: '<MetricsChart client:load /> forces eager hydration of 42kB client bundle during initial main thread execution, delaying LCP.',
          remediation: 'Replace client:load with client:visible to defer execution until element enters viewport.',
          diff: '-<MetricsChart client:load />\n+<MetricsChart client:visible />'
        },
        {
          id: 'A11Y-02',
          category: 'a11y',
          severity: 'warn',
          title: 'Secondary Button Contrast Under 4.5:1 Target',
          file: 'src/styles/components.css:L18',
          description: 'Text color #64748b against #ffffff surface achieves 3.82:1 ratio. Fails WCAG 2.2 Level AA normal text threshold.',
          remediation: 'Bump foreground hex to #475569 to achieve 5.48:1 contrast ratio.',
          diff: '-.btn-secondary { color: #64748b; }\n+.btn-secondary { color: #475569; }'
        },
        {
          id: 'CWV-03',
          category: 'perf',
          severity: 'warn',
          title: 'Hero Graphic Missing Explicit Dimensions and Priority',
          file: 'src/pages/index.astro:L14',
          description: 'Unsized <img> causes layout shift on slower network interfaces and lacks preload priority.',
          remediation: 'Add width="1200", height="630", and fetchpriority="high" attributes.',
          diff: '-<img src="/hero.webp" alt="Dashboard" />\n+<img src="/hero.webp" alt="Dashboard" width="1200" height="630" fetchpriority="high" />'
        },
        {
          id: 'SEO-04',
          category: 'seo',
          severity: 'pass',
          title: 'Canonical URL and OpenGraph Tags Validated',
          file: 'src/layouts/Layout.astro:L8',
          description: 'Full canonical links, meta robots, and og:image social tags match standard schema.',
          remediation: 'No remediation necessary.',
          diff: ''
        }
      ]
    },
    ecom: {
      id: 'ecom',
      name: 'High-Volume Storefront Demo',
      url: 'https://shop.vitalslab.internal/storefront-demo',
      scores: { perf: 71, a11y: 84, bp: 88, seo: 89 },
      descs: {
        perf: 'Simulated LCP: 3.1s · INP: 120ms · CLS: 0.12',
        a11y: 'WCAG 2.2 AA · 1 missing alt tag',
        bp: '3 over-hydrated islands detected',
        seo: 'Missing canonical · Twitter card OK'
      },
      metrics: { lcp: 3100, inp: 120, cls: 0.12, fcp: 2100, ttfb: 480 },
      findings: [
        {
          id: 'CWV-E1',
          category: 'perf',
          severity: 'crit',
          title: 'Carousel Slider Hydration Blocking Main Thread',
          file: 'src/components/ProductCarousel.astro:L8',
          description: 'Carousel bundle (98kB) loaded synchronously via client:load, directly spiking LCP to 3.1s.',
          remediation: 'Switch to client:idle to defer hydration until after page load.',
          diff: '-<ProductCarousel client:load />\n+<ProductCarousel client:idle />'
        }
      ]
    },
    portfolio: {
      id: 'portfolio',
      name: 'Personal Engineering Portfolio',
      url: 'https://arnav.engineering/portfolio',
      scores: { perf: 98, a11y: 92, bp: 100, seo: 95 },
      descs: {
        perf: 'Simulated LCP: 0.8s · INP: 22ms · CLS: 0.00',
        a11y: 'WCAG 2.2 AA · 1 focus order suggestion',
        bp: 'Fully static · Zero client JS shipped',
        seo: 'Full OpenGraph + JSON-LD structured data'
      },
      metrics: { lcp: 800, inp: 22, cls: 0.0, fcp: 650, ttfb: 140 },
      findings: [
        {
          id: 'BP-P1',
          category: 'bp',
          severity: 'pass',
          title: 'Pure Static HTML Island Architecture',
          file: 'src/pages/index.astro:L1',
          description: 'Zero client-side JavaScript sent to browser on initial load. Maximum performance tier.',
          remediation: 'No remediation necessary.',
          diff: ''
        }
      ]
    },
    docs: {
      id: 'docs',
      name: 'Technical Documentation Hub',
      url: 'https://docs.vitalslab.internal/v2/architecture',
      scores: { perf: 96, a11y: 95, bp: 98, seo: 99 },
      descs: {
        perf: 'Simulated LCP: 0.9s · INP: 30ms · CLS: 0.00',
        a11y: 'WCAG 2.2 AA · All checks passed',
        bp: '1 lazy-loaded component · No hydration bloat',
        seo: 'Sitemap + robots.txt + full canonical chain'
      },
      metrics: { lcp: 900, inp: 30, cls: 0.0, fcp: 700, ttfb: 180 },
      findings: [
        {
          id: 'DOC-01',
          category: 'seo',
          severity: 'pass',
          title: 'Complete Canonical Hierarchy & Sitemap Indexed',
          file: 'src/pages/[...slug].astro:L12',
          description: 'Sitemap XML generated deterministically with valid hreflang annotations.',
          remediation: 'No remediation necessary.',
          diff: ''
        }
      ]
    }
  };

  /**
   * Classify single Core Web Vital value against industry targets
   * @param {string} metric - 'lcp', 'inp', 'cls', 'fcp', or 'ttfb'
   * @param {number} value - Numeric measurement
   */
  function rateMetric(metric, value) {
    var threshold = CWV_THRESHOLDS[metric];
    if (!threshold) return { rating: 'unknown', status: 'neutral' };
    if (value <= threshold.good) return { rating: 'Good', status: 'pass' };
    if (value <= threshold.needsImprovement) return { rating: 'Needs Improvement', status: 'warn' };
    return { rating: 'Poor', status: 'crit' };
  }

  /**
   * Produce formatted unified git patch text for an audit report
   * @param {Array} findings - List of findings with diff properties
   * @returns {string} Git patch content
   */
  function generateUnifiedPatch(findings) {
    var patch = ['# VitalsLab Automated Remediation Patch', '# Author: Arnav Katyal', ''];
    findings.forEach(function (f) {
      if (f.diff && f.file) {
        patch.push('diff --git a/' + f.file + ' b/' + f.file);
        patch.push('--- a/' + f.file);
        patch.push('+++ b/' + f.file);
        patch.push(f.diff);
        patch.push('');
      }
    });
    return patch.join('\n');
  }

  /**
   * Generate prioritized action plan text
   * @param {Array} findings - Audit findings
   * @returns {string} Text summary
   */
  function generateActionPlan(findings) {
    var lines = ['VitalsLab Remediation Action Plan:'];
    findings.forEach(function (f, idx) {
      var tag = f.severity === 'crit' ? '[Critical]' : f.severity === 'warn' ? '[Warning]' : '[Passed]';
      lines.push((idx + 1) + '. ' + tag + ' ' + f.title + ' (' + f.file + ')');
      if (f.remediation && f.remediation !== 'No remediation necessary.') {
        lines.push('   Action: ' + f.remediation);
      }
    });
    return lines.join('\n');
  }

  var VitalsEngine = {
    CWV_THRESHOLDS: CWV_THRESHOLDS,
    PRESET_PROFILES: PRESET_PROFILES,
    rateMetric: rateMetric,
    generateUnifiedPatch: generateUnifiedPatch,
    generateActionPlan: generateActionPlan
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VitalsEngine;
  } else {
    global.VitalsEngine = VitalsEngine;
  }
})(typeof window !== 'undefined' ? window : this);
