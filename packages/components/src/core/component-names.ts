export let KolAbbrTag = 'kol-abbr' as const;
export let KolAccordionTag = 'kol-accordion' as const;
export let KolAlertTag = 'kol-alert' as const;
export let KolAlertWcTag = 'kol-alert-wc' as const;
export let KolAvatarTag = 'kol-avatar' as const;
export let KolAvatarWcTag = 'kol-avatar-wc' as const;
export let KolBadgeTag = 'kol-badge' as const;
export let KolBreadcrumbTag = 'kol-breadcrumb' as const;
export let KolButtonLinkTag = 'kol-button-link' as const;
export let KolButtonTag = 'kol-button' as const;
export let KolButtonWcTag = 'kol-button-wc' as const;
export let KolCardTag = 'kol-card' as const;
export let KolComboboxTag = 'kol-combobox' as const;
export let KolDetailsTag = 'kol-details' as const;
export let KolDrawerTag = 'kol-drawer' as const;
export let KolFormTag = 'kol-form' as const;
export let KolHeadingTag = 'kol-heading' as const;
export let KolIconTag = 'kol-icon' as const;
export let KolImageTag = 'kol-image' as const;
export let KolIndentedTextTag = 'kol-indented-text' as const;
export let KolIndentedTextWcTag = 'kol-indented-text-wc' as const;
export let KolInputCheckboxTag = 'kol-input-checkbox' as const;
export let KolInputColorTag = 'kol-input-color' as const;
export let KolInputDateTag = 'kol-input-date' as const;
export let KolInputEmailTag = 'kol-input-email' as const;
export let KolInputFileTag = 'kol-input-file' as const;
export let KolInputNumberTag = 'kol-input-number' as const;
export let KolInputPasswordTag = 'kol-input-password' as const;
export let KolInputRadioTag = 'kol-input-radio' as const;
export let KolInputRangeTag = 'kol-input-range' as const;
export let KolInputTag = 'kol-input' as const;
export let KolInputTextTag = 'kol-input-text' as const;
export let KolKolibriTag = 'kol-kolibri' as const;
export let KolLinkButtonTag = 'kol-link-button' as const;
export let KolLinkGroupTag = 'kol-link-group' as const;
export let KolLinkTag = 'kol-link' as const;
export let KolLinkWcTag = 'kol-link-wc' as const;
export let KolLogoTag = 'kol-logo' as const;
export let KolModalTag = 'kol-modal' as const;
export let KolNavTag = 'kol-nav' as const;
export let KolPaginationTag = 'kol-pagination' as const;
export let KolPopoverWcTag = 'kol-popover-wc' as const;
export let KolProgressTag = 'kol-progress' as const;
export let KolQuoteTag = 'kol-quote' as const;
export let KolSelectTag = 'kol-select' as const;
export let KolSingleSelectTag = 'kol-single-select' as const;
export let KolSkipNavTag = 'kol-skip-nav' as const;
export let KolSpinTag = 'kol-spin' as const;
export let KolSplitButtonTag = 'kol-split-button' as const;
export let KolSymbolTag = 'kol-symbol' as const;
export let KolTableStatefulTag = 'kol-table-stateful';
export let KolTableStatelessTag = 'kol-table-stateless' as const;
export let KolTableStatelessWcTag = 'kol-table-stateless-wc' as const;
export let KolTableTag = 'kol-table' as const;
export let KolTabsTag = 'kol-tabs' as const;
export let KolTextareaTag = 'kol-textarea' as const;
export let KolToastContainerTag = 'kol-toast-container' as const;
export let KolToolbarTag = 'kol-toolbar' as const;
export let KolTooltipWcTag = 'kol-tooltip-wc' as const;
export let KolTreeItemTag = 'kol-tree-item' as const;
export let KolTreeItemWcTag = 'kol-tree-item-wc' as const;
export let KolTreeTag = 'kol-tree' as const;
export let KolTreeWcTag = 'kol-tree-wc' as const;
export let KolVersionTag = 'kol-version' as const;

