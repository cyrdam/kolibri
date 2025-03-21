import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as process from 'process';

const PORT = Number(process.env.KOLIBRI_VISUAL_TEST_PORT);
const URL = `http://localhost:${PORT}`;

console.log('Serving React Sample app:', URL);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	snapshotDir: path.join(process.env.KOLIBRI_CWD ?? '', 'snapshots'),
	// snapshotPathTemplate: '',
	outputDir: path.join(process.env.KOLIBRI_CWD ?? '', 'test-results'),
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Allow to override the expectation timeout for slow environments */
	timeout: process.env.KOLIBRI_VISUAL_TESTS_TIMEOUT ? Number(process.env.KOLIBRI_VISUAL_TESTS_TIMEOUT) : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'line',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: URL,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	expect: {
		timeout: process.env.KOLIBRI_VISUAL_TESTS_EXPECT_TIMEOUT ? Number(process.env.KOLIBRI_VISUAL_TESTS_EXPECT_TIMEOUT) : undefined,
	},

	/* Configure projects for major browsers */
	projects: [
		// {
		// 	name: 'chrome',
		// 	use: { ...devices['Desktop Chrome'] },
		// },
		// {
		// 	name: 'edge',
		// 	use: { ...devices['Desktop Edge'] },
		// },
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: `npx serve -p ${PORT}`,
		cwd: path.resolve(process.env.KOLIBRI_VISUAL_TESTS_BUILD_PATH),
		url: URL,
		reuseExistingServer: false,
	},
});
