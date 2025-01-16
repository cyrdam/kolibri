import type { FC } from 'react';
import React, { useRef, useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { HideMenusContext } from '../../shares/HideMenusContext';
import type { AlignPropType } from '@public-ui/components';
import { KolDrawer, KolButton, KolBadge } from '@public-ui/react';
import { SampleDescription } from '../SampleDescription';

import { DrawerRadioAlign } from './partials/align';

export const DrawerBasic: FC = () => {
	const [searchParams] = useSearchParams();
	const defaultAlign = searchParams.get('align') as AlignPropType;
	const hideMenus = useContext(HideMenusContext);
	const drawerElement = useRef<HTMLKolDrawerElement>(null);
	const drawerModalElement = useRef<HTMLKolDrawerElement>(null);
	const [align, setAlign] = useState<AlignPropType>(defaultAlign || 'left');
	useEffect(() => {
		if (defaultAlign) {
			drawerModalElement.current?.open();
		}
	}, [defaultAlign]);
	return (
		<>
			{!hideMenus && <KolBadge className="block mb-3" _label="Component is a DRAFT - Don't use in production yet." _color="#db5461" />}
			<SampleDescription>
				<p>
					KolDrawer shows a dialog attached to one of the sides of the viewport, when opened. This sample illustrates the four alignments and the modal- and
					non-modal modes.
				</p>
			</SampleDescription>

			<DrawerRadioAlign value={align} onChange={(_, value) => setAlign(value as AlignPropType)} />
			<div className="flex flex-wrap gap-4">
				<KolDrawer ref={drawerElement} _label="I am a drawer" _align={align} _on={{ onClose: () => console.log('Drawer onClose triggered!') }}>
					<p>
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
						voluptua.
					</p>
					<KolButton _label="Close drawer" _on={{ onClick: () => drawerElement.current?.close() }} />
				</KolDrawer>
				<KolButton _label="Open drawer" _on={{ onClick: () => drawerElement.current?.open() }} />
				<KolDrawer ref={drawerModalElement} _align={align} _label="I am a Drawer Modal" _on={{ onClose: () => console.log('Drawer Modal onClose triggered!') }}>
					<p>
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
						voluptua.
					</p>
					<KolButton _label="Close drawer modal" _on={{ onClick: () => drawerModalElement.current?.close() }} />
				</KolDrawer>
				<KolButton _label="Open drawer as modal" _on={{ onClick: () => drawerModalElement.current?.open() }} />
			</div>
		</>
	);
};
