# VitalsLab

> **Core Web Vitals, Accessibility, and Performance Auditor for Modern Web Applications**
> Developed and maintained by **Arnav Katyal**

[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-black?style=flat-square&logo=github)](https://katyal07.github.io/vitalslab/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)
[![Standards: WCAG 2.2](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-success?style=flat-square)](#wcag-22-color-contrast-lab)

---

## Overview

**VitalsLab** is a lightweight, zero-runtime engineering auditor designed to analyze web applications built with Astro and modern frontend architectures. It runs completely inside the browser, evaluating Core Web Vitals, accessibility compliance, island hydration overhead, and SEO metadata without sending data to external servers.

---

## Key Modules

### 1. Core Web Vitals Simulation
- **LCP (Largest Contentful Paint)**: Identifies unoptimized hero media, missing `fetchpriority="high"`, and blocking client scripts.
- **INP (Interaction to Next Paint)**: Measures main-thread responsiveness under simulated user interactions.
- **CLS (Cumulative Layout Shift)**: Flags image elements and embedded components lacking explicit `width` and `height` dimension attributes.

### 2. Astro Island Hydration Analyzer
- Scans template component imports and hydration directives (`client:load`, `client:idle`, `client:visible`).
- Detects over-eager hydration of below-the-fold components and flags unnecessary JavaScript bundle delivery.

### 3. WCAG 2.2 Color Contrast Lab
- Interactive relative luminance calculation following W3C WCAG 2.2 specifications.
- Instant evaluation for **Normal Text (AA 4.5:1)**, **Large Text (AA 3.0:1)**, and **Enhanced Contrast (AAA 7.0:1)**.

### 4. Deterministic Code Remediations
- Generates clean, ready-to-apply unified Git patches and code snippets directly inside the interface.
- One-click copy for fast remediation.

### 5. SERP and OpenGraph Social Card Preview
- Real-time simulation of Google Search Engine Result Page (SERP) snippets.
- OpenGraph preview for LinkedIn, Twitter / X, and Discord social cards.

---

## Privacy and Security

- **100% Client-Side Execution**: All audits, simulations, and contrast computations run strictly within the browser sandbox.
- **No Remote Telemetry**: URLs, inputs, and report payloads are never transmitted to external servers.
- **Zero Profiling / No Tracking Cookies**: No persistent cross-site tracking cookies.
- See the full [Privacy Policy](privacy.html) for details.

---

## Getting Started

Clone the repository and serve locally:

```bash
git clone https://github.com/KATYAL07/vitalslab.git
cd vitalslab
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.

### Terminal CLI Usage

VitalsLab includes a built-in terminal CLI auditor and test suite:

```bash
# Run terminal performance audit
node cli.js --profile saas

# Generate unified git remediation patch
node cli.js --profile saas --patch

# Run engine test suite
node tests.js
```

---

## Author

- **Arnav Katyal** -- [@KATYAL07](https://github.com/KATYAL07)
