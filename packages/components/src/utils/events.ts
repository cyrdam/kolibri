// TODO: Should be synchronized with enums/events.ts
export type KoliBriEventType =
	| 'blur'
	| 'change'
	| 'changePage'
	| 'changePageSize'
	| 'click'
	| 'close'
	| 'focus'
	| 'input'
	| 'mousedown'
	| 'reset'
	| 'selection-change' // todo remove
	| 'selectionChange'
	| 'sort'
	| 'submit'
	| 'toggle';

export function stopPropagation(event: Event): void {
	event.stopImmediatePropagation();
	event.stopPropagation();
}

function createKoliBriEvent<T>(type: KoliBriEventType, detail: T): CustomEvent {
	const event = new CustomEvent(`kol-${type}`, {
		bubbles: true,
		cancelable: true,
		composed: true,
		detail: detail,
	});
	return event;
}

function dispatchKoliBriEvent<T>(target: EventTarget, type: KoliBriEventType, detail?: T): boolean {
	const dispatch = target.dispatchEvent(createKoliBriEvent(type, detail));
	return dispatch;
}

/**
 * @deprecated
 */
export function tryToDispatchKoliBriEvent<T>(type: KoliBriEventType, target?: EventTarget, detail?: T): void {
	target && dispatchKoliBriEvent(target, type, detail);
}

export function dispatchDomEvent(target: HTMLElement, type: KoliBriEventType) {
	target.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
}

export function preventDefaultAndStopPropagation(event: Event) {
	event.preventDefault();
	stopPropagation(event);
}
