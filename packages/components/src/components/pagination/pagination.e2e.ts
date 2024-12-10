import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';
import { KolEvent } from '../../utils/events';

test.describe('kol-pagination', () => {
	test.beforeEach(async ({ page }) => {
		await page.setContent(`
			<kol-pagination
				_max="40"
				_page="1"
				_siblingCount="0"
				_boundaryCount="2"
				_label="Pagination"
				_page-size-options="[10, 20]"
			/>
		`);
	});

	test.describe('Callbacks', () => {
		['onClick', 'onChangePage'].forEach((callbackName) => {
			test(`it calls the ${callbackName} callback when a page is clicked`, async ({ page }) => {
				const callbackPromise = page.locator('kol-pagination').evaluate((element: HTMLKolPaginationElement, callbackName) => {
					return new Promise<number>((resolve) => {
						element._on = {
							[callbackName]: (_: Event, page: number) => {
								resolve(page);
							},
						};
					});
				}, callbackName);
				await page.getByRole('button', { name: 'Seite 2' }).click();

				await expect(callbackPromise).resolves.toBe(2);
			});
		});

		test('it calls the onChangePageSize callback when the page size is changed', async ({ page }) => {
			const callbackPromise = page.locator('kol-pagination').evaluate((element: HTMLKolPaginationElement) => {
				return new Promise<number>((resolve) => {
					element._on = {
						onChangePageSize: (_: Event, pageSize: number) => {
							resolve(pageSize);
						},
					};
				});
			});
			await page.waitForChanges();
			await page.locator('select').selectOption('-1'); // choose second option (20)

			await expect(callbackPromise).resolves.toBe(20);
		});
	});

	test.describe('DOM events', () => {
		[KolEvent.click, KolEvent.changePage].forEach((eventName) => {
			test(`it emits ${eventName} when a page is clicked`, async ({ page }) => {
				const eventPromise = page.locator('kol-pagination').evaluate((element: HTMLKolPaginationElement, eventName) => {
					return new Promise<void>((resolve) => {
						element.addEventListener(eventName, () => {
							resolve();
						});
					});
				}, eventName);
				await page.getByRole('button', { name: 'Seite 2' }).click();

				await expect(eventPromise).resolves.toBeUndefined();
			});
		});

		test('it emits changePageSize when the page size is changed', async ({ page }) => {
			const eventPromise = page.locator('kol-pagination').evaluate((element: HTMLKolPaginationElement, KolEvent) => {
				return new Promise<void>((resolve) => {
					element.addEventListener(KolEvent.changePageSize, () => {
						resolve();
					});
				});
			}, KolEvent);
			await page.waitForChanges();
			await page.locator('select').selectOption('-1'); // choose second option (20)

			await expect(eventPromise).resolves.toBeUndefined();
		});
	});
});
