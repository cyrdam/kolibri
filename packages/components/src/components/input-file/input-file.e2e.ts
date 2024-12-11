import { test } from '@stencil/playwright';
import { testInputCallbacksAndEvents } from '../../e2e';
import type { FillAction } from '../../e2e/utils/FillAction';
import { expect } from '@playwright/test';

const COMPONENT_NAME = 'kol-input-file';
const TEST_VALUE: [] = [];
const fillAction: FillAction = async (page) => {
	await page.locator('input').setInputFiles({
		name: 'file.txt',
		mimeType: 'text/plain',
		buffer: Buffer.from('this is test'),
	});
};

test.describe(COMPONENT_NAME, () => {
	testInputCallbacksAndEvents<HTMLKolInputFileElement>(COMPONENT_NAME, TEST_VALUE, fillAction, ['input', 'change']);

	test.describe('Callbacks', () => {
		['onInput', 'onChange'].forEach((callbackName) => {
			test(`should call ${callbackName} when internal input receives file selection`, async ({ page }) => {
				await page.setContent(`<kol-input-file _label="Input"></kol-input-file>`);
				const component = page.locator(COMPONENT_NAME);

				const filelistPromise = component.evaluate((element: HTMLKolInputFileElement, callbackName) => {
					return new Promise<FileList>((resolve) => {
						element._on = {
							[callbackName]: (_event: InputEvent, value: FileList) => {
								resolve(value);
							},
						};
					});
				}, callbackName);
				await page.waitForChanges();

				await fillAction(page);
				await page.waitForChanges();

				expect(Object.keys(await filelistPromise)).toHaveLength(1); // no great way to test this, because Playwright has no FileList implementation.
			});
		});
	});

	test(`should reflect the _files property on the web component`, async ({ page }) => {
		await page.setContent(`<kol-input-file _label="Input"></kol-input-file>`);
		await fillAction(page);
		const filesDomProperty: FileList | null | undefined = await page.locator(COMPONENT_NAME).evaluate((element: HTMLKolInputFileElement) => element._files);

		expect(filesDomProperty).toBeTruthy();
		expect(Object.keys(filesDomProperty as FileList)).toHaveLength(1); // no great way to test this, because Playwright has no FileList implementation.
	});
});
