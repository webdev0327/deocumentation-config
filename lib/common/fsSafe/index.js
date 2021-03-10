const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function writeFileSync(filePath, data, options) {
	try {
		const pathSplit = filePath.split('/');
		const dir = path.join('/', ...pathSplit.slice(0, pathSplit.length - 1));
		const isDirExist = existsSync(dir);
		if (!isDirExist) {
			fs.mkdirSync(dir, { recursive: true });
		}

		fs.writeFileSync(filePath, data, options);
	} catch (e) {
		console.error(chalk.red(e));
	}
}

function readFileSync(filePath, defaultValue = '', options = '') {
	let output;

	try {
		const isFileExist = existsSync(filePath);
		if (!isFileExist) {
			writeFileSync(filePath, '', options);
		}

		output = fs.readFileSync(filePath, options);
	} catch (e) {
		console.error(chalk.red(e));
	}

	return output;
}

function readdirSync(path, options) {
	let dir = [];

	try {
		const isDirExist = existsSync(path);
		if (!isDirExist) {
			mkdirSync(path, { recursive: true });
		}

		dir = fs.readdirSync(path, options);
	} catch (e) {
		console.error(chalk.red(e));
	}

	return dir;
}

function mkdirSync(path, options) {
	try {
		fs.mkdirSync(path, options);
	} catch (e) {
		console.error(chalk.red(e));
	}
}

function copyFileSync(src, dest, flags) {
	let destDir = dest.split('/');
	destDir.pop();
	destDir = destDir.join('/');
	if (!existsSync(destDir)) {
		mkdirSync(destDir, { recursive: true });
	}

	fs.copyFileSync(src, dest, flags);
}

function existsSync(path) {
	return fs.existsSync(path);
}

function unlinkSync(path) {
	fs.unlinkSync(path);
}

function rmdirSync(path, options) {
	fs.rmdirSync(path, options);
}

module.exports = {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmdirSync,
	writeFileSync,
	unlinkSync
};
