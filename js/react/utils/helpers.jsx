export const loadlGoogleClientLibraryScript = (src) => {
	const tag = document.createElement('script');
	tag.async = true;
	tag.defer = true;
	tag.src = src;
	const body = document.getElementsByTagName('body')[0];
	body.appendChild(tag);
};

export const chunkArray = (arr, chunkSize) => {
	const chunkedArray = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunkedArray.push(arr.slice(i, i + chunkSize));
	}
	return chunkedArray;
};
