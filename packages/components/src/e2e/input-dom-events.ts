import { type E2EPage, test } from '@stencil/playwright';
import { expect, type Locator, type Page } from '@playwright/test';
import { INPUTS_SELECTOR } from './utils/inputsSelector';
import { KolEvent } from '../utils/events';

const testInputDomEvents = (
	componentName: string,
	additionalProperties: string = '',
	selectInput?: (page: Page & E2EPage) => Locator,
	omittedEvents: string[] = [],
) => {
	test.describe('DOM events', () => {
		const EVENTS: [string, KolEvent][] = [
			['click', KolEvent.click],
			['focus', KolEvent.focus],
			['blur', KolEvent.blur],
			['input', KolEvent.input],
			['change', KolEvent.change],
		];
		EVENTS.filter(([eventName]) => !omittedEvents.includes(eventName)).forEach(([nativeEvent, kolEvent]) => {
			test(`should emit ${kolEvent} when internal input emits ${nativeEvent}`, async ({ page, browserName }) => {
				/* See https://github.com/microsoft/playwright/issues/33864 */
				test.skip(
					componentName === 'kol-input-color' && kolEvent === KolEvent.click && browserName === 'firefox',
					'Clicking on an input[type=color] in Firefox currently makes the page close itself.',
				);

				await page.setContent(`<${componentName} _label="Input" ${additionalProperties}></${componentName}>`);
				const component = page.locator(componentName);
				const input = selectInput ? selectInput(page) : page.locator(INPUTS_SELECTOR);

				await expect(component).toBeVisible();
				await expect(input).toBeVisible();

				const eventPromise = component.evaluate(async (element, kolEvent) => {
					return new Promise((resolve) => {
						element.addEventListener(kolEvent, resolve);
					});
				}, kolEvent);
				await page.waitForChanges();
				await input.dispatchEvent(nativeEvent);
				await expect(eventPromise).resolves.toBeTruthy();
			});
		});
	});
};

export { testInputDomEvents };
