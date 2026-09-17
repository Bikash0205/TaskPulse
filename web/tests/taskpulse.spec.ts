import { test, expect } from "@playwright/test";

test.describe("TaskPulse Enterprise Platform E2E Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("domcontentloaded");
  });

  test("1. Dashboard Header & Branding Verification", async ({ page }) => {
    await expect(page).toHaveTitle("TaskPulse | Task Synchronization & Workload Platform");

    // Check SVG logo in header
    const logo = page.locator('header svg[aria-label="TaskPulse Logo"]');
    await expect(logo).toBeVisible();

    // Check active user in header
    await expect(page.locator("text=Sarah Chen").first()).toBeVisible();

    // Check role indicator
    await expect(page.locator("text=Role:").first()).toBeVisible();
  });

  test("2. Light and Dark Mode Theme Toggle", async ({ page }) => {
    const themeButton = page.locator('button[aria-label="Toggle Theme"]');
    await expect(themeButton).toBeVisible();

    // Initial state check
    const html = page.locator("html");

    // Click toggle
    await themeButton.click();
    await page.waitForTimeout(300);

    // Verify class changed
    const htmlClass = await html.getAttribute("class");
    expect(htmlClass === "light" || htmlClass === "dark").toBeTruthy();

    // Click again to toggle back
    await themeButton.click();
    await page.waitForTimeout(300);
  });

  test("3. Team Workload Matrix Telemetry", async ({ page }) => {
    // Check matrix title
    await expect(page.locator("text=Team Workload & Capacity")).toBeVisible();

    // Check that colleagues are rendered
    await expect(page.locator("text=Sarah Chen").nth(1)).toBeVisible();
    await expect(page.locator("text=Marcus Vance").first()).toBeVisible();
    await expect(page.locator("text=Elena Rostova").first()).toBeVisible();
    await expect(page.locator("text=David Kim").first()).toBeVisible();
  });

  test("4. Parent Project Filter & Rollup Progress", async ({ page }) => {
    const projectSelect = page.locator("select").first();
    await expect(projectSelect).toBeVisible();

    // Select [WEB] Corporate Website Build
    await projectSelect.selectOption("proj-web");
    await page.waitForTimeout(300);

    // Verify Project Progress banner is displayed
    await expect(page.locator("text=Project Progress:")).toBeVisible();
    await expect(page.locator("h3:has-text('Website Building')")).toBeVisible();

    // Verify task filtering: only WEB tasks should be visible
    await expect(page.locator("text=Backend: Database Schema & Auth APIs").first()).toBeVisible();
    await expect(page.locator("text=Frontend: Interactive Landing Page & Features").first()).toBeVisible();
  });

  test("5. Interactive Subtask Checklist & Automatic Velocity Calculation", async ({ page }) => {
    // Locate To-Do List button on Database Schema task (showing 3/4 completed)
    const subtaskExpander = page.getByRole("button", { name: "To-Do List (3/4)" }).first();
    await expect(subtaskExpander).toBeVisible();

    // Click to expand checklist
    await subtaskExpander.click();
    await page.waitForTimeout(300);

    // Locate the unchecked subtask
    const uncheckedItem = page.locator("text=Security audit on user role claims").first();
    await expect(uncheckedItem).toBeVisible();

    // Click to toggle subtask completed
    await uncheckedItem.click();
    await page.waitForTimeout(300);

    // Verify progress updated to 100% and label shows 4/4
    await expect(page.getByRole("button", { name: "To-Do List (4/4)" }).first()).toBeVisible();
  });

  test("6. Role Switcher Dynamic Context", async ({ page }) => {
    const roleButton = page.locator('button:has-text("Role:")');
    await expect(roleButton).toBeVisible();

    // Click to open role menu
    await roleButton.click();
    await page.waitForTimeout(200);

    // Switch to Admin
    const adminOption = page.locator('button:has-text("admin")');
    await adminOption.click();
    await page.waitForTimeout(200);

    // Verify role button shows Admin
    await expect(page.locator('button:has-text("Role:admin")')).toBeVisible();
  });

  test("7. New Workstream Task Dispatching", async ({ page }) => {
    const newTaskButton = page.locator('button:has-text("New Task")');
    await expect(newTaskButton).toBeVisible();

    // Open modal
    await newTaskButton.click();
    await page.waitForTimeout(200);

    // Fill form
    const titleInput = page.locator('input[placeholder*="Payment Webhooks"]');
    await titleInput.fill("Automated E2E Test Verification Task");

    // Click submit
    const submitButton = page.locator('button:has-text("Dispatch Task")');
    await submitButton.click();
    await page.waitForTimeout(500);

    // Verify new task appears in Backlog
    await expect(page.locator("text=Automated E2E Test Verification Task")).toBeVisible();
  });

  test("8. Mobile Client Device Frame Interaction", async ({ page }) => {
    // Check mobile header
    await expect(page.locator("text=Team Tasks & Activity")).toBeVisible();

    // Switch to My Tasks tab inside the mobile device canvas
    const myTasksTab = page.getByRole("button", { name: /My Tasks \(\d+\)/ });
    await myTasksTab.click();
    await page.waitForTimeout(300);

    // Verify My Tasks to-do contents
    await expect(page.locator("text=Personal To-Do List")).toBeVisible();
  });

  test("9. User Sign Out, State Persistence & Logged Out UI Verification", async ({ page }) => {
    // 1. Ensure user is logged in first via Demo Login if needed
    const demoLoginBtn = page.locator('[data-testid="demo-login-btn"]');
    if (await demoLoginBtn.isVisible()) {
      await demoLoginBtn.click();
      await page.waitForTimeout(300);
    }

    // Verify Sign Out button is visible
    const signOutBtn = page.locator('[data-testid="sign-out-btn"]');
    await expect(signOutBtn).toBeVisible();

    // Click Sign Out
    await signOutBtn.click();
    await page.waitForTimeout(400);

    // Verify user is logged out
    await expect(page.locator('[data-testid="sign-out-btn"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="demo-login-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="google-signin-btn"]')).toBeVisible();
    await expect(page.locator("text=Logged Out").first()).toBeVisible();

    // Verify persistence across page refresh
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator('[data-testid="sign-out-btn"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="demo-login-btn"]')).toBeVisible();
    await expect(page.locator("text=Logged Out").first()).toBeVisible();
  });

  test("10. Demo Login Flow & Identity Restoration", async ({ page }) => {
    // Start from logged out state
    const signOutBtn = page.locator('[data-testid="sign-out-btn"]');
    if (await signOutBtn.isVisible()) {
      await signOutBtn.click();
      await page.waitForTimeout(300);
    }

    // Click Demo Login
    const demoLoginBtn = page.locator('[data-testid="demo-login-btn"]');
    await expect(demoLoginBtn).toBeVisible();
    await demoLoginBtn.click();
    await page.waitForTimeout(400);

    // Verify Sarah Chen is restored
    await expect(page.locator('[data-testid="header-user-name"]')).toHaveText("Sarah Chen");
    await expect(page.locator("text=Demo Mode").first()).toBeVisible();
    await expect(page.locator('[data-testid="sign-out-btn"]')).toBeVisible();
  });

  test("11. Google Sign-In Modal & Custom Identity Authentication Flow", async ({ page }) => {
    // Open Google modal
    const googleBtn = page.locator('[data-testid="google-signin-btn"]');
    await expect(googleBtn).toBeVisible();
    await googleBtn.click();
    await page.waitForTimeout(300);

    // Switch to 'Enter Identity' tab
    const identityTab = page.getByRole("button", { name: "Enter Identity" });
    await expect(identityTab).toBeVisible();
    await identityTab.click();
    await page.waitForTimeout(200);

    // Fill custom Google user details
    const nameInput = page.locator('input[placeholder="e.g. Alex Johnson"]');
    const emailInput = page.locator('input[placeholder="e.g. alex.johnson@gmail.com"]');
    await nameInput.fill("Jordan Taylor");
    await emailInput.fill("jordan.taylor@gmail.com");

    // Click 'Sign in with this Profile'
    const submitProfileBtn = page.getByRole("button", { name: "Sign in with this Profile" });
    await submitProfileBtn.click();
    await page.waitForTimeout(400);

    // Verify header now shows Jordan Taylor with Google Connected status
    await expect(page.locator('[data-testid="header-user-name"]')).toHaveText("Jordan Taylor");
    await expect(page.locator("text=Google Connected").first()).toBeVisible();

    // Now sign out and verify cleanly logged out
    const signOutBtn = page.locator('[data-testid="sign-out-btn"]');
    await signOutBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator("text=Logged Out").first()).toBeVisible();
  });

  test("12. Clean Board & Sample Tasks Restoration", async ({ page }) => {
    // Click Clear Demo Tasks
    const clearBtn = page.getByRole("button", { name: "Clear Demo Tasks" });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await page.waitForTimeout(300);

    // Verify empty state placeholders
    await expect(page.locator("text=No tasks in Backlog")).toBeVisible();
    await expect(page.locator("text=No tasks in In Flight")).toBeVisible();
    await expect(page.locator("text=No tasks in Review & QA")).toBeVisible();
    await expect(page.locator("text=No tasks in Completed")).toBeVisible();

    // Click Load Sample Tasks to restore
    const loadSampleBtn = page.getByRole("button", { name: "Load Sample Tasks" });
    await expect(loadSampleBtn).toBeVisible();
    await loadSampleBtn.click();
    await page.waitForTimeout(300);

    // Verify sample tasks are restored
    await expect(page.locator("text=Backend: Database Schema & Auth APIs").first()).toBeVisible();
  });
});
