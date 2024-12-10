import { h, type FunctionalComponent as FC } from '@stencil/core';
import clsx from 'clsx';
import type { JSXBase, VNode } from '@stencil/core/internal';
import InputAdornment from '../InputAdornment';
import type { InternMsgPropType } from '../../schema';

type InputAdornmentType = VNode | VNode[] | null;

export type InputContainerProps = JSXBase.HTMLAttributes & {
	startAdornment?: InputAdornmentType;
	endAdornment?: InputAdornmentType;
	disabled?: boolean;
	msg?: InternMsgPropType;
	touched?: boolean;

	containerProps?: JSXBase.HTMLAttributes<HTMLDivElement>;
	startAdornmentProps?: JSXBase.HTMLAttributes<HTMLDivElement>;
	endAdornmentProps?: JSXBase.HTMLAttributes<HTMLDivElement>;
};

function hasItems(items?: InputAdornmentType): boolean {
	if (!items) {
		return false;
	}

	return Array.isArray(items) ? items.length > 0 : Boolean(items);
}

function checkHasError(msg?: InternMsgPropType, touched?: boolean): boolean {
	/**
	 * We support 5 types of messages:
	 * - default
	 * - info
	 * - success
	 * - warning
	 * - error
	 *
	 * The message is shown if:
	 * - the message text is not an empty string
	 * - we show only one message at a time
	 * - by error messages the input must be touched
	 */
	const hasValidMsg = Boolean(msg?.description && msg?.description.length > 0);
	const showMsg = hasValidMsg && (touched === true || msg?.type !== 'error');

	return showMsg;
}

const Container: FC<JSXBase.HTMLAttributes<HTMLDivElement>> = ({ class: className, ...other }, children) => {
	return (
		<div class={clsx('kol-input-container__container', className)} {...other}>
			{children}
		</div>
	);
};

const KolInputContainerFc: FC<InputContainerProps> = (props, children) => {
	const { class: classNames, startAdornment, endAdornment, disabled, msg, touched, containerProps, startAdornmentProps, endAdornmentProps, ...other } = props;
	const showMsg = checkHasError(msg, touched);

	const stateCssClasses = {
		['kol-input-container--disabled']: disabled,
		[`kol-input-container--${msg?.type || 'error'}`]: showMsg,
	};

	const baseProps: JSXBase.HTMLAttributes<HTMLDivElement> = {
		class: clsx('kol-input-container', stateCssClasses, classNames),
		...other,
	};

	if (!hasItems(startAdornment) && !hasItems(endAdornment)) {
		return (
			<div {...baseProps}>
				<Container {...containerProps}>{children}</Container>
			</div>
		);
	}

	return (
		<div {...baseProps}>
			<InputAdornment {...startAdornmentProps} position="start">
				{startAdornment}
			</InputAdornment>
			<Container {...containerProps}>{children}</Container>
			<InputAdornment {...endAdornmentProps} position="end">
				{endAdornment}
			</InputAdornment>
		</div>
	);
};

export default KolInputContainerFc;
