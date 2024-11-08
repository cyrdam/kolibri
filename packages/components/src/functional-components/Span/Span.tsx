import { Fragment, h, type FunctionalComponent as FC } from '@stencil/core';
import type { JSXBase } from '@stencil/core/internal';
import clsx from 'clsx';

import { isString, isObject } from 'lodash-es';

import {
	showExpertSlot,
	type AccessKeyPropType,
	type HideLabelPropType,
	type IconOrIconClass,
	type KoliBriCustomIcon,
	type KoliBriIconsProp,
	type LabelWithExpertSlotPropType,
} from '../../schema';

import KolIconFc from '../Icon';
import AccessKey from '../AccessKey';
import InternalUnderlinedAccessKey from '../InternalUnderlinedAccessKey';
import { md } from '../../utils/markdown';

type IconType = IconOrIconClass | undefined | null;

export type SpanProps = JSXBase.HTMLAttributes<HTMLSpanElement> & {
	label: LabelWithExpertSlotPropType;

	accessKey?: AccessKeyPropType;
	allowMarkdown?: boolean;
	icons?: KoliBriIconsProp;
	hideLabel?: HideLabelPropType;
};

const IconHelper: FC<KoliBriCustomIcon & { class?: string }> = (props) => {
	return <KolIconFc class={clsx('icon', props.class)} style={props.style} label={props.label || ''} icons={props.icon} />;
};

const LabelHelper: FC<{ label: string; hideLabel?: boolean; accessKey?: string; hideExpertSlot?: boolean; allowMarkdown?: boolean }> = ({
	label,
	hideLabel,
	allowMarkdown,
	accessKey,
}) => {
	if (hideLabel || !isString(label)) {
		return null;
	}

	const defaultClasses = 'span-label';

	if (allowMarkdown) {
		return <span class={clsx(defaultClasses, 'md')} innerHTML={md(label)} />;
	}

	if (accessKey) {
		return (
			<span class={clsx(defaultClasses)}>
				<InternalUnderlinedAccessKey label={label} accessKey={accessKey} />
			</span>
		);
	}

	return <span class={clsx(defaultClasses)}>{label}</span>;
};

const SpanCoreHelper: FC<{ label: string; hideLabel?: boolean; accessKey?: string; hideExpertSlot?: boolean; allowMarkdown?: boolean }> = (
	{ hideLabel, label, accessKey, allowMarkdown },
	children,
) => {
	const hideExpertSlot = !showExpertSlot(label);

	return (
		<>
			{hideExpertSlot && <LabelHelper label={label} hideLabel={hideLabel} accessKey={accessKey} allowMarkdown={allowMarkdown} />}
			<span aria-hidden={hideExpertSlot ? 'true' : undefined} class="span-label" hidden={hideExpertSlot}>
				{children}
			</span>
			{isString(accessKey) && <AccessKey accessKey={accessKey} />}
		</>
	);
};

const KolSpanFc: FC<SpanProps> = (props, children) => {
	const { class: classNames, label, hideLabel = false, accessKey, allowMarkdown, icons, ...other } = props;
	let TopIconProps: IconType = null;
	let LeftIconProps: IconType = null;
	let RightIconProps: IconType = null;
	let BottomIconProps: IconType = null;

	if (isObject(icons)) {
		TopIconProps = icons.top;
		LeftIconProps = icons.left;
		RightIconProps = icons.right;
		BottomIconProps = icons.bottom;
	} else if (isString(icons)) {
		LeftIconProps = {
			icon: icons,
		};
	}

	return (
		<span class={clsx('kol-span-wc', { 'hide-label': hideLabel }, classNames)} {...other}>
			{isObject(TopIconProps) && <IconHelper class="top" {...TopIconProps} />}
			<span>
				{isObject(LeftIconProps) && <IconHelper class="left" {...LeftIconProps} />}
				<SpanCoreHelper label={label} hideLabel={hideLabel} allowMarkdown={allowMarkdown} accessKey={accessKey}>
					{children}
				</SpanCoreHelper>
				{isObject(RightIconProps) && <IconHelper class="right" {...RightIconProps} />}
			</span>
			{isObject(BottomIconProps) && <IconHelper class="bottom" {...BottomIconProps} />}
		</span>
	);
};

export default KolSpanFc;
