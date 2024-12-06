import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('kol-form', () => {
	test.describe('Callbacks', () => {
		const EVENTS: [string, string, unknown?][] = [
			['submit', 'onSubmit'],
			['reset', 'onReset'],
		];
		EVENTS.forEach(([eventName, callbackName]) => {
			test(`should call ${callbackName} when internal form emits`, async ({ page }) => {
				await page.setContent('<kol-form />');
				const kolForm = page.locator('kol-form');

				const eventPromise = kolForm.evaluate((element: HTMLKolFormElement, callbackName) => {
					return new Promise<void>((resolve) => {
						element._on = {
							[callbackName]: () => {
								resolve();
							},
						};
					});
				}, callbackName);
				await page.waitForChanges();

				await page.locator('form').dispatchEvent(eventName);
				await expect(eventPromise).resolves.toBeUndefined();
			});
		});
	});

	test.describe('DOM events', () => {
		['reset', 'submit'].forEach((eventName) => {
			test(`should emit ${eventName} when internal form emits ${eventName}`, async ({ page }) => {
				await page.setContent('<kol-form />');
				const eventPromise = page.locator('kol-form').evaluate(async (element: HTMLKolFormElement, eventName) => {
					return new Promise<void>((resolve) => {
						element.addEventListener(eventName, () => {
							resolve();
						});
					});
				}, eventName);
				await page.waitForChanges();
				await page.locator('form').dispatchEvent(eventName);
				await expect(eventPromise).resolves.toBeUndefined();
			});
		});
	});
});
