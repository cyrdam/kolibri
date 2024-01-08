import { useEffect } from 'react';
import { ErrorListPropType } from '@public-ui/components';

export function createErrorList(formikErrors: Record<string, string>): ErrorListPropType[] {
	return Object.keys(formikErrors).map((fieldName) => ({
		message: formikErrors[fieldName],
		selector: `#field-${fieldName}`,
	}));
}
