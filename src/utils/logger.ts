/*
 *  index.ts is a part of Moosync.
 *
 *  Copyright 2021-2022 by Sahil Gupte <sahilsachingupte@gmail.com>. All rights reserved.
 *  Licensed under the GNU General Public License.
 *
 *  See LICENSE in the project root for license information.
 */

import { Console } from 'console';
import log from 'loglevel';

function getLevel(method: string) {
  return method.toUpperCase();
}

function getTimestamp() {
  const dt = new Date();

  return `${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}-${dt
    .getFullYear()
    .toString()
    .padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
}

function generatePrefix(level: string, loggerName: string | symbol) {
  return `\u001b[1m${getColor(level)}[${getTimestamp()}] [${getLevel(level)}] [${String(loggerName) ?? 'Main'}]${
    process?.['APP_ENV'] !== 'production' ? getStackDetails() : ''
  }:\u001b[0m${getColor(level)}`;
}

function getColor(level: string) {
  const outputColors: { [key: string]: string } = {
    trace: '\u001b[35m',
    debug: '\u001b[36m',
    info: '\u001b[34m',
    warn: '\u001b[33m',
    error: '\u001b[31m',
  };

  return outputColors[level];
}

type logMethods = 'trace' | 'debug' | 'warn' | 'info' | 'error';

function getStackDetails() {
  const err = new Error();
  const firstLine = err.stack.split('\n')[5].trim().substring(3);
  const split = firstLine.split('(');
  // const fileName = path.basename(split[1].trim().substring(0, split[1].length - 2));
  // [${fileName}]
  if (!split[0].includes('anonymous')) {
    return ` [${split[0].trim()}]`;
  }
  return '';
}

export function prefixLogger(logger: log.Logger, level: log.LogLevelDesc) {
  const stockConsole = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: false,
  });

  logger.methodFactory = (methodName, logLevel, loggerName) => {
    return (...args) => {
      const prefix = generatePrefix(methodName, loggerName);
      stockConsole[methodName as logMethods](prefix, ...args);
    };
  };
  logger.setLevel(level);
}

const logger = log.getLogger('Main');
prefixLogger(logger, 'DEBUG');

console.info = (...args: unknown[]) => {
  logger.info(...args);
};

console.error = (...args: unknown[]) => {
  logger.error(...args);
};

console.warn = (...args: unknown[]) => {
  logger.warn(...args);
};

console.debug = (...args: unknown[]) => {
  logger.debug(...args);
};

console.trace = (...args: unknown[]) => {
  logger.trace(...args);
};
