import { ErrorCodes, ErrorEnum } from './errorCodes';

export class HttpException extends Error {
  public status: number;
  public code: string;

  constructor(errorEnum: ErrorEnum, ...params: string[]) {
    const error = ErrorCodes[errorEnum];
    let message = error.message;
    for (const p of params) {
      message = message.replace('%s', p);
    }

    super(message);
    this.status = error.status;
    this.code = error.code;
  }
}
