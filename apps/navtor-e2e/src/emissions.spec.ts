import { test, expect } from '@playwright/test';

test.describe('Emissions Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to emissions page
    await page.click('text=Emissions');
  });

  test('should display emissions page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Emissions');
  });

  test('should display vessel selector dropdown', async ({ page }) => {
    const vesselSelector = page.locator('.vessel-select');
    await expect(vesselSelector).toBeVisible();
    await expect(vesselSelector).toHaveAttribute('class', /vessel-select/);
  });

  test('should load vessel options in dropdown', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('.vessel-select option:not([disabled])', {
      timeout: 10000,
    });

    const options = page.locator('.vessel-select option:not([disabled])');
    const optionCount = await options.count();

    expect(optionCount).toBeGreaterThan(0);

    // Check that we have vessel options
    const firstOption = options.first();
    await expect(firstOption).toContainText('Vessel');
  });

  test('should display chart container when data is loaded', async ({
    page,
  }) => {
    // Wait for chart container to appear
    await page.waitForSelector('.chart-container', { timeout: 10000 });

    const chartContainer = page.locator('.chart-container');
    await expect(chartContainer).toBeVisible();

    // Check that chart div exists
    const chartDiv = chartContainer.locator(
      'div[style*="width: 100%; height: 500px"]'
    );
    await expect(chartDiv).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // The loading state might be very brief, so we check for either loading or chart
    const loadingOrChart = page.locator('.loading-container, .chart-container');
    await expect(loadingOrChart).toBeVisible();
  });

  test('should change vessel selection', async ({ page }) => {
    // Wait for dropdown to be populated
    await page.waitForSelector('.vessel-select option:not([disabled])', {
      timeout: 10000,
    });

    const vesselSelector = page.locator('.vessel-select');
    const options = page.locator('.vessel-select option:not([disabled])');
    const optionCount = await options.count();

    if (optionCount > 1) {
      // Select a different vessel
      await vesselSelector.selectOption({ index: 1 });

      // Verify selection changed
      const selectedValue = await vesselSelector.inputValue();
      expect(selectedValue).toBeTruthy();
    }
  });

  test('should display chart with proper styling', async ({ page }) => {
    // Wait for chart to load
    await page.waitForSelector('.chart-container', { timeout: 10000 });

    // Check for Highcharts elements
    const highchartsContainer = page.locator('.highcharts-container');
    await expect(highchartsContainer).toBeVisible();

    // Check for chart title
    const chartTitle = page.locator('.highcharts-title');
    await expect(chartTitle).toBeVisible();
    await expect(chartTitle).toContainText('Emissions');
  });

  test('should display legend with emission types', async ({ page }) => {
    // Wait for chart to load
    await page.waitForSelector('.chart-container', { timeout: 10000 });

    // Check for legend
    const legend = page.locator('.highcharts-legend');
    await expect(legend).toBeVisible();

    // Check for legend items (NOx, Methane, PM, SOx)
    const legendItems = page.locator('.highcharts-legend-item');
    const itemCount = await legendItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should handle API data loading', async ({ page }) => {
    // Wait for chart to load (indicates API data was fetched)
    await page.waitForSelector('.chart-container', { timeout: 15000 });

    // Verify no error state
    const errorContainer = page.locator('.error-container');
    await expect(errorContainer).not.toBeVisible();

    // Verify chart is rendered
    const chartContainer = page.locator('.chart-container');
    await expect(chartContainer).toBeVisible();
  });

  test('should have proper dark theme styling', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('.emissions-container', { timeout: 10000 });

    // Check background color
    const container = page.locator('.emissions-container');
    await expect(container).toHaveCSS('background-color', 'rgb(26, 26, 26)');

    // Check text color
    const title = page.locator('h1');
    await expect(title).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for chart to load
    await page.waitForSelector('.chart-container', { timeout: 10000 });

    // Verify elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.vessel-select')).toBeVisible();
    await expect(page.locator('.chart-container')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.chart-container')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between Vessels and Emissions pages', async ({
    page,
  }) => {
    await page.goto('/');

    // Check initial navigation
    const navItems = page.locator('nav a, nav button');
    await expect(navItems).toHaveCount(2);

    // Navigate to Emissions
    await page.click('text=Emissions');
    await expect(page.locator('h1')).toHaveText('Emissions');

    // Navigate to Vessels
    await page.click('text=Vessels');
    await expect(page.locator('h1')).toHaveText('Vessels');

    // Navigate back to Emissions
    await page.click('text=Emissions');
    await expect(page.locator('h1')).toHaveText('Emissions');
  });
});
