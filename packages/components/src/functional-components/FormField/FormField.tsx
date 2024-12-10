import type { JSX } from '@stencil/core';
import { h, Fragment, type FunctionalComponent as FC } from '@stencil/core';
import KolFormFieldMsgFc from '../FormFieldMsg';
import KolFormFieldLabelFc from '../FormFieldLabel';
import KolFormFieldHintFc from '../FormFieldHint/FormFieldHint';
import KolFormFieldCounterFc from '../FormFieldCounter';
import KolFormFieldTooltipFc from '../FormFieldTooltip';
import type { JSXBase } from '@stencil/core/internal';
import clsx from 'clsx';
import type { AlignPropType, InternMsgPropType } from '../../schema';
import { buildBadgeTextString, showExpertSlot } from '../../schema';

function getModifierClassNameByMsgType(msg?: { type?: string }): string {
	if (msg?.type) {
		return (
			{
				default: 'msg-type-default',
				info: 'msg-type-info',
				success: 'msg-type-success',
				warning: 'msg-type-warning',
				error: 'msg-type-error',
			}[msg?.type] || ''
		);
	}

	return '';
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

export type FormFieldProps = Omit<JSXBase.HTMLAttributes<HTMLElement>, 'id'> & {
	component?: 'div' | 'fieldset';
	id: string;
	alert?: boolean;
	disabled?: boolean;
	msg?: InternMsgPropType;
	tooltipAlign?: AlignPropType;
	hint?: string;
	label: string;
	hideLabel?: boolean;
	hideError?: boolean;
	accessKey?: string;
	shortKey?: string;
	counter?: { currentLength?: number; maxLength?: number };
	readOnly?: boolean;
	touched?: boolean;
	required?: boolean;
	renderNoLabel?: boolean;
	renderNoHint?: boolean;
	anotherChildren?: JSX.Element | JSX.Element[];

	reverseLabelInput?: boolean;

	formFieldLabelProps?: JSXBase.HTMLAttributes<Omit<HTMLLabelElement | HTMLLegendElement, 'id' | 'hidden' | 'htmlFor'>> & { component?: 'label' | 'legend' };
	formFieldHintProps?: JSXBase.HTMLAttributes<HTMLElement>;
	formFieldTooltipProps?: Pick<JSXBase.HTMLAttributes<HTMLElement>, 'class'>;
	formFieldMsgProps?: JSXBase.HTMLAttributes<HTMLDivElement>;
	formFieldCounterProps?: JSXBase.HTMLAttributes<HTMLSpanElement>;
} & {
	[key: `data-${string}`]: unknown;
};

const KolFormFieldFc: FC<FormFieldProps> = (props, children) => {
	const {
		component: Component = 'div',
		renderNoLabel,
		renderNoHint,
		anotherChildren,
		id,
		required,
		alert,
		disabled,
		class: classNames,
		msg,
		hideError,
		hideLabel,
		label,
		hint,
		accessKey,
		shortKey,
		tooltipAlign,
		counter,
		readOnly,
		touched,
		reverseLabelInput,
		formFieldLabelProps,
		formFieldHintProps,
		formFieldTooltipProps,
		formFieldMsgProps,
		formFieldCounterProps,
		...other
	} = props;

	const showLabel = !renderNoLabel;
	const showHint = !renderNoHint;
	const hasExpertSlot = showExpertSlot(label);
	const showMsg = checkHasError(msg, touched);
	const badgeText = buildBadgeTextString(accessKey, shortKey);
	const useTooltipInsteadOfLabel = !hasExpertSlot && hideLabel;

	let stateCssClasses = {
		['kol-form-field--disabled']: Boolean(disabled),
		['kol-form-field--required']: Boolean(required),
		['kol-form-field--touched']: Boolean(touched),
		['kol-form-field--hide-label']: Boolean(hideLabel),
		['kol-form-field--read-only']: Boolean(readOnly),
		['kol-form-field--hidden-error']: Boolean(hideError),
	};

	if (showMsg) {
		stateCssClasses = {
			...stateCssClasses,
			[`kol-form-field--${msg?.type || 'error'}`]: true,
			[`kol-form-field--${getModifierClassNameByMsgType(msg)}`]: true,
		};
	}

	const componentList = [
		<>
			{showLabel && (
				<KolFormFieldLabelFc
					{...(formFieldLabelProps || {})}
					id={id}
					hasExpertSlot={hasExpertSlot}
					hideLabel={hideLabel}
					label={label}
					accessKey={accessKey}
					shortKey={shortKey}
				/>
			)}
			{showHint && <KolFormFieldHintFc {...(formFieldHintProps || {})} id={id} hint={hint} />}
		</>,
		<>
			<div class="kol-form-field__input">{children}</div>
			{useTooltipInsteadOfLabel && (
				<KolFormFieldTooltipFc {...(formFieldTooltipProps || {})} id={id} label={label} hideLabel={hideLabel} align={tooltipAlign} badgeText={badgeText} />
			)}
		</>,
	];

	if (reverseLabelInput) {
		componentList.reverse();
	}

	return (
		<Component
			class={clsx('kol-form-field', stateCssClasses, classNames)}
			role={`presentation` /* Avoid element being read as 'clickable' in NVDA */}
			{...other}
		>
			{componentList}
			{showMsg && <KolFormFieldMsgFc {...(formFieldMsgProps || {})} id={id} alert={alert} msg={msg} hideError={hideError} />}
			{counter ? <KolFormFieldCounterFc {...(formFieldCounterProps || {})} {...counter} /> : null}
			{anotherChildren}
		</Component>
	);
};

export default KolFormFieldFc;
