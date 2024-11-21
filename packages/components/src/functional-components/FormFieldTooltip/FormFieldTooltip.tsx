import { h, type FunctionalComponent as FC } from '@stencil/core';
import type { JSXBase } from '@stencil/core/internal';
import clsx from 'clsx';
import { KolTooltipWcTag } from '../../core/component-names';
import type { AlignPropType } from '../../schema';

type FormFieldTooltipProps = Pick<JSXBase.HTMLAttributes<HTMLElement>, 'class'> & {
	id: string;
	align?: AlignPropType;
	badgeText?: string;
	hideLabel?: boolean;
	label: string;
	hasExpertSlot?: boolean;
};

const FormFieldTooltipFc: FC<FormFieldTooltipProps> = ({ id, align, badgeText, hideLabel, label, class: classNames, hasExpertSlot }) => {
	const useTooltopInsteadOfLabel = !hasExpertSlot && hideLabel;

	if (!useTooltopInsteadOfLabel) {
		return null;
	}

	return (
		<KolTooltipWcTag
			/**
			 * Dieses Aria-Hidden verhindert das doppelte Vorlesen des Labels,
			 * verhindert aber nicht das Aria-Labelledby vorgelesen wird.
			 */
			aria-hidden="true"
			class={clsx('input-tooltip', classNames)}
			_badgeText={badgeText}
			_align={align}
			_id={hideLabel ? `${id}-label` : undefined}
			_label={label}
		></KolTooltipWcTag>
	);
};

export default FormFieldTooltipFc;
