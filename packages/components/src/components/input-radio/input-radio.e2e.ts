import { type E2EPage, test } from '@stencil/playwright';
import { testInputCallbacks, testInputDomEvents, testInputValueReflection } from '../../e2e';
import type { FillAction } from '../../e2e/utils/FillAction';
import type { Page } from '@playwright/test';

const COMPONENT_NAME = 'kol-input-radio';
const TEST_VALUE = 'test-value';
const OPTIONS = [
	{ label: 'Option 1', value: TEST_VALUE },
	{ label: 'Option 2', value: 'option-2' },
];
const OPTIONS_ATTRIBUTE = `_options='${JSON.stringify(OPTIONS)}'`;
const fillAction: FillAction = async (page) => {
	await page.locator('input').first().check();
};
const selectInput = (page: Page & E2EPage) => page.locator('input').first();

test.describe(COMPONENT_NAME, () => {
	testInputValueReflection<HTMLKolInputNumberElement>(COMPONENT_NAME, TEST_VALUE, fillAction, OPTIONS_ATTRIBUTE);
	testInputCallbacks<HTMLKolInputNumberElement>(COMPONENT_NAME, TEST_VALUE, fillAction, ['click'], OPTIONS_ATTRIBUTE, selectInput);
	testInputDomEvents(COMPONENT_NAME, OPTIONS_ATTRIBUTE, selectInput);
});
