import { format } from 'util';

export type Level = 'debug' | 'info' | 'warn' | 'error';

enum LevelColor {
  debug = 34,
  info = 32,
  warn = 33,
  error = 31,
}

interface Timer {
  level: Level;
  time: number;
}

const LevelPriority = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * 日志类
 */
class Log {
  public silent: boolean;
  public label?: string;
  public lastOutput?: string;
  private cachedTimers: any;

  /**
   * 初始化日志
   * @param label {string} 日志前缀
   */
  constructor (label?: string) {
    if (label) {
      this.label = label;
    }

    // 当使用 Jest 进行测试且使用 --silent 参数时禁止日志输出
    this.silent = !process.env.logLevel &&
      process.env.npm_config_argv &&
      JSON.parse(process.env.npm_config_argv).original.includes('--silent');

    this.cachedTimers = {};
  }

  /**
   * 调试级别日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public debug (message: string, ...args: any[]) {
    this.log('debug', message, ...args);
    return this;
  }

  /**
   * 信息级别日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public info (message: string, ...args: any[]) {
    this.log('info', message, ...args);
    return this;
  }

  /**
   * 警告级别日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public warn (message: string, ...args: any[]) {
    this.log('warn', message, ...args);
    return this;
  }

  /**
   * 错误级别日志
   * @param message {any} 日志内容，可以为 Error 对象
   * @param args {...any=} 内容参数
   */
  public error (message: any, ...args: any[]) {
    let stack = false;
    [message].concat(Array.from(args)).forEach((e: any) => {
      if (e.stack) {
        stack = true;
        this.log('error', e.stack);
      }
    });

    if (!stack) {
      this.log('error', message, ...args);
    }

    return this;
  }

  /**
   * 设置一个计时器
   * @param key {string} 计时器标识
   * @param level [string=debug] 日志级别，支持 debug、info、warn、error
   */
  public time (key: string, level: Level = 'debug') {
    this.cachedTimers[key as string] = {
      level,
      time: new Date().getTime(),
    };

    return this;
  }

  /**
   * 结束计时并显示日志
   * @param key {string} 计时器标识
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public timeEnd (key: string, message: string, ...args: any[]) {
    if (this.cachedTimers[key as string]) {
      const timer: Timer = this.cachedTimers[key as string];

      message = message + ' +%ims';
      args.push(new Date().getTime() - timer.time);

      this[timer.level](message, ...args);

      delete this.cachedTimers[key as string];
    } else {
      this.error('timeEnd not found key %s', key);
      this.error(message, ...args);
    }
    return this;
  }

  private log (level: Level, message: string, ...args: any) {
    if (process.env.FaasLog) {
      const priority = LevelPriority[process.env.FaasLog];
      if (LevelPriority[level as Level] < priority) return;
    }
    
    if (this.label) {
      message = `[${this.label}] ${message}`;
    }
    let output = format(message, ...args);

    if (process.env.FaasMode !== 'remote') {
      output = `\u001b[0${LevelColor[level as string]}m${level.toUpperCase()} ${output}\u001b[39m`;
    }

    this.lastOutput = output;

    if (level === 'error') {
      console.error(output);
    } else {
      console.log(output);
    }
  }
}

export default Log;
