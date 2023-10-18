export const loadlGoogleClientLibraryScript = (src) => {
	const tag = document.createElement('script');
	tag.async = true;
	tag.defer = true;
	tag.src = src;
	const body = document.getElementsByTagName('body')[0];
	body.appendChild(tag);
};

export const chunkArray = (initialArray, chunkSize) => {
	const chunks = [];
	for (let index = 0; index < initialArray.length; index += chunkSize) {
		const chunk = initialArray.slice(index, index + chunkSize);
		chunks.push(chunk);
	}
	return chunks;
};

export const capitalizeFirstLetter = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};
