/**
 * Add to Pinboard
 *
 * Open a popup to bookmark the current page in Pinboard, information is
 * extracted from meta-tags where possible and some smarts are used for
 * constructing the title and description. If the document defines
 * keywords, tags will be pre-populated as well.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.1
 */
const url = firstNonEmpty(metaP('og:url'), metaP('al:web:url'), location.href);
let title = firstNonEmpty(
	// Try to grab the title from metadata.
	metaID('title'),
	metaP('title'),
	metaP('og:title'),
	metaP('twitter:title'),
	query('h1', 'innerText'),
	query('title', 'innerText'), // Fallback to page title.
	// metaN('title'), // Often a site title, ignore.
);
let description = firstNonEmpty(
	// Try to grab the description from metadata.
	metaID('description'),
	metaP('description'),
	metaP('og:description'),
	metaP('twitter:description'),
	metaN('description'), // Often a site description, low prio.
);
if (description) {
	description = description.replace(
		/\ Contribute to [^\ ]* development by creating an account on GitHub.$/,
		'',
	);
	description = `Description: ${quote(description)}`;
}
let tags = [];
let keywords = firstNonEmpty(metaN('keywords'));
if (keywords) {
	tags = keywords
		.split(',')
		.map((kw) => kw.trim())
		.filter((kw) => kw !== '');
}

// Add author or site information, if available.
const author = firstNonEmpty(metaID('author'), metaN('author'));
const siteName = firstNonEmpty(metaP('og:site_name'));
if (author && !title.includes(author)) {
	title += ` | ${author}`;
} else if (siteName && !title.includes(siteName)) {
	title += ` | ${siteName}`;
}

// Add the selected text as an excerpt.
let sel = document.getSelection().toString();
if (sel !== '') {
	sel = `Excerpt: ${quote(sel)}`;
}

// Retain all information by combining the description and selection.
if (description && sel) {
	description = `${description}\n${sel}`;
} else if (sel) {
	description = sel;
}

const queryParams = [
	['url', url],
	['title', title],
	['description', description],
	['tags', tags.join(',')],
]
	.map((x) => `${x[0]}=${encodeURIComponent(x[1])}`)
	.join('&');

const openURL = `https://pinboard.in/add?showtags=yes&${queryParams}`;
if (url.startsWith('https://web.archive.org/web/')) {
	window.location = openURL;
} else {
	open(openURL, 'Pinboard', 'toolbar=no,scrollbars=yes,width=750,height=700');
}

function firstNonEmpty(...list) {
	const [x] = list.map((x) => x.trim()).filter((x) => x !== '');
	return x || '';
}
function query(elem, key) {
	const el = document.querySelector(elem);
	if (el) {
		return el[key];
	}
	return '';
}
function metaID(id) {
	return query(`meta#${id}`, 'content');
}
function metaN(name) {
	return query(`meta[name="${name}"]`, 'content');
}
function metaP(prop) {
	let v = query(`meta[property="${prop}"]`, 'content');
	if (!v) {
		v = query(`meta[itemprop="${prop}"]`, 'content');
	}
	return v;
}
function quote(s) {
	return `<blockquote>${s.trim()}</blockquote>`;
}
