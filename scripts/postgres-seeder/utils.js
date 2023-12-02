const fs = require('node:fs');
const path = require('node:path');

const importSeederFile = async (name = '') => {
	const filePath = path.join(__dirname, `./data/${name}.json`);

	try {
		const fileData = await fs.promises.readFile(filePath, 'utf8');
		const JSONData = JSON.parse(fileData);

		return JSONData;
	} catch (error) {
		console.log('Error importing seeder file', { filePath, error });
	}

	return;
};

const saveSeederFile = async (name = '', data = []) => {
	const filePath = path.join(__dirname, `./data/${name}.json`);

	try {
		const fileData = JSON.stringify(data, null, 4);
		await fs.promises.writeFile(filePath, fileData, 'utf8');

		return;
	} catch (error) {
		console.log('Error saving seeder file', { filePath, error });
	}

	return;
};

const randomNumber = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1) + min);

module.exports = {
	importSeederFile,
	saveSeederFile,
	randomNumber,
};
