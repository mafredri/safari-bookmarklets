/**
 * DuckStartGo
 *
 * Toggle between DuckDuckGo. Starpage.com and Google, maintaining the search
 * query. From DuckDuckGo to Startpage.com, from Startpage.com to Google and
 * from Google to DuckDuckGo. If none of these sites are active, search for the
 * highlighted text via DuckDuckGo. If no text is highlighted, simply navigate
 * to DuckDuckGo.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.3
 */
function run() {
	switch (window.location.hostname.replace('www.', '')) {
		case 'duckduckgo.com':
			var q = document.querySelector('[name=q]').value;
			return toStartpage(q);
		case 'startpage.com':
			var q = document.querySelector('#q').value;
			// return toDuckDuckGo(q, true);
			return toGoogle(q);
			break;
		case 'google.com':
			var q = document.querySelector('[name=q]').value;
			return toDuckDuckGo(q, false); // Google doesn't support navigating via POST.
		default:
			let sel = document.getSelection().toString();
			if (sel !== '') {
				return toDuckDuckGo(sel, false);
			}
	}

	// Fallback navigation to DuckDuckGo.
	window.location = 'https://www.duckduckgo.com';
}
run();

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
