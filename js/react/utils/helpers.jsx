export const loadlGoogleClientLibraryScript = (src) => {
	const tag = document.createElement('script');
	tag.async = true;
	tag.defer = true;
	tag.src = src;
	tag.id = 'google-client-library-script';
	const body = document.getElementsByTagName('body')[0];
	body.appendChild(tag);
};

export const loadFacebookScript = (src, nonce) => {
	const tag = document.createElement('script');
	tag.async = true;
	tag.defer = true;
	tag.crossOrigin = 'anonymous';
	tag.nonce = nonce;
	tag.src = src;
	tag.id = 'facebook-script';
	const body = document.getElementsByTagName('body')[0];
	body.appendChild(tag);
};

export function initFacebookSdk() {
	return new Promise((resolve) => {
		// wait for facebook sdk to initialize before starting the react app
		window.fbAsyncInit = function () {
			window.FB.init({
				appId: '1986956124780876',
				cookie: true,
				xfbml: true,
				version: 'v8.0',
			});

			// auto authenticate with the api if already logged in with facebook
			window.FB.getLoginStatus(({ authResponse }) => {
				if (authResponse) {
					// accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
					console.log('logged in');
				} else {
					resolve();
				}
			});
		};

		// load facebook sdk script
		(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk.js';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');
	});
}
