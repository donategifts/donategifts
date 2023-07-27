const fs = require('fs');

// rename all js files in the server folder to ts recursively

const renameFiles = (dir) => {
	fs.readdir(dir, (err, files) => {
		if (err) {
			throw err;
		}
		files.forEach((file) => {
			const filePath = `${dir}/${file}`;
			fs.stat(filePath, (err, stats) => {
				if (err) {
					throw err;
				}
				if (stats.isDirectory()) {
					renameFiles(filePath);
				} else if (stats.isFile() && file.endsWith('.js')) {
					fs.rename(filePath, filePath.replace('.js', '.ts'), (err) => {
						if (err) {
							throw err;
						}
						console.log(`Renamed ${filePath}`);
					});
				}
			});
		});
	});
};

renameFiles('../server');
