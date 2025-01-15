import React, { forwardRef } from 'react';
import { KolInputEmail } from '@public-ui/react';
import type { Components } from '@public-ui/components';

import { ERROR_MSG, HINT_MSG } from '../../../shares/constants';

export const InputEmailCases = forwardRef<HTMLKolInputEmailElement, Components.KolInputEmail>(function InputEmailCases(props, ref) {
	return (
		<div className="grid gap-4">
			<div className="black-background">
				<KolInputEmail {...props} _required _value="test@mail.de" _msg={{ _type: 'error', _description: ERROR_MSG }} _label="E-Mail (Black background test)" />
			</div>
			<KolInputEmail
				{...props}
				ref={ref}
				_accessKey="M"
				_placeholder="elke@mustermann.de"
				_suggestions="['test1@mail.de', 'test2@mail.de', 'test3@mail.de']"
				_label="E-Mail (list)"
				_hint={HINT_MSG}
				_msg={{ _type: 'error', _description: ERROR_MSG }}
				_touched
				_icons={{
					left: {
						icon: 'codicon codicon-arrow-left',
					},
					right: {
						icon: 'codicon codicon-arrow-right',
					},
				}}
			/>
			<KolInputEmail {...props} _msg={{ _type: 'info', _description: 'Just a hint' }} _label="E-Mail" />
			<KolInputEmail {...props} _msg={{ _type: 'warning', _description: 'Small warning' }} _label="E-Mail" />
			<KolInputEmail {...props} _msg={{ _type: 'success', _description: 'Success message' }} _label="E-Mail" />
			<KolInputEmail {...props} _disabled _value="test@mail.de" _label="E-Mail (Disabled)" />
			<KolInputEmail {...props} _readOnly _value="test@mail.de" _label="E-Mail (Readonly)" />
			<KolInputEmail {...props} _value="test@mail.de" _label="With access key" _accessKey="c" />
			<KolInputEmail {...props} _value="test@mail.de" _label="With short key" _shortKey="s" />
		</div>
	);
});
