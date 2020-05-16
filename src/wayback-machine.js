/**
 * Wayback Machine
 *
 * Opens the latest snapshot of the current URL from Internet Archive.
 * Clicking the bookmarklet while viewing an archive redirects to the
 * live page.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
let loc = window.location.href;

// Safari error pages don't expose the URL :(...
if (loc === 'safari-resource:/ErrorPage.html') {
	// I hope they keep their stylized quotes...
	const quot = new RegExp(
		'[' + String.fromCharCode(8220) + String.fromCharCode(8221) + ']',
		'g',
	); // “”
	loc = document.querySelector('.error-message').textContent.split(quot)[1];
	// Clean up "invisible" space (Safari bug?).
	loc = loc.replace(String.fromCharCode(8206), '');
}

if (!loc.includes('://web.archive.org/web/')) {
	showArchive(loc);
} else {
	showLive(loc);
}

function showArchive(loc) {
	loc = encodeURI(loc);
	window.location = `http://web.archive.org/web/submit?type=replay&url=${loc}`;
}
function showLive(loc) {
	// Strip away "http://web.archive.org/web/*/", what remains is the site URL.
	loc = loc.split('/').slice(5).join('/');
	// Add http if it's missing, otherwise the archive is reloaded.
	// Note: Should this be https instead?
	if (!loc.startsWith('http')) {
		loc = 'http://' + loc;
	}
	window.location = loc;
}
