import { format } from 'util';

export type Level = 'debug' | 'info' | 'warn' | 'error';

enum LevelColor {
  debug = '\u001b[034m',
  info = '\u001b[032m',
  warn = '\u001b[033m',
  error = '\u001b[031m',
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
  public level: number;
  public mode: string;
  public label?: string;
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
    this.silent = !process.env.FaasLog &&
      process.env.npm_config_argv &&
      JSON.parse(process.env.npm_config_argv).original.includes('--silent');

    this.mode = process.env.FaasMode !== 'remote' ? 'local' : 'remote';
    this.level = process.env.FaasLog ? LevelPriority[process.env.FaasLog.toLowerCase()] : 0;

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
      this.warn('timeEnd not found key %s', key);
      this.debug(message);
    }
    return this;
  }

  private log (level: Level, message: string, ...args: any) {
    if (this.silent) return this;

    if (LevelPriority[level as Level] < this.level) return this;

    if (this.label) {
      message = `[${this.label}] ${message}`;
    }
    let output = level.toUpperCase() + ' ' + format(message, ...args);

    if (this.mode === 'local' && level !== 'error') {
      output = `${LevelColor[level as string]}${output}\u001b[39m`;
    }

    if (level === 'error') {
      console.error(output);
    } else {
      console.log(output);
    }

    return this;
  }
}

export default Log;
