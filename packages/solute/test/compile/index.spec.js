const fs = require('fs');
const path = require('path');
const { print } = require('code-red');
const { compile } = require('../../dist/index');

const featuresToTest = [
  {
    description: 'Compile: JSX',
    pathToTestFiles: `${__dirname}/jsx`,
  },
  {
    description: 'Compile: Reactivity',
    pathToTestFiles: `${__dirname}/reactivity`,
  },
  {
    description: 'Compile: Conditional',
    pathToTestFiles: `${__dirname}/conditional`,
  },
];

const runTest = ({ description, pathToTestFiles }) => {
  describe(description, () => {
    fs.readdirSync(pathToTestFiles).forEach((dir) => {
      const resolved = path.resolve(pathToTestFiles, dir);

      if (!fs.existsSync(`${resolved}/input.jsx`)) {
        return;
      }

      test(dir, () => {
        try {
          const input = fs.readFileSync(`${resolved}/input.jsx`, 'utf-8').replace(/\s+$/, '');
          const actual = compile(input);
          const output = `${resolved}/actual.json`;
          const JSoutput = `${resolved}/actual.js`;
          fs.writeFileSync(output, JSON.stringify(actual));
          fs.writeFileSync(JSoutput, print(actual).code);
        } catch (err) {
          console.log(err.frame);
          throw err;
        }
      });
    });
  });
};

featuresToTest.forEach(runTest);
