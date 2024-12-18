import { h, Fragment, type FunctionalComponent as FC } from '@stencil/core';
import type { JSXBase, VNode } from '@stencil/core/internal';
import { getDefaultProps } from '../_helpers/getDefaultProps';
import type { DefaultInputProps } from '../_types';

export type InputProps = DefaultInputProps<JSXBase.InputHTMLAttributes<HTMLInputElement>> & {
	value: string | number | string[];
	suggestions?: VNode;
	spellcheck?: boolean;
} & {
	[key: `data-${string}`]: unknown;
	[key: `aria-${string}`]: unknown;
};

const InputFc: FC<InputProps> = (props) => {
	const { ariaDescribedBy, hideLabel, label, suggestions, value, ...other } = props;

	const inputProps: JSXBase.InputHTMLAttributes<HTMLInputElement> = {
		type: 'text',
		list: suggestions ? `${other.id}-list` : undefined,
		...getDefaultProps({ ariaDescribedBy, hideLabel, label }),
		...other,
	};

	return (
		<>
			<input {...inputProps} value={value} />
			{suggestions}
		</>
	);
};

export default InputFc;
