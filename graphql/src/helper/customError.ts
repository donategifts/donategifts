export class CustomError extends Error {
  public code?: string;

  public status?: number;

  public meta?: Record<string, any>;

  public constructor(
    message?: string,
    code?: string,
    status?: number,
    meta?: Record<string, any>,
  ) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.message = String(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.meta = meta;
  }
}
