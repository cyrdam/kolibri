import type { Generic } from 'adopted-style-sheets';
import { watchString } from '../utils';
import type { AccessKeyPropType } from './access-key';
import type { ShortKeyPropType } from './short-key';

/* types */
export type BadgeTextPropType = string;

/**
 * Defines the elements badge text.
 */
export type PropBadgeText = {
	badgeText: BadgeTextPropType;
};

/* validator */
export const validateBadgeText = (component: Generic.Element.Component, value?: AccessKeyPropType | ShortKeyPropType): void => {
	watchString(component, '_badgeText', value);
};
