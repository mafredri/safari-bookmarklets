import {readFileSync, readdirSync, writeFileSync} from 'fs';
import {join, basename} from 'path';
import {minify} from 'uglify-es';
import {escape} from 'html-escaper';

const docs = join(__dirname, 'docs');
const src = join(__dirname, 'src');

if (process.argv.length == 3) {
	console.log(createBookmarklet(process.argv[2]).src);
	process.exit(0);
}

const bookmarklets = compileBookmarklets(readdirSync(src));
generateReadmeMD(bookmarklets);
generateIndexHTML(bookmarklets);
process.exit(0);

function compileBookmarklets(files) {
	let bookmarklets = [];
	for (let f of files) {
		const bookmarklet = createBookmarklet(join(src, f));
		bookmarklets = [...bookmarklets, bookmarklet];
	}
	return bookmarklets;
}

function createBookmarklet(file) {
	let data = readFileSync(file, 'utf8');
	let header = '';
	if (data.startsWith('/*')) {
		const end = data.search('\\*/') + 2;
		header = data.slice(0, end);
		data = data.slice(end);
	}
	const info = parseHeader(header);
	const {code} = minify(data, {output: {webkit: true}});
	const {code: codeStyled} = minify(data, {
		output: {max_line_len: 120, webkit: true},
	});

	// TODO: Populate version in header.
	let bookmarklet = {
		id: basename(file).replace(/\.js$/, ''),
		name: info.name,
		description: info.description,
		src: `javascript:(function(){\n${header}\n${encodeURI(code)}})();void(0);`,
		srcStyled: `javascript:(function(){\n${header}\n${codeStyled}})();void(0);`,
	};

	return bookmarklet;
}

function generateIndexHTML(bookmarklets) {
	const indexTmpl = readFileSync(join(docs, 'tmpl.index.html'), 'utf8');
	const bookmarkletTmpl = readFileSync(
		join(docs, 'tmpl.bookmarklet.html'),
		'utf8',
	);

	const index = indexTmpl.replace(
		'{{bookmarklets}}',
		bookmarklets
			.map(bm => bookmarkletToTemplate(bookmarkletTmpl, bm))
			.join('\n'),
	);
	writeFileSync(join(docs, 'index.html'), index);

	function bookmarkletToTemplate(tmpl, bm) {
		tmpl = bookmarkletTmpl.replace(/{{id}}/g, bm.id);
		tmpl = tmpl.replace(/{{name}}/g, bm.name);
		tmpl = tmpl.replace(/{{description}}/g, bm.description);
		tmpl = tmpl.replace(/{{src}}/g, bm.src);
		tmpl = tmpl.replace(/{{srcStyled}}/g, escape(bm.srcStyled));
		return tmpl;
	}
}

function generateReadmeMD(bookmarklets) {
	const filename = join(__dirname, 'README.md');
	const readmeMD = readFileSync(filename, 'utf8');

	const parts = readmeMD.split('\n');
	const start = parts.indexOf('<!-- {{bookmarklets}} -->');
	const end = parts.indexOf('<!-- {{/bookmarklets}} -->');

	writeFileSync(
		filename,
		[
			parts.slice(0, start + 1).join('\n'),
			'<!-- This list is automatically generated by build.js, DO NOT EDIT. -->',
			bookmarklets.map(bookmarkletToMarkdown).join('\n'),
			parts.slice(end).join('\n'),
		].join('\n'),
	);

	function bookmarkletToMarkdown(bm) {
		return `- [${bm.name}](https://mafredri.github.io/safari-bookmarklets/index.html#${bm.id}): ${bm.description}`;
	}
}

// Header sample:
/**
 * Bookmarklet name
 *
 * A description that can span multiple
 * lines.
 *
 * Author: mamfwefwe
 * Version: 1.1.1
 */
function parseHeader(header) {
	const parts = header.split('\n');
	const start = parts.shift();
	if (start !== '/**') {
		console.error(`Invalid header start: want "/**", got "${start}"`);
		process.exit(0);
	}

	let name = parts.shift();
	if (!name.startsWith(' * ')) {
		console.error(`Invalid name: want " * Name", got "${name}"`);
		process.exit(0);
	}
	name = name.slice(3);

	// Should be " *" or " * ".
	let separator = parts.shift();
	if (separator > 3) {
		console.error(`Invalid separator: want " *", got "${separator}"`);
		process.exit(0);
	}

	let description = '';
	while (true) {
		let tmp = parts.shift();
		if (description === '' && !tmp.startsWith(' * ')) {
			console.error(`Invalid description: want " * Description", got "${tmp}"`);
			process.exit(0);
		}
		if (tmp.length <= 3) {
			break;
		}
		description += tmp.slice(3) + ' ';
	}
	description = description.trim();

	// Description should be followed by a separator too.
	separator = parts.shift();
	if (separator > 3) {
		console.error(`Invalid separator: want " *", got "${separator}"`);
		process.exit(0);
	}

	return {name, description};
}