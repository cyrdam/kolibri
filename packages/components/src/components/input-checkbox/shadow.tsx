/* eslint-disable jsx-a11y/label-has-associated-control */
import type { JSX } from '@stencil/core';
import { Component, Element, h, Method, Prop, State, Watch } from '@stencil/core';
import clsx from 'clsx';

import type {
	CheckedPropType,
	FocusableElement,
	HideErrorPropType,
	IdPropType,
	IndeterminatePropType,
	InputCheckboxAPI,
	InputCheckboxIconsProp,
	InputCheckboxStates,
	InputCheckboxVariant,
	InputTypeOnDefault,
	LabelAlignPropType,
	LabelWithExpertSlotPropType,
	MsgPropType,
	NamePropType,
	ShortKeyPropType,
	StencilUnknown,
	Stringified,
	SyncValueBySelectorPropType,
	TooltipAlignPropType,
} from '../../schema';

import { nonce } from '../../utils/dev.utils';
import { tryToDispatchKoliBriEvent } from '../../utils/events';
import { InputCheckboxController } from './controller';

import KolFormFieldStateWrapperFc, { type FormFieldStateWrapperProps } from '../../functional-component-wrappers/FormFieldStateWrapper';
import KolInputStateWrapperFc, { type InputStateWrapperProps } from '../../functional-component-wrappers/InputStateWrapper';
import KolIconFc from '../../functional-components/Icon';

/**
 * @slot expert - Die Beschriftung der Checkbox.
 */
@Component({
	tag: 'kol-input-checkbox',
	styleUrls: {
		default: './style.scss',
	},
	shadow: {
		delegatesFocus: true,
	},
})
export class KolInputCheckbox implements InputCheckboxAPI, FocusableElement {
	@Element() private readonly host?: HTMLKolInputCheckboxElement;
	private inputRef?: HTMLInputElement;

	private readonly catchRef = (ref?: HTMLInputElement) => {
		this.inputRef = ref;
	};

	private getModelValue(): StencilUnknown {
		return this._checked ? this.state._value : null;
	}

	@Method()
	// eslint-disable-next-line @typescript-eslint/require-await
	public async getValue(): Promise<StencilUnknown> {
		return this.getModelValue();
	}

	/**
	 * @deprecated Use kolFocus instead.
	 */
	@Method()
	public async focus() {
		await this.kolFocus();
	}

	@Method()
	// eslint-disable-next-line @typescript-eslint/require-await
	public async kolFocus() {
		this.inputRef?.focus();
	}

	private getFormFieldProps(): FormFieldStateWrapperProps {
		return {
			state: this.state,
			class: clsx('kol-input-checkbox', 'checkbox', this.state._variant, {
				'hide-label': !!this.state._hideLabel,
				checked: this.state._checked,
				indeterminate: this.state._indeterminate,
			}),
			tooltipAlign: this._tooltipAlign,
			'data-label-align': this.state._labelAlign || 'right',
			'data-role': this.state._variant === 'button' ? 'button' : undefined,
			alert: this.showAsAlert(),
			reverseLabelInput: this.state._labelAlign === 'right',
		};
	}

	private getInputProps(): InputStateWrapperProps {
		return {
			class: clsx('checkbox-input-element', {
				'visually-hidden': this.state._variant === 'button',
			}),
			ref: this.catchRef,
			type: 'checkbox',
			slot: 'input',
			state: this.state,
			...this.controller.onFacade,
			onInput: this.onInput,
			onChange: this.onChange,
			onFocus: (event: Event) => {
				this.controller.onFacade.onFocus(event);
				this.inputHasFocus = true;
			},
			onBlur: (event: Event) => {
				this.controller.onFacade.onBlur(event);
				this.inputHasFocus = false;
			},
			onClick: undefined, // onClick is not needed since onChange already triggers the correct event
		};
	}

	private getIcon(): string {
		if (this.state._indeterminate) return this.state._icons.indeterminate;
		if (this.state._checked) return this.state._icons.checked;
		return this.state._icons.unchecked;
	}

	private getIconProps() {
		return {
			class: 'icon',
			icons: this.getIcon(),
			label: '',
		};
	}

	public render(): JSX.Element {
		return (
			<KolFormFieldStateWrapperFc {...this.getFormFieldProps()}>
				<div class="input">
					<label class="checkbox-container">
						<KolIconFc {...this.getIconProps()} />
						<KolInputStateWrapperFc {...this.getInputProps()} />
					</label>
				</div>
			</KolFormFieldStateWrapperFc>
		);
	}

	private readonly controller: InputCheckboxController;

	/**
	 * Defines which key combination can be used to trigger or focus the interactive element of the component.
	 */
	@Prop() public _accessKey?: string;

	/**
	 * Defines whether the checkbox is checked or not. Can be read and written.
	 * @TODO: Change type back to `CheckedPropType` after Stencil#4663 has been resolved.
	 */
	@Prop({ mutable: true, reflect: true }) public _checked?: boolean = false;

	/**
	 * Hides the error message but leaves it in the DOM for the input's aria-describedby.
	 * @TODO: Change type back to `HideErrorPropType` after Stencil#4663 has been resolved.
	 */
	@Prop({ mutable: true, reflect: true }) public _hideError?: boolean = false;

	/**
	 * Makes the element not focusable and ignore all events.
	 * @TODO: Change type back to `DisabledPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _disabled?: boolean = false;

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
	@Prop() public _icons?: Stringified<InputCheckboxIconsProp>;

	/**
	 * Defines the internal ID of the primary component element.
	 */
	@Prop() public _id?: IdPropType;

	/**
	 * Puts the checkbox in the indeterminate state, does not change the value of _checked.
	 * @TODO: Change type back to `IndeterminatePropType` after Stencil#4663 has been resolved.
	 */
	@Prop({ mutable: true, reflect: true }) public _indeterminate?: boolean;

