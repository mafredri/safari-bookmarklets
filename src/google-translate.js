/**
 * Google Translate
 *
 * Translates the current page using automatic language detection. When
 * clicked on a translated page, will return to the original.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
if (
	['://translate.google.com', '://translate.googleusercontent.com'].some(s =>
		window.location.origin.includes(s),
	)
) {
	untranslate();
} else {
	translate();
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
