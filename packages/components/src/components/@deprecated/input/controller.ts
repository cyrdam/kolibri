import type { Generic } from 'adopted-style-sheets';

import type {
	AccessKeyPropType,
	AdjustHeightPropType,
	ButtonProps,
	HideMsgPropType,
	InputTypeOnDefault,
	LabelWithExpertSlotPropType,
	MsgPropType,
	ShortKeyPropType,
	StencilUnknown,
	Stringified,
	TooltipAlignPropType,
} from '../../../schema';
import {
	a11yHint,
	a11yHintDisabled,
	devHint,
	objectObjectHandler,
	parseJson,
	setState,
	validateAccessKey,
	validateAdjustHeight,
	validateHideMsg,
	validateHideLabel,
	validateLabelWithExpertSlot,
	validateMsg,
	validateShortKey,
	validateTabIndex,
	validateTooltipAlign,
	watchBoolean,
	watchString,
} from '../../../schema';

import { dispatchDomEvent, KolEvent } from '../../../utils/events';
import { ControlledInputController } from '../../input-adapter-leanup/controller';

import type { Props as AdapterProps } from '../../input-adapter-leanup/types';
import type { Props, Watches } from './types';
import { validateAccessAndShortKey } from '../../../schema/validators/access-and-short-key';

type ValueChangeListener = (value: StencilUnknown) => void;

export class InputController extends ControlledInputController implements Watches {
	protected readonly component: Generic.Element.Component & Props & AdapterProps;

	private readonly valueChangeListeners: ValueChangeListener[] = [];

	public constructor(component: Generic.Element.Component & Props, name: string, host?: HTMLElement) {
		super(component, name, host);
		this.component = component;
	}

	public validateAccessKey(value?: AccessKeyPropType): void {
		validateAccessKey(this.component, value);
		validateAccessAndShortKey(value, this.component._shortKey);
	}

	public validateAdjustHeight(value?: AdjustHeightPropType): void {
		validateAdjustHeight(this.component, value);
	}

	public validateDisabled(value?: boolean): void {
		watchBoolean(this.component, '_disabled', value);
		if (value === true) {
			a11yHintDisabled();
		}
	}
	public validateTooltipAlign(value?: TooltipAlignPropType): void {
		validateTooltipAlign(this.component, value);
	}

	public validateHideMsg(value?: HideMsgPropType): void {
		validateHideMsg(this.component, value, {
			hooks: {
				afterPatch: () => {
					if (this.component.state._hideMsg) {
						a11yHint('Property _hideMsg for inputs: Only use when the error message is shown outside of the input component.');
					}
				},
			},
		});
	}

	public validateHideLabel(value?: boolean): void {
		validateHideLabel(this.component, value, {
			hooks: {
				afterPatch: () => {
					if (this.component.state._hideLabel) {
						a11yHint('Property hide-label for inputs: Only use for exceptions like search inputs that are clearly identifiable by their context.');
					}
				},
			},
		});
	}

	public validateHint(value?: string): void {
		watchString(this.component, '_hint', value);
	}

	public validateId(value?: string): void {
		watchString(this.component, '_id', value, { minLength: 1 });
		if (value === '' || typeof value === 'undefined') {
			devHint(`A unique ID on the input fields is not strictly required, but it might be relevant for E2E tests.`);
		}
	}

	public validateLabel(value?: LabelWithExpertSlotPropType): void {
		validateLabelWithExpertSlot(this.component, value, {
			required: true,
		});
	}

	public validateMsg(value?: Stringified<MsgPropType>): void {
		validateMsg(this.component, value);
	}

	public validateOn(value?: InputTypeOnDefault): void {
		if (typeof value === 'object') {
			setState(this.component, '_on', value);
		}
	}

	public validateShortKey(value?: ShortKeyPropType): void {
		validateShortKey(this.component, value);
		validateAccessAndShortKey(this.component._accessKey, value);
	}

	public validateSmartButton(value?: ButtonProps | string): void {
		objectObjectHandler(value, () => {
			try {
				value = parseJson<ButtonProps>(value as string);
				// eslint-disable-next-line no-empty
			} catch (e) {
				// value behält den ursprünglichen Wert
			}
			setState(this.component, '_smartButton', value);
		});
	}

