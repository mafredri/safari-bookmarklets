/**
 * YouTube PiP
 *
 * Enable YouTube PiP in macOS and on iOS devices. Additionally launches a
 * watchdog that keeps PiP
 *
 * Credits for the original code go to Code Everywhere, from:
 * https://codeeverywhere.ca/post.php?id=56#Enable-YouTube-picture-in-picture-on-iOS-14-Safari-with-this-Siri-Shortcut
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.2
 */

function enablePiP(launch) {
	let adskip = document.querySelector('.ytp-ad-skip-button-text');
	if (adskip) {
		adskip.click();
		setTimeout(() => enablePiP(launch), 250);
		return;
	}

	let v = document.querySelector('video');
	v.setAttribute('controls', true);
	if (v !== window._pip_watchdog.video) {
		const enableControls = (e) =>
			setTimeout(() => {
				window._pip_watchdog.video.setAttribute('controls', true);
			}, 250);
		window._pip_watchdog.video = v;
		v.addEventListener(
			'webkitpresentationmodechanged',
			(e) => {
				enableControls(e);
				return e.stopPropagation();
			},
			true,
		);
		v.addEventListener('play', enableControls);
		v.addEventListener('pause', enableControls);
	}

	if (launch) {
		setTimeout(() => {
			let v = window._pip_watchdog.video;
			v.webkitSetPresentationMode('picture-in-picture');
		}, 250);
	}
}

function run() {
	if (window._pip_watchdog) {
		window._pip_watchdog.url = document.location.href;
		enablePiP(true);
		return;
	}

	window._pip_watchdog = {url: document.location.href, video: null};
	enablePiP(true);

	setInterval(() => {
		if (window._pip_watchdog.url != document.location.href) {
			enablePiP(false);
		}
	}, 500);
}

run();
