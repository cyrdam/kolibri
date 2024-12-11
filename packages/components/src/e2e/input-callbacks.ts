import { type E2EPage, test } from '@stencil/playwright';
import type { Locator } from '@playwright/test';
import { expect, type Page } from '@playwright/test';
import type { FillAction } from './utils/FillAction';
import type { InputTypeOnDefault } from '../schema';
import { INPUTS_SELECTOR } from './utils/inputsSelector';
import { Callback } from '../schema/enums';

const testInputCallbacks = <ElementType extends { _on?: InputTypeOnDefault } & (HTMLElement | SVGElement)>(
	componentName: string,
	testValue: unknown = 'Test Input',
	fillAction?: FillAction,
	omittedEvents: string[] = [],
	additionalProperties: string = '',
	selectInput?: (page: Page & E2EPage) => Locator,
	equalityCheck: 'toBe' | 'toEqual' = 'toBe',
) => {
	test.describe('Callbacks', () => {
		const EVENTS: [string, Callback, unknown?][] = [
			['click', Callback.onClick],
			['focus', Callback.onFocus],
			['blur', Callback.onBlur],
			['input', Callback.onInput, testValue],
			['change', Callback.onChange, testValue],
		];

		EVENTS.filter(([eventName]) => !omittedEvents.includes(eventName)).forEach(([eventName, callbackName, testValue]) => {
			test(`should call ${callbackName} when internal input emits`, async ({ page, browserName }) => {
				/* See https://github.com/microsoft/playwright/issues/33864 */
				test.skip(
					componentName === 'kol-input-color' && eventName === 'click' && browserName === 'firefox',
					'Clicking on an input[type=color] in Firefox currently makes the page close itself.',
				);

				await page.setContent(`<${componentName} _label="Input" ${additionalProperties}></${componentName}>`);
				const component = page.locator(componentName);
				const input = selectInput ? selectInput(page) : page.locator(INPUTS_SELECTOR);

				const eventPromise = component.evaluate((element: ElementType, callbackName) => {
					return new Promise<unknown>((resolve) => {
						element._on = {
							[callbackName]: (_event: InputEvent, value?: unknown) => {
								resolve(value);
							},
						};
					});
				}, callbackName);
				await page.waitForChanges();

				if (fillAction) {
					await fillAction(page);
				} else if (typeof testValue === 'string') {
					await page.locator(INPUTS_SELECTOR).fill(testValue);
				}
				await page.waitForChanges();
				await input.dispatchEvent(eventName);

				await expect(eventPromise).resolves[equalityCheck](testValue);
			});
		});
	});
};

export { testInputCallbacks };
