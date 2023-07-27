import { Generic } from '@a11y-ui/core';

import { KoliBriButtonCallbacks, LinkTarget } from './button-link';
import { PropHideLabel } from './props/hide-label';
import { PropHref } from './props/href';
import { PropIcon } from './props/icon';
import { PropLabel } from './props/label';
import { StencilUnknown } from './unknown';

/**
 * This types specifies the props of a link or button in navigations.
 * We will support a mixin of link and button inside a navigation.
 * Not all possible props of a link or button are relevant and supported.
 */

type RequiredButtonProps = PropLabel & {
	on: KoliBriButtonCallbacks<StencilUnknown>; // actually no value is relevant
};
type RequiredLinkProps = PropHref;
type RequiredTextProps = PropLabel;

type OptionalButtonOrLinkOrTextProps = PropHideLabel &
	PropIcon & {
		active: boolean; // TODO: realy needed?
		// tabIndex: number; // possible, but sensible ?! -> Ticket?
		// tooltipAlign: Alignment; // possible, but sensible ?! -> Ticket?
		target: LinkTarget;
		targetDescription: string;
	};
type OptionalButtonProps = OptionalButtonOrLinkOrTextProps & {
	disabled: boolean;
};
// type ButtonProps = Generic.Element.Members<RequiredButtonProps, OptionalButtonProps>;
// type LinkProps = Generic.Element.Members<RequiredLinkProps, OptionalButtonOrLinkOrTextProps>;
// type TextProps = Generic.Element.Members<RequiredTextProps, OptionalButtonOrLinkOrTextProps>;
// type ButtonOrLinkOrTextProps = ButtonProps | LinkProps | TextProps;

type OptionalButtonOrLinkOrTextWithChildrenProps = OptionalButtonOrLinkOrTextProps & {
	children: ButtonOrLinkOrTextWithChildrenProps[];
} & PropLabel;
type OptionalButtonWithChildrenProps = OptionalButtonProps & {
	children: ButtonOrLinkOrTextWithChildrenProps[];
};
export type ButtonWithChildrenProps = Generic.Element.Members<RequiredButtonProps, OptionalButtonWithChildrenProps>;
export type LinkWithChildrenProps = Generic.Element.Members<RequiredLinkProps, OptionalButtonOrLinkOrTextWithChildrenProps>;
export type TextWithChildrenProps = Generic.Element.Members<RequiredTextProps, OptionalButtonOrLinkOrTextWithChildrenProps>;
export type ButtonOrLinkOrTextWithChildrenProps = ButtonWithChildrenProps | LinkWithChildrenProps | TextWithChildrenProps;
