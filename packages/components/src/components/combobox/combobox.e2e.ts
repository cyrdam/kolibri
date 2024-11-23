import { test } from '@stencil/playwright';
import { testInputCallbacks, testInputDomEvents, testInputValueReflection } from '../../e2e';

const COMPONENT_NAME = 'kol-combobox';
const TEST_VALUE = 'Hello World';

test.describe(COMPONENT_NAME, () => {
	testInputValueReflection(COMPONENT_NAME, TEST_VALUE);
	testInputCallbacks(COMPONENT_NAME, TEST_VALUE);
	testInputDomEvents(COMPONENT_NAME);
});
