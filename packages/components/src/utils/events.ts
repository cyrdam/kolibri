enum KolEvent {
	blur = 'kolBlur',
	change = 'kolChange',
	changePage = 'kolChangePage',
	changePageSize = 'kolChangePageSize',
	click = 'kolClick',
	close = 'kolClose',
	focus = 'kolFocus',
	input = 'kolInput',
	mousedown = 'kolMousedown',
	reset = 'kolReset',
	select = 'kolSelect',
	selectionChange = 'kolSelectionChange',
	sort = 'kolSort',
	submit = 'kolSubmit',
	toggle = 'kolToggle',
}

function stopPropagation(event: Event): void {
	event.stopImmediatePropagation();
	event.stopPropagation();
}

function createKoliBriEvent<T>(type: KolEvent, detail?: T): CustomEvent {
	return new CustomEvent(type, {
		bubbles: true,
		cancelable: true,
		composed: true,
		detail: detail,
	});
}

function dispatchDomEvent<T>(target: HTMLElement, event: KolEvent, detail?: T) {
	target.dispatchEvent(createKoliBriEvent<T>(event, detail));
}

export { KolEvent, stopPropagation, dispatchDomEvent };
