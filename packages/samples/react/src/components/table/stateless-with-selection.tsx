import type { FC } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import { KolButton, KolTableStateless, createReactRenderElement } from '@public-ui/react';
import { SampleDescription } from '../SampleDescription';
import type { KoliBriTableSelection } from '@public-ui/components';
import { getRoot } from '../../shares/react-roots';
import type { KoliBriTableCell } from '@public-ui/components';
import { useToasterService } from '../../hooks/useToasterService';

const DATA = [
	{ id: '1001', name: 'Foo Bar', internalIdentifier: `AAA1001` },
	{ id: '1002', name: 'Foo Baz', internalIdentifier: `AAA1002` },
];
type Data = (typeof DATA)[0];

function KolButtonWrapper({ label }: { label: string }) {
	const { dummyClickEventHandler } = useToasterService();

	const dummyEventHandler = {
		onClick: dummyClickEventHandler,
	};

	return <KolButton _label={label} _on={dummyEventHandler} />;
}

export const TableStatelessWithSelection: FC = () => {
	const [selectedKeys, setSelectedKeys] = useState(['AAA1002']);

	const selection: KoliBriTableSelection = {
		label: (row) => `Selection for ${(row as Data).name}`,
		selectedKeys,
		keyPropertyName: 'internalIdentifier',
	};

	const kolTableStatelessRef = useRef<HTMLKolTableStatelessElement>(null);

	const handleSelectionChangeEvent = ({ detail: selection }: { detail: string[] }) => {
		console.log('Selection change via event', selection);
	};
	const handleSelectionChangeCallback = (_event: Event, selection: string[] | string) => {
		console.log('Selection change via callback', selection);
		setSelectedKeys(typeof selection === 'string' ? [selection] : selection);
	};

	useEffect(() => {
		// @ts-expect-error https://github.com/Microsoft/TypeScript/issues/28357
		kolTableStatelessRef.current?.addEventListener('kol-selection-change', handleSelectionChangeEvent);

		return () => {
			// @ts-expect-error https://github.com/Microsoft/TypeScript/issues/28357
			kolTableStatelessRef.current?.removeEventListener('kol-selection-change', handleSelectionChangeEvent);
		};
	}, [kolTableStatelessRef]);

	const renderButton = (element: HTMLElement, cell: KoliBriTableCell) => {
		getRoot(createReactRenderElement(element)).render(<KolButtonWrapper label={`Click ${cell.data?.id}`} />);
	};

	return (
		<>
			<SampleDescription>
				<p>This sample shows KolTableStateless with checkboxes for selection enabled.</p>
			</SampleDescription>

			<section className="w-full">
				<KolTableStateless
					_label="Table with selection checkboxes"
					_headerCells={{
						horizontal: [
							[
								{ key: 'id', label: '#ID', textAlign: 'left' },
								{ key: 'name', label: 'Name', textAlign: 'left' },
								{ key: 'action', label: 'Action', textAlign: 'left', render: renderButton },
							],
						],
					}}
					_data={DATA}
					_selection={selection}
					_on={{ onSelectionChange: handleSelectionChangeCallback }}
					className="block"
					style={{ maxWidth: '600px' }}
					ref={kolTableStatelessRef}
				/>
			</section>
		</>
	);
};
