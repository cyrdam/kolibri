import { h, type FunctionalComponent as FC } from '@stencil/core';
import type { JSXBase } from '@stencil/core/internal';
import clsx from 'clsx';
import { type AlignPropType, buildBadgeTextString, checkHasError, type InternMsgPropType, showExpertSlot } from '../../schema';
import KolFieldControlTooltipFc from '../FormFieldTooltip';
import KolFieldControlLabelFc from '../FormFieldLabel';
import KolFieldControlHintFc from '../FormFieldHint';

export type FieldControlProps = Omit<JSXBase.HTMLAttributes<HTMLElement>, 'id'> & {
	id: string;
	hint?: string;
	label: string;
	hideLabel?: boolean;
	accessKey?: string;
	shortKey?: string;
	tooltipAlign?: AlignPropType;
	disabled?: boolean;
	msg?: InternMsgPropType;
	touched?: boolean;
	showTooltip?: boolean;

	renderNoLabel?: boolean;
	renderNoHint?: boolean;

	fieldControlLabelProps?: JSXBase.HTMLAttributes<Omit<HTMLLabelElement | HTMLLegendElement, 'id' | 'hidden' | 'htmlFor'>> & { component?: 'label' | 'legend' };
	fieldControlInputProps?: JSXBase.HTMLAttributes<HTMLDivElement>;
	fieldControlTooltipProps?: Pick<JSXBase.HTMLAttributes<HTMLElement>, 'class'>;
	fieldControlHintProps?: JSXBase.HTMLAttributes<HTMLElement>;
	fieldControlWrapperProps?: JSXBase.HTMLAttributes<HTMLElement>;
};

const WrapperContainer: FC<JSXBase.HTMLAttributes<HTMLDivElement>> = ({ class: classNames, ...other }, children) => {
	return (
		<div class={clsx('kol-field-control__wrapper', classNames)} {...other}>
			{children}
		</div>
	);
};

const InputContainer: FC<JSXBase.HTMLAttributes<HTMLDivElement>> = ({ class: classNames, ...other }, children) => {
	return (
		<div class={clsx('kol-field-control__input', classNames)} {...other}>
			{children}
		</div>
	);
};

const KolFieldControlFc: FC<FieldControlProps> = (props, children) => {
	const {
		class: classNames,
		id,
		disabled,
		label,
		hideLabel,
		renderNoLabel,
		hint,
		renderNoHint,
		tooltipAlign,
		accessKey,
		shortKey,
		msg,
		showTooltip,
		touched,
		fieldControlInputProps,
		fieldControlLabelProps,
		fieldControlTooltipProps,
		fieldControlHintProps,
		fieldControlWrapperProps,
		...other
	} = props;

	const showLabel = !renderNoLabel;
	const showHint = !renderNoHint;
	const showMsg = checkHasError(msg, touched);
	const hasExpertSlot = showExpertSlot(label);
	const useTooltipInsteadOfLabel = showTooltip || (!hasExpertSlot && hideLabel);
	const badgeText = buildBadgeTextString(accessKey, shortKey);

	const components = [
		<InputContainer {...fieldControlInputProps}>{children}</InputContainer>,
		showLabel && (
			<KolFieldControlLabelFc
				{...(fieldControlLabelProps || {})}
				id={id}
				baseClassNaame="kol-field-control"
				hasExpertSlot={hasExpertSlot}
				hideLabel={hideLabel}
				label={label}
				accessKey={accessKey}
				shortKey={shortKey}
			/>
		),
	];

	const stateCssClasses = {
		['kol-field-control--disabled']: Boolean(disabled),
		['kol-field-control--hide-label']: Boolean(hideLabel),
		[`kol-field-control--${msg?.type || 'error'}`]: showMsg,
	};

	return (
		<div class={clsx('kol-field-control', stateCssClasses, classNames)} {...other}>
			<WrapperContainer {...fieldControlWrapperProps}>{components}</WrapperContainer>
			{useTooltipInsteadOfLabel && (
				<KolFieldControlTooltipFc
					{...(fieldControlTooltipProps || {})}
					id={id}
					label={label}
					hideLabel={hideLabel}
					align={tooltipAlign}
					badgeText={badgeText}
				/>
			)}
			{showHint && <KolFieldControlHintFc {...(fieldControlHintProps || {})} baseClassNaame="kol-field-control" id={id} hint={hint} />}
		</div>
	);
};

export default KolFieldControlFc;
