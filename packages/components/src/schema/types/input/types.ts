import type { EventCallback, EventValueOrEventCallback } from '../callbacks';
import type { Callbacks } from '../../enums';

export const inputTypeOnOffOptions = ['on', 'off'] as const;
export type InputTypeOnOff = (typeof inputTypeOnOffOptions)[number];

type InputTypeOnBlur = {
	[Callbacks.onBlur]?: EventCallback<Event>;
};

type InputTypeOnClick = {
	[Callbacks.onClick]?: EventCallback<Event>;
};

type InputTypeOnChange = {
	[Callbacks.onChange]?: EventValueOrEventCallback<Event, unknown>;
};

type InputTypeOnFocus = {
	[Callbacks.onFocus]?: EventCallback<Event>;
};

type InputTypeOnInput = {
	[Callbacks.onInput]?: EventValueOrEventCallback<Event, unknown>;
};

// https://html.spec.whatwg.org/multipage/form-elements.html#the-option-element
export type Option<T> = {
	disabled?: boolean;
	label: string | number;
	// selected?: boolean; // wird über den value der *-Komponente gesteuert
	value: T;
};
export type RadioOption<T> = Option<T> & {
	hint?: string;
};
export type Optgroup<T> = {
	disabled?: boolean;
	label: string;
	options: Option<T>[];
};

export type SelectOption<T> = Option<T> | Optgroup<T> | RadioOption<T>;

export type InputTypeOnDefault = InputTypeOnBlur & InputTypeOnClick & InputTypeOnChange & InputTypeOnFocus & InputTypeOnInput;
