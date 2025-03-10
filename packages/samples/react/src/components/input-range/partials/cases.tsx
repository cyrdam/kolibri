import React, { forwardRef } from 'react';
import { KolInputRange } from '@public-ui/react';
import type { Components } from '@public-ui/components';

import { ERROR_MSG, HINT_MSG } from '../../../shares/constants';

export const InputRangeCases = forwardRef<HTMLKolInputRangeElement, Components.KolInputRange>(function InputRangeCases(props, ref) {
	return (
		<div className="grid gap-4">
			<div className="black-background">
				<KolInputRange
					{...props}
					_min={0}
					_max={50}
					_msg={{ _type: 'error', _description: ERROR_MSG }}
					_label="Slider (Black background test)"
					_icons={{
						left: {
							icon: 'codicon codicon-arrow-left',
						},
						right: {
							icon: 'codicon codicon-arrow-right',
						},
					}}
					_touched
				/>
			</div>
			<KolInputRange
				{...props}
				ref={ref}
				_accessKey="F"
				_min={0}
				_max={50}
				_step={10}
				_hint={HINT_MSG}
				_msg={{ _type: 'error', _description: ERROR_MSG }}
				_label="Slider with error"
				_touched
			/>
			<KolInputRange {...props} _msg={{ _type: 'info', _description: 'Just a hint' }} _label="Slider" />
			<KolInputRange {...props} _msg={{ _type: 'warning', _description: 'Small warning' }} _label="Slider" />
			<KolInputRange {...props} _msg={{ _type: 'success', _description: 'Success message' }} _label="Slider" />
			<KolInputRange {...props} _disabled _min={0} _max={50} _label="Slider (disabled)" />
			<KolInputRange {...props} _min={0} _max={50} _label="With access key" _accessKey="c" />
			<KolInputRange {...props} _min={0} _max={50} _label="With short key" _shortKey="s" />
		</div>
	);
});
