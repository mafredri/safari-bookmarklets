/**
 * Google Translate
 *
 * Translates the current page using automatic language detection. When
 * clicked on a translated page, will return to the original.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
if (!window.location.origin.includes('://translate.google.com')) {
	translate();
} else {
	untranslate();
}

function translate() {
	const href = encodeURIComponent(window.location.href);
	const url =
		'https://translate.google.com/translate?sl=auto&tl=en&js=y&prev=_t&hl=en&ie=UTF-8&edit-text=&u=' +
		href;
	window.location = url;
}
function untranslate() {
	let url = window.location.search
		.split('&')
		.filter(qp => qp.startsWith('u='))[0]
		.slice(2);
	url = decodeURIComponent(url);
	window.location = url;
}
