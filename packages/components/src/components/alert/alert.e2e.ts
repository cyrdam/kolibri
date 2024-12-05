import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('kol-alert', () => {
	test('should emit "close" when close button is clicked', async ({ page }) => {
		await page.setContent('<kol-alert _label="Alert" _has-closer />');
		const eventPromise = page.locator('kol-alert').evaluate(async (element: HTMLKolAlertElement) => {
			return new Promise((resolve) => {
				element.addEventListener('close', resolve);
			});
		});
		await page.waitForChanges();
		await page.getByTestId('alert-close-button').click();
		await expect(eventPromise).resolves.toBeTruthy();
	});

	test('should call "onClose" when the close button is clicked', async ({ page }) => {
		await page.setContent('<kol-alert _label="Alert" _has-closer />');
		const eventPromise = page.locator('kol-alert').evaluate(async (element: HTMLKolAlertElement) => {
			return new Promise((resolve) => {
				element._on = {
					onClose: (_event: Event, value?: unknown) => {
						resolve(value);
					},
				};
			});
		});
		await page.waitForChanges();
		await page.getByTestId('alert-close-button').click();
		await expect(eventPromise).resolves.toBeUndefined();
	});
});
