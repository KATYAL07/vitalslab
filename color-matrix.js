/**
 * VitalsLab - Advanced Color Science & Perceptual Contrast Matrix (APCA / WCAG 3.0 draft)
 * Developed and maintained by Arnav Katyal
 * High-precision color space conversions and perceptual lightness models.
 */

(function (global) {
  'use strict';

  /**
   * Convert sRGB channel to linear CIE XYZ light space
   * @param {number} c - Normalized 0-1 sRGB channel
   */
  function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  /**
   * Convert linear channel back to gamma-compressed sRGB
   * @param {number} c - Normalized linear channel
   */
  function linearToSrgb(c) {
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  /**
   * Convert standard RGB [0-255] to CIE-XYZ reference coordinates
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {[number, number, number]} XYZ coordinate array
   */
  function rgbToXyz(r, g, b) {
    var lr = srgbToLinear(r / 255);
    var lg = srgbToLinear(g / 255);
    var lb = srgbToLinear(b / 255);

    var x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
    var y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750;
    var z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041;
    return [x * 100, y * 100, z * 100];
  }

  /**
   * Convert CIE-XYZ to CIE-L*a*b* coordinates (D65 standard illuminant)
   */
  function xyzToLab(x, y, z) {
    var xn = 95.047;
    var yn = 100.0;
    var zn = 108.883;

    function f(t) {
      return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
    }

    var fx = f(x / xn);
    var fy = f(y / yn);
    var fz = f(z / zn);

    var l = 116 * fy - 16;
    var a = 500 * (fx - fy);
    var b = 200 * (fy - fz);
    return [l, a, b];
  }

  /**
   * Compute CIE76 color difference (Delta E) between two RGB colors
   */
  function deltaE76(rgb1, rgb2) {
    var xyz1 = rgbToXyz(rgb1[0], rgb1[1], rgb1[2]);
    var xyz2 = rgbToXyz(rgb2[0], rgb2[1], rgb2[2]);
    var lab1 = xyzToLab(xyz1[0], xyz1[1], xyz1[2]);
    var lab2 = xyzToLab(xyz2[0], xyz2[1], xyz2[2]);

    var dl = lab1[0] - lab2[0];
    var da = lab1[1] - lab2[1];
    var db = lab1[2] - lab2[2];
    return Math.sqrt(dl * dl + da * da + db * db);
  }

  /**
   * Simplified APCA (Advanced Perceptual Contrast Algorithm) estimator
   * Approximates W3C Silver / WCAG 3 Lightness Contrast (Lc) value
   * @param {string} textColorHex - Text color
   * @param {string} surfaceColorHex - Background surface color
   */
  function estimateApca(textColorHex, surfaceColorHex) {
    function parseHex(h) {
      var s = h.replace('#', '');
      if (s.length === 3) s = s.split('').map(function (c) { return c + c; }).join('');
      var n = parseInt(s, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    var fg = parseHex(textColorHex);
    var bg = parseHex(surfaceColorHex);

    // Perceptual exponents
    var lumFg = 0.2126729 * srgbToLinear(fg[0] / 255) +
                 0.7151522 * srgbToLinear(fg[1] / 255) +
                 0.0721750 * srgbToLinear(fg[2] / 255);
    var lumBg = 0.2126729 * srgbToLinear(bg[0] / 255) +
                 0.7151522 * srgbToLinear(bg[1] / 255) +
                 0.0721750 * srgbToLinear(bg[2] / 255);

    var yText = Math.pow(Math.max(lumFg, 0.0), 0.56);
    var ySurf = Math.pow(Math.max(lumBg, 0.0), 0.56);

    // Polarity
    var deltaY = ySurf - yText;
    var lc = deltaY * 100;

    return {
      lightnessContrast: Math.round(lc),
      readableSmallBody: Math.abs(lc) >= 60,
      readableHeader: Math.abs(lc) >= 45,
      polarity: lc >= 0 ? 'Dark Text on Light Background' : 'Light Text on Dark Background'
    };
  }

  var ColorMatrix = {
    rgbToXyz: rgbToXyz,
    xyzToLab: xyzToLab,
    deltaE76: deltaE76,
    estimateApca: estimateApca
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorMatrix;
  } else {
    global.ColorMatrix = ColorMatrix;
  }
})(typeof window !== 'undefined' ? window : this);
