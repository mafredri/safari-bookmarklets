/**
 * DuckStartGo
 *
 * Toggle between DuckDuckGo. Starpage.com and Google, maintaining the search query.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
switch (window.location.hostname.replace('www.', '')) {
	case 'duckduckgo.com':
		var q = document.querySelector('[name=q]').value;
		toStartpage(q);
		break;
	case 'startpage.com':
		var q = document.querySelector('#q').value;
		toGoogle(q);
		// toDuckDuckGo(q, true);
		break;
	case 'google.com':
		var q = document.querySelector('[name=q]').value;
		toDuckDuckGo(q, false); // Google doesn't support navigating via POST.
		break;
}

function toStartpage(q) {
	return navigateViaForm('POST', 'https://www.startpage.com/sp/search', {q});
}

function toDuckDuckGo(q, post) {
	if (post) {
		return navigateViaForm('POST', 'https://www.duckduckgo.com/', {q});
	}
	q = encodeURIComponent(q);
	document.location = `https://www.duckduckgo.com/?q=${q}`;
}

function toGoogle(q) {
	q = encodeURIComponent(q);
	document.location = `https://www.google.com/search?q=${q}`;
}

function navigateViaForm(method, action, inputs) {
	const form = document.createElement('form');
	form.style.visibility = 'hidden';
	form.method = method;
	form.action = action;
	for (const key of Object.keys(inputs)) {
		const input = document.createElement('input');
		input.name = key;
		input.value = inputs[key];
		form.appendChild(input);
	}
	document.body.appendChild(form);
	form.submit();
}
