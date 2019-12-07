/**
 * Tori: Relinkify
 *
 * Relinkify sold links on Tori.fi.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
for (const linkContainer of Array.from(
	document.querySelectorAll('.adw_desc.gray_text'),
)) {
	const parent = linkContainer.parentNode;
	const linkNode = linkContainer.childNodes[0];

	const id = parent.id.replace(/^item_/, '');
	const name = linkNode.textContent
		.replace(/\ /g, '_')
		.replace(/\+/g, '_')
		.replace(/[ÄÅ]/g, 'A')
		.replace(/[åä]/g, 'a')
		.replace('Ö', 'O')
		.replace('ö', 'o')
		.trim();
	const region = parent
		.querySelectorAll('.cat_geo a')[0]
		.textContent.trim()
		.toLowerCase();

	console.log(id, name, region);
	const link = document.createElement('a');
	link.classList.add('item_link', 'nohistory');
	link.href = `https://www.tori.fi/${region}/${name}_${id}.htm?aw=1`;
	link.textContent = linkNode.textContent;
	linkContainer.insertBefore(link, linkNode);
	linkNode.remove();
}
