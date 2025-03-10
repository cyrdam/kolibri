/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import type {
	KoliBriDataCompareFn,
	KoliBriPaginationButtonCallbacks,
	KoliBriSortDirection,
	KoliBriTableDataType,
	KoliBriTableHeaderCellWithLogic,
	KoliBriTableHeaders,
	KoliBriTablePaginationProps,
	LabelPropType,
	PaginationPositionPropType,
	SortEventPayload,
	Stringified,
	TableAPI,
	TableDataFootPropType,
	TableDataPropType,
	TableHeaderCells,
	TableSelectionPropType,
	TableStatefulCallbacksPropType,
	TableStates,
} from '../../schema';
import {
	devHint,
	emptyStringByArrayHandler,
	objectObjectHandler,
	parseJson,
	setState,
	validateLabel,
	validatePaginationPosition,
	validateTableData,
	validateTableDataFoot,
	validateTableSelection,
	validateTableStatefulCallbacks,
	watchString,
	watchValidator,
} from '../../schema';
import type { JSX } from '@stencil/core';
import { Component, Element, h, Host, Method, Prop, State, Watch } from '@stencil/core';

import { translate } from '../../i18n';
import { KolPaginationTag, KolTableStatelessWcTag } from '../../core/component-names';
import { dispatchDomEvent, KolEvent } from '../../utils/events';
import { Callback } from '../../schema/enums';

const PAGINATION_OPTIONS = [10, 20, 50, 100];

const paginationValidator = (value: unknown) => value === true || value === '' /* true */ || (typeof value === 'object' && value !== null);

type SortData = {
	label: string;
	key: string;
	compareFn: KoliBriDataCompareFn;
	direction: KoliBriSortDirection;
};

@Component({
	tag: 'kol-table-stateful',
	styleUrls: {
		default: './style.scss',
	},
	shadow: true,
})
export class KolTableStateful implements TableAPI {
	@Element() private readonly host?: HTMLKolTableStatelessWcElement;
	private tableWcRef?: HTMLKolTableStatelessWcElement;

	private readonly catchRef = (ref?: HTMLKolTableStatelessWcElement) => {
		this.tableWcRef = ref;
	};

	private sortData: SortData[] = [];
	private showPagination = false;
	private pageStartSlice = 0;
	private pageEndSlice = 10;
	private disableSort = false;

	/**
	 * Defines whether to allow multi sort.
	 */
	@Prop() public _allowMultiSort?: boolean;

	/**
	 * Defines the primary table data.
	 */
	@Prop() public _data!: Stringified<KoliBriTableDataType[]>;

	/**
	 * Defines the data for the table footer.
	 */
	@Prop() public _dataFoot?: Stringified<KoliBriTableDataType[]>;

	/**
	 * Defines the horizontal and vertical table headers.
	 */
	@Prop() public _headers!: Stringified<KoliBriTableHeaders>;

	/**
	 * Defines the visible or semantic label of the component (e.g. aria-label, label, headline, caption, summary, etc.).
	 */
	@Prop() public _label!: string;

	/**
	 * Defines the table min-width.
	 */
	@Prop() public _minWidth?: string;

	/**
	 * Defines whether to show the data distributed over multiple pages.
	 */
	@Prop() public _pagination?: boolean | Stringified<KoliBriTablePaginationProps>;
	/**
	 * Controls the position of the pagination.
	 */
	@Prop() public _paginationPosition?: PaginationPositionPropType = 'bottom';
	/**
	 * Defines how rows can be selected and the current selection.
	 */
	@Prop() public _selection?: TableSelectionPropType;
	/**
	 * Defines the callback functions for table events.
	 */
	@Prop() public _on?: TableStatefulCallbacksPropType;

	@State() public state: TableStates = {
		_allowMultiSort: false,
		_data: [],
		_dataFoot: [],
		_headers: {
			horizontal: [],
			vertical: [],
		},
		_label: '', // ⚠ required
		_pagination: {
			_page: 1,
			_pageSize: 10,
			_max: 0,
		},
		_sortedData: [],
		_paginationPosition: 'bottom',
	};

	@Watch('_allowMultiSort')
	public validateAllowMultiSort(value?: boolean): void {
		watchValidator(this, '_allowMultiSort', () => true, new Set(['boolean']), value, {
			defaultValue: false,
		});
	}

	@Watch('_data')
	public validateData(value?: TableDataPropType): void {
		validateTableData(this, value, {
			afterPatch: () => {
				// TODO: kein guter Hack (endless loop)
				setTimeout(this.updateSortedData);
			},
		});
	}

