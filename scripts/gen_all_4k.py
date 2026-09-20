import os
from playwright.sync_api import sync_playwright
from PIL import Image

# 1. AppIcon (Squircle with transparency outside)
html_appicon = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 2048px;
    height: 2048px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  }
  .card-container {
    width: 1750px;
    height: 1750px;
    background: #0F172A;
    border: 6px solid #1E293B;
    border-radius: 380px;
    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.65),
                0 0 120px rgba(117, 110, 243, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px;
  }
  .logo-svg {
    width: 1150px;
    height: 500px;
  }
  .brand-text {
    margin-top: 55px;
    font-size: 165px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.04em;
  }
  .brand-pulse { color: #10B981; }
  .brand-subtitle {
    margin-top: 32px;
    font-size: 34px;
    font-weight: 700;
    color: #38BDF8;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="card-container">
    <svg class="logo-svg" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="emerald-glow-4k" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.0" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.062 0 0 0 0 0.725 0 0 0 0 0.505 0 0 0 0.9 0" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pulse-blue-glow-4k" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arrow-grad-4k" x1="95" y1="25" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
        <linearGradient id="pulse-grad-4k" x1="10" y1="35" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#818CF8" />
          <stop offset="60%" stop-color="#756EF3" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
      </defs>
      <g>
        <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="#756EF3" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"
          opacity="0.4" filter="url(#pulse-blue-glow-4k)" />
        <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="url(#pulse-grad-4k)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 95 15 L 105 15 L 105 25"
          stroke="url(#arrow-grad-4k)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
          filter="url(#emerald-glow-4k)" />
        <circle cx="105" cy="15" r="4" fill="#FFFFFF" filter="url(#emerald-glow-4k)" />
      </g>
    </svg>
    <div class="brand-text">Task<span class="brand-pulse">Pulse</span></div>
    <div class="brand-subtitle">Workspace Velocity Engine</div>
  </div>
</body>
</html>"""

# 2. Transparent (Pure logo mark + typography)
html_transparent = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 2048px;
    height: 2048px;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  }
  .logo-svg {
    width: 1400px;
    height: 600px;
  }
  .brand-text {
    margin-top: 60px;
    font-size: 200px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.04em;
  }
  .brand-pulse { color: #10B981; }
  .brand-subtitle {
    margin-top: 36px;
    font-size: 40px;
    font-weight: 700;
    color: #38BDF8;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <svg class="logo-svg" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="emerald-glow-4k" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.0" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.062 0 0 0 0 0.725 0 0 0 0 0.505 0 0 0 0.9 0" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="pulse-blue-glow-4k" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="arrow-grad-4k" x1="95" y1="25" x2="105" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#34D399" />
        <stop offset="100%" stop-color="#10B981" />
      </linearGradient>
      <linearGradient id="pulse-grad-4k" x1="10" y1="35" x2="105" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#818CF8" />
        <stop offset="60%" stop-color="#756EF3" />
        <stop offset="100%" stop-color="#10B981" />
      </linearGradient>
    </defs>
    <g>
      <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
        stroke="#756EF3" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"
        opacity="0.4" filter="url(#pulse-blue-glow-4k)" />
      <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
        stroke="url(#pulse-grad-4k)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 95 15 L 105 15 L 105 25"
        stroke="url(#arrow-grad-4k)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
        filter="url(#emerald-glow-4k)" />
      <circle cx="105" cy="15" r="4" fill="#FFFFFF" filter="url(#emerald-glow-4k)" />
    </g>
  </svg>
  <div class="brand-text">Task<span class="brand-pulse">Pulse</span></div>
  <div class="brand-subtitle">Workspace Velocity Engine</div>
</body>
</html>"""

# 3. Light Theme
html_light = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 2048px;
    height: 2048px;
    background: #F8FAFC;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  }
  .card-container {
    width: 1650px;
    height: 1650px;
    background: #FFFFFF;
    border: 4px solid #E2E8F0;
    border-radius: 260px;
    box-shadow: 0 40px 100px -20px rgba(117, 110, 243, 0.15),
                0 0 60px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px;
  }
  .logo-svg {
    width: 1100px;
    height: 480px;
  }
  .brand-text {
    margin-top: 50px;
    font-size: 155px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.04em;
  }
  .brand-pulse { color: #10B981; }
  .brand-subtitle {
    margin-top: 30px;
    font-size: 32px;
    font-weight: 700;
    color: #756EF3;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="card-container">
    <svg class="logo-svg" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="emerald-glow-light" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arrow-grad-light" x1="95" y1="25" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <linearGradient id="pulse-grad-light" x1="10" y1="35" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#6366F1" />
          <stop offset="60%" stop-color="#4F46E5" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
      </defs>
      <g>
        <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="#6366F1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"
          opacity="0.2" />
        <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="url(#pulse-grad-light)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 95 15 L 105 15 L 105 25"
          stroke="url(#arrow-grad-light)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
          filter="url(#emerald-glow-light)" />
        <circle cx="105" cy="15" r="4" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      </g>
    </svg>
    <div class="brand-text">Task<span class="brand-pulse">Pulse</span></div>
    <div class="brand-subtitle">Workspace Velocity Engine</div>
  </div>
</body>
</html>"""

files_to_render = [
    ("scripts/render_4k_appicon.html", html_appicon, "TaskPulse-Square-4K-AppIcon.png", True),
    ("scripts/render_4k_transparent.html", html_transparent, "TaskPulse-Square-4K-Transparent.png", True),
    ("scripts/render_4k_light.html", html_light, "TaskPulse-Square-4K-Light.png", False)
]

for html_path, content, out_name, omit_bg in files_to_render:
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Launching Playwright to render all 4K variations...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for html_path, _, out_name, omit_bg in files_to_render:
        page = browser.new_page(viewport={"width": 2048, "height": 2048}, device_scale_factor=2)
        page.goto(f"file:///{os.path.abspath(html_path)}")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        page.screenshot(path=out_name, omit_background=omit_bg)
        im = Image.open(out_name)
        print(f"Generated {out_name}: Resolution {im.size}, Size {os.path.getsize(out_name)} bytes")
        page.close()
    browser.close()

print("All 4K square PNGs rendered successfully!")
