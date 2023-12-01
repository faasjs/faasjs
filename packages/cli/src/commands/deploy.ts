import { Command } from 'commander'
import { existsSync, lstatSync } from 'fs'
import { sync as globSync } from 'glob'
import { createInterface } from 'readline'
import { sep, resolve } from 'path'
import { Deployer } from '@faasjs/deployer'
import { defaultsEnv } from '../helper'
import Cluster from 'cluster'
import { chunk } from 'lodash'
import { log, warn, error } from 'console'
import { execSync } from 'child_process'

async function sleep() {
  const waiting = Math.floor(Math.random() * 3)
  return new Promise<void>(resolve => {
    log(`Waiting ${waiting} seconds...`)
    setTimeout(() => {
      resolve()
    }, waiting * 1000)
  })
}

async function confirm({
  message,
  success,
  fail,
}: {
  message?: string
  success?: string
  fail?: string
}) {
  return new Promise<void>((resolve, reject) => {
    if (message) warn(message)

    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    readline.question('输入 y 确认: ', (res: string) => {
      readline.close()

      if (res !== 'y') {
        if (fail) error(fail)
        reject(res)
      } else {
        if (success) log(success)
        resolve()
      }
    })
  })
}

async function deploy(file: string, ar: number) {
  if (!file.endsWith('.func.ts'))
    throw Error(`${file} isn't a cloud function file.`)

  try {
    const deployer = new Deployer({
      root: process.env.FaasRoot as string,
      filename: file,
      config: {},
      dependencies: {},
    })
    await deployer.deploy()
  } catch (err) {
    error(err)
    if (ar > 0) {
      warn(file + ` 自动重试（剩余 ${ar} 次）`)
      await sleep()
      await deploy(file, ar - 1)
    } else throw Error(`${file} 自动重试次数已满，结束重试`)
  }
}

export async function action(
  env: string,
  files: string[],
  {
    workers,
    autoRetry,
    autoYes,
    commit,
  }: {
    workers?: string
    autoRetry?: string
    autoYes?: string
    commit?: string
  }
): Promise<void> {
  process.env.FaasEnv = env

  defaultsEnv()

  if (!autoRetry) autoRetry = '3'

  if (process.env.FaasDeployFile) {
    await deploy(process.env.FaasDeployFile, Number(autoRetry))
    process.exit(0)
  }

  if (process.env.FaasDeployFiles) {
    for (const file of process.env.FaasDeployFiles.split(','))
      try {
        execSync(
          `FaasDeployFile=${file} FaasEnv=${env} node ${__filename} deploy ${env}`,
          { stdio: 'inherit' }
        )
        process.send({
          type: 'done',
          file,
        })
      } catch (err) {
        error(err)
        process.send({
          type: 'fail',
          file,
        })
      }

    if (process.env.JEST_WORKER_ID) return

    process.exit(0)
  }

  const list: string[] = []

  if (commit)
    if (typeof commit === 'string') {
      const cwd = execSync('git rev-parse --show-cdup').toString().trim()
      const changes = execSync(
        `git log -m -1 --name-only --pretty="format:" ${commit}`
      )
        .toString()
        .split('\n')
        .filter(f => f?.endsWith('.func.ts'))
        .map(f => resolve(cwd, f))
      files = files.concat(changes)
    } else {
      const cwd = execSync('git rev-parse --show-cdup').toString().trim()
      const changes = execSync('git diff --name-only HEAD~1..HEAD')
        .toString()
        .split('\n')
        .filter(f => f?.endsWith('.func.ts'))
        .map(f => resolve(cwd, f))
      files = files.concat(changes)
    }

  for (const name of files) {
    if (name.includes('*')) {
      if (name.endsWith('.func.ts'))
        list.push(...globSync(process.env.FaasRoot + name))
      else list.push(...globSync(`${process.env.FaasRoot + name}.func.ts`))
      continue
    }
    let path = name.startsWith(sep) ? name : process.env.FaasRoot + name

    if (!existsSync(path)) throw Error(`File not found: ${path}`)

    if (lstatSync(path).isFile()) list.push(path)
    else {
      if (!path.endsWith(sep)) path += sep

      list.push(
        ...[
          ...new Set(
            globSync(`${path}*.func.ts`).concat(
              globSync(path + `**${sep}*.func.ts`)
            )
          ),
        ]
      )
    }
  }

  if (list.length < 1) throw Error('Not found files.')

  if (list.length === 1) {
    await deploy(list[0], Number(autoRetry))
    if (process.env.JEST_WORKER_ID) return
    process.exit(0)
  } else {
    let processNumber = workers ? Number(workers) : 1
    if (processNumber > list.length) processNumber = list.length

    log(
      `[${process.env.FaasEnv}] 是否要发布以下 ${list.length} 个云函数？(并行数 ${processNumber}，失败自动重试 ${autoRetry} 次)`
    )
    log(list)
    log('')

    if (!autoYes)
      await confirm({
        success: '开始发布',
        fail: '停止发布',
      })

    const chunked = chunk(list, Math.ceil(list.length / processNumber))
    const queues = []
    const results: {
      done: string[]
      fail: string[]
    } = {
      done: [],
      fail: [],
    }
    for (let i = 0; i < processNumber; i++) {
      if (!chunked[i] || chunked[i].length === 0) continue
      queues.push(
        new Promise<void>(resolve => {
          const worker = Cluster.fork({ FaasDeployFiles: chunked[i] })
          worker.on('message', message => {
            switch (message?.type) {
              case 'done':
                results.done.push(message.file)
                break
              case 'fail':
                results.fail.push(message.file)
                break
            }
          })
          worker.on('error', () => {
            worker.kill()
          })
          worker.on('exit', () => {
            resolve()
          })
        })
      )
    }

    await Promise.all(queues)

    if (results.fail.length) {
      if (results.done.length) {
        log('Success:')
        log(results.done)
      }
      error('Failed:')
      error(results.fail)
      if (process.env.JEST_WORKER_ID) return
      process.exit(1)
    }
  }
}

export function DeployCommand(program: Command): void {
  program
    .command('deploy <env> [files...]')
    .option('-w --workers <workers>', '并行发布的数量，默认为 CPU 数量 - 1')
    .option(
      '-ar --autoRetry <times>',
      '自动重试次数，默认为 3 次，设为 0 则禁止自动重试'
    )
    .option('-y --autoYes', '当出现需确认的情况时，自动选择 yes')
    .option(
      '-c --commit [commit]',
      '基于 commit 到 head 的文件变化，发布有更新的云函数，若没有填写 commit id，则发布最近一次提交的云函数'
    )
    .name('deploy')
    .description('Deploy to cloud function')
    .on('--help', () => {
      log(`
Examples:
  npm exec faas deploy staging services${sep}demo.func.ts
  npm exec faas deploy production services${sep}demo.func.ts services${sep}demo2.func.ts
  npm exec faas deploy staging services${sep}`)
    })
    .action(action)
}
