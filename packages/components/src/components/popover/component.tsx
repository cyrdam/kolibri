import type { AlignPropType, PopoverAPI, PopoverCallbacksPropType, PopoverStates, ShowPropType } from '../../schema';
import { getDocument, validateAlign, validatePopoverCallbacks, validateShow } from '../../schema';
import type { JSX } from '@stencil/core';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

import { alignFloatingElements } from '../../utils/align-floating-elements';
import clsx from 'clsx';
import { dispatchDomEvent, KolEvent } from '../../utils/events';

/**
 * @internal
 * @slot - Der Inhalt des Popover.
 */
@Component({
	tag: 'kol-popover-wc',
	shadow: false,
})
export class KolPopover implements PopoverAPI {
	private arrowElement?: HTMLDivElement;
	private popoverElement?: HTMLDivElement;
	private triggerElement?: HTMLElement | null;
	private host?: HTMLElement;

	private async showPopover(): Promise<void> {
		this.addListenersToBody();

		if (this.triggerElement && this.popoverElement) {
			await alignFloatingElements({
				align: this._align,
				referenceElement: this.triggerElement,
				arrowElement: this.arrowElement,
				floatingElement: this.popoverElement,
			});
			this.state = { ...this.state, _visible: true };
		}
	}
	private hidePopover(event: MouseEvent | KeyboardEvent): void {
		this.state = {
			...this.state,
			_visible: false,
		};
		this._show = false;
		this.triggerElement?.focus();
		this.removeListenersToBody();

		this.state._on?.onClose?.(event);
		if (this.host) {
			dispatchDomEvent(this.host, KolEvent.close);
		}
	}

	private hidePopoverByEscape = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') this.hidePopover(event);
	};

	private hidePopoverByClickOutside = (event: MouseEvent): void => {
		if (this.host && !this.host.contains(event.target as HTMLElement)) {
			this.hidePopover(event);
		}
	};

	/* EventListener functions */
	private addListenersToBody(): void {
		const body = getDocument().body;
		body.addEventListener('keyup', this.hidePopoverByEscape);
		body.addEventListener('click', this.hidePopoverByClickOutside);
		document.scrollingElement?.addEventListener(
			'scroll',
			() => {
				void this.showPopover();
			},
			{ passive: true },
		);
	}
	private removeListenersToBody(): void {
		const body = getDocument().body;
		body.removeEventListener('keyup', this.hidePopoverByEscape);
		body.removeEventListener('click', this.hidePopoverByClickOutside);
		document.scrollingElement?.removeEventListener('scroll', () => {
			void this.showPopover();
		});
	}

	/* catchElement functions */
	private catchHostAndTriggerElement = (element: HTMLElement | null): void => {
		if (element) {
			this.host = element;
			this.triggerElement = element.previousElementSibling as HTMLElement | null;
		}
	};
	private catchPopoverElement = (element?: HTMLDivElement): void => {
		this.popoverElement = element;
	};
	private catchArrowElement = (element?: HTMLDivElement): void => {
		this.arrowElement = element;
	};

	public render(): JSX.Element {
		return (
			<Host ref={this.catchHostAndTriggerElement} class="kol-popover">
				<div
					class={clsx('kol-popover__content', { 'kol-popover__content--visible': this.state._visible })}
					ref={this.catchPopoverElement}
					hidden={!this.state._show}
				>
					<div class={clsx('kol-popover__arrow', `kol-popover__arrow--${this.state._align}`)} ref={this.catchArrowElement} />
					<slot />
				</div>
			</Host>
		);
	}

	/**
	 * Defines the alignment of the tooltip, popover or tabs in relation to the element.
	 */
	@Prop() public _align?: AlignPropType = 'top';

	/**
	 * Defines the callback functions for popover events.
	 */
	@Prop() public _on?: PopoverCallbacksPropType;

	/**
	 * Makes the element show up.
	 * @TODO: Change type back to `ShowPropType` after Stencil#4663 has been resolved.
	 */
	@Prop({ mutable: true, reflect: true }) public _show?: boolean = false;

	@State() public state: PopoverStates = {
		_align: 'top',
		_on: {},
		_show: false,
		_visible: false,
	};

	@Watch('_align')
	public validateAlign(value?: AlignPropType): void {
		validateAlign(this, value);
	}

	@Watch('_on')
	public validateOn(value?: PopoverCallbacksPropType): void {
		validatePopoverCallbacks(this, value);
	}

	@Watch('_show')
	public validateShow(value?: ShowPropType): void {
		validateShow(this, value);
		if (value) void this.showPopover();
	}

	public componentWillLoad(): void {
		this.validateAlign(this._align);
		this.validateShow(this._show);
	}
}