	/**
	 * Defines the visible or semantic label of the component (e.g. aria-label, label, headline, caption, summary, etc.). Set to `false` to enable the expert slot.
	 */
	@Prop() public _label!: LabelWithExpertSlotPropType;

	/**
	 * Defines which alignment should be used for presentation.
	 */
	@Prop() public _labelAlign?: LabelAlignPropType = 'right';

	/**
	 * Defines the properties for a message rendered as Alert component.
	 */
	@Prop() public _msg?: Stringified<MsgPropType>;

	/**
	 * Defines the technical name of an input field.
	 */
	@Prop() public _name?: NamePropType;

	/**
	 * Gibt die EventCallback-Funktionen für das Input-Event an.
	 */
	@Prop() public _on?: InputTypeOnDefault;

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
	 * Shows if the input was touched by a user.
	 * @TODO: Change type back to `TouchedPropType` after Stencil#4663 has been resolved.
	 */
	@Prop({ mutable: true, reflect: true }) public _touched?: boolean = false;

	/**
	 * Defines the value of the input.
	 */
	@Prop() public _value?: Stringified<StencilUnknown> = true;

	/**
	 * Defines which variant should be used for presentation.
	 */
	@Prop() public _variant?: InputCheckboxVariant = 'default';

	@State() public state: InputCheckboxStates = {
		_checked: false,
		_hideError: false,
		_icons: {
			checked: 'codicon codicon-check',
			indeterminate: 'codicon codicon-remove',
			unchecked: 'codicon codicon-close',
		},
		_id: `id-${nonce()}`,
		_indeterminate: false,
		_label: '', // ⚠ required
		_value: true,
		_variant: 'default',
		_labelAlign: 'right',
	};

	@State() private inputHasFocus = false;

	public constructor() {
		this.controller = new InputCheckboxController(this, 'checkbox', this.host);
	}

	private showAsAlert(): boolean {
		return Boolean(this.state._touched) && !this.inputHasFocus;
	}

	@Watch('_accessKey')
	public validateAccessKey(value?: string): void {
		this.controller.validateAccessKey(value);
	}

	@Watch('_checked')
	public validateChecked(value?: CheckedPropType): void {
		this.controller.validateChecked(value);
	}

	@Watch('_disabled')
	public validateDisabled(value?: boolean): void {
		this.controller.validateDisabled(value);
	}

	@Watch('_hideError')
	public validateHideError(value?: HideErrorPropType): void {
		this.controller.validateHideError(value);
	}

	@Watch('_hideLabel')
	public validateHideLabel(value?: boolean): void {
		this.controller.validateHideLabel(value);
	}

	@Watch('_hint')
	public validateHint(value?: string): void {
		this.controller.validateHint(value);
	}

	@Watch('_icons')
	public validateIcons(value?: Stringified<InputCheckboxIconsProp>): void {
		this.controller.validateIcons(value);
	}

	@Watch('_id')
	public validateId(value?: string): void {
		this.controller.validateId(value);
	}

	@Watch('_indeterminate')
	public validateIndeterminate(value?: IndeterminatePropType): void {
		this.controller.validateIndeterminate(value);
	}

	@Watch('_label')
	public validateLabel(value?: LabelWithExpertSlotPropType): void {
		this.controller.validateLabel(value);
	}

	@Watch('_labelAlign')
	public validateLabelAlign(value?: LabelAlignPropType): void {
		this.controller.validateLabelAlign(value);
	}

	@Watch('_msg')
	public validateMsg(value?: Stringified<MsgPropType>): void {
		this.controller.validateMsg(value);
	}

	@Watch('_name')
	public validateName(value?: string): void {
		this.controller.validateName(value);
	}

	@Watch('_on')
	public validateOn(value?: InputTypeOnDefault): void {
		this.controller.validateOn(value);
	}

	@Watch('_required')
	public validateRequired(value?: boolean): void {
		this.controller.validateRequired(value);
	}

	@Watch('_shortKey')
	public validateShortKey(value?: ShortKeyPropType): void {
		this.controller.validateShortKey(value);
	}

	@Watch('_syncValueBySelector')
	public validateSyncValueBySelector(value?: SyncValueBySelectorPropType): void {
		this.controller.validateSyncValueBySelector(value);
	}

	@Watch('_tabIndex')
	public validateTabIndex(value?: number): void {
		this.controller.validateTabIndex(value);
	}

	@Watch('_touched')
	public validateTouched(value?: boolean): void {
		this.controller.validateTouched(value);
	}

	@Watch('_value')
	public validateValue(value?: Stringified<StencilUnknown>): void {
		this.controller.validateValue(value);
	}

	@Watch('_variant')
	public validateVariant(value?: InputCheckboxVariant): void {
		this.controller.validateVariant(value);
	}

	public componentWillLoad(): void {
		this._touched = this._touched === true;
		this.controller.componentWillLoad();
	}

	private onInput = (event: Event): void => {
		this._checked = !this._checked;
		this._indeterminate = false;

		const value = this.getModelValue();

		// Event handling
		tryToDispatchKoliBriEvent('input', this.host, value);

		// Callback
		if (typeof this._on?.onInput === 'function') {
			this._on.onInput(event, value);
		}
	};

	private onChange = (event: Event): void => {
		const value = this.getModelValue();

		// Event handling
		// stopPropagation(event);
		tryToDispatchKoliBriEvent('change', this.host, value);

		// Static form handling
		// this.controller.setFormAssociatedValue(value);
		this.controller.setFormAssociatedCheckboxValue(value);

		// Callback
		if (typeof this._on?.onChange === 'function') {
			this._on.onChange(event, value);
		}
	};
}
