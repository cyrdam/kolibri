import { Theme } from '@a11y-ui/core';

enum TagEnum {
	'example',
}

enum KeyEnum {}

export const KoliBri = new Theme<'my', keyof typeof KeyEnum, keyof typeof TagEnum>('my', KeyEnum, TagEnum);
