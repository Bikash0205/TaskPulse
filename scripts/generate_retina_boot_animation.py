import os, sys, time, io
from playwright.sync_api import sync_playwright
from PIL import Image

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 720px;
    height: 240px;
    overflow: hidden;
  }
  .card {
    background: #0F172A;
    border: 1.5px solid #1E293B;
    border-radius: 28px;
    padding: 22px 42px;
    box-shadow: 0 20px 45px -15px rgba(117, 110, 243, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @keyframes ecgLineDraw {
    0% { stroke-dashoffset: 200; opacity: 0.2; }
    50% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes ecgArrowSurge {
    0%, 35% { stroke-dashoffset: 35; opacity: 0; }
    70% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes apexBlink {
    0%, 45% { opacity: 0; }
    70% { opacity: 1; }
    100% { opacity: 1; }
  }
  @keyframes glowRadiate {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.9; }
  }
  @keyframes logoTextReveal {
    0%, 25% { opacity: 0; transform: translateX(-10px); }
    100% { opacity: 1; transform: translateX(0); }
  }
</style>
</head>
<body>
  <div class="card" id="target-card">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60" width="375" height="75" fill="none">
      <defs>
        <filter id="emerald-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.062 0 0 0 0 0.725 0 0 0 0 0.505 0 0 0 0.85 0" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pulse-blue-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arrow-grad" x1="95" y1="25" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
        <linearGradient id="pulse-grad" x1="10" y1="35" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#818CF8" />
          <stop offset="60%" stop-color="#756EF3" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
      </defs>
      <g id="pulse-mark">
        <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="#756EF3" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"
          opacity="0.3" filter="url(#pulse-blue-glow)" stroke-dasharray="200" stroke-dashoffset="200"
          style="animation: glowRadiate 2s infinite ease-in-out, ecgLineDraw 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;" />
        <path d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="url(#pulse-grad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="200" stroke-dashoffset="200"
          style="animation: ecgLineDraw 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;" />
        <path d="M 95 15 L 105 15 L 105 25"
          stroke="url(#arrow-grad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"
          filter="url(#emerald-glow)" stroke-dasharray="35" stroke-dashoffset="35"
          style="animation: ecgArrowSurge 1.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;" />
        <circle cx="105" cy="15" r="3.5" fill="#FFFFFF" filter="url(#emerald-glow)"
          style="animation: apexBlink 1.0s ease-out forwards;" />
      </g>
      <text x="122" y="41" fill="#FFFFFF"
        font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
        font-weight="800" font-size="30" letter-spacing="-0.03em"
        style="animation: logoTextReveal 0.85s ease-out forwards; text-rendering: geometricPrecision;">
        Task<tspan fill="#10B981">Pulse</tspan>
      </text>
    </svg>
  </div>
</body>
</html>"""

os.makedirs("scripts", exist_ok=True)
html_file = os.path.abspath("scripts/render_boot_card_v2.html")
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Launching Playwright to capture frames...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 720, "height": 240}, device_scale_factor=2)
    page.goto(f"file:///{html_file}")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")

    page.evaluate("""() => {
      document.getAnimations().forEach(anim => {
        anim.pause();
        anim.currentTime = 0;
      });
    }""")

    fps = 35
    duration_sec = 1.2
    total_frames = int(fps * duration_sec)
    card_element = page.locator("#target-card")

    frames = []
    print(f"Capturing {total_frames} frames at {fps} fps...")

    for i in range(total_frames):
        t_ms = (i / fps) * 1000
        page.evaluate(f"""() => {{
          document.getAnimations().forEach(anim => {{
            anim.currentTime = {t_ms};
          }});
        }}""")
        png_bytes = card_element.screenshot(omit_background=True)
        img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
        frames.append(img)

    browser.close()

os.makedirs("mobile/assets", exist_ok=True)

# Save as Animated WebP
webp_path = "mobile/assets/taskpulse_boot_animated.webp"
frame_duration_ms = int(1000 / fps)
frames[0].save(
    webp_path,
    save_all=True,
    append_images=frames[1:],
    duration=frame_duration_ms,
    loop=1,
    lossless=True,
    quality=100,
    method=6
)
print(f"Saved animated WebP to {webp_path} ({os.path.getsize(webp_path)} bytes)")

# Save as Animated GIF
gif_path = "mobile/assets/taskpulse_boot_animated.gif"
frames[0].save(
    gif_path,
    save_all=True,
    append_images=frames[1:],
    duration=frame_duration_ms,
    loop=1,
    optimize=False,
    disposal=2
)
print(f"Saved animated GIF to {gif_path} ({os.path.getsize(gif_path)} bytes)")