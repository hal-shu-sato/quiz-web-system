// 401 Unauthorized
export interface UnauthorizedErrorJSON {
  message: 'Unauthorized';
  details: { [name: string]: unknown };
}

// 403 Forbidden
export interface ForbiddenErrorJson {
  message: 'Forbidden';
  details: { [name: string]: unknown };
}

// 404 Not Found
export interface NotFoundErrorJSON {
  message: 'Not found';
  details: { [name: string]: unknown };
}

// 422 Unprocessable Content
export interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}
