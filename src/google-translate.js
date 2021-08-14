/**
 * Google Translate
 *
 * Translates the current page using automatic language detection. When
 * clicked on a translated page, will return to the original.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.1
 */
if (
	['://translate.google.com', '://translate.googleusercontent.com'].some((s) =>
		window.location.origin.includes(s),
	)
) {
	untranslate();
} else if (window.location.origin.endsWith('.translate.goog')) {
	untranslateDomain();
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
		.filter((qp) => qp.startsWith('u='))[0]
		.slice(2);
	url = decodeURIComponent(url);
	window.location = url;
}
function untranslateDomain() {
	// https://webos--forums-ru.translate.goog/topic4650-1140.html?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=ajax,elem&_x_tr_sch=http
	const isHttp = window.location.href.includes('_x_tr_sch=http');
	const origin = window.location.origin
		.replace('--', '[dash]')
		.replace('-', '.')
		.replace('[dash]', '-')
		.replace('.translate.goog', '');
	let qp = window.location.search
		.slice(1)
		.split('&')
		.filter((qp) => !qp.startsWith('_x_tr_'))
		.join('&');
	qp = qp.length ? `?${qp}` : '';
	let url = window.location.href
		.replace(window.location.origin, origin)
		.replace(window.location.search, qp);
	if (isHttp) {
		url = url.replace('https://', 'http://');
	}

	window.location = url;
}
