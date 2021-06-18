import { Command } from 'commander';
import { existsSync, lstatSync } from 'fs';
import { sync as globSync } from 'glob';
import { createInterface } from 'readline';
import { sep } from 'path';
import { Deployer } from '@faasjs/deployer';
import { defaultsEnv } from '../helper';
import { cpus } from 'os';
import { fork } from 'cluster';
import { chunk } from 'lodash';
import { log, warn, error } from 'console';
import { runInNewContext } from 'vm';

async function sleep () {
  const waiting = Math.floor(Math.random() * 3);
  return new Promise<void>(function (resolve) {
    log(`等待 ${waiting} 秒...`);
    setTimeout(function () {
      resolve();
    }, waiting * 1000);
  });
}

async function confirm ({
  message,
  success,
  fail
}: {
  message?: string;
  success?: string;
  fail?: string;
}) {
  return new Promise<void>(function (resolve, reject) {
    if (message) warn(message);

    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question('输入 y 确认:', function (res: string) {
      readline.close();

      if (res !== 'y') {
        if (fail)
          error(fail);
        reject();
      } else {
        if (success)
          log(success);
        resolve();
      }
    });
  });
}

async function deploy (file: string, ar: number, options: {y: string}) {
  if (!file.endsWith('.func.ts')) throw Error(`${file} isn't a cloud function file.`);

  try {
    const deployer = new Deployer({
      root: process.env.FaasRoot,
      filename: file
    });
    await deployer.deploy();
  } catch (err) {
    if (ar > 0) {
      error(err);
      warn(file + ` 自动重试（剩余 ${ar} 次）`);
      await sleep();
      await deploy(file, ar - 1, options);
      return;
    } else {
      error(err);
      throw Error(file + ' 自动重试次数已满，结束重试');
    }
  }
}

export async function action (env: string, files: string[], { w, ar, y }: {
  w?: string;
  ar?: string;
  y?: string;
}): Promise<void> {
  if (!ar) ar = '3';

  if (process.env.FaasDeployFiles) {
    for (const file of process.env.FaasDeployFiles.split(','))
      await new Promise(function (resolve) {
        runInNewContext(
          `(async function() {
              try {
                  await deploy('${file}', ar);
              } catch (e) {
                  throw e;
              } finally {
                  resolve();
              }
          })();`,
          {
            deploy,
            ar: Number(ar),
            resolve
          },
          { breakOnSigint: true }
        );
      });
    return;
  }

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

  if (list.length === 1)
    await deploy(list[0], Number(ar), { y });
  else {
    let processNumber = w ? Number(w) : (cpus().length > 1 ? cpus().length - 1 : 1);
    if (processNumber > list.length) processNumber = list.length;

    log(`[${process.env.FaasEnv}] 是否要发布以下 ${list.length} 个云函数？(并行数 ${processNumber}，失败自动重试 ${ar} 次)`);
    log(list);
    log('');

    if (!y)
      await confirm({
        success: '开始发布',
        fail: '停止发布'
      });

    const files = chunk(list, Math.ceil(list.length / processNumber));
    for (let i = 0; i < processNumber; i++) {
      if (!files[i] || !files[i].length) continue;
      const worker = fork({ FaasDeployFiles: files[i] });
      worker.on('error', function () {
        worker.kill();
      });
    }
  }
}

export default function (program: Command): void {
  program
    .command('deploy <env> [files...]')
    .option('-w <workers>', '并行发布的数量，默认为 CPU 数量 - 1')
    .option('-ar <times>', '自动重试次数，默认为 3 次，设为 0 则禁止自动重试')
    .option('-y', '当出现需确认的情况时，自动选择 yes')
    .name('deploy')
    .description('发布')
    .on('--help', function () {
      log(`
Examples:
  yarn deploy staging services${sep}demo.func.ts
  yarn deploy production services${sep}demo.func.ts services${sep}demo2.func.ts
  yarn deploy staging services${sep}`);
    })
    .action(action);
}