	@Watch('_dataFoot')
	public validateDataFoot(value?: TableDataFootPropType): void {
		validateTableDataFoot(this, value, {
			afterPatch: () => {
				setTimeout(this.updateSortedData);
			},
		});
	}

	@Watch('_paginationPosition')
	public validatePaginationPosition(value?: PaginationPositionPropType): void {
		validatePaginationPosition(this, value);
	}

	/**
	 * Handles sorting logic for table columns.
	 * If multi-sort is enabled (`_allowMultiSort`), multiple columns can be sorted at once.
	 * Otherwise, sorting is cleared when switching between columns.
	 */
	private changeCellSort(headerCell: KoliBriTableHeaderCellWithLogic) {
		if (typeof headerCell.compareFn === 'function') {
			if (!this.state._allowMultiSort && headerCell.key != this.sortData[0]?.key) {
				// clear when another column is sorted and multi sort is not allowed
				this.sortData = [];
			}

			const index = this.sortData.findIndex((value) => value.key === headerCell.key);
			if (index >= 0) {
				const settings = this.sortData[index];
				switch (settings.direction) {
					case 'ASC':
						settings.direction = 'DESC';
						break;
					case 'DESC':
						this.sortData.splice(index, 1);
						break;
					default:
						settings.direction = 'ASC';
						break;
				}
			} else if (headerCell.key) {
				this.sortData.push({
					label: headerCell.label,
					key: headerCell.key,
					compareFn: headerCell.compareFn,
					direction: 'ASC',
				});
			}

			this.updateSortedData();
		}
	}

	@Watch('_headers')
	public validateHeaders(value?: Stringified<KoliBriTableHeaders>): void {
		/**
		 * - es darf maximal ein Header als primary markiert werden (last win)
		 * - der primary-Header entscheidet implizit über _order und _orientation
		 *   - primary-Headers müssen das key-Property setzen
		 *   - nicht primary-Headers müssen das key-Property nicht setzen (wird ignoriert)
		 *   - _order: wird durch den primary-Header geregelt
		 *   - _orientation: wird durch den primary-Header geregelt
		 * - sobald ein Header sortierbar ist, darf es nur noch entweder horizontale
		 *   oder vertikale Header geben, aber nicht mehr beides
		 */
		emptyStringByArrayHandler(value, () => {
			objectObjectHandler(value, () => {
				try {
					value = parseJson<KoliBriTableHeaders>(value);
					// eslint-disable-next-line no-empty
				} catch (e) {
					// value behält den ursprünglichen Wert
				}
				watchValidator(this, '_headers', (value): boolean => typeof value === 'object' && value !== null, new Set(['KoliBriTableHeaders']), value, {
					hooks: {
						beforePatch: (nextValue: unknown) => {
							const applySort = (headers: KoliBriTableHeaderCellWithLogic[]) => {
								let hasSortedCells = false;
								headers.forEach((cell) => {
									const key = cell.key;
									if (!key) {
										return;
									}
									const sortDirection = cell.sortDirection;
									if (sortDirection === 'ASC' || sortDirection === 'DESC') {
										if (typeof cell.compareFn === 'function') {
											if (this.state._allowMultiSort || this.sortData.length === 0) {
												this.sortData.push({ label: cell.label, key, compareFn: cell.compareFn, direction: sortDirection });
											}
											hasSortedCells = true;
										}
									}
								});
								if (hasSortedCells) {
									setTimeout(() => this.updateSortedData());
								}
							};

							const headers: KoliBriTableHeaders = nextValue as KoliBriTableHeaders;
							headers.horizontal?.forEach(applySort);
							headers.vertical?.forEach(applySort);

							if (headers.horizontal && headers.vertical && headers.horizontal?.length > 0 && headers.vertical?.length > 0) {
								this.disableSort = true;
								devHint(
									`Table: You can not sort the table data, if horizontal and vertical headers are defined at the same time. (https://github.com/public-ui/kolibri/issues/2372)`,
								);
							}
						},
					},
				});
			});
		});
	}

	@Watch('_label')
	public validateLabel(value?: LabelPropType): void {
		validateLabel(this, value, {
			required: true,
		});
	}

	@Watch('_minWidth')
	public validateMinWidth(value?: string): void {
		watchString(this, '_minWidth', value, {
			defaultValue: undefined,
		});
	}

	@Watch('_selection')
	public validateSelection(value?: TableSelectionPropType): void {
		validateTableSelection(this, value);
	}
	@Watch('_on')
	public validateOn(value?: TableStatefulCallbacksPropType): void {
		validateTableStatefulCallbacks(this, value);
	}

