import type { Generic } from 'adopted-style-sheets';
import type { Callbacks } from '../enums';
import type { EventValueOrEventCallback } from '../types/callbacks';
import { watchValidator } from '../utils';

/* types */
export type DetailsCallbacksPropType<T> = {
	[Callbacks.onToggle]?: EventValueOrEventCallback<MouseEvent, T>;
};

/**
 * Defines the callback functions for detail events.
 */
export type PropDetailsCallbacks<T> = {
	on: DetailsCallbacksPropType<T>;
};

/* validator */
export const validateDetailsCallbacks = (component: Generic.Element.Component, value?: DetailsCallbacksPropType<boolean>): void => {
	watchValidator(component, `_on`, (value) => typeof value === 'object' && value !== null, new Set(['DetailsCallbacksPropType {Events.onToggle}']), value);
};
