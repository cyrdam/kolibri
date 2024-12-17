import { h, type FunctionalComponent as FC } from '@stencil/core';
import type { JSXBase } from '@stencil/core/internal';
import { getDefaultProps } from '../_helpers/getDefaultProps';
import type { DefaultInputProps } from '../_types';
import NativeOptionListFc, { type NativeOptionListProps } from '../NativeOptionList';

type SelectAttributes = JSXBase.SelectHTMLAttributes<HTMLSelectElement>;

export type SelectProps = DefaultInputProps<SelectAttributes> & NativeOptionListProps;

const NativeSelectFc: FC<SelectProps> = (props) => {
	const { options, value, OptionProps, OptionGroupProps, ariaDescribedBy, hideLabel, label, ...other } = props;

	const inputProps: SelectAttributes = {
		...getDefaultProps({ ariaDescribedBy, hideLabel, label }),
		...other,
	};

	return (
		<select {...inputProps}>
			<NativeOptionListFc options={options} value={value} OptionGroupProps={OptionGroupProps} OptionProps={OptionProps} />
		</select>
	);
};

export default NativeSelectFc;
