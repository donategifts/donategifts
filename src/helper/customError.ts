import { logger } from './logger';

export class CustomError extends Error {
  public code?: string;

  public status?: number;

  public meta?: Record<string, any>;

  public error?: Error;

  public constructor({
    message,
    code,
    status,
    meta,
    error,
  }: {
    message?: string;
    code?: string;
    status?: number;
    meta?: Record<string, any>;
    error?: Error;
  }) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.message = String(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.meta = meta;

    if (process.env.NODE_ENV === 'development') {
      logger.error(error);
    }
  }
}
