import { Command } from 'commander';
import { prompt } from 'enquirer';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const Provider = ['tencentcloud', null];
const Region = ['ap-beijing', 'ap-shanghai', 'ap-guangzhou', 'ap-hongkong'];

const Validator = {
  name (input: string) {
    const match = /^[a-z0-9-_]+$/i.test(input) ? true : 'Must be a-z, 0-9 or -_';
    if (match !== true) return match;
    if (existsSync(input))
      return `${input} folder exists, please try another name`;

    return true;
  },
  provider (input: string | null) {
    return Provider.includes(input) ? true : 'Unknow provider';
  },
  region (input: string) {
    return Region.includes(input) ? true : 'Unknown region';
  },
  appId (input: string) {
    return /^[0-9]+$/.test(input) ? true : 'Wrong format';
  },
  secretId (input: string) {
    return /^[a-zA-Z0-9]+$/.test(input) ? true : 'Wrong format';
  },
  secretKey (input: string) {
    return /^[a-zA-Z0-9]+$/.test(input) ? true : 'Wrong format';
  }
};

export async function action (options?: {
  name?: string;
  region?: string;
  appId?: string;
  secretId?: string;
  secretKey?: string;
  example?: boolean;
  noprovider?: boolean;
}): Promise<void> {
  const answers: {
    name?: string;
    provider?: string;
    region?: string;
    appId?: string;
    secretId?: string;
    secretKey?: string;
    example?: boolean;
  } = Object.assign(options, {});

  if (!options.name || Validator.name(options.name) !== true)
    answers.name = await prompt({
      type: 'input',
      name: 'value',
      message: 'Project name',
      validate: Validator.name
    }).then((res: { value: string }) => res.value);


  if (!options.noprovider) {
    answers.provider = await prompt({
      type: 'select',
      name: 'value',
      message: 'Provider',
      choices: [
        {
          name: 'null',
          message: '暂不配置'
        },
        {
          name: 'tencentcloud',
          message: '腾讯云'
        },
      ]
    }).then((res: { value: string }) => res.value);

    if (answers.provider === 'tencentcloud') {
      if (!answers.region || Validator.region(answers.region) !== true)
        answers.region = await prompt({
          type: 'select',
          name: 'value',
          message: 'Region',
          choices: Region.concat([]), // choices 会修改 Region 对象，因此克隆一份
          validate: Validator.region
        }).then((res: { value: string }) => res.value);


      if (!answers.appId || Validator.appId(answers.appId) !== true)
        answers.appId = await prompt({
          type: 'input',
          name: 'value',
          message: 'appId (from https://console.cloud.tencent.com/developer)',
          validate: Validator.appId
        }).then((res: { value: string }) => res.value);


      if (!answers.secretId || Validator.secretId(answers.secretId) !== true)
        answers.secretId = await prompt({
          type: 'input',
          name: 'value',
          message: 'secretId (from https://console.cloud.tencent.com/cam/capi)',
          validate: Validator.secretId
        }).then((res: { value: string }) => res.value);


      if (!answers.secretKey || Validator.secretKey(answers.secretKey) !== true)
        answers.secretKey = await prompt({
          type: 'input',
          name: 'value',
          message: 'secretKey (from https://console.cloud.tencent.com/cam/capi)',
          validate: Validator.secretKey
        }).then((res: { value: string }) => res.value);
    }
  }

  if (answers.example !== false)
    answers.example = await prompt({
      type: 'confirm',
      name: 'value',
      message: 'Add example files',
      initial: true
    }).then((res: { value: boolean }) => res.value);

  mkdirSync(answers.name);
  writeFileSync(join(answers.name, 'faas.yaml'),
    `defaults:
  providers:
    tencentcloud:
      type: '@faasjs/tencentcloud'
      config: # https://faasjs.com/guide/tencentcloud.html
        appId: ${answers.appId || ''}
        secretId: ${answers.secretId || ''}
        secretKey: ${answers.secretKey || ''}
        region: ${answers.region || ''}
  plugins:
    cloud_function:
      provider: tencentcloud
      type: cloud_function
    http:
      provider: tencentcloud
      type: http
development:
testing:
production:`);

  writeFileSync(join(answers.name, 'package.json'),
    `{
  "name": "${answers.name}",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "serve": "faas server",
    "lint": "eslint --ext .ts .",
    "test": "jest"
  },
  "dependencies": {
    "faasjs": "beta",
    "@faasjs/eslint-config-recommended": "beta"
  },
  "eslintConfig": {
    "extends": [
      "@faasjs/recommended"
    ]
  },
  "eslintIgnore": [
    "tmp",
    "coverage"
  ],
  "jest": {
    "preset": "ts-jest",
    "collectCoverage": true,
    "collectCoverageFrom": [
      "**/*.ts"
    ],
    "testRegex": "/*\\\\.test\\\\.ts$",
    "modulePathIgnorePatterns": [
      "/tmp/",
      "/coverage/"
    ]
  }
}`);

  writeFileSync(join(answers.name, 'tsconfig.json'), '{}');

  writeFileSync(join(answers.name, '.gitignore'), `node_modules/
tmp/
coverage/
*.tmp.js`);

  mkdirSync(join(answers.name, '.vscode'));

  writeFileSync(join(answers.name, '.vscode', 'settings.json'),
    `{
  "editor.detectIndentation": true,
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "editor.wordWrap": "on",
  "files.trimTrailingWhitespace": true,
  "editor.minimap.renderCharacters": false,
  "editor.minimap.maxColumn": 200,
  "editor.smoothScrolling": true,
  "editor.cursorBlinking": "phase",
  "search.exclude": {
    "**/node_modules": true,
    "**/coverage": true,
    "**/dist": true,
    "**/tmp": true
  },
  "eslint.packageManager": "yarn",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "grunt.autoDetect": "off",
  "jake.autoDetect": "off",
  "gulp.autoDetect": "off",
  "npm.autoDetect": "off"
}`);

  execSync(`yarn --cwd ${answers.name} install`, { stdio: 'inherit' });

  if (answers.example) {
    writeFileSync(join(answers.name, 'index.func.ts'),
      `import { useFunc } from '@faasjs/func';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  useHttp();

  return async function () {
    return 'Hello, world';
  };
});
`);

    mkdirSync(join(answers.name, '__tests__'));
    writeFileSync(join(answers.name, '__tests__', 'index.test.ts'),
      `import { FuncWarpper } from '@faasjs/test';

describe('hello', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../index.func'));

    const { data } = await func.JSONhandler<string>({});

    expect(data).toEqual('Hello, world');
  });
});
`);

    execSync(`yarn --cwd ${answers.name} jest`, { stdio: 'inherit' });
  }
}

export default function (program: Command): void {
  program
    .description('创建新项目')
    .on('--help', function () {
      console.log(`
Examples:
  yarn create faas-app`);
    })
    .option('--name <name>', '项目名字')
    .option('--region <region>', '可用区')
    .option('--appId <appid>', 'appId')
    .option('--secretId <secretId>', 'secretId')
    .option('--secretKey <secretKey>', 'secretKey')
    .option('--example', '创建示例文件')
    .option('--noprovider', '暂不配置服务商')
    .action(action);
}
