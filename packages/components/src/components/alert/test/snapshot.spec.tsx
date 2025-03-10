import { KolAlertTag } from '../../../core/component-names';
import type { AlertProps } from '../../../schema';
import { executeSnapshotTests } from '../../../utils/testing';

import { KolAlert } from '../shadow';
import { KolAlertWc } from '../component';

const baseObject = { _label: 'Überschrift' };
const baseArray = [true, false].map((_alert) => ({ ...baseObject, _alert }));

function buildByType(_type: 'default' | 'error' | 'info' | 'success' | 'warning') {
	const nextArray: AlertProps[] = [];
	[1, 2, 3, 4, 5, 6].forEach((_level) => {
		nextArray.push(...baseArray.map((o) => ({ ...o, _level, _type }) as AlertProps));
	});

	return nextArray;
}

executeSnapshotTests<AlertProps>(
	KolAlertTag,
	[KolAlert, KolAlertWc],
	[...buildByType('default'), ...buildByType('error'), ...buildByType('info'), ...buildByType('success'), ...buildByType('warning')],
);
