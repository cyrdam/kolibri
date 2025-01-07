import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { KolButton, KolCard, KolModal } from '@public-ui/react';
import { SampleDescription } from '../SampleDescription';

export const ModalBasic: FC = () => {
	const [searchParams] = useSearchParams();
	const modalState = searchParams.get('show-modal') as string;
	const modalElement = useRef<HTMLKolModalElement>(null);
	const stackedModalElement = useRef<HTMLKolModalElement>(null);

	useEffect(() => {
		if (modalState === 'true') {
			modalElement.current?.openModal();
		}
	}, [modalState]);

	return (
		<>
			<SampleDescription>
				<p>
					KolModal renders content in a popover, disabling interactivity with elements behind it. In the sample, the modal can be opened and closed using the
					buttons &quot;Open modal&quot; and &quot;Close modal&quot;.
				</p>
			</SampleDescription>

			<div className="flex">
				<KolModal _label="Primary modal" _width="80%" ref={modalElement} _on={{ onClose: () => console.log('Modal closed') }} _variant="card">
					<KolCard _label="I am a modal.">
						<KolButton
							_label="Open stacked modal"
							className="mr"
							_on={{
								onClick: () => {
									stackedModalElement.current?.openModal();
								},
							}}
						/>

						<KolButton
							_label="Close modal"
							_on={{
								onClick: () => {
									modalElement.current?.closeModal();
								},
							}}
						/>
					</KolCard>
				</KolModal>

				<KolModal _label="Stacked modal" _width="80%" ref={stackedModalElement}>
					<KolCard _label="Stacked modal element">
						<KolButton
							_label="Close stacked modal"
							_on={{
								onClick: () => {
									stackedModalElement.current?.closeModal();
								},
							}}
						/>
					</KolCard>
				</KolModal>

				<KolButton
					_label="Open modal"
					_on={{
						onClick: () => {
							modalElement.current?.openModal();
						},
					}}
				/>
			</div>
		</>
	);
};