	private readonly handlePagination: KoliBriPaginationButtonCallbacks = {
		onClick: (event: Event, page: number) => {
			if (typeof this.state._pagination._on?.onClick === 'function') {
				this.state._pagination._on.onClick(event, page);
			}
			setState(this, '_pagination', {
				...this.state._pagination,
				_page: page,
			});
		},
		onChangePage: (event: Event, page: number) => {
			if (typeof this.state._pagination._on?.onChangePage === 'function') {
				this.state._pagination._on.onChangePage(event, page);
			}
			setState(this, '_pagination', {
				...this.state._pagination,
				_page: page,
			});
		},
		onChangePageSize: (event: Event, pageSize: number) => {
			if (typeof this.state._pagination._on?.onChangePageSize === 'function') {
				this.state._pagination._on.onChangePageSize(event, pageSize);
			}
			setState(this, '_pagination', {
				...this.state._pagination,
				_pageSize: pageSize,
			});
			setState(this, '_pageSize', pageSize);
		},
	};

	@Watch('_pagination')
	public validatePagination(value?: boolean | Stringified<KoliBriTablePaginationProps>): void {
		try {
			value = parseJson<boolean | KoliBriTablePaginationProps>(value);
			// eslint-disable-next-line no-empty
		} catch (e) {
			// value behält den ursprünglichen Wert
		}

		this.showPagination = paginationValidator(value);

		watchValidator<boolean | Stringified<KoliBriTablePaginationProps>>(
			this,
			'_pagination',
			paginationValidator,
			new Set(['boolean', 'KoliBriTablePagination']),
			value,
			{
				defaultValue: {
					_page: 1,
					_pageSize: 10,
					_max: 0,
				},
			},
		);
	}

	private onSelectionChange = (event: Event): void => {
		/* Stop propagation for selectionChange event from table-stateless component because table-stateful emits its own selectionChange event. */
		event.stopPropagation();
	};

	public componentDidLoad(): void {
		this.tableWcRef?.addEventListener(KolEvent.selectionChange, this.onSelectionChange);
	}

	public disconnectedCallback(): void {
		this.tableWcRef?.removeEventListener(KolEvent.selectionChange, this.onSelectionChange);
	}

	public componentWillLoad(): void {
		this.validateAllowMultiSort(this._allowMultiSort);
		this.validateData(this._data);
		this.validateDataFoot(this._dataFoot);
		this.validateHeaders(this._headers);
		this.validateLabel(this._label);
		this.validateMinWidth(this._minWidth);
		this.validatePagination(this._pagination);
		this.validatePaginationPosition(this._paginationPosition);
		this.validateSelection(this._selection);
		this.validateOn(this._on);
	}

	private selectDisplayedData(data: KoliBriTableDataType[], pageSize: number, page: number): KoliBriTableDataType[] {
		if (typeof pageSize === 'number' && pageSize > 0 && typeof page === 'number' && page > 0) {
			this.pageStartSlice = pageSize * (page - 1);
			this.pageEndSlice = pageSize * page > data.length ? data.length : pageSize * page;
			return data.slice(this.pageStartSlice, this.pageEndSlice);
		} else {
			this.pageStartSlice = 0;
			this.pageEndSlice = data.length;
			return data;
		}
	}

	private updateSortedData = () => {
		if (this.disableSort) {
			setState(this, '_sortedData', this.state._data);
			return;
		}

		let sortedData: KoliBriTableDataType[] = this.state._data;
		if (this.sortData.length > 0) {
			sortedData = this.state._data.sort((a: KoliBriTableDataType, b: KoliBriTableDataType) => {
				for (let index = 0; index < this.sortData.length; index++) {
					const data = this.sortData[index];
					const result = data.compareFn(a, b);
					if (result !== 0) {
						return data.direction === 'ASC' ? result : -result;
					}
				}
				return 0;
			});
		}
		setState(this, '_sortedData', sortedData);
	};

