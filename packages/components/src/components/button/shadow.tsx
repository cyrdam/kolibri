import type {
	AccessKeyPropType,
	AlternativeButtonLinkRolePropType,
	AriaDescriptionPropType,
	ButtonCallbacksPropType,
	ButtonProps,
	ButtonTypePropType,
	ButtonVariantPropType,
	CustomClassPropType,
	FocusableElement,
	IconsPropType,
	LabelWithExpertSlotPropType,
	ShortKeyPropType,
	StencilUnknown,
	Stringified,
	SyncValueBySelectorPropType,
	TooltipAlignPropType,
} from '../../schema';
import type { JSX } from '@stencil/core';
import { Component, h, Method, Prop } from '@stencil/core';
import { KolButtonWcTag } from '../../core/component-names';

@Component({
	tag: 'kol-button',
	styleUrls: {
		default: './style.scss',
	},
	shadow: {
		delegatesFocus: true,
	},
})
export class KolButton implements ButtonProps, FocusableElement {
	private buttonWcRef?: HTMLKolButtonWcElement;

	private readonly catchRef = (ref?: HTMLKolButtonWcElement) => {
		this.buttonWcRef = ref;
	};

	@Method()
	// eslint-disable-next-line @typescript-eslint/require-await
	public async getValue(): Promise<Stringified<StencilUnknown> | undefined> {
		return this._value;
	}

	@Method()
	public async kolFocus() {
		await this.buttonWcRef?.kolFocus();
	}

	public render(): JSX.Element {
		return (
			<KolButtonWcTag
				ref={this.catchRef}
				_accessKey={this._accessKey}
				_ariaControls={this._ariaControls}
				_ariaDescription={this._ariaDescription}
				_ariaExpanded={this._ariaExpanded}
				_ariaSelected={this._ariaSelected}
				_customClass={this._customClass}
				_disabled={this._disabled}
				_hideLabel={this._hideLabel}
				_icons={this._icons}
				_id={this._id}
				_label={this._label}
				_name={this._name}
				_on={this._on}
				_role={this._role}
				_shortKey={this._shortKey}
				_syncValueBySelector={this._syncValueBySelector}
				_tabIndex={this._tabIndex}
				_tooltipAlign={this._tooltipAlign}
				_type={this._type}
				_value={this._value}
				_variant={this._variant}
			>
				<slot name="expert" slot="expert"></slot>
			</KolButtonWcTag>
		);
	}

	/**
	 * Defines which key combination can be used to trigger or focus the interactive element of the component.
	 */
	@Prop() public _accessKey?: AccessKeyPropType;

	/**
	 * Defines which elements are controlled by this component. (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls)
	 */
	@Prop() public _ariaControls?: string;

	/**
	 * Defines the value for the aria-description attribute.
	 */
	@Prop() public _ariaDescription?: AriaDescriptionPropType;

	/**
	 * Defines whether the interactive element of the component expanded something. (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
	 */
	@Prop() public _ariaExpanded?: boolean;

	/**
	 * Defines whether the interactive element of the component is selected (e.g. role=tab). (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected)
	 */
	@Prop() public _ariaSelected?: boolean;

	/**
	 * Defines the custom class attribute if _variant="custom" is set.
	 */
	@Prop() public _customClass?: CustomClassPropType;

	/**
	 * Makes the element not focusable and ignore all events.
	 */
	@Prop() public _disabled?: boolean = false;

	/**
	 * Hides the caption by default and displays the caption text with a tooltip when the
	 * interactive element is focused or the mouse is over it.
	 * @TODO: Change type back to `HideLabelPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _hideLabel?: boolean = false;

	/**
	 * Defines the icon classnames (e.g. `_icons="fa-solid fa-user"`).
	 */
	@Prop() public _icons?: IconsPropType;

	/**
	 * Defines the internal ID of the primary component element.
	 */
	@Prop() public _id?: string;

	/**
	 * Defines the visible or semantic label of the component (e.g. aria-label, label, headline, caption, summary, etc.). Set to `false` to enable the expert slot.
	 */
	@Prop() public _label!: LabelWithExpertSlotPropType;

	/**
	 * Defines the technical name of an input field.
	 */
	@Prop() public _name?: string;

	/**
	 * Defines the callback functions for button events.
	 */
	@Prop() public _on?: ButtonCallbacksPropType<StencilUnknown>;

	/**
	 * Defines the role of the components primary element.
	 */
	@Prop() public _role?: AlternativeButtonLinkRolePropType;

	/**
	 * Adds a visual short key hint to the component.
	 */
	@Prop() public _shortKey?: ShortKeyPropType;

	/**
	 * Selector for synchronizing the value with another input element.
	 * @internal
	 */
	@Prop() public _syncValueBySelector?: SyncValueBySelectorPropType;

	/**
	 * Defines which tab-index the primary element of the component has. (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
	 */
	@Prop() public _tabIndex?: number;

	/**
	 * Defines where to show the Tooltip preferably: top, right, bottom or left.
	 */
	@Prop() public _tooltipAlign?: TooltipAlignPropType = 'top';

	/**
	 * Defines either the type of the component or of the components interactive element.
	 */
	@Prop() public _type?: ButtonTypePropType = 'button';

	/**
	 * Defines the value that the button emits on click.
	 */
	@Prop() public _value?: Stringified<StencilUnknown>;

	/**
	 * Defines which variant should be used for presentation.
	 */
	@Prop() public _variant?: ButtonVariantPropType = 'normal';
}
