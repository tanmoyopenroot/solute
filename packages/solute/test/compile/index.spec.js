const fs = require('fs');
const path = require('path');
const { compile } = require('../../dist');

describe('compile', () => {
	fs.readdirSync(`${__dirname}/samples`).forEach(dir => {
    const resolved = path.resolve(`${__dirname}/samples`, dir);

		if (!fs.existsSync(`${resolved}/input.jsx`)) {
			return;
		}

		test(dir, () => {
			try {
        const input = fs.readFileSync(`${resolved}/input.jsx`, 'utf-8').replace(/\s+$/, '');
        const actual = compile(input);
        const output = `${resolved}/actual.json`;
        fs.writeFileSync(output, JSON.stringify(actual));
			} catch (err) {
				console.log(err.frame);
				throw err;
			}
		});
	});
});
