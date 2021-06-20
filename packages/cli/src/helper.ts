import { sep } from 'path'

export function defaultsEnv (): void {
  // 设置默认环境变量
  if (!process.env.FaasRoot) process.env.FaasRoot = process.cwd() + sep

  if (!process.env.FaasRoot.endsWith(sep)) process.env.FaasRoot += sep

  if (!process.env.FaasEnv) process.env.FaasEnv = 'development'

  if (!process.env.FaasLog) process.env.FaasLog = 'info'
}
