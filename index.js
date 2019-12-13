#!/usr/bin/env node

let shell = require('shelljs');
let fs = require('fs');
let path = require('path');
let ncp = require('ncp').ncp;

let appName = process.argv[2];
let appDirectory = `${process.cwd()}/${appName}`;

const createReactApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      shell.exec(`npx create-react-app ${appName} --typescript`, () => {
        console.log('Created react app');
        resolve(true);
      });
    } else {
      console.log('\nNo app name was provided.'.red);
      console.log('\nProvide an app name in the following format: ');
      console.log('\ncreate-react-redux-router-app ', 'app-name\n'.cyan);
      resolve(false);
    }
  });
};

const packages = [
  'yarn',
  'husky',
  'lint-staged',
  'eslint',
  'stylelint',
  'prettier',
  'hygen',
  '@groinder/eslint-config',
  '@groinder/prettier-config',
  '@groinder/stylelint-config',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@types/jest',
  '@storybook/react',
  '@storybook/addon-knobs',
  '@storybook/addon-actions',
];

const installPackages = () => {
  return new Promise((resolve) => {
    shell.exec(`yarn && yarn add -D ${packages.join(' ')}`, () => {
      console.log('\nFinished installing packages\n'.green);
      resolve();
    });
  });
};

const extendPackageJson = () => {
  return new Promise((resolve) => {
    shell.exec(
      `cat ${appDirectory}/package.json ${path.resolve(
        __dirname,
        'extendPackage.json',
      )} | ${path.resolve(
        __dirname,
        'node_modules',
        'json',
        'lib',
        'json.js',
      )} --deep-merge | tee ${appDirectory}/package.json > null`,
      () => {
        resolve();
      },
    );
  });
};

const configs = [
  '.eslintignore',
  '.prettierignore',
  'tsconfig.json',
  '.storybook/config.js',
];

const updateConfigs = () => {
  return new Promise((resolve) => {
    let promises = [];
    shell.mkdir(`${appDirectory}/.storybook`);
    configs.forEach((fileName, i) => {
      promises[i] = new Promise((res) => {
        fs.copyFile(
          path.resolve(__dirname, 'configs', fileName),
          `${appDirectory}/${fileName}`,
          function(err) {
            if (err) {
              return console.log(err);
            }
            res();
          },
        );
      });
    });
    Promise.all(promises).then(() => {
      resolve();
    });
  });
};

// .gitignore has to have different name as otherwise it's not published to npm
const copyGitignore = () => {
  return new Promise((resolve) => {
    fs.copyFile(
      path.resolve(__dirname, 'configs', 'gitignore'),
      `${appDirectory}/.gitignore`,
      function(err) {
        if (err) {
          return console.log(err);
        }
        resolve();
      },
    );
  });
};

const copyHygenTemplates = () => {
  return new Promise((resolve) => {
    ncp(
      path.resolve(__dirname, '_templates'),
      `${appDirectory}/_templates`,
      () => resolve(),
    );
  });
};

const templates = ['App.test.tsx', 'App.tsx', 'index.tsx'];

const updateTemplates = () => {
  return new Promise((resolve) => {
    let promises = [];
    templates.forEach((fileName, i) => {
      promises[i] = new Promise((res) => {
        fs.copyFile(
          path.resolve(__dirname, 'templates', fileName),
          `${appDirectory}/src/${fileName}`,
          function(err) {
            if (err) {
              return console.log(err);
            }
            res();
          },
        );
      });
    });
    Promise.all(promises).then(() => {
      resolve();
    });
  });
};

const commitChanges = async () => {
  return new Promise((resolve) => {
    shell.exec(
      `git add . && git commit -m "Initial commit with Groinder Create React App"`,
      () => {
        resolve();
      },
    );
  });
};

const run = async () => {
  let success = await createReactApp();
  if (!success) {
    console.log(
      'Something went wrong while trying to create a new React app using create-react-app'
        .red,
    );
    return false;
  }

  await updateConfigs();
  await copyGitignore();
  await updateTemplates();
  await copyHygenTemplates();
  shell.cd(appName);
  await installPackages();
  shell.cd('..');
  await extendPackageJson();
  shell.cd(appName);
  await commitChanges();
  console.log('All done');
};
run();
