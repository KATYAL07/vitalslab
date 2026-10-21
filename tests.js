/**
 * VitalsLab - Automated Engine & Algorithm Test Suite
 * Developed and maintained by Arnav Katyal
 * Usage: node tests.js
 */

const VitalsEngine = require('./vitals-engine.js');
const ContrastLab = require('./contrast-lab.js');
const ColorMatrix = require('./color-matrix.js');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${testName}`);
  } else {
    console.error(`  \x1b[31m✖\x1b[0m ${testName}`);
  }
}

console.log('\n===================================================================');
console.log('  VitalsLab Automated Test Runner');
console.log('  Maintained by Arnav Katyal');
console.log('===================================================================\n');

console.log('Suite 1: WCAG 2.2 Contrast Math Verification');
const whiteBlackRatio = ContrastLab.calculateContrastRatio('#ffffff', '#000000');
assert(Math.abs(whiteBlackRatio - 21.0) < 0.1, 'White vs Black contrast must equal 21:1');

const sameColorRatio = ContrastLab.calculateContrastRatio('#ffffff', '#ffffff');
assert(Math.abs(sameColorRatio - 1.0) < 0.05, 'Identical colors contrast must equal 1:1');

const standardRatio = ContrastLab.calculateContrastRatio('#111827', '#ffffff');
assert(standardRatio >= 15.0, 'Primary dark text on white passes AAA (ratio >= 15)');

const failRatio = ContrastLab.calculateContrastRatio('#9ca3af', '#ffffff');
assert(failRatio < 4.5, 'Muted gray text on white correctly flagged as sub-AA');

console.log('\nSuite 2: Core Web Vitals Ratings');
assert(VitalsEngine.rateMetric('lcp', 1200).rating === 'Good', 'LCP 1.2s rated Good');
assert(VitalsEngine.rateMetric('lcp', 3200).rating === 'Needs Improvement', 'LCP 3.2s rated Needs Improvement');
assert(VitalsEngine.rateMetric('lcp', 5000).rating === 'Poor', 'LCP 5.0s rated Poor');
assert(VitalsEngine.rateMetric('inp', 45).rating === 'Good', 'INP 45ms rated Good');
assert(VitalsEngine.rateMetric('inp', 250).rating === 'Needs Improvement', 'INP 250ms rated Needs Improvement');
assert(VitalsEngine.rateMetric('cls', 0.02).rating === 'Good', 'CLS 0.02 rated Good');
assert(VitalsEngine.rateMetric('cls', 0.28).rating === 'Poor', 'CLS 0.28 rated Poor');

console.log('\nSuite 3: Astro Island Hydration Profiles');
const saasProfile = VitalsEngine.PRESET_PROFILES.saas;
assert(saasProfile !== undefined, 'SaaS profile exists');
assert(saasProfile.scores.perf === 94, 'SaaS performance score matches expected baseline (94)');
assert(saasProfile.findings.length > 0, 'SaaS profile has diagnostic findings');

console.log('\nSuite 4: APCA & Color Space Conversions');
const apcaResult = ColorMatrix.estimateApca('#000000', '#ffffff');
assert(apcaResult.lightnessContrast > 80, 'Black text on white has high APCA Lc (> 80)');
assert(apcaResult.readableSmallBody === true, 'Black text on white passes small body readability');

console.log('\nSuite 5: Deterministic Git Patch Generation');
const patch = VitalsEngine.generateUnifiedPatch(saasProfile.findings);
assert(patch.includes('diff --git'), 'Unified patch includes git diff headers');
assert(patch.includes('--- a/'), 'Unified patch includes source file reference');
assert(patch.includes('+++ b/'), 'Unified patch includes target file reference');

console.log('\n-------------------------------------------------------------------');
if (passedTests === totalTests) {
  console.log(`\x1b[32mAll ${passedTests}/${totalTests} tests passed successfully.\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\x1b[31mFailed ${totalTests - passedTests} out of ${totalTests} tests.\x1b[0m\n`);
  process.exit(1);
}