export const setCustomTagNames = (transformTagName: (tagName: string) => string) => {
	KolAbbrTag = transformTagName(KolAbbrTag as string) as 'kol-abbr';
	KolAccordionTag = transformTagName(KolAccordionTag as string) as 'kol-accordion';
	KolAlertTag = transformTagName(KolAlertTag as string) as 'kol-alert';
	KolAlertWcTag = transformTagName(KolAlertWcTag as string) as 'kol-alert-wc';
	KolAvatarTag = transformTagName(KolAvatarTag as string) as 'kol-avatar';
	KolAvatarWcTag = transformTagName(KolAvatarWcTag as string) as 'kol-avatar-wc';
	KolBadgeTag = transformTagName(KolBadgeTag as string) as 'kol-badge';
	KolBreadcrumbTag = transformTagName(KolBreadcrumbTag as string) as 'kol-breadcrumb';
	KolButtonLinkTag = transformTagName(KolButtonLinkTag as string) as 'kol-button-link';
	KolButtonTag = transformTagName(KolButtonTag as string) as 'kol-button';
	KolButtonWcTag = transformTagName(KolButtonWcTag as string) as 'kol-button-wc';
	KolCardTag = transformTagName(KolCardTag as string) as 'kol-card';
	KolComboboxTag = transformTagName(KolComboboxTag as string) as 'kol-combobox';
	KolDetailsTag = transformTagName(KolDetailsTag as string) as 'kol-details';
	KolDrawerTag = transformTagName(KolDrawerTag as string) as 'kol-drawer';
	KolFormTag = transformTagName(KolFormTag as string) as 'kol-form';
	KolHeadingTag = transformTagName(KolHeadingTag as string) as 'kol-heading';
	KolIconTag = transformTagName(KolIconTag as string) as 'kol-icon';
	KolImageTag = transformTagName(KolImageTag as string) as 'kol-image';
	KolIndentedTextTag = transformTagName(KolIndentedTextTag as string) as 'kol-indented-text';
	KolIndentedTextWcTag = transformTagName(KolIndentedTextWcTag as string) as 'kol-indented-text-wc';
	KolInputCheckboxTag = transformTagName(KolInputCheckboxTag as string) as 'kol-input-checkbox';
	KolInputColorTag = transformTagName(KolInputColorTag as string) as 'kol-input-color';
	KolInputDateTag = transformTagName(KolInputDateTag as string) as 'kol-input-date';
	KolInputEmailTag = transformTagName(KolInputEmailTag as string) as 'kol-input-email';
	KolInputFileTag = transformTagName(KolInputFileTag as string) as 'kol-input-file';
	KolInputNumberTag = transformTagName(KolInputNumberTag as string) as 'kol-input-number';
	KolInputPasswordTag = transformTagName(KolInputPasswordTag as string) as 'kol-input-password';
	KolInputRadioTag = transformTagName(KolInputRadioTag as string) as 'kol-input-radio';
	KolInputRangeTag = transformTagName(KolInputRangeTag as string) as 'kol-input-range';
	KolInputTag = transformTagName(KolInputTag as string) as 'kol-input';
	KolInputTextTag = transformTagName(KolInputTextTag as string) as 'kol-input-text';
	KolKolibriTag = transformTagName(KolKolibriTag as string) as 'kol-kolibri';
	KolLinkButtonTag = transformTagName(KolLinkButtonTag as string) as 'kol-link-button';
	KolLinkGroupTag = transformTagName(KolLinkGroupTag as string) as 'kol-link-group';
	KolLinkTag = transformTagName(KolLinkTag as string) as 'kol-link';
	KolLinkWcTag = transformTagName(KolLinkWcTag as string) as 'kol-link-wc';
	KolLogoTag = transformTagName(KolLogoTag as string) as 'kol-logo';
	KolModalTag = transformTagName(KolModalTag as string) as 'kol-modal';
	KolNavTag = transformTagName(KolNavTag as string) as 'kol-nav';
	KolPaginationTag = transformTagName(KolPaginationTag as string) as 'kol-pagination';
	KolPopoverWcTag = transformTagName(KolPopoverWcTag as string) as 'kol-popover-wc';
	KolProgressTag = transformTagName(KolProgressTag as string) as 'kol-progress';
	KolQuoteTag = transformTagName(KolQuoteTag as string) as 'kol-quote';
	KolSelectTag = transformTagName(KolSelectTag as string) as 'kol-select';
	KolSingleSelectTag = transformTagName(KolSingleSelectTag as string) as 'kol-single-select';
	KolSkipNavTag = transformTagName(KolSkipNavTag as string) as 'kol-skip-nav';
	KolSpinTag = transformTagName(KolSpinTag as string) as 'kol-spin';
	KolSplitButtonTag = transformTagName(KolSplitButtonTag as string) as 'kol-split-button';
	KolSymbolTag = transformTagName(KolSymbolTag as string) as 'kol-symbol';
	KolTableStatefulTag = transformTagName(KolTableStatefulTag) as 'kol-table-stateful';
	KolTableStatelessTag = transformTagName(KolTableStatelessTag as string) as 'kol-table-stateless';
	KolTableStatelessWcTag = transformTagName(KolTableStatelessWcTag as string) as 'kol-table-stateless-wc';
	KolTableTag = transformTagName(KolTableTag as string) as 'kol-table';
	KolTabsTag = transformTagName(KolTabsTag as string) as 'kol-tabs';
	KolTextareaTag = transformTagName(KolTextareaTag as string) as 'kol-textarea';
	KolToastContainerTag = transformTagName(KolToastContainerTag as string) as 'kol-toast-container';
	KolToolbarTag = transformTagName(KolTooltipWcTag as string) as 'kol-toolbar';
	KolTooltipWcTag = transformTagName(KolTooltipWcTag as string) as 'kol-tooltip-wc';
	KolTreeItemTag = transformTagName(KolTreeItemTag as string) as 'kol-tree-item';
	KolTreeItemWcTag = transformTagName(KolTreeItemWcTag as string) as 'kol-tree-item-wc';
	KolTreeTag = transformTagName(KolTreeTag as string) as 'kol-tree';
	KolTreeWcTag = transformTagName(KolTreeWcTag as string) as 'kol-tree-wc';
	KolVersionTag = transformTagName(KolVersionTag as string) as 'kol-version';
};
