const loadlGoogleClientLibraryScript = (src) => {
	const tag = document.createElement('script');
	tag.async = true;
	tag.defer = true;
	tag.src = src;
	const body = document.getElementsByTagName('body')[0];
	body.appendChild(tag);
};

const chunkArray = (initialArray, chunkSize) => {
	const chunks = [];
	for (let index = 0; index < initialArray.length; index += chunkSize) {
		const chunk = initialArray.slice(index, index + chunkSize);
		chunks.push(chunk);
	}
	return chunks;
};

const capitalizeFirstLetter = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

const validateImage = (setError, fieldName, formData, currFormMap) => {
	if (!formData[fieldName]) {
		return setError(currFormMap[fieldName].errors?.default);
	}
	const imgFile = formData[fieldName];
	const isImgTypeValid =
		imgFile.type == 'image/png' ||
		imgFile.type == 'image/jpeg' ||
		imgFile.type == 'image/jpg' ||
		imgFile.type == 'image/gif';
	if (!isImgTypeValid) {
		setError(currFormMap[fieldName].errors?.validate);
	} else if (imgFile.size > 5000000) {
		setError(currFormMap[fieldName].errors?.size);
	} else {
		setError('');
	}
};

const getLastUrlSegment = () => {
	const pathSegments = window.location.pathname.split('/').filter(Boolean);
	return pathSegments[pathSegments.length - 1];
};

const formatAddress = (address) => {
	const parts = [address.address1, address.city, address.state, address.zipcode].filter(Boolean);

	return parts.join(', ');
};

const formatPosterName = (messageFrom) => {
	if (!messageFrom || !messageFrom.fName || !messageFrom.lName) {
		return 'Anonymous';
	}
	return `${messageFrom.fName} ${messageFrom.lName.charAt(0)}.`;
};

export {
	loadlGoogleClientLibraryScript,
	chunkArray,
	validateImage,
	capitalizeFirstLetter,
	getLastUrlSegment,
	formatAddress,
	formatPosterName,
};
