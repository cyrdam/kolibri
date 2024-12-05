import { h, type FunctionalComponent as FC } from '@stencil/core';
import clsx from 'clsx';
import type { JSXBase, VNode } from '@stencil/core/internal';
import InputAdornment from '../InputAdornment';

type InputAdornmentType = VNode | VNode[] | null;

export type InputContainerProps = JSXBase.HTMLAttributes & {
	startAdornment?: InputAdornmentType;
	endAdornment?: InputAdornmentType;
};

function hasItems(items?: InputAdornmentType): boolean {
	if (!items) {
		return false;
	}

	return Array.isArray(items) ? items.length > 0 : Boolean(items);
}

const KolInputContainerFc: FC<InputContainerProps> = (props, children) => {
	const { class: classNames, startAdornment, endAdornment, ...other } = props;

	return (
		<div class={clsx('input', classNames)} {...other}>
			{hasItems(startAdornment) && <InputAdornment position="start">{startAdornment}</InputAdornment>}
			{children}
			{hasItems(endAdornment) && <InputAdornment position="end">{endAdornment}</InputAdornment>}
		</div>
	);
};

export default KolInputContainerFc;
