/**
 * YouTube PiP
 *
 * Enable YouTube PiP on iOS devices.
 *
 * All credits for the original code go to Code Everywhere, from:
 * https://codeeverywhere.ca/post.php?id=56#Enable-YouTube-picture-in-picture-on-iOS-14-Safari-with-this-Siri-Shortcut
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.1
 */
let v = document.querySelector('video');

v.addEventListener(
	'webkitpresentationmodechanged',
	(e) => e.stopPropagation(),
	true,
);

setTimeout(() => v.webkitSetPresentationMode('picture-in-picture'), 3000);
