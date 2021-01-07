import { Command } from 'commander';
import { existsSync, lstatSync } from 'fs';
import { sync as globSync } from 'glob';
import { createInterface } from 'readline';
import { sep } from 'path';
import { Deployer } from '@faasjs/deployer';
import { defaultsEnv } from '../helper';

export async function action (env: string, files: string[]): Promise<void> {
  process.env.FaasEnv = env;

  defaultsEnv();

  const list: string[] = [];

  for (const name of files) {
    let path = name.startsWith(sep) ? name : process.env.FaasRoot + name;

    if (!existsSync(path))
      throw Error(`File not found: ${path}`);

    if (lstatSync(path).isFile())
      list.push(path);
    else {
      if (!path.endsWith(sep))
        path += sep;

      list.push(...[...new Set(globSync(path + '*.func.ts').concat(globSync(path + `**${sep}*.func.ts`)))]);
    }
  }

  if (list.length < 1) throw Error('Not found files.');

  // 单个云函数文件直接部署
  if (list.length === 1) {
    const deployer = new Deployer({
      root: process.env.FaasRoot,
      filename: list[0]
    });
    await deployer.deploy();
  } else {
    console.log(`[${process.env.FaasEnv}] 是否要发布以下云函数？`);
    console.log(list);
    console.log('');
    if (!process.env.CI)
      // eslint-disable-next-line @typescript-eslint/typedef
      await new Promise<void>(function (resolve, reject) {
        const readline = createInterface({
          input: process.stdin,
          output: process.stdout
        });
        readline.question('输入 y 确认:', function (res: string) {
          readline.close();

          if (res !== 'y') {
            console.error('停止发布');
            reject();
          } else
            resolve();
        });
      });

    for (const file of list) {
      const deployer = new Deployer({
        root: process.env.FaasRoot,
        filename: file
      });
      await deployer.deploy();
    }
  }
}

export default function (program: Command): void {
  program
    .command('deploy <env> [files...]')
    .name('deploy')
    .description('发布')
    .on('--help', function () {
      console.log(`
Examples:
  yarn deploy testing services${sep}demo.func.ts
  yarn deploy production services${sep}demo.func.ts services${sep}demo2.func.ts
  yarn deploy testing services${sep}`);
    })
    .action(action);
}
