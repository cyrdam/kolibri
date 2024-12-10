import clsx from 'clsx';
import type { AlertPropType, HideErrorPropType, IdPropType, InternMsgPropType } from '../../schema';
import type { FunctionalComponent } from '@stencil/core';
import { h } from '@stencil/core';
import KolAlertFc from '../Alert';
import type { JSXBase } from '@stencil/core/internal';

type FormFieldMsgProps = JSXBase.HTMLAttributes<HTMLDivElement> & {
	alert?: AlertPropType;
	msg?: InternMsgPropType;
	hideError?: HideErrorPropType;
	id: IdPropType;
};

const FormFieldMsgFc: FunctionalComponent<FormFieldMsgProps> = ({ alert, msg, hideError, id, class: classNames, ...other }) => (
	<KolAlertFc
		/**
		 * This message is read out by screen readers if the input field
		 * refers to the message using the <code>aria-describedby</code>
		 * attribute. It also does this if <code>aria-hidden=true</code>
		 * is set.
		 */
		id={`${id}-error`}
		alert={alert}
		type="error"
		class={clsx(
			'kol-form-field__msg',
			{
				error: true,
				'visually-hidden': hideError === true,
			},
			classNames,
		)}
		{...msg}
		{...other}
		aria-hidden="true"
	>
		{msg?.description || undefined}
	</KolAlertFc>
);

export default FormFieldMsgFc;
