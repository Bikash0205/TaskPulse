import os, time
from playwright.sync_api import sync_playwright
from PIL import Image

html_dark = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 2048px;
    height: 2048px;
    background: #0B0F19;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  }
  .radial-glow {
    position: absolute;
    width: 1400px;
    height: 1400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(117, 110, 243, 0.22) 0%, rgba(16, 185, 129, 0.12) 40%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
  }
  .card-container {
    position: relative;
    z-index: 10;
    width: 1650px;
    height: 1650px;
    background: rgba(15, 23, 42, 0.85);
    border: 5px solid rgba(30, 41, 59, 0.9);
    border-radius: 260px;
    box-shadow: 0 50px 120px -20px rgba(0, 0, 0, 0.7),
                0 0 100px rgba(117, 110, 243, 0.25);
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
    color: #FFFFFF;
    letter-spacing: -0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-pulse {
    color: #10B981;
  }
  .brand-subtitle {
    margin-top: 30px;
    font-size: 32px;
    font-weight: 700;
    color: #38BDF8;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="radial-glow"></div>
  <div class="card-container" id="target">
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
    <div class="brand-text">
      Task<span class="brand-pulse">Pulse</span>
    </div>
    <div class="brand-subtitle">
      Workspace Velocity Engine
    </div>
  </div>
</body>
</html>"""

os.makedirs("scripts", exist_ok=True)
with open("scripts/render_4k_dark.html", "w", encoding="utf-8") as f:
    f.write(html_dark)

print("Rendering 4K Dark Square Logo...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # 2048 x 2048 with device_scale_factor=2 produces exactly 4096 x 4096
    page = browser.new_page(viewport={"width": 2048, "height": 2048}, device_scale_factor=2)
    page.goto(f"file:///{os.path.abspath('scripts/render_4k_dark.html')}")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    
    out_path = "TaskPulse-Square-4K-Dark.png"
    page.screenshot(path=out_path)
    print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")
    browser.close()

im = Image.open("TaskPulse-Square-4K-Dark.png")
print("Verified Image Resolution:", im.size)
