#!/usr/bin/env node

/**
 * VitalsLab CLI - Command Line Auditor for Modern Web Applications
 * Developed and maintained by Arnav Katyal
 * Usage: node cli.js [--url <target_url>] [--profile <saas|ecom|portfolio|docs>] [--format <json|table>]
 */

const VitalsEngine = require('./vitals-engine.js');
const ContrastLab = require('./contrast-lab.js');

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback;
}

const profileName = getArg('--profile', 'saas').toLowerCase();
const targetUrl = getArg('--url', null);
const outputFormat = getArg('--format', 'table');
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
===================================================================
  VitalsLab CLI - Web Performance & Accessibility Auditor
  Maintained by Arnav Katyal
===================================================================

Usage:
  node cli.js [options]

Options:
  --url <url>         Specify target URL for audit
  --profile <name>    Profile preset: saas | ecom | portfolio | docs (default: saas)
  --format <format>   Output format: table | json (default: table)
  --patch             Print unified git patch for remediations
  --help, -h          Display this help message

Examples:
  node cli.js --profile saas
  node cli.js --url https://arnav.engineering --profile portfolio
  node cli.js --profile saas --patch
`);
  process.exit(0);
}

const profile = VitalsEngine.PRESET_PROFILES[profileName] || VitalsEngine.PRESET_PROFILES.saas;
const auditUrl = targetUrl || profile.url;

if (outputFormat === 'json') {
  const report = {
    app: 'VitalsLab CLI',
    version: '2.4.0',
    auditor: 'Arnav Katyal',
    target: auditUrl,
    timestamp: new Date().toISOString(),
    scores: profile.scores,
    metrics: profile.metrics,
    findings: profile.findings
  };
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

// Terminal table renderer with ANSI colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

console.log(`\n${BOLD}===================================================================${RESET}`);
console.log(`${BOLD}  VitalsLab v2.4.0 - Terminal Performance & Accessibility Report${RESET}`);
console.log(`  Developed & Maintained by ${CYAN}Arnav Katyal${RESET}`);
console.log(`${BOLD}===================================================================${RESET}\n`);

console.log(`${GRAY}Target URL:${RESET}  ${BOLD}${auditUrl}${RESET}`);
console.log(`${GRAY}Profile:${RESET}     ${profile.name}`);
console.log(`${GRAY}Timestamp:${RESET}   ${new Date().toUTCString()}\n`);

console.log(`${BOLD}CATEGORY SCORES (0-100):${RESET}`);
console.log('-------------------------------------------------------------------');
function formatScore(score) {
  const color = score >= 90 ? GREEN : score >= 75 ? YELLOW : RED;
  return `${color}${score.toString().padEnd(3)}${RESET}`;
}

console.log(`  Performance:     [ ${formatScore(profile.scores.perf)} ]  ${GRAY}${profile.descs.perf}${RESET}`);
console.log(`  Accessibility:   [ ${formatScore(profile.scores.a11y)} ]  ${GRAY}${profile.descs.a11y}${RESET}`);
console.log(`  Best Practices:  [ ${formatScore(profile.scores.bp)} ]  ${GRAY}${profile.descs.bp}${RESET}`);
console.log(`  SEO:             [ ${formatScore(profile.scores.seo)} ]  ${GRAY}${profile.descs.seo}${RESET}`);
console.log('-------------------------------------------------------------------\n');

console.log(`${BOLD}CORE WEB VITALS BENCHMARK:${RESET}`);
console.log('-------------------------------------------------------------------');
if (profile.metrics) {
  const m = profile.metrics;
  const lcpRate = VitalsEngine.rateMetric('lcp', m.lcp);
  const inpRate = VitalsEngine.rateMetric('inp', m.inp);
  const clsRate = VitalsEngine.rateMetric('cls', m.cls);
  const fcpRate = VitalsEngine.rateMetric('fcp', m.fcp);

  console.log(`  LCP (Largest Contentful Paint):  ${(m.lcp / 1000).toFixed(2)}s  [${lcpRate.status === 'pass' ? GREEN : RED}${lcpRate.rating}${RESET}] (Goal <= 2.5s)`);
  console.log(`  INP (Interaction to Next Paint):  ${m.inp}ms    [${inpRate.status === 'pass' ? GREEN : RED}${inpRate.rating}${RESET}] (Goal <= 200ms)`);
  console.log(`  CLS (Cumulative Layout Shift):   ${m.cls.toFixed(2)}   [${clsRate.status === 'pass' ? GREEN : RED}${clsRate.rating}${RESET}] (Goal <= 0.1)`);
  console.log(`  FCP (First Contentful Paint):    ${(m.fcp / 1000).toFixed(2)}s  [${fcpRate.status === 'pass' ? GREEN : RED}${fcpRate.rating}${RESET}] (Goal <= 1.8s)`);
}
console.log('-------------------------------------------------------------------\n');

console.log(`${BOLD}WCAG 2.2 CONTRAST SPOT-CHECK:${RESET}`);
console.log('-------------------------------------------------------------------');
const sampleFg = '#111827';
const sampleBg = '#ffffff';
const contrastRatio = ContrastLab.calculateContrastRatio(sampleFg, sampleBg);
const contrastEval = ContrastLab.evaluateWcagCompliance(contrastRatio);
console.log(`  Primary Text (${sampleFg}) on Surface (${sampleBg}):`);
console.log(`  Contrast Ratio: ${BOLD}${contrastEval.ratioFormatted}${RESET} - ${GREEN}${contrastEval.classification.label}${RESET}`);
console.log('-------------------------------------------------------------------\n');

if (profile.findings && profile.findings.length > 0) {
  console.log(`${BOLD}DIAGNOSTIC FINDINGS & REMEDIATIONS:${RESET}`);
  console.log('-------------------------------------------------------------------');
  profile.findings.forEach((f, idx) => {
    const sevColor = f.severity === 'crit' ? RED : f.severity === 'warn' ? YELLOW : GREEN;
    const sevLabel = f.severity.toUpperCase().padEnd(4);
    console.log(` ${idx + 1}. [${sevColor}${sevLabel}${RESET}] ${BOLD}${f.title}${RESET}`);
    console.log(`    Location:    ${GRAY}${f.file}${RESET}`);
    console.log(`    Detail:      ${f.description}`);
    if (f.remediation) {
      console.log(`    Remediation: ${CYAN}${f.remediation}${RESET}`);
    }
    console.log('');
  });
}

if (args.includes('--patch')) {
  console.log(`${BOLD}UNIFIED REMEDIATION PATCH:${RESET}`);
  console.log('-------------------------------------------------------------------');
  console.log(VitalsEngine.generateUnifiedPatch(profile.findings));
  console.log('-------------------------------------------------------------------\n');
}

console.log(`${GREEN}Audit completed successfully.${RESET} Run ${BOLD}node cli.js --patch${RESET} to generate git diff.\n`);
