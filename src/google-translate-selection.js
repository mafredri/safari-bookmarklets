/**
 * Google Translate: Selection
 *
 * Translate only the selected text using automatic language detection.
 * Note: This is still a work-in-progress (WIP).
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.1
 */
main();

async function main() {
	const sel = document.getSelection();
	const range = sel.getRangeAt(0);
	const treeWalker = document.createTreeWalker(
		range.commonAncestorContainer,
		NodeFilter.SHOW_ALL,
	);

	let nodes = [];
	while (treeWalker.nextNode()) {
		const node = treeWalker.currentNode;
		// TODO: Handle partial node selection as well (start / end).
		if (sel.containsNode(node, false)) {
			nodes = [...nodes, node];
		}
	}

	// Grab all non-empty text nodes.
	const textNodes = nodes.filter(
		(n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== '',
	);
	const query = textNodes.map((n, i) => `${n.nodeValue.trim()}`).join('\n');
	const [translations] = await translate(query);

	// Rewrite all node values with the translated strings.
	textNodes.forEach((n, i) => {
		n.nodeValue = translations[i][0];
	});
}

function translate(query, to = 'en', from = 'auto') {
	query = encodeURI(query.replace(/\ /g, '+'));
	const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${query}`;

	return new Promise((resolve, reject) => {
		// Sometimes `fetch` is polyfilled and doesn't work as
		// expected, so we use XMLHttpRequest which is more safe.
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status !== 200) {
					reject(xhr.status);
					return;
				}

				const data = JSON.parse(xhr.responseText);
				resolve(data);
			}
		};
		xhr.open('GET', url, true);
		xhr.send(null);
	});
}
