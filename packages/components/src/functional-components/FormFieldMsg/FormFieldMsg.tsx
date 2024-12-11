import clsx from 'clsx';
import type { AlertPropType, HideErrorPropType, IdPropType, MsgPropType } from '../../schema';
import type { FunctionalComponent } from '@stencil/core';
import { h } from '@stencil/core';
import KolAlertFc from '../Alert';

type FormFieldMsgProps = {
	_alert?: AlertPropType;
	_msg?: MsgPropType;
	_hideError?: HideErrorPropType;
	_id: IdPropType;
};

const FormFieldMsgFc: FunctionalComponent<FormFieldMsgProps> = ({ _alert, _msg, _hideError, _id }) => (
	<KolAlertFc
		id={`${_id}-error`}
		alert={_alert}
		type="error"
		class={clsx({
			error: true,
			'visually-hidden': _hideError === true,
		})}
		{..._msg}
	>
		{_msg?._description || undefined}
	</KolAlertFc>
);

export default FormFieldMsgFc;
