const fs = require('fs');
const path = require('path');

// read all json files in the current folder
// read every line and push it into an array
// write the array into a new json file
const files = fs.readdirSync('./');
const jsonFiles = files.filter((file) => file.endsWith('.json'));

for (const file of jsonFiles) {
	const lines = fs.readFileSync(file, 'utf-8').split('\n');
	const json = [];
	for (const line of lines) {
		if (line) {
			json.push(JSON.parse(line));
		}
	}

	fs.writeFileSync(path.join(__dirname, `data/${file}`), JSON.stringify(json));
}