	public validateTabIndex(value?: number): void {
		validateTabIndex(this.component, value);
	}

	public componentWillLoad(): void {
		super.componentWillLoad();
		this.validateAccessKey(this.component._accessKey);
		this.validateAdjustHeight(this.component._adjustHeight);
		this.validateMsg(this.component._msg);
		this.validateDisabled(this.component._disabled);
		this.validateHideMsg(this.component._hideMsg);
		this.validateHideLabel(this.component._hideLabel);
		this.validateHint(this.component._hint);
		this.validateId(this.component._id);
		this.validateLabel(this.component._label);
		this.validateShortKey(this.component._shortKey);
		this.validateSmartButton(this.component._smartButton);
		this.validateOn(this.component._on);
		this.validateTabIndex(this.component._tabIndex);
		validateAccessAndShortKey(this.component._accessKey, this.component._shortKey);
	}

	private emitEvent(type: KolEvent, value?: unknown): void {
		if (this.host) {
			dispatchDomEvent(this.host, type, value);
		}
	}

	protected onBlur(event: Event): void {
		this.component._touched = true;

		// Event handling
		this.emitEvent(KolEvent.blur);

		// Callback
		if (typeof this.component._on?.onBlur === 'function') {
			this.component._on.onBlur(event);
		}
	}

	/**
	 * @param event - The original event object
	 * @param value - Optional value. Taken from event if not defined.
	 */
	protected onChange(event: Event, value?: StencilUnknown): void {
		if (typeof value === 'undefined') {
			value = (event.target as HTMLInputElement).value;
		}

		// Event handling
		this.emitEvent(KolEvent.change, value);

		// Callback
		if (typeof this.component._on?.onChange === 'function') {
			/**
			 * TODO
			 * Value-Handling muss für InputDate und InputNumber optimiert werden
			 * - value
			 * - valueAsNumber
			 * - valueAsDate
			 */
			this.component._on.onChange(event, value);
		}

		/**
		 * TODO: Was ist das?
		 */
		this.valueChangeListeners.forEach((listener) => listener(value));
	}

	/**
	 * @param event - The original event object
	 * @param shouldSetFormAssociatedValue - Set to false when setting form associated value is not desired.
	 * @param value - Optional value. Taken from event if not defined.
	 */
	protected onInput(event: Event, shouldSetFormAssociatedValue = true, value?: StencilUnknown): void {
		if (typeof value === 'undefined') {
			value = (event.target as HTMLInputElement).value;
		}

		// Event handling
		this.emitEvent(KolEvent.input, value);

		// Static form handling
		if (shouldSetFormAssociatedValue) {
			this.setFormAssociatedValue(value);
		}

		// Callback
		if (typeof this.component._on?.onInput === 'function') {
			this.component._on.onInput(event, value);
		}
	}

	protected onClick(event: Event): void {
		// Event handling
		this.emitEvent(KolEvent.click);

		// Callback
		if (typeof this.component._on?.onClick === 'function') {
			this.component._on.onClick(event);
		}
	}

	protected onFocus(event: Event): void {
		// Event handling
		this.emitEvent(KolEvent.focus);

		// Callback
		if (typeof this.component._on?.onFocus === 'function') {
			this.component._on.onFocus(event);
		}
	}

	public addValueChangeListener(listener: ValueChangeListener) {
		this.valueChangeListeners.push(listener);
	}

	/**
	 * Hinweis: In der Subklasse 'InputPasswordController'
	 *          werden die Methoden onBlur und onFocus
	 *          überschrieben.
	 *          Es werden somit zunächst die Methoden der
	 *          Subklasse ausgeführt und danach die der
	 *          Oberklassen.
	 */
	public readonly onFacade = {
		onBlur: this.onBlur.bind(this),
		onChange: this.onChange.bind(this),
		onClick: this.onClick.bind(this),
		onFocus: this.onFocus.bind(this),
		onInput: this.onInput.bind(this),
	};
}
