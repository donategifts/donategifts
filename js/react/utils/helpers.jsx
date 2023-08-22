export const loadlGoogleClientLibraryScript = (src) => {
	const tag = document.createElement('script');
	tag.async = true;
	tag.defer = true;
	tag.src = src;
	const body = document.getElementsByTagName('body')[0];
	body.appendChild(tag);
};