	/**
	 * Renders the pagination controls for the table, showing the current visible data range
	 * and providing navigation between different pages.
	 *
	 * @returns {JSX.Element} The rendered pagination controls including page range and navigation.
	 */
	private renderPagination(): JSX.Element {
		return (
			<div class={`kol-table-stateful__pagination kol-table-stateful__pagination--${this.state._paginationPosition}`}>
				<span>
					{translate('kol-table-visible-range', {
						placeholders: {
							start: this.pageEndSlice > 0 ? (this.pageStartSlice + 1).toString() : '0',
							end: this.pageEndSlice.toString(),
							total:
								this.state._pagination && this.state._pagination._max > 0
									? this.state._pagination._max.toString()
									: Array.isArray(this.state._data)
										? this.state._data.length.toString()
										: '0',
						},
					})}
				</span>
				<div class="kol-table-stateful__pagination-wrapper">
					<KolPaginationTag
						class="test"
						_boundaryCount={this.state._pagination._boundaryCount}
						_customClass={this.state._pagination._customClass}
						_on={this.handlePagination}
						_page={this.state._pagination._page}
						_pageSize={this.state._pagination._pageSize}
						_pageSizeOptions={this.state._pagination._pageSizeOptions || PAGINATION_OPTIONS}
						_siblingCount={this.state._pagination._siblingCount}
						_tooltipAlign="bottom"
						_max={this.state._pagination._max || this.state._pagination._max || this.state._data.length}
						_label={translate('kol-table-pagination-label', { placeholders: { label: this.state._label } })}
					></KolPaginationTag>
				</div>
			</div>
		);
	}

	private getHeaderCellSortState(headerCell: KoliBriTableHeaderCellWithLogic): KoliBriSortDirection | undefined {
		if (!this.disableSort && typeof headerCell.compareFn === 'function') {
			if (headerCell.key) {
				const data = this.sortData.find((value) => value.key === headerCell.key);
				if (data?.direction) {
					return data.direction;
				}
			}
			return 'NOS';
		}
	}

	private handleSort({ key }: SortEventPayload) {
		const headerCell = [...(this.state._headers.horizontal || []).flat(), ...(this.state._headers.vertical || []).flat()].find((cell) => cell.key === key);
		if (headerCell) {
			this.changeCellSort(headerCell);
		}
	}

	private getSelectedData(selectedKeys: string[] | string): null | KoliBriTableDataType | KoliBriTableDataType[] {
		const selection = this.state._selection;
		if (selection) {
			const keyPropertyName = selection.keyPropertyName ?? 'id';
			const data = this.state._sortedData.filter((item) => selectedKeys.includes(item[keyPropertyName] as string));
			if (selection?.multiple === false) {
				return data[0];
			}

			if (keyPropertyName) return data;
		}
		return null;
	}
	private handleSelectionChange(event: Event, value: string[] | string): void {
		const selection = this.state._selection;
		if (selection)
			this.state = {
				...this.state,
				_selection: {
					...selection,
					selectedKeys: typeof value === 'object' ? value : [value],
				},
			};
		const selectedData = this.getSelectedData(value);

		if (typeof this.state._on?.[Callback.onSelectionChange] === 'function') {
			this.state._on[Callback.onSelectionChange](event, selectedData);
		}
		if (this.host) {
			dispatchDomEvent(this.host, KolEvent.selectionChange, selectedData);
		}
	}

	@Method()
	// eslint-disable-next-line @typescript-eslint/require-await
	public async getSelection(): Promise<KoliBriTableDataType[] | KoliBriTableDataType | null> {
		const selectedKeys: string[] = this.state._selection?.selectedKeys || [];
		return this.getSelectedData(selectedKeys);
	}

	public render(): JSX.Element {
		const displayedData: KoliBriTableDataType[] = this.selectDisplayedData(
			this.state._sortedData,
			this.showPagination ? (this.state._pagination?._pageSize ?? 10) : this.state._sortedData.length,
			this.state._pagination._page || 1,
		);
		const paginationTop = this._paginationPosition === 'top' || this._paginationPosition === 'both' ? this.renderPagination() : null;
		const paginationBottom = this._paginationPosition === 'bottom' || this._paginationPosition === 'both' ? this.renderPagination() : null;

		const headerCells: TableHeaderCells = {
			horizontal: this.state._headers.horizontal?.map((row) => row.map((cell) => ({ ...cell, sortDirection: this.getHeaderCellSortState(cell) }))),
			vertical: this.state._headers.vertical?.map((column) => column.map((cell) => ({ ...cell, sortDirection: this.getHeaderCellSortState(cell) }))),
		};
		return (
			<Host class="kol-table-stateful">
				{this.pageEndSlice > 0 && this.showPagination && paginationTop}
				<KolTableStatelessWcTag
					ref={this.catchRef}
					_data={displayedData}
					_headerCells={headerCells}
					_label={this.state._label}
					_dataFoot={this.state._dataFoot}
					_minWidth={this.state._minWidth}
					_on={{
						onSort: (_: MouseEvent, payload: SortEventPayload) => {
							this.handleSort(payload);
						},
						onSelectionChange: (event: Event, value: string[] | string) => {
							this.handleSelectionChange(event, value);
						},
					}}
					_selection={this.state._selection}
				/>
				{this.pageEndSlice > 0 && this.showPagination && paginationBottom}
			</Host>
		);
	}
}
