/**
 * Google Translate: Toolbar
 *
 * Inject a Google Translate toolbar into the current page, allows
 * toggling translate on/off but might disrupt the page layout and
 * doesn't translate as well as the "Google Translate" bookmarklet.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.1
 */
const target = document.createElement('div');
target.id = 'googleTranslateElement';

// Add translate container to the bottom because the script will also add a
// toolbar to the top of the page.
document.body.append(target);

const inject = document.createElement('script');
inject.type = 'text/javascript';
inject.src =
	'http://translate.google.com/translate_a/element.js?cb=googleTranslateInit';

// Make the callback available in the global scope.
window.googleTranslateInit = googleTranslateInit;
// Inject Google Translate script in the header.
document.head.append(inject);

function googleTranslateInit() {
	const te = new google.translate.TranslateElement(
		{pageLanguage: ''},
		'googleTranslateElement',
	);
	console.log(te);
}
