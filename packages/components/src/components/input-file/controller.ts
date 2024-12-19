import type { Generic } from 'adopted-style-sheets';

import type { InputFileProps, InputFileWatches } from '../../schema';
import { watchBoolean, watchString } from '../../schema';

import { InputIconController } from '../@deprecated/input/controller-icon';

export class InputFileController extends InputIconController implements InputFileWatches {
	protected readonly component: Generic.Element.Component & InputFileProps;

	public constructor(component: Generic.Element.Component & InputFileProps, name: string, host?: HTMLElement) {
		super(component, name, host);
		this.component = component;
	}

	public validateAccept(value?: string): void {
		watchString(this.component, '_accept', value);
	}

	public validateMultiple(value?: boolean): void {
		watchBoolean(this.component, '_multiple', value);
	}

	public validateRequired(value?: boolean): void {
		watchBoolean(this.component, '_required', value);
	}

	public componentWillLoad(): void {
		super.componentWillLoad();
		this.validateAccept(this.component._accept);
		this.validateMultiple(this.component._multiple);
		this.validateRequired(this.component._required);
	}
}
