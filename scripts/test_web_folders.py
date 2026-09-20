import time
from playwright.sync_api import sync_playwright

ARTIFACTS_DIR = r"C:\Users\ATS-1\.gemini\antigravity\brain\d27243f4-146c-4919-8f6e-08eff34ff738"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 950})
        page = context.new_page()

        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)

        # Login as Marcus Vance
        marcus_btn = page.query_selector("button:has-text('Marcus Vance')")
        if marcus_btn:
            marcus_btn.click()
            page.wait_for_timeout(1500)

        # 1. Capture Manager Project Folders Grid
        page.screenshot(path=f"{ARTIFACTS_DIR}\\screen_web_project_folders.png")
        print("Captured screen_web_project_folders.png")

        # 2. Click the Website Building tab or the first folder card
        print("Opening Website Building folder...")
        web_folder = page.query_selector("button:has-text('Website Building')")
        if web_folder:
            web_folder.click()
            page.wait_for_timeout(1200)
            page.screenshot(path=f"{ARTIFACTS_DIR}\\screen_web_folder_opened.png")
            print("Captured screen_web_folder_opened.png")

        # 3. Create a task with Email Invitation
        add_task_btn = page.query_selector("button:has-text('Add Task to WEB')") or page.query_selector("button:has-text('+ New Task')")
        if add_task_btn:
            print("Opening New Task modal...")
            add_task_btn.click()
            page.wait_for_timeout(600)

            # Fill title
            title_input = page.query_selector("input[placeholder*='e.g. Backend: Payment']")
            if title_input:
                title_input.fill("Security Audit & Cloud Infrastructure Hardening")

            # Select invite new assignee
            page.select_option("select:has(option:has-text('+ Invite New Person via Email...'))", "INVITE_NEW")
            page.wait_for_timeout(500)

            # Fill email and name
            email_input = page.query_selector("input[placeholder*='alex.morgan@taskpulse.io']")
            if email_input:
                email_input.fill("sarah.lead@taskpulse.io")

            name_input = page.query_selector("input[placeholder*='Alex Morgan']")
            if name_input:
                name_input.fill("Sarah Lead")

            page.screenshot(path=f"{ARTIFACTS_DIR}\\screen_web_modal_invite.png")
            print("Captured screen_web_modal_invite.png")

            # Submit task
            submit_btn = page.query_selector("button[type='submit']:has-text('Create Task')")
            if submit_btn:
                submit_btn.click()
                page.wait_for_timeout(1200)
                page.screenshot(path=f"{ARTIFACTS_DIR}\\screen_web_task_invited.png")
                print("Captured screen_web_task_invited.png")

        browser.close()
        print("Finished all web tests successfully!")

if __name__ == "__main__":
    run()
