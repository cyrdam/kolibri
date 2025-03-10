/* eslint-disable jsx-a11y/label-has-associated-control */
import { convertMsgToInternMsg, handleSlotContent, type MsgPropType, type ShortKeyPropType, showExpertSlot } from '../../schema';
import type { JSX } from '@stencil/core';
import { Component, Element, Fragment, Host, Prop, h } from '@stencil/core';
import clsx from 'clsx';

import { translate } from '../../i18n';

import type {
	AccessKeyPropType,
	AnyIconFontClass,
	ButtonProps,
	IdPropType,
	KoliBriCustomIcon,
	KoliBriHorizontalIcons,
	LabelWithExpertSlotPropType,
	Stringified,
	SuggestionsPropType,
	TooltipAlignPropType,
	W3CInputValue,
} from '../../schema';
import type { Props } from './types';
import { KolButtonWcTag, KolIconTag, KolTooltipWcTag } from '../../core/component-names';
import { KolFormFieldMsgFc } from '../../functional-components';

/**
 * @internal
 */
@Component({
	tag: 'kol-input',
	shadow: false,
})
export class KolInputWc implements Props {
	@Element() private readonly host?: HTMLElement;

	private slotName: string = 'input';

	public componentWillRender(): void {
		this.slotName = this._slotName ? this._slotName : 'input';
	}

	private catchInputSlot = (slot?: HTMLDivElement): void => {
		handleSlotContent(this.host!, slot!, this.slotName);
	};

	private getIconStyles(icon?: AnyIconFontClass | KoliBriCustomIcon): Record<string, string> {
		return icon && typeof icon === 'object' && icon.style ? icon.style : {};
	}

	public render(): JSX.Element {
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
		const hasValidMsg =
			typeof this._msg === 'object' && this._msg !== null && typeof this._msg?._description === 'string' && this._msg?._description.length > 0;
		const showMsg = hasValidMsg && (this._touched === true || this._msg?._type !== 'error');

		const hasExpertSlot = showExpertSlot(this._label);
		const hasHint = typeof this._hint === 'string' && this._hint.length > 0;
		const useTooltipInsteadOfLabel = !hasExpertSlot && this._hideLabel;

		return (
			<Host
				class={clsx('kol-input', this.getModifierClassNameByMsgType(showMsg), {
					disabled: this._disabled === true,
					[this._msg?._type || 'error']: showMsg === true,
					'read-only': this._readOnly === true,
					required: this._required === true,
					touched: this._touched === true,
					'hidden-msg': this._hideMsg === true,
				})}
			>
				<label class="input-label" id={!useTooltipInsteadOfLabel ? `${this._id}-label` : undefined} hidden={useTooltipInsteadOfLabel} htmlFor={this._id}>
					{/* INFO: span is needed for css styling :after content like a star (*) or optional text ! */}
					<span class="input-label-span">
						{/* INFO: label comes with any html tag or as plain text! */}
						<slot name="label"></slot>
					</span>
				</label>
				{hasHint && (
					<span class="hint" id={`${this._id}-hint`}>
						{this._hint}
					</span>
				)}
				<div
					class={{
						input: true,
						'icon-left': typeof this._icons?.left === 'object',
						'icon-right': typeof this._icons?.right === 'object',
					}}
				>
					{this._icons?.left && (
						<KolIconTag _label="" _icons={(this._icons?.left as KoliBriCustomIcon).icon} style={this.getIconStyles(this._icons?.left)}></KolIconTag>
					)}
					<div ref={this.catchInputSlot} id={this.slotName} class="input-slot"></div>
					{typeof this._smartButton === 'object' && this._smartButton !== null && (
						<KolButtonWcTag
							_customClass={this._smartButton._customClass}
							_disabled={this._smartButton._disabled}
							_icons={this._smartButton._icons}
							_hideLabel={true}
							_id={this._smartButton._id}
							_label={this._smartButton._label}
							_on={this._smartButton._on}
							_tooltipAlign={this._smartButton._tooltipAlign}
							_variant={this._smartButton._variant}
						></KolButtonWcTag>
					)}
					{this._icons?.right && (
						<KolIconTag _label="" _icons={(this._icons?.right as KoliBriCustomIcon).icon} style={this.getIconStyles(this._icons?.right)}></KolIconTag>
					)}
				</div>
				{useTooltipInsteadOfLabel && (
					<KolTooltipWcTag
						/**
						 * Dieses Aria-Hidden verhindert das doppelte Vorlesen des Labels,
						 * verhindert aber nicht das Aria-Labelledby vorgelesen wird.
						 */
						aria-hidden="true"
						class="input-tooltip"
						_badgeText={this._accessKey || this._shortKey}
						_align={this._tooltipAlign}
						_id={this._hideLabel ? `${this._id}-label` : undefined}
						_label={this._label}
					></KolTooltipWcTag>
				)}
				{showMsg && <KolFormFieldMsgFc alert={this._alert} hideMsg={this._hideMsg} msg={convertMsgToInternMsg(this._msg)} id={this._id} />}
				{Array.isArray(this._suggestions) && this._suggestions.length > 0 && (
					<datalist id={`${this._id}-list`}>
						{this._suggestions.map((option: W3CInputValue) => (
							<option value={option} />
						))}
					</datalist>
				)}
				{this._hasCounter && (
					<span class="counter" aria-atomic="true" aria-live="polite" data-testid="input-counter">
						{this._currentLength}
						{this._maxLength && (
							<>
								<span aria-label={translate('kol-of')} role="img">
									/
								</span>
								{this._maxLength}
							</>
						)}{' '}
						<span>{translate('kol-characters')}</span>
					</span>
				)}
			</Host>
		);
	}

