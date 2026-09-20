import os, sys, time, io
from playwright.sync_api import sync_playwright
from PIL import Image

html_path = os.path.abspath("scripts/render_boot_card.html")

print("Launching Playwright Chromium...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 640, "height": 220}, device_scale_factor=2)
    page.goto(f"file:///{html_path}")

    # Pause all CSS animations initially
    page.evaluate("""() => {
      document.getAnimations().forEach(anim => {
        anim.pause();
        anim.currentTime = 0;
      });
    }""")

    fps = 30
    duration_sec = 1.3
    total_frames = int(fps * duration_sec)
    card_element = page.locator("#target-card")

    frames = []
    print(f"Capturing {total_frames} frames at {fps} fps...")

    for i in range(total_frames):
        t_ms = (i / fps) * 1000
        # Step animation to t_ms
        page.evaluate(f"""() => {{
          document.getAnimations().forEach(anim => {{
            anim.currentTime = {t_ms};
          }});
        }}""")

        # Capture element screenshot with transparent background
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
    loop=1, # play once or loop
    lossless=True,
    quality=100,
    method=6
)
print(f"Saved animated WebP to {webp_path} ({os.path.getsize(webp_path)} bytes)")

# Save as Animated GIF as fallback
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