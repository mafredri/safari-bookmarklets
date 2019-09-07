/**
 * Add to Pinboard
 *
 * Open a popup to bookmark the current page in Pinboard and place
 * selected text in the description field.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
const [u, d, t] = [
	location.href,
	document.getSelection ? document.getSelection() : '',
	document.title,
].map(x => encodeURIComponent(x));
open(
	`https://pinboard.in/add?showtags=yes&url=${u}&description=${d}&title=${t}`,
	'Pinboard',
	'toolbar=no,scrollbars=yes,width=750,height=700',
);
