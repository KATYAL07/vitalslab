# VitalsLab an astro app

> **Web Architecture, SEO, and Performance Auditor for Modern Web Applications**  
> Developed and maintained by **Arnav Katyal**

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-black?style=flat-square&logo=github)](https://katyal07.github.io/astroapp/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)
[![Standards: WCAG 2.2](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-success?style=flat-square)](#wcag-22-color-contrast-lab)

---

## Overview

**AstroPulse** is a lightweight, zero-runtime engineering auditor designed to analyze web applications built with **Astro** and modern frontend architectures. It runs completely inside the browser client, evaluating Core Web Vitals, accessibility compliance, island hydration overhead, and SEO metadata without sending payloads to external servers.

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

### 5. SERP & OpenGraph Social Card Preview
- Real-time simulation of Google Search Engine Result Page (SERP) snippets.
- OpenGraph preview for LinkedIn, Twitter / X, and Discord social cards.

---

## Privacy & Security Architecture

- **100% Client-Side Execution**: All audits, heuristic simulations, and contrast computations occur strictly within the client browser sandbox.
- **No Remote Telemetry**: Tested endpoints, local URLs, and report payloads are never transmitted to external monitoring or analytics servers.
- **Zero Profiling / No Tracking Cookies**: Does not store persistent cross-site tracking cookies.
- See the full [Privacy Policy](privacy.html) for detailed disclosures.

---

## Getting Started

### Local Setup

Simply clone the repository and open `index.html` in any modern web browser or serve it with Python:

```bash
git clone https://github.com/KATYAL07/astroapp.git
cd astroapp
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.

---

## Author & Maintainer

- **Arnav Katyal**  
  GitHub: [@KATYAL07](https://github.com/KATYAL07)
