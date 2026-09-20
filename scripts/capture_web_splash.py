from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    # Force reload with cache clear to trigger boot splash
    page.goto("http://localhost:3000")
    # Take screenshot mid-splash
    time.sleep(0.4)
    page.screenshot(path="C:/Users/ATS-1/.gemini/antigravity/brain/d27243f4-146c-4919-8f6e-08eff34ff738/web_splash_live_mid.png")
    time.sleep(0.5)
    page.screenshot(path="C:/Users/ATS-1/.gemini/antigravity/brain/d27243f4-146c-4919-8f6e-08eff34ff738/web_splash_live_end.png")
    browser.close()
print("Captured live web splash screenshots")
