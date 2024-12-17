import { h, Fragment, type FunctionalComponent as FC } from '@stencil/core';
import type { JSXBase } from '@stencil/core/internal';
import clsx from 'clsx';
import InternalUnderlinedBadgeText from '../InternalUnderlinedBadgeText';
import { buildBadgeTextString } from '../../schema';
import { isString } from 'lodash-es';

type LabelProps = {
	label?: string;
	accessKey?: string;
	shortKey?: string;
	hasExpertSlot?: boolean;
};

type FormFieldLabelProps = JSXBase.HTMLAttributes<Omit<HTMLLabelElement | HTMLLegendElement, 'id' | 'hidden' | 'htmlFor'>> & {
	component?: 'label' | 'legend';
	id: string;
	hideLabel?: boolean;
} & LabelProps;

const LabelFc: FC<LabelProps> = ({ hasExpertSlot, accessKey, shortKey, label }) => {
	if (hasExpertSlot) {
		return <slot name="expert"></slot>;
	}

	if (!label) {
		return null;
	}

	const hasBadgeText = isString(accessKey) || isString(shortKey);

	if (!hasBadgeText) {
		return <span>{label}</span>;
	}

	const badgeText = buildBadgeTextString(accessKey, shortKey);

	return (
		<>
			<InternalUnderlinedBadgeText badgeText={badgeText} label={label} />
			&nbsp;
			<span class="access-key-hint" aria-hidden="true">
				{badgeText}
			</span>
		</>
	);
};

const KolFormFieldLabelFc: FC<FormFieldLabelProps> = ({
	component: Component = 'label',
	id,
	class: classNames,
	accessKey,
	shortKey,
	label,
	hideLabel,
	hasExpertSlot,
	...other
}) => {
	const useTooltopInsteadOfLabel = !hasExpertSlot && hideLabel;

	return (
		<Component
			{...other}
			class={clsx('input-label', classNames)}
			id={!useTooltopInsteadOfLabel ? `${id}-label` : undefined}
			hidden={useTooltopInsteadOfLabel}
			htmlFor={id}
		>
			{/* INFO: span is needed for css styling :after content like a star (*) or optional text ! */}
			<span class="input-label-span">
				{/* INFO: label comes with any html tag or as plain text! */}
				<LabelFc hasExpertSlot={hasExpertSlot} accessKey={accessKey} shortKey={shortKey} label={label} />
			</span>
		</Component>
	);
};

export default KolFormFieldLabelFc;
