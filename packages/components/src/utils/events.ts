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
	| 'select'
	| 'selectionChange'
	| 'sort'
	| 'submit'
	| 'toggle';

export function stopPropagation(event: Event): void {
	event.stopImmediatePropagation();
	event.stopPropagation();
}

export function dispatchDomEvent(target: HTMLElement, type: KoliBriEventType) {
	target.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
}