	/**
	 * Defines which key combination can be used to trigger or focus the interactive element of the component.
	 */
	@Prop() public _accessKey?: AccessKeyPropType;

	/**
	 * Defines whether the screen-readers should read out the notification.
	 * @TODO: Change type back to `AlertPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _alert?: boolean = true;

	/**
	 * @internal
	 */
	@Prop() public _currentLength?: number;

	/**
	 * Makes the element not focusable and ignore all events.
	 * @TODO: Change type back to `DisabledPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _disabled?: boolean = false;

	/**
	 * Shows the character count on the lower border of the input.
	 * @TODO: Change type back to `HasCounterPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _hasCounter?: boolean = false;

	/**
	 * Hides the error message but leaves it in the DOM for the input's aria-describedby.
	 * @TODO: Change type back to `HideMsgPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _hideMsg?: boolean = false;

	/**
	 * Hides the caption by default and displays the caption text with a tooltip when the
	 * interactive element is focused or the mouse is over it.
	 * @TODO: Change type back to `HideLabelPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _hideLabel?: boolean = false;

	/**
	 * Defines the hint text.
	 */
	@Prop() public _hint?: string = '';

	/**
	 * Defines the icon classnames (e.g. `_icons="fa-solid fa-user"`).
	 */
	@Prop() public _icons?: KoliBriHorizontalIcons;

	/**
	 * Defines the internal ID of the primary component element.
	 */
	@Prop() public _id!: IdPropType;

	/**
	 * Defines the visible or semantic label of the component (e.g. aria-label, label, headline, caption, summary, etc.). Set to `false` to enable the expert slot.
	 */
	@Prop() public _label!: LabelWithExpertSlotPropType;

	/**
	 * Defines the maximum number of input characters.
	 */
	@Prop() public _maxLength?: number;

	/**
	 * Defines the properties for a message rendered as Alert component.
	 */
	@Prop() public _msg?: MsgPropType;

	/**
	 * Makes the input element read only.
	 * @TODO: Change type back to `ReadOnlyPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _readOnly?: boolean = false;

	/**
	 * Gibt an, ob die Komponente kein Label rendern soll.
	 */
	@Prop() public _renderNoLabel?: boolean = false;

	/**
	 * Makes the input element required.
	 * @TODO: Change type back to `RequiredPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _required?: boolean = false;

	/**
	 * Adds a visual short key hint to the component.
	 */
	@Prop() public _shortKey?: ShortKeyPropType;

	/**
	 * Ermöglicht den Slotnamen zu bestimmen. Wird nur verwendet, wenn sonst mehrere Slots mit dem gleichen Namen innerhalb eines Shadow DOMs existieren würden.
	 * @internal
	 */
	@Prop() public _slotName?: string;

	/**
	 * Suggestions to provide for the input.
	 */
	@Prop() public _suggestions?: SuggestionsPropType;

	/**
	 * Allows to add a button with an arbitrary action within the element (_hide-label only).
	 */
	@Prop() public _smartButton?: Stringified<ButtonProps>;

	/**
	 * Defines where to show the Tooltip preferably: top, right, bottom or left.
	 */
	@Prop() public _tooltipAlign?: TooltipAlignPropType = 'top';

	/**
	 * Shows if the input was touched by a user.
	 * @TODO: Change type back to `TouchedPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _touched?: boolean = false;

	private getModifierClassNameByMsgType(showMsg: boolean) {
		if (showMsg && this._msg?._type) {
			return {
				default: 'msg-type-default',
				info: 'msg-type-info',
				success: 'msg-type-success',
				warning: 'msg-type-warning',
				error: 'msg-type-error',
			}[this._msg?._type];
		}
	}
}
