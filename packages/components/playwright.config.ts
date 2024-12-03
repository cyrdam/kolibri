import { devices, expect } from '@playwright/test';
import { createConfig, matchers } from '@stencil/playwright';

expect.extend(matchers);

const TEST_URL = 'http://localhost:3333';

/* See https://playwright.dev/docs/test-configuration */
export default createConfig({
	testMatch: /.*\.e2e\.ts$/,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['html', { open: 'never' }]],
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
	],
	use: {
		baseURL: TEST_URL,
		timezoneId: 'Europe/Berlin',
		screenshot: 'only-on-failure',
		navigationTimeout: 60 * 1000, // Rendering the sample page sometimes needs longer than 30 seconds, which led to test failures.
	},
	webServer: {
		url: TEST_URL,
	},
});
