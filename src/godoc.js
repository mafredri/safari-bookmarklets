/**
 * GoDoc
 *
 * Navigates to GoDoc from the current repository, e.g. on GitHub.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
// This regexp tries to handle most cases on GitHub.
const re = /\/((tree|blob|commits?|issues|pull|graphs|settings|network)\/[^/]+|(issues|pulls|projects|wiki|pulse|community|network|settings)$)/;
const loc = window.location;
window.location =
	'https://godoc.org/' + loc.hostname + loc.pathname.replace(re, '');
