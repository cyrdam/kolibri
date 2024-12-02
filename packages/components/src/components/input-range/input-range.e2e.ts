import { type E2EPage, test } from '@stencil/playwright';
import { testInputCallbacks, testInputDomEvents, testInputValueReflection } from '../../e2e';
import type { FillAction } from '../../e2e/utils/FillAction';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const COMPONENT_NAME = 'kol-input-range';
const TEST_VALUE = '10';
const fillAction: FillAction = async (page) => {
	const input = page.locator('input[type=number]');
	await input.fill(TEST_VALUE);
	await input.dispatchEvent('change');
};
const selectInput = (page: Page & E2EPage) => page.locator('input[type=number]');

test.describe(COMPONENT_NAME, () => {
	testInputValueReflection<HTMLKolInputRangeElement>(COMPONENT_NAME, Number(TEST_VALUE), fillAction);
	testInputCallbacks<HTMLKolInputRangeElement>(COMPONENT_NAME, TEST_VALUE, fillAction, ['change'], undefined, selectInput);
	testInputDomEvents(COMPONENT_NAME, undefined, selectInput);

	// handle special case: onChange payload is a number while onInput is a string
	test.describe('Callbacks', () => {
		test(`should call onChange when internal input emits`, async ({ page }) => {
			await page.setContent(`<${COMPONENT_NAME} _label="Input"></${COMPONENT_NAME}>`);
			const component = page.locator(COMPONENT_NAME);
			const input = selectInput(page);

			const eventPromise = component.evaluate((element: HTMLKolInputRangeElement) => {
				return new Promise<unknown>((resolve) => {
					element._on = {
						onChange: (_event: Event, value?: unknown) => {
							resolve(value);
						},
					};
				});
			});
			await page.waitForChanges();

			await fillAction(page);
			await page.waitForChanges();
			await input.dispatchEvent('change');

			await expect(eventPromise).resolves.toBe(Number(TEST_VALUE));
		});
	});
});
