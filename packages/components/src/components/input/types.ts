import type { Generic } from 'adopted-style-sheets';

import type {
	ButtonProps,
	KoliBriHorizontalIcons,
	MsgPropType,
	PropAccessKey,
	PropDisabled,
	PropHasCounter,
	PropHideMsg,
	PropHideLabel,
	PropId,
	PropLabelWithExpertSlot,
	PropReadOnly,
	PropRequired,
	PropShortKey,
	PropSuggestions,
	PropSyncValueBySelector,
	PropTooltipAlign,
	PropTouched,
	Stringified,
} from '../../schema';

type RequiredProps = PropId & PropLabelWithExpertSlot;
type OptionalProps = {
	currentLength: number;
	hint: string;
	icons: KoliBriHorizontalIcons;
	maxLength: number;
	msg: MsgPropType;
	slotName: string;
	smartButton: Stringified<ButtonProps>;
} & PropAccessKey &
	PropDisabled &
	PropHasCounter &
	PropHideMsg &
	PropHideLabel &
	PropReadOnly &
	PropRequired &
	PropShortKey &
	PropSuggestions &
	PropSyncValueBySelector &
	PropTooltipAlign &
	PropTouched;

export type Props = Generic.Element.Members<RequiredProps, OptionalProps>;
