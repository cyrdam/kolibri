import { Routes } from '../../shares/types';
import { InputCheckboxBasic } from './basic';
import { InputCheckboxButton } from './button';
import { InputCheckboxSwitch } from './switch';
import { InputCheckboxAccessAndShortKey } from './access-and-short-key';

export const INPUT_CHECKBOX_ROUTES: Routes = {
	'input-checkbox': {
		basic: InputCheckboxBasic,
		switch: InputCheckboxSwitch,
		button: InputCheckboxButton,
		'access-and-short-key': InputCheckboxAccessAndShortKey,
	},
};
