import { h, type FunctionalComponent as FC } from '@stencil/core';
import KolSelectFc, { type SelectProps } from '../../functional-components/inputs/NativeSelect';

import type { SelectStates } from '../../schema';
import { getRenderStates } from '../_helpers/getRenderStates';

export type SelectStateWrapperProps = Partial<SelectProps> & {
	state: SelectStates;
};

function getTextAreaProps(state: SelectStates): SelectProps {
	const { ariaDescribedBy } = getRenderStates(state);

	const props: SelectProps = {
		id: state._id,
		hideLabel: state._hideLabel,
		label: state._label,
		value: state._value,
		options: state._options,
		accessKey: state._accessKey,
		disabled: state._disabled,
		name: state._name,
		ariaDescribedBy: ariaDescribedBy,
		size: state._rows,
		multiple: state._multiple,
		required: state._required,
	};

	return props;
}

const TextAreaStateWrapper: FC<SelectStateWrapperProps> = ({ state, ...other }) => {
	return <KolSelectFc {...getTextAreaProps(state)} {...other} />;
};

export default TextAreaStateWrapper;
