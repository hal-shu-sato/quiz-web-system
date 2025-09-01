import type { Exception, FieldErrors } from 'tsoa';

// 401 Unauthorized
export interface UnauthorizedErrorJSON {
  message: 'Unauthorized';
  details: { [name: string]: unknown };
}

export class UnauthorizedError extends Error implements Exception {
  public status = 401;
  public name = 'UnauthorizedError';

  constructor(
    public fields: FieldErrors,
    public message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// 403 Forbidden
export interface ForbiddenErrorJson {
  message: 'Forbidden';
  details: { [name: string]: unknown };
}

export class ForbiddenError extends Error implements Exception {
  public status = 403;
  public name = 'ForbiddenError';

  constructor(
    public fields: FieldErrors,
    public message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// 404 Not Found
export interface NotFoundErrorJSON {
  message: 'Not found';
  details: { [name: string]: unknown };
}

export class NotFoundError extends Error implements Exception {
  public status = 404;
  public name = 'NotFoundError';

  constructor(
    public fields: FieldErrors,
    public message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// 422 Unprocessable Content
export interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}
