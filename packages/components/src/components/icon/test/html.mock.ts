import path from 'path';
import pug from 'pug';
import { KoliBriIconProps, KoliBriIconStates } from '../types';
import { mixMembers } from 'stencil-awesome-test';
import { readFileSync } from 'fs';
import { render } from 'mustache';
import { twig } from 'twig';

const getState = (props: KoliBriIconProps): KoliBriIconStates =>
	mixMembers<KoliBriIconProps, KoliBriIconStates>(
		{
			_icon: 'codicon codicon-home',
		},
		props
	);

const getIconHtmlTwig = (props: KoliBriIconProps, additionalAttrs = ''): string => {
	const state = getState(props);
	const context = { additionalAttrs, ...state, mode: 'csr' };

	return twig({ path: path.join(__dirname, 'icon.twig'), async: false }).render(context);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIconHtmlMustache = (props: KoliBriIconProps, additionalAttrs = ''): string => {
	const state = getState(props);
	const template = readFileSync(path.join(__dirname, 'icon.mustache'), { encoding: 'utf-8' });

	return render(template, {
		additionalAttrs,
		...state,
		csrMode: true,
		ssrMode: false,
	});
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIconHtmlPug = (props: KoliBriIconProps, additionalAttrs = ''): string => {
	const compiledFunction = pug.compileFile(path.join(__dirname, 'icon.pug'));
	const state = getState(props);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	return compiledFunction({
		additionalAttrs,
		mode: 'csr',
		...state,
	});
};

export const getIconHtml = (props: KoliBriIconProps, additionalAttrs = ''): string => {
	return getIconHtmlTwig(props, additionalAttrs);
	// return getIconHtmlMustache(props, additionalAttrs);
	// return getIconHtmlPug(props, additionalAttrs);
};
