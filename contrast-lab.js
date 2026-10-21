/**
 * VitalsLab - WCAG 2.2 Color Contrast & Accessibility Calculation Engine
 * Developed and maintained by Arnav Katyal
 * Reference: W3C WCAG 2.2 Relative Luminance and Contrast Ratio Specification
 */

(function (global) {
  'use strict';

  /**
   * Convert standard 3-digit or 6-digit hex string to RGB array
   * @param {string} hex - Hex color string (#fff or #ffffff)
   * @returns {[number, number, number]} RGB values in range 0-255
   */
  function hexToRgb(hex) {
    var cleaned = hex.replace(/^#/, '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(function (c) { return c + c; }).join('');
    }
    var num = parseInt(cleaned, 16);
    return [
      (num >> 16) & 255,
      (num >> 8) & 255,
      num & 255
    ];
  }

  /**
   * Compute relative luminance of an RGB triplet according to WCAG 2.2 formula
   * @param {number} r - Red channel (0-255)
   * @param {number} g - Green channel (0-255)
   * @param {number} b - Blue channel (0-255)
   * @returns {number} Relative luminance value (0.0 - 1.0)
   */
  function relativeLuminance(r, g, b) {
    var channels = [r, g, b].map(function (val) {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }

  /**
   * Calculate contrast ratio between two hex colors
   * @param {string} foregroundHex - Foreground text color
   * @param {string} backgroundHex - Background surface color
   * @returns {number} Ratio formatted as a floating point number (1.0 to 21.0)
   */
  function calculateContrastRatio(foregroundHex, backgroundHex) {
    var fgRgb = hexToRgb(foregroundHex);
    var bgRgb = hexToRgb(backgroundHex);
    var lum1 = relativeLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
    var lum2 = relativeLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
    var brighter = Math.max(lum1, lum2);
    var darker = Math.min(lum1, lum2);
    return (brighter + 0.05) / (darker + 0.05);
  }

  /**
   * Evaluate compliance against WCAG 2.2 criteria
   * @param {number} ratio - Calculated contrast ratio
   * @returns {Object} Compliance status for Normal text, Large text, and AAA
   */
  function evaluateWcagCompliance(ratio) {
    return {
      ratio: Number(ratio.toFixed(2)),
      ratioFormatted: ratio.toFixed(2) + ':1',
      normalAA: ratio >= 4.5,
      largeAA: ratio >= 3.0,
      enhancedAAA: ratio >= 7.0,
      uiComponentsAA: ratio >= 3.0,
      classification: (function () {
        if (ratio >= 7.0) return { label: 'Passes WCAG 2.2 AAA (Enhanced)', level: 'pass', score: 100 };
        if (ratio >= 4.5) return { label: 'Passes WCAG 2.2 AA (Standard)', level: 'pass', score: 85 };
        if (ratio >= 3.0) return { label: 'Passes Large Text Only (>=3.0:1)', level: 'warn', score: 65 };
        return { label: 'Fails WCAG 2.2 AA (< 3.0:1)', level: 'crit', score: 30 };
      })()
    };
  }

  var ContrastLab = {
    hexToRgb: hexToRgb,
    relativeLuminance: relativeLuminance,
    calculateContrastRatio: calculateContrastRatio,
    evaluateWcagCompliance: evaluateWcagCompliance
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContrastLab;
  } else {
    global.ContrastLab = ContrastLab;
  }
})(typeof window !== 'undefined' ? window : this);
