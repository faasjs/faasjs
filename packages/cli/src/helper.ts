export function defaultsEnv (): void {
  // 设置默认环境变量
  if (!process.env.FaasRoot) {
    process.env.FaasRoot = process.cwd() + '/';
  }
  if (!process.env.FaasRoot.endsWith('/')) {
    process.env.FaasRoot += '/';
  }

  if (!process.env.FaasEnv) {
    process.env.FaasEnv = 'development';
  }

  if (!process.env.FaasLog) {
    process.env.FaasLog = 'info';
  }
}
